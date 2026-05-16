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
    if (!this._panel) {return;}
    try {
      this._panel.webview.html = await this._getHtml();
    } catch (err) {
      Logger.getInstance().error('Panel refresh failed', err);
    }
  }

  private _getNonce(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {text += possible.charAt(Math.floor(Math.random() * possible.length));}
    return text;
  }

  private async _getHtml(): Promise<string> {
    const rawAccounts = await this.accountRepo.getAccountSummaries();
    const activeEmail = await this.accountService.getActiveAntigravityEmail();
    const isRefreshing = this.accountService.isRefreshing();

    const getAvgBalance = (acc: any) => {
      if (!acc.balances || Object.keys(acc.balances).length === 0) {return 0;}
      const values = Object.values(acc.balances).map((v: any) => typeof v === 'number' ? v : (v?.value || 0));
      return values.reduce((a, b) => a + b, 0) / values.length;
    };

    const sortedAccounts = [...rawAccounts].sort((a, b) => {
      if (a.email === activeEmail) {return -1;}
      if (b.email === activeEmail) {return 1;}
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
          --bg: var(--vscode-editor-background);
          --fg: var(--vscode-foreground);
          --border: var(--vscode-panel-border, var(--vscode-sideBar-border));
          --primary: var(--vscode-button-background);
          --primary-fg: var(--vscode-button-foreground);
          
          /* Premium Palette */
          --neon-pro: #6366f1;
          --neon-orange: #f97316;
          --neon-cyan: #06b6d4;
          --neon-purple: #a855f7;
          --neon-pink: #ec4899;
          --neon-green: #10b981;
          
          /* Glassmorphism */
          --glass-bg: rgba(255, 255, 255, 0.03);
          --glass-border: rgba(255, 255, 255, 0.1);
          --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
          
          --radius-lg: 16px;
          --radius-md: 12px;
          --radius-sm: 8px;
          
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        body { 
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif; 
          background: var(--bg); 
          color: var(--fg); 
          margin: 0; padding: 0; 
          display:flex; justify-content:center;
          overflow-x: hidden;
        }

        /* Aurora Background Effect */
        body::before {
          content: "";
          position: fixed;
          top: -50%; left: -50%; width: 200%; height: 200%;
          background: radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.05) 0%, transparent 40%),
                      radial-gradient(circle at 70% 70%, rgba(236, 72, 153, 0.05) 0%, transparent 40%);
          z-index: -1;
          pointer-events: none;
        }

        .container { max-width: 440px; width: 100%; position: relative; }

        .header { 
          display: flex; align-items: center; justify-content: space-between; 
          padding: 16px; 
          border-bottom: 1px solid var(--border); 
          position: sticky; top: 0; 
          background: rgba(var(--vscode-editor-background-rgb, 30, 30, 30), 0.8); 
          backdrop-filter: blur(12px);
          z-index: 100; 
        }

        .icon-btn { 
          width: 32px; height: 32px; border-radius: var(--radius-sm); 
          border: 1px solid var(--border); background: var(--glass-bg); 
          color: var(--fg); display: flex; align-items: center; justify-content: center; 
          cursor: pointer; transition: var(--transition); 
        }
        .icon-btn:hover { background: var(--glass-border); border-color: var(--neon-pro); transform: translateY(-1px); }
        .icon-btn.spinning svg { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .dashboard { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 16px; }
        .stat-tile { 
          background: var(--glass-bg); border: 1px solid var(--glass-border); 
          padding: 14px 8px; border-radius: var(--radius-md); 
          text-align: center; transition: var(--transition);
          position: relative; overflow: hidden;
        }
        .stat-tile:hover { transform: translateY(-2px); border-color: var(--tile-color, var(--neon-pro)); }
        .stat-tile::after {
          content: ""; position: absolute; bottom: 0; left: 0; width: 100%; height: 2px;
          background: var(--tile-color, var(--neon-pro)); opacity: 0.3;
        }
        .stat-label { font-size: 9px; font-weight: 700; opacity: 0.5; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .stat-val { font-size: 18px; font-weight: 700; }
        .tile-claude { --tile-color: var(--neon-orange); } 
        .tile-pro { --tile-color: var(--neon-pro); } 
        .tile-flash { --tile-color: var(--neon-cyan); }

        /* Tabs */
        .header-nav { display: flex; gap: 4px; background: var(--glass-bg); padding: 4px; border-radius: var(--radius-md); }
        .nav-btn { 
          padding: 8px 16px; border: none; background: transparent; 
          color: var(--fg); font-size: 12px; font-weight: 600; 
          cursor: pointer; border-radius: var(--radius-sm); 
          opacity: 0.5; transition: var(--transition); 
          display: flex; align-items: center; gap: 8px; 
        }
        .nav-btn.active { background: var(--bg); opacity: 1; box-shadow: var(--glass-shadow); color: var(--neon-pro); }

        .tab-content { display: none; animation: fadeIn 0.4s ease-out; }
        .tab-content.active { display: block; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* Search & Filter Bar */
        .search-bar { padding: 0 16px 12px 16px; display: flex; gap: 8px; }
        .search-input-wrap { flex: 1; position: relative; }
        .search-input { 
          width: 100%; background: var(--glass-bg); border: 1px solid var(--border); 
          border-radius: var(--radius-md); padding: 10px 12px 10px 36px; 
          color: var(--fg); font-size: 13px; font-family: inherit;
          transition: var(--transition);
        }
        .search-input:focus { outline: none; border-color: var(--neon-pro); background: var(--glass-border); box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); opacity: 0.4; }

        .filter-btn {
          padding: 8px 12px; border: 1px solid var(--border); background: var(--glass-bg);
          border-radius: var(--radius-md); color: var(--fg); font-size: 11px; font-weight: 600;
          cursor: pointer; transition: var(--transition);
        }
        .filter-btn:hover { border-color: var(--neon-pro); }

        /* Skills Grid */
        .skills-grid { 
          display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
          gap: 16px; padding: 0 16px 16px 16px; 
        }
        
        .skill-card { 
          background: var(--glass-bg); border: 1px solid var(--glass-border); 
          border-radius: var(--radius-lg); padding: 20px; 
          transition: var(--transition); position: relative; 
          display: flex; flex-direction: column; gap: 14px;
          backdrop-filter: blur(8px);
          animation: cardEntrance 0.5s ease-out both;
        }
        @keyframes cardEntrance { 
          from { opacity: 0; transform: scale(0.95) translateY(20px); } 
          to { opacity: 1; transform: scale(1) translateY(0); } 
        }

        .skill-card:hover { 
          border-color: var(--neon-pro); 
          background: rgba(99, 102, 241, 0.05); 
          transform: translateY(-4px); 
          box-shadow: 0 12px 24px -8px rgba(0,0,0,0.3);
        }

        .skill-header { display: flex; align-items: flex-start; justify-content: space-between; }
        .skill-icon-box { 
          width: 48px; height: 48px; border-radius: var(--radius-md); 
          display: flex; align-items: center; justify-content: center; 
          font-size: 24px; color: #fff; 
          box-shadow: 0 8px 16px -4px rgba(0,0,0,0.2);
          transition: var(--transition);
        }
        .skill-card:hover .skill-icon-box { transform: scale(1.1) rotate(5deg); }

        .skill-info-meta { flex: 1; padding-left: 16px; }
        .skill-title { font-weight: 700; font-size: 16px; margin-bottom: 4px; letter-spacing: -0.2px; }
        .skill-category { font-size: 10px; opacity: 0.4; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
        
        .skill-desc { 
          font-size: 12px; line-height: 1.6; opacity: 0.7; 
          height: 58px; overflow: hidden; 
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; 
        }

        .skill-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .tag { 
          font-size: 9px; padding: 4px 10px; border-radius: 20px; 
          background: var(--glass-border); font-weight: 600; 
          color: var(--fg); opacity: 0.8;
          border: 1px solid transparent;
          transition: var(--transition);
        }
        .skill-card:hover .tag { border-color: rgba(255,255,255,0.1); opacity: 1; }

        .skill-footer { 
          margin-top: 8px; display: flex; align-items: center; 
          justify-content: space-between; border-top: 1px solid var(--border); 
          padding-top: 16px; 
        }
        
        /* Premium Toggle */
        .switch { position: relative; display: inline-block; width: 38px; height: 22px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { 
          position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; 
          background-color: var(--glass-border); transition: .4s; border-radius: 34px; 
        }
        .slider:before { 
          position: absolute; content: ""; height: 16px; width: 16px; 
          left: 3px; bottom: 3px; background-color: white; 
          transition: .4s; border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        input:checked + .slider { background-color: var(--neon-pro); }
        input:checked + .slider:before { transform: translateX(16px); }
        
        .skill-status { font-size: 10px; font-weight: 800; opacity: 0.4; letter-spacing: 1px; }
        .skill-status.active { color: var(--neon-pro); opacity: 1; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }

        .learn-more-btn {
          background: transparent; border: 1px solid var(--border);
          color: var(--fg); font-size: 10px; font-weight: 700;
          padding: 6px 12px; border-radius: var(--radius-sm);
          cursor: pointer; transition: var(--transition);
          opacity: 0.7;
        }
        .learn-more-btn:hover { opacity: 1; border-color: var(--neon-pro); background: var(--glass-bg); }

        /* Accounts List */
        .acc-list { padding: 0 16px 16px 16px; }
        .acc-card { 
          background: var(--glass-bg); border: 1px solid var(--border); 
          border-radius: var(--radius-md); margin-bottom: 12px; 
          cursor: pointer; transition: var(--transition); 
          position: relative; overflow: hidden;
          backdrop-filter: blur(4px);
        }
        .acc-card:hover { border-color: var(--neon-pro); transform: scale(1.01); }
        
        .acc-card.refreshing::after {
          content: ""; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
          animation: shimmer 2s infinite;
        }
        @keyframes shimmer { 100% { left: 100%; } }
        
        .acc-card.preview-selected { border-color: var(--neon-pro); background: rgba(99, 102, 241, 0.05); }

        .card-main { padding: 14px; display: flex; align-items: center; gap: 12px; }
        .avatar { 
          width: 40px; height: 40px; background: var(--primary); 
          color: var(--primary-fg); border-radius: 10px; 
          display: flex; align-items: center; justify-content: center; 
          font-weight: 700; font-size: 18px;
        }
        .active-dot { 
          position: absolute; bottom: -2px; right: -2px; 
          width: 12px; height: 12px; background: #10b981; 
          border: 2px solid var(--bg); border-radius: 50%; z-index: 10; 
        }
        
        .info { flex: 1; min-width: 0; } 
        .name { font-weight: 700; font-size: 13px; margin-bottom: 2px; } 
        .email { font-size: 11px; opacity: 0.5; }
        
        .badge { 
          font-size: 8px; font-weight: 800; padding: 4px 8px; 
          border-radius: 6px; background: var(--glass-border); 
          letter-spacing: 0.5px;
        }
        
        .card-actions { display: flex; border-top: 1px solid var(--border); background: rgba(0,0,0,0.05); }
        .action-btn { 
          flex: 1; padding: 10px; background: transparent; border: none; 
          font-size: 10px; font-weight: 700; color: var(--fg); 
          opacity: 0.6; cursor: pointer; transition: var(--transition);
        }
        .action-btn:hover { opacity: 1; background: rgba(255,255,255,0.05); }
        .action-btn.switch { border-right: 1px solid var(--border); color: var(--neon-pro); }
        .action-btn.remove:hover { color: #f87171; }

        .hidden { display: none !important; }
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
            <div class="stat-tile tile-claude"><div class="stat-label">Claude 3.5</div><div class="stat-val" id="val-c">${initialStats.claude}%</div></div>
            <div class="stat-tile tile-pro"><div class="stat-label">Gemini 1.5 Pro</div><div class="stat-val" id="val-p">${initialStats.geminiPro}%</div></div>
            <div class="stat-tile tile-flash"><div class="stat-label">Gemini 1.5 Flash</div><div class="stat-val" id="val-f">${initialStats.geminiFlash}%</div></div>
          </div>
          <div class="acc-list" id="account-list">${cardsHtml}</div>
        </div>

        <div id="tab-skills" class="tab-content">
          <div class="search-bar">
            <div class="search-input-wrap">
              <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" class="search-input" id="skill-search" placeholder="Search expert skills..." oninput="filterSkills()">
            </div>
            <button class="filter-btn" onclick="toggleFilters()">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            </button>
          </div>
          <div class="skills-grid" id="skills-grid">
            ${this.skillService.getSkills().map((skill, idx) => `
              <div class="skill-card" data-title="${skill.title.toLowerCase()}" data-category="${skill.category.toLowerCase()}" style="animation-delay: ${idx * 0.05}s">
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
                  <button class="learn-more-btn" onclick="vscode.postMessage({command:'skillAction', id:'${skill.id}'})">DETAILS</button>
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

        function filterSkills() {
          const query = document.getElementById('skill-search').value.toLowerCase();
          document.querySelectorAll('.skill-card').forEach(card => {
            const title = card.dataset.title;
            const category = card.dataset.category;
            if (title.includes(query) || category.includes(query)) {
              card.classList.remove('hidden');
            } else {
              card.classList.add('hidden');
            }
          });
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
