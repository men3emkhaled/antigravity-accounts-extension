/**
 * Accounts Panel Provider — WebviewPanel-based (editor tab) for Antigravity IDE compatibility.
 * Uses createWebviewPanel instead of WebviewViewProvider to bypass service worker issues.
 */

import * as vscode from 'vscode';
import { IAccountRepository } from '../../core/domain/repositories/account.repository';
import { AccountService } from '../../features/accounts/account.service';
import { SkillService } from '../../features/skills/skill.service';
import { Logger } from '../../core/utils/logger';

export class AccountsPanelProvider {
  private _panel?: vscode.WebviewPanel;

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly accountRepo: IAccountRepository,
    private readonly accountService: AccountService,
    private readonly skillService: SkillService
  ) {
    this.accountService.onAccountsChanged(() => {
      this.refresh();
    });
  }

  public show() {
    if (this._panel) {
      this._panel.reveal(vscode.ViewColumn.One);
      this.refresh();
      return;
    }

    this._panel = vscode.window.createWebviewPanel(
      'agent-assistant.panel',
      'Agent Assistant',
      vscode.ViewColumn.One,
      {
        enableScripts: true
      }
    );

    this._panel.onDidDispose(() => {
      this._panel = undefined;
    });

    this._panel.webview.onDidReceiveMessage(async message => {
      try {
        switch (message.command) {
          case 'addAccount':
            await vscode.commands.executeCommand('agent-assistant.addAccount');
            break;
          case 'refreshAccounts':
            await this.accountService.refreshBalancesWorkflow(true);
            break;
          case 'switchAccount':
            await this.accountService.switchAccountWorkflow(message.email);
            break;
          case 'deleteAccount':
            await this.accountService.removeAccountWorkflow(message.email);
            break;
          case 'toggleSkill':
            if (message.id) {
              this.skillService.toggleSkill(message.id);
              this.refresh();
            }
            break;
          case 'skillAction':
            vscode.window.showInformationMessage(`Skill ${message.id} action triggered. This can be used to open documentation or a dedicated tool.`);
            break;
        }
      } catch (err) {
        Logger.getInstance().error(`Panel command ${message.command} failed`, err);
      }
    });

    // Delay significantly to let Antigravity IDE's webview host stabilize
    setTimeout(() => this.refresh(), 1000);
  }

  public async refresh() {
    if (!this._panel) return;
    try {
      this._panel.webview.html = await this._getHtml();
    } catch (err) {
      Logger.getInstance().error('Panel refresh failed', err);
    }
  }

  private _getNonce(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  private async _getHtml(): Promise<string> {
    const rawAccounts = await this.accountRepo.getAccountSummaries();
    const activeEmail = await this.accountService.getActiveAntigravityEmail();
    const isRefreshing = this.accountService.isRefreshing();

    const getAvgBalance = (acc: any) => {
      if (!acc.balances || Object.keys(acc.balances).length === 0) return 0;
      const values = Object.values(acc.balances).map((v: any) => typeof v === 'number' ? v : (v?.value || 0));
      return values.reduce((a, b) => a + b, 0) / values.length;
    };

    const sortedAccounts = [...rawAccounts].sort((a, b) => {
      if (a.email === activeEmail) return -1;
      if (b.email === activeEmail) return 1;
      return getAvgBalance(b) - getAvgBalance(a);
    });

    const getHeroStats = (acc: any) => {
      const balances = acc?.balances || {};
      const findStat = (patterns: string[]) => {
        let minVal = 101; // Higher than 100 to detect first match
        let found = false;
        for (const key of Object.keys(balances)) {
          const lk = key.toLowerCase();
          if (lk && patterns.some(p => lk.includes(p))) {
            const val = balances[key];
            const current = typeof val === 'number' ? val : (val as any)?.value || 0;
            if (current < minVal) {
              minVal = current;
              found = true;
            }
          }
        }
        return found ? minVal : 0;
      };

      return {
        claude: findStat(['claude', 'sonnet', 'opus', 'haiku']),
        geminiPro: findStat(['pro', 'google_one', 'ultra']),
        geminiFlash: findStat(['flash'])
      };
    };

    const accountsDataForJs = sortedAccounts.map(a => ({ email: a.email, stats: getHeroStats(a) }));
    const activeAcc = sortedAccounts.find(a => a.email === activeEmail) || sortedAccounts[0];
    const initialStats = activeAcc ? getHeroStats(activeAcc) : { claude: 0, geminiPro: 0, geminiFlash: 0 };

    const cardsHtml = sortedAccounts.map(acc => `
      <div class="acc-card ${acc.email === activeEmail ? 'active' : ''} ${isRefreshing ? 'refreshing' : ''}" id="card-${acc.email.replace(/[@.]/g, '-')}" onclick="previewAcc('${acc.email}')">
        <div class="card-main">
          <div class="avatar-wrap">
            <div class="avatar">
              <span class="avatar-letter">${(acc.displayName || 'U')[0].toUpperCase()}</span>
            </div>
            ${acc.email === activeEmail ? '<div class="active-dot"></div>' : ''}
          </div>
          <div class="info">
            <div class="name">${acc.email}</div>
            <div class="email">${acc.displayName || ''}</div>
          </div>
          <div class="badge ${acc.status || 'active'}">${(acc.status || 'active').toUpperCase()}</div>
        </div>
        <div class="actions">
          ${acc.email !== activeEmail ? `<button class="btn btn-switch" onclick="event.stopPropagation(); doSwitch('${acc.email}')">SWITCH</button>` : ''}
          <button class="btn btn-remove" onclick="event.stopPropagation(); doDelete('${acc.email}')">REMOVE</button>
        </div>
      </div>
    `).join('');

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
      <style>
        :root {
          --bg: var(--vscode-editor-background); --fg: var(--vscode-foreground); --border: var(--vscode-panel-border, var(--vscode-sideBar-border));
          --primary: var(--vscode-button-background); --primary-fg: var(--vscode-button-foreground);
          --neon-pro: #6366f1; --neon-orange: #f97316; --neon-cyan: #06b6d4; --neon-purple: #a855f7;
        }
        body { font-family: 'Outfit', sans-serif; background: var(--bg); color: var(--fg); margin: 0; padding: 0; display:flex; justify-content:center; }
        .container { max-width: 420px; width: 100%; }
        .header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 100; }
        .icon-btn { width: 30px; height: 30px; border-radius: 8px; border: 1px solid var(--border); background: rgba(128,128,128,0.05); color: var(--fg); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
        .icon-btn:hover { background: rgba(128,128,128,0.15); }
        .icon-btn.spinning svg { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .dashboard { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 16px; }
        .stat-tile { background: rgba(128,128,128,0.03); border: 1px solid var(--border); padding: 12px 4px; border-radius: 12px; text-align: center; }
        .stat-label { font-size: 8px; font-weight: 700; opacity: 0.4; text-transform: uppercase; margin-bottom: 4px; }
        .stat-val { font-size: 16px; font-weight: 700; }
        .tile-claude { --tile-color: var(--neon-orange); } .tile-pro { --tile-color: var(--neon-pro); } .tile-flash { --tile-color: var(--neon-cyan); }

        /* Tabs */
        .header-nav { display: flex; gap: 4px; background: rgba(128,128,128,0.05); padding: 4px; border-radius: 10px; margin-bottom: 0; }
        .nav-btn { padding: 6px 12px; border: none; background: transparent; color: var(--fg); font-size: 11px; font-weight: 600; cursor: pointer; border-radius: 8px; opacity: 0.5; transition: 0.3s; display: flex; align-items: center; gap: 6px; }
        .nav-btn.active { background: var(--bg); opacity: 1; box-shadow: 0 2px 8px rgba(0,0,0,0.2); color: var(--neon-pro); }
        .tab-content { display: none; }
        .tab-content.active { display: block; }

        /* Skills Grid */
        .skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; padding: 16px; }
        .skill-card { background: rgba(128,128,128,0.03); border: 1px solid var(--border); border-radius: 16px; padding: 20px; transition: 0.3s; position: relative; display: flex; flex-direction: column; gap: 12px; }
        .skill-card:hover { border-color: var(--neon-pro); background: rgba(99, 102, 241, 0.05); transform: translateY(-2px); }
        .skill-header { display: flex; align-items: flex-start; justify-content: space-between; }
        .skill-icon-box { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .skill-info-meta { flex: 1; padding-left: 14px; }
        .skill-title { font-weight: 700; font-size: 15px; margin-bottom: 2px; }
        .skill-category { font-size: 10px; opacity: 0.5; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .skill-desc { font-size: 11px; line-height: 1.5; opacity: 0.7; height: 50px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; }
        .skill-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .tag { font-size: 9px; padding: 3px 8px; border-radius: 6px; background: rgba(128,128,128,0.1); font-weight: 600; }
        .skill-footer { margin-top: 8px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border); padding-top: 12px; }
        
        /* Premium Toggle */
        .switch { position: relative; display: inline-block; width: 34px; height: 20px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(128,128,128,0.2); transition: .4s; border-radius: 20px; }
        .slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: var(--neon-pro); }
        input:checked + .slider:before { transform: translateX(14px); }
        
        .skill-status { font-size: 9px; font-weight: 700; opacity: 0.6; }
        .skill-status.active { color: var(--neon-pro); opacity: 1; }

        .acc-list { padding: 0 16px 16px 16px; }
        .acc-card { background: rgba(128,128,128,0.02); border: 1px solid var(--border); border-radius: 14px; margin-bottom: 10px; cursor: pointer; transition: 0.3s; position: relative; overflow: hidden; }
        .acc-card.refreshing::after {
          content: "";
          position: absolute;
          top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer { 100% { left: 100%; } }
        .acc-card.preview-selected { padding: 4px; border-color: var(--neon-pro); background: rgba(99, 102, 241, 0.05); transform: scale(0.98); }

        .progress-bar { position: absolute; bottom: 0; left: 0; height: 2px; width: 0; background: var(--neon-pro); transition: width 0.3s; }
        .progress-active { width: 100%; animation: progress-indet 2s infinite linear; }
        @keyframes progress-indet { 0% { left: -40%; width: 40%; } 100% { left: 100%; width: 40%; } }

        .card-main { padding: 12px; display: flex; align-items: center; gap: 10px; }
        .avatar-wrap { position: relative; }
        .avatar { width: 36px; height: 36px; background: var(--primary); color: var(--primary-fg); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 700; position: relative; overflow: hidden; }
        .avatar img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 2; }
        .active-dot { position: absolute; bottom: -2px; right: -2px; width: 10px; height: 10px; background: #10b981; border: 2px solid var(--bg); border-radius: 50%; z-index: 10; }
        .info { flex: 1; min-width: 0; } .name { font-weight: 600; font-size: 12px; } .email { font-size: 10px; opacity: 0.5; }
        .badge { font-size: 7px; font-weight: 800; padding: 2px 5px; border-radius: 4px; background: rgba(128,128,128,0.1); margin-left: auto; }
        
        .actions { display: flex; border-top: 1px solid var(--border); }
        .btn { flex: 1; padding: 8px; background: transparent; border: none; font-size: 9px; font-weight: 700; color: var(--fg); opacity: 0.6; cursor: pointer; }
        .btn:hover { opacity: 1; background: rgba(128,128,128,0.05); }
        .btn-switch { border-right: 1px solid var(--border); color: var(--neon-pro); }
        .btn-remove:hover { color: #f87171; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="header-nav">
            <button class="nav-btn active" onclick="switchTab('accounts')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> Accounts
            </button>
            <button class="nav-btn" onclick="switchTab('skills')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> Skills
            </button>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="icon-btn" id="btn-global" onclick="toggleGlobal()" title="Global Insights"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg></button>
            <button class="icon-btn ${isRefreshing ? 'spinning' : ''}" id="btn-refresh" onclick="refreshAll()" title="Sync all data"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg></button>
            <button class="icon-btn" onclick="addAcc()" title="Add new account"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>
          </div>
          <div class="progress-bar ${isRefreshing ? 'progress-active' : ''}"></div>
        </div>

        <div id="tab-accounts" class="tab-content active">
          <div class="dashboard">
            <div class="stat-tile tile-claude"><div class="stat-label">Claude 4.6</div><div class="stat-val" id="val-c">${initialStats.claude}%</div></div>
            <div class="stat-tile tile-pro"><div class="stat-label">Gemini Pro 3.1</div><div class="stat-val" id="val-p">${initialStats.geminiPro}%</div></div>
            <div class="stat-tile tile-flash"><div class="stat-label">Gemini Flash 3</div><div class="stat-val" id="val-f">${initialStats.geminiFlash}%</div></div>
          </div>
          <div class="acc-list" id="account-list">${cardsHtml}</div>
        </div>

        <div id="tab-skills" class="tab-content">
          <div class="skills-grid" id="skills-grid">
            ${this.skillService.getSkills().map(skill => `
              <div class="skill-card" data-title="${skill.title}" data-category="${skill.category}">
                <div class="skill-header">
                  <div class="skill-icon-box" style="background: ${skill.color}">
                    <i class="codicon codicon-${skill.icon}"></i>
                  </div>
                  <div class="skill-info-meta">
                    <div class="skill-title">${skill.title}</div>
                    <div class="skill-category">${skill.category}</div>
                  </div>
                  <label class="switch">
                    <input type="checkbox" ${skill.isActive ? 'checked' : ''} onchange="toggleSkill('${skill.id}')">
                    <span class="slider"></span>
                  </label>
                </div>
                <div class="skill-desc">${skill.description}</div>
                <div class="skill-tags">
                  ${skill.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="skill-footer">
                  <div class="skill-status ${skill.isActive ? 'active' : ''}">${skill.isActive ? 'ACTIVE' : 'INACTIVE'}</div>
                  <button class="btn" style="flex:none; padding:4px 8px; border-radius:6px; border:1px solid var(--border);" onclick="vscode.postMessage({command:'skillAction', id:'${skill.id}'})">LEARN MORE</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <script>
        const vscode = acquireVsCodeApi();
        const accs = ${JSON.stringify(accountsDataForJs)};
        let currentPreview = null;
        let isGlobal = false;

        function switchTab(tabId) {
          document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
          document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
          document.getElementById('tab-' + tabId).classList.add('active');
          event.currentTarget.classList.add('active');
        }

        function toggleSkill(id) {
          vscode.postMessage({ command: 'toggleSkill', id: id });
        }

        function addAcc() { vscode.postMessage({ command: 'addAccount' }); }
        function refreshAll() { vscode.postMessage({ command: 'refreshAccounts' }); }
        function doSwitch(email) { vscode.postMessage({ command: 'switchAccount', email: email }); }
        function doDelete(email) { vscode.postMessage({ command: 'deleteAccount', email: email }); }

        function toggleGlobal() {
          isGlobal = !isGlobal;
          const btn = document.getElementById('btn-global');
          if (isGlobal) {
            btn.classList.add('active-global');
            currentPreview = null;
            document.querySelectorAll('.acc-card').forEach(c => c.classList.remove('preview-selected'));
            calculateGlobal();
          } else {
            btn.classList.remove('active-global');
            updateStats(null);
          }
        }

        function calculateGlobal() {
          if (accs.length === 0) return updateStats(null);
          const totals = accs.reduce((acc, curr) => ({
            claude: acc.claude + curr.stats.claude, 
            geminiPro: acc.geminiPro + curr.stats.geminiPro, 
            geminiFlash: acc.geminiFlash + curr.stats.geminiFlash
          }), { claude: 0, geminiPro: 0, geminiFlash: 0 });
          updateStats({
            claude: Math.round(totals.claude / accs.length),
            geminiPro: Math.round(totals.geminiPro / accs.length),
            geminiFlash: Math.round(totals.geminiFlash / accs.length)
          });
        }

        function previewAcc(email) {
          if (${isRefreshing}) return;
          isGlobal = false;
          document.getElementById('btn-global').classList.remove('active-global');
          
          const targetCard = document.getElementById('card-' + email.replace(/[@.]/g, '-'));
          
          if (currentPreview === email) {
            // Already selected, do nothing or toggle off
            currentPreview = null;
            targetCard.classList.remove('preview-selected');
            updateStats(null);
          } else {
            document.querySelectorAll('.acc-card').forEach(c => c.classList.remove('preview-selected'));
            currentPreview = email;
            targetCard.classList.add('preview-selected');
            const a = accs.find(x => x.email === email);
            updateStats(a ? a.stats : null);
          }
        }

        function updateStats(stats) {
          document.getElementById('val-c').innerText = (stats ? stats.claude : 0) + '%';
          document.getElementById('val-p').innerText = (stats ? stats.geminiPro : 0) + '%';
          document.getElementById('val-f').innerText = (stats ? stats.geminiFlash : 0) + '%';
        }
      </script>
    </body>
    </html>`;
  }
}
