
export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest extends LoginRequest { fullName: string; }

export interface RegisterResponse {
    id : string;
    fullName : string;
    email : string;
    status : string;
    createdAt : string;
}


export interface LoginResponse {
    id : string;
    fullname : string;
    email : string;
    accessToken : string;
    tokenType : string;
    expiresIn : number;
}




export interface MeResponse {
  id: string;
  fullName: string;
  email: string;
  status: 'ACTIVE' | 'LOCKED' | 'SUSPENDED' |
          'DEACTIVATED' | 'DELETED';
  createdAt: string;
}


export interface TokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}