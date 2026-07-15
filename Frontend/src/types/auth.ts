export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}


export interface LoginRequest {
    email: string;
    passwordHash: string;
}

export interface UserResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    roles: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    passwordHash: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface UpdatePasswordRequest {
    currentPassword: string;
    newPassword: string;
}