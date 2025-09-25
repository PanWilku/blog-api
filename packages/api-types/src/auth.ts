export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    role: "ADMIN" | "AUTHOR" | "USER";
  };
}

export interface ResponseUser {
  id: number;
  email: string;
  name: string;
}
