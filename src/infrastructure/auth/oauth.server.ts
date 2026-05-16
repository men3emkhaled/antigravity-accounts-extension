/**
 * OAuth Local Server
 * 
 * Spins up a temporary local HTTP server to receive the OAuth2 callback
 * from Google. It tries a list of ports sequentially until it finds an open one.
 * Once the code is received, it serves a stylized success HTML page and closes.
 */

import * as http from 'http';
import * as url from 'url';
import { Logger } from '../../core/utils/logger';
import { OAUTH } from '../../core/constants/app.constants';
import { I18nService } from '../../i18n/i18n.service';

export class OAuthServer {
  private server: http.Server | null = null;
  private currentPort: number | null = null;

  /**
   * Starts the server on the first available port from the configured list.
   * @returns The port number the server is listening on.
   */
  async start(): Promise<number> {
    this.server = http.createServer();
    this.currentPort = await this.listenOnAvailablePort(OAUTH.PORTS, 0);
    Logger.getInstance().info(`OAuth Server started successfully on port ${this.currentPort}`);
    return this.currentPort;
  }

  /**
   * Listens for the OAuth callback request and extracts the authorization code.
   * Resolves when the code is received, or rejects if it times out.
   * Automatically closes the server upon completion.
   */
  async waitForAuthCode(timeoutMs: number = 5 * 60 * 1000): Promise<string> {
    const i18n = I18nService.getInstance();
    if (!this.server) {
      throw new Error('OAuth Server has not been started.');
    }

    return new Promise((resolve, reject) => {
      let timeoutHandle: NodeJS.Timeout;

      const cleanup = () => {
        if (timeoutHandle) {clearTimeout(timeoutHandle);}
        if (this.server) {
          this.server.close();
          this.server = null;
        }
      };

      // Set timeout to prevent the server from running indefinitely
      timeoutHandle = setTimeout(() => {
        cleanup();
        reject(new Error(i18n.t('oauth.timeout')));
      }, timeoutMs);

      this.server!.on('request', (req, res) => {
        const reqUrl = url.parse(req.url || '', true);
        
        // Only handle the specific redirect path
        if (reqUrl.pathname === OAUTH.REDIRECT_PATH) {
          const code = reqUrl.query.code as string;
          const error = reqUrl.query.error as string;

          if (error) {
            res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(this.getHtmlResponse(i18n.t('oauth.authFailedTitle'), i18n.t('oauth.authFailedDetail', { error }), false));
            cleanup();
            reject(new Error(`OAuth Error: ${error}`));
            return;
          }

          if (code) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(this.getHtmlResponse(i18n.t('oauth.authSuccessTitle'), i18n.t('oauth.authSuccessDetail'), true));
            cleanup();
            resolve(code);
            return;
          }
        } else {
          // Return 404 for any other rogue requests (like favicon.ico)
          res.writeHead(404);
          res.end();
        }
      });
    });
  }

  /**
   * Recursively tries ports until it successfully binds.
   */
  private listenOnAvailablePort(ports: readonly number[], index: number): Promise<number> {
    return new Promise((resolve, reject) => {
      if (index >= ports.length) {
        const i18n = I18nService.getInstance();
        return reject(new Error(i18n.t('oauth.noPorts')));
      }

      const port = ports[index];
      
      this.server!.once('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
          Logger.getInstance().warn(`Port ${port} is in use, trying next port...`);
          resolve(this.listenOnAvailablePort(ports, index + 1));
        } else {
          reject(err);
        }
      });

      this.server!.listen(port, '127.0.0.1', () => {
        // Successfully bound
        this.server!.removeAllListeners('error');
        resolve(port);
      });
    });
  }

  /**
   * Generates a beautifully styled HTML response page that aligns with the extension's theme.
   */
  private getHtmlResponse(title: string, message: string, isSuccess: boolean): string {
    const color = isSuccess ? '#10b981' : '#ef4444';
    const bgGradient = isSuccess 
      ? 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.1), transparent), radial-gradient(circle at bottom left, rgba(139, 92, 246, 0.1), transparent)'
      : 'radial-gradient(circle at top right, rgba(239, 68, 68, 0.1), transparent)';

    return `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Agent Assistant | Authentication</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');
          
          body {
            background-color: #030303;
            background-image: ${bgGradient};
            color: #f8fafc;
            font-family: 'Outfit', sans-serif;
            display: flex; justify-content: center; align-items: center;
            height: 100vh; margin: 0;
            overflow: hidden;
          }

          .glass-card {
            background: rgba(15, 15, 25, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 50px 40px;
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            text-align: center;
            max-width: 420px;
            width: 90%;
            animation: slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
          }

          @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }

          .icon-box {
            width: 80px; height: 80px;
            background: ${isSuccess ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
            border-radius: 20px;
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 24px;
            font-size: 40px;
            border: 1px solid ${color}33;
            box-shadow: 0 0 30px ${color}22;
          }

          h1 { font-size: 24px; font-weight: 700; margin-bottom: 12px; color: white; }
          p { font-size: 16px; color: #94a3b8; line-height: 1.6; margin-bottom: 32px; }

          .btn {
            background: #fff;
            color: #000;
            border: none;
            padding: 14px 32px;
            border-radius: 14px;
            font-size: 15px; font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-block;
          }
          .btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(255,255,255,0.1); }

          .instruction {
            margin-top: 24px;
            font-size: 13px;
            color: #475569;
          }
        </style>
      </head>
      <body>
        <div class="glass-card">
          <div class="icon-box">${isSuccess ? '✅' : '❌'}</div>
          <h1>${title}</h1>
          <p>${message}</p>
          <button class="btn" onclick="window.close()">${I18nService.getInstance().t('oauth.closeWindow')}</button>
          <div class="instruction" id="manualClose" style="display:none;">
            يمكنك الآن إغلاق هذه النافذة والعودة إلى VS Code
          </div>
        </div>
        <script>
          const btn = document.querySelector('.btn');
          const instr = document.getElementById('manualClose');

          function attemptClose() {
            window.close();
            // If it didn't close, show the instruction
            setTimeout(() => {
              instr.style.display = 'block';
              btn.style.opacity = '0.5';
            }, 500);
          }

          if (${isSuccess}) {
            setTimeout(attemptClose, 2500);
          }
        </script>
      </body>
      </html>
    `;
  }
}
