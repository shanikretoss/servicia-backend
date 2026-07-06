export interface TokenPayload {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: string | number;
  tokenType: string;
}

export interface AuthSuccessResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface AuthUserPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  [key: string]: any;
}

export interface LoginResponseData {
  user: AuthUserPayload;
  tokens: TokenPayload;
}

export interface JwtPayload {
  sub: string;
  email: string;
}
