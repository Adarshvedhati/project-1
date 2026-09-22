import { apiClient } from "../../../services/api/client";
import { ENDPOINTS } from "../../../services/api/endpoints";
import type { LoginPayload, RegisterPayload, AuthSession } from "../types";

/**
 * Talks to Django's auth endpoints (FR-01). Until the backend is live,
 * `AuthContext` falls back to a local mock session so the UI is fully
 * click-through-able in isolation.
 */
export const authApi = {
  login: (payload: LoginPayload) => apiClient.post<AuthSession>(ENDPOINTS.auth.login, payload, { auth: false }),
  register: (payload: RegisterPayload) =>
    apiClient.post<AuthSession>(ENDPOINTS.auth.register, payload, { auth: false }),
  me: () => apiClient.get<AuthSession["user"]>(ENDPOINTS.auth.me),
};
