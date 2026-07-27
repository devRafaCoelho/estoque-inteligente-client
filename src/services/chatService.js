import { api } from "./apiClient";
import { CHAT_URL } from "./endpoints";

/**
 * Sessão atual + histórico curto.
 */
export async function getChatSession() {
  return api.get(`${CHAT_URL}/session`);
}

/**
 * @param {{ message: string, sessionId?: string|null }} payload
 */
export async function postChatMessage(payload) {
  return api.post(`${CHAT_URL}/messages`, payload);
}
