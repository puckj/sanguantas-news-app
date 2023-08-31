type AuthState = {
    isAuthenticated: boolean;
    uid: string | null;
    accessToken: string | null;
    refreshToken: string | null;
  };
  
  type SetUserPayload = {
    uid: string;
    accessToken: string;
    refreshToken: string;
  };
  