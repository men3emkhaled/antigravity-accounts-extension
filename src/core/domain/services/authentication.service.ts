export interface IAuthenticationService {
  authenticate(): Promise<{ 
    email: string; 
    name: string; 
    avatarUrl?: string; 
    accessToken: string; 
    refreshToken: string; 
    expiresAt: number; 
    projectId?: string; 
  }>;
  refreshAccessToken(refreshToken: string): Promise<{ 
    accessToken: string; 
    expiresIn: number; 
  }>;
}
