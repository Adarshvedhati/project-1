import { apiClient } from "../../../services/api/client";
import { ENDPOINTS } from "../../../services/api/endpoints";
import type { LoginPayload, RegisterPayload, AuthSession } from "../types";

/** Django auth endpoints (FR-01). */
export const authApi = {
  login: (payload: LoginPayload) => apiClient.post<AuthSession>(ENDPOINTS.auth.login, payload, { auth: false }),
  register: (payload: RegisterPayload) =>
    apiClient.post<AuthSession>(ENDPOINTS.auth.register, payload, { auth: false }),
  me: () => apiClient.get<AuthSession["user"]>(ENDPOINTS.auth.me),
  logout: () => apiClient.post<void>(ENDPOINTS.auth.logout),
};
