/**
 * Authentication Service
 */

import * as vscode from 'vscode';
import { Logger } from '../../core/utils/logger';
import { OAUTH } from '../../core/constants/app.constants';
import { OAuthServer } from './oauth.server';
import { I18nService } from '../../i18n/i18n.service';
import { IAuthenticationService } from '../../core/domain/services/authentication.service';

export interface OAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserProfile {
  email: string;
  name: string;
  picture?: string;
}

export class AuthService implements IAuthenticationService {
  /**
   * Initiates the Google OAuth login process.
   */
  async authenticate(): Promise<{ email: string; name: string; avatarUrl?: string; accessToken: string; refreshToken: string; expiresAt: number; projectId?: string; }> {
    const server = new OAuthServer();
    
    try {
      const port = await server.start();
      const redirectUri = `http://localhost:${port}${OAUTH.REDIRECT_PATH}`;

      const authUrl = new URL(OAUTH.AUTH_URL);
      authUrl.searchParams.append('client_id', OAUTH.CLIENT_ID);
      authUrl.searchParams.append('redirect_uri', redirectUri);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('scope', OAUTH.SCOPES.join(' '));
      authUrl.searchParams.append('access_type', 'offline');
      authUrl.searchParams.append('prompt', 'consent'); 
      authUrl.searchParams.append('include_granted_scopes', 'true');

      Logger.getInstance().info(`Opening browser for OAuth on port ${port}...`);
      await vscode.env.openExternal(vscode.Uri.parse(authUrl.toString()));

      const code = await server.waitForAuthCode();
      const tokens = await this.exchangeCodeForTokens(code, redirectUri);
      const profile = await this.fetchUserProfile(tokens.accessToken);

      return {
        email: profile.email,
        name: profile.name,
        avatarUrl: profile.picture,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: Math.floor(Date.now() / 1000) + tokens.expiresIn
      };
      
    } catch (error: any) {
      Logger.getInstance().error('Auth flow failed', error);
      throw error;
    }
  }

  private async exchangeCodeForTokens(code: string, redirectUri: string): Promise<OAuthTokens> {
    const body = new URLSearchParams({
      client_id: OAUTH.CLIENT_ID,
      client_secret: OAUTH.CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    });

    const response = await fetch(OAUTH.TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.status}`);
    }

    const data = await response.json() as any;
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; expiresIn: number; }> {
    const body = new URLSearchParams({
      client_id: OAUTH.CLIENT_ID,
      client_secret: OAUTH.CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    });

    const response = await fetch(OAUTH.TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`);
    }

    const data = await response.json() as any;
    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in
    };
  }

  private async fetchUserProfile(accessToken: string): Promise<UserProfile> {
    const response = await fetch(OAUTH.USERINFO_URL, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!response.ok) {
      throw new Error(`Profile fetch failed: ${response.status}`);
    }

    const data = await response.json() as any;
    return {
      email: data.email,
      name: data.name || data.email.split('@')[0],
      picture: data.picture
    };
  }
}
