/**
 * State Database Service - Restored Full Logic
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
import { Logger } from '../../core/utils/logger';
import { I18nService } from '../../i18n/i18n.service';
import { PathUtils } from '../../core/utils/path.utils';
import { ProtobufUtils } from '../../core/utils/protobuf.utils';
import { Account, AccountTokens } from '../../core/domain/models/account.model';
import { DeviceProfile } from '../../core/domain/models/device-profile.model';
import { STATE_DB_KEYS, STORAGE_JSON_KEYS, PERSONAL_EMAIL_DOMAINS } from '../../core/constants/app.constants';
import { getAntigravityVersion, isVersionSupported, MIN_SUPPORTED_VERSION } from '../../core/utils/version.utils';
import { IStateDbService } from '../../core/domain/services/state-db.service';
import initSqlJs = require('sql.js');

export class StateDbService implements IStateDbService {
  constructor(private readonly context?: vscode.ExtensionContext) { }

  async injectAccountState(account: Account, tokens: AccountTokens, deviceProfile: DeviceProfile | null): Promise<'success' | 'cancelled' | 'error'> {
    const version = getAntigravityVersion();
    if (version && !isVersionSupported(version)) {
      vscode.window.showErrorMessage(I18nService.getInstance().t('stateDb.outdatedAntigravity', { minVersion: MIN_SUPPORTED_VERSION }));
      return 'error';
    }

    const dbPath = PathUtils.getVscdbPath();
    if (!fs.existsSync(dbPath)) {
      vscode.window.showErrorMessage(I18nService.getInstance().t('stateDb.dbNotFound'));
      return 'error';
    }

    try {
      this.performRollingBackup(dbPath);
      if (deviceProfile) {
        this.writeDeviceProfileToStorageJson(deviceProfile);
      }

      const isGcpTos = !PERSONAL_EMAIL_DOMAINS.some(d => account.email.toLowerCase().endsWith(d));
      const oauthToken = ProtobufUtils.createUnifiedOAuthToken(tokens.accessToken, tokens.refreshToken, tokens.expiresAt, isGcpTos, undefined, account.email);
      const userStatus = ProtobufUtils.createUnifiedStateEntry('userStatusSentinelKey', ProtobufUtils.createMinimalUserStatusPayload(account.email));

      const rows: Array<{ key: string; value: string | null }> = [
        { key: STATE_DB_KEYS.OAUTH_TOKEN, value: oauthToken },
        { key: STATE_DB_KEYS.USER_STATUS, value: userStatus },
        { key: STATE_DB_KEYS.ONBOARDING, value: 'true' },
        { key: STATE_DB_KEYS.LEGACY, value: null },
      ];

      if (account.projectId) {
        rows.push({ key: STATE_DB_KEYS.ENTERPRISE_PREFS, value: ProtobufUtils.createUnifiedStateEntry('enterpriseGcpProjectId', ProtobufUtils.createStringValuePayload(account.projectId)) });
      }

      const triggered = await this.triggerWorkerAndClose(account.email, dbPath, rows);
      return triggered ? 'success' : 'cancelled';

    } catch (error: unknown) {
      Logger.getInstance().error('Injection failed', error);
      return 'error';
    }
  }

  async getActiveEmail(): Promise<string | null> {
    const dbPath = PathUtils.getVscdbPath();
    if (!fs.existsSync(dbPath)) {
      return null;
    }
    try {
      const SQL = await initSqlJs();
      const db = new SQL.Database(fs.readFileSync(dbPath));
      const stmt = db.prepare('SELECT value FROM ItemTable WHERE key = $key');
      stmt.bind({ $key: STATE_DB_KEYS.USER_STATUS });
      if (!stmt.step()) {
        stmt.free();
        db.close();
        return null;
      }
      const email = this.extractEmailFromUserStatus(stmt.get()[0] as string);
      stmt.free();
      db.close();
      return email;
    } catch {
      return null;
    }
  }

  private async triggerWorkerAndClose(email: string, dbPath: string, rows: Array<{ key: string; value: string | null }>): Promise<boolean> {
    const i18n = I18nService.getInstance();
    const choice = await vscode.window.showInformationMessage(i18n.t('switchPrompt.title', { email }), { modal: true, detail: i18n.t('stateDb.reloadPrompt') }, i18n.t('switchPrompt.actionYes'), i18n.t('switchPrompt.actionNo'));
    if (choice !== i18n.t('switchPrompt.actionYes')) {
      return false;
    }

    const workDir = __dirname;
    const payloadPath = path.join(workDir, '.inject-payload.json');
    const workerPath = path.join(workDir, '.inject-worker.js');
    const exeCandidates = [this.findAntigravityExe(), process.execPath].filter(Boolean) as string[];

    fs.writeFileSync(payloadPath, JSON.stringify({ dbPath, rows, exeCandidates }, null, 2));
    fs.writeFileSync(workerPath, this.getWorkerScript());

    spawn(process.execPath, [workerPath, payloadPath], {
      detached: true, stdio: 'ignore', windowsHide: true, cwd: workDir, env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' }
    }).unref();

    vscode.commands.executeCommand('workbench.action.closeWindow');
    return true;
  }

  private getWorkerScript(): string {
    return String.raw`
const IS_WIN = process.platform === 'win32';
const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const payload = JSON.parse(fs.readFileSync(process.argv[2], 'utf-8'));
const { dbPath, rows, exeCandidates } = payload;
const ownPid = process.pid;

function getPids() {
  try {
    if (IS_WIN) {
      const out = execSync('tasklist /FI "IMAGENAME eq Antigravity.exe" /FO CSV /NH', { encoding: 'utf-8' });
      return out.split('\n').map(l => { const m = l.match(/"Antigravity\.exe","(\d+)"/i); return m ? parseInt(m[1]) : null; }).filter(p => p && p !== ownPid);
    } else {
      const out = execSync('pgrep -i antigravity || true', { encoding: 'utf-8' });
      return out.trim().split('\n').map(s => parseInt(s)).filter(p => !isNaN(p) && p !== ownPid);
    }
  } catch { return []; }
}

async function run() {
  for (let i=0; i<20; i++) { if (getPids().length === 0) break; await new Promise(r => setTimeout(r, 500)); }
  await new Promise(r => setTimeout(r, 2000));
  const SQL = await (require('sql.js'))();
  const db = new SQL.Database(fs.readFileSync(dbPath));
  rows.forEach(r => {
    if (r.value === null) db.run('DELETE FROM ItemTable WHERE key = ?', [r.key]);
    else db.run('INSERT OR REPLACE INTO ItemTable (key, value) VALUES (?, ?)', [r.key, r.value]);
  });
  fs.writeFileSync(dbPath, Buffer.from(db.export()));
  db.close();
  const exe = exeCandidates.find(c => fs.existsSync(c));
  if (exe) {
    if (IS_WIN) {
      const bat = path.join(path.dirname(process.argv[2]), '.relaunch.bat');
      fs.writeFileSync(bat, '@echo off\r\nstart "" "' + exe + '"\r\ndel "%~f0"', 'utf-8');
      spawn('cmd.exe', ['/c', bat], { detached: true, stdio: 'ignore', windowsHide: true }).unref();
    } else {
      spawn(exe, [], { detached: true, stdio: 'ignore', env: { ...process.env, ELECTRON_RUN_AS_NODE: undefined } }).unref();
    }
  }
}
run().catch(() => process.exit(1));
`;
  }

  private findAntigravityExe(): string | undefined {
    if (process.platform === 'win32') {
      const paths = [path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Antigravity', 'Antigravity.exe'), path.join(process.env.PROGRAMFILES || '', 'Antigravity', 'Antigravity.exe')];
      return paths.find(p => fs.existsSync(p));
    }
    return undefined;
  }

  private extractEmailFromUserStatus(base64: string): string | null {
    try {
      const extract = (data: Buffer, field: number) => {
        let off = 0;
        while (off < data.length) {
          const tag = data[off++];
          const type = tag & 0x07; const num = tag >> 3;
          if (type === 2) {
            const len = data[off++];
            if (num === field) {return data.slice(off, off + len);}
            off += len;
          } else if (type === 0) {
            while (data[off++] & 0x80) {
              // Skip varint
            }
          } else {
            break;
          }
        }
        return null;
      };
      const bytes = Buffer.from(base64, 'base64');
      const data = extract(bytes, 1);
      const row = data ? extract(data, 2) : null;
      const inner = row ? extract(row, 1)?.toString('utf-8') : null;
      if (!inner) {
        return null;
      }
      const payload = Buffer.from(inner, 'base64');
      return extract(payload, 3)?.toString('utf-8') || extract(payload, 7)?.toString('utf-8') || null;
    } catch {
      return null;
    }
  }

  private performRollingBackup(dbPath: string): void {
    try {
      for (let i = 4; i >= 1; i--) {
        if (fs.existsSync(`${dbPath}.${i}`)) {
          fs.renameSync(`${dbPath}.${i}`, `${dbPath}.${i + 1}`);
        }
      }
      fs.copyFileSync(dbPath, `${dbPath}.1`);
    } catch (e) {
      Logger.getInstance().error('Backup failed', e);
    }
  }

  private writeDeviceProfileToStorageJson(profile: DeviceProfile): void {
    const p = PathUtils.getStorageJsonPath();
    try {
      const d = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf-8')) : {};
      d[STORAGE_JSON_KEYS.MACHINE_ID] = profile.machineId;
      d[STORAGE_JSON_KEYS.MAC_MACHINE_ID] = profile.macMachineId;
      d[STORAGE_JSON_KEYS.DEV_DEVICE_ID] = profile.devDeviceId;
      fs.writeFileSync(p, JSON.stringify(d, null, 2));
    } catch (e) {
      Logger.getInstance().error('Failed to write device profile', e);
    }
  }
}
