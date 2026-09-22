import type { Role, User } from "../../types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Extract<Role, "researcher" | "author">;
}

export interface AuthSession {
  user: User;
  token: string;
}
