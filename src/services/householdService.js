import { api } from "./apiClient";
import { HOUSEHOLDS_URL } from "./endpoints";

/** @returns {Promise<{ household: object|null, membership: object|null }>} */
export async function getMyHousehold() {
  return api.get(`${HOUSEHOLDS_URL}/me`);
}

/** @param {{ name: string }} payload */
export async function createHousehold(payload) {
  return api.post(HOUSEHOLDS_URL, payload);
}

/** @param {string} householdId */
export async function listHouseholdMembers(householdId) {
  return api.get(`${HOUSEHOLDS_URL}/${householdId}/members`);
}

/** @param {string} householdId */
export async function listHouseholdInvites(householdId) {
  return api.get(`${HOUSEHOLDS_URL}/${householdId}/invites`);
}

/**
 * @param {string} householdId
 * @param {{ email: string }} payload
 */
export async function inviteHouseholdMember(householdId, payload) {
  return api.post(`${HOUSEHOLDS_URL}/${householdId}/invites`, payload);
}

/**
 * @param {string} householdId
 * @param {string} inviteId
 */
export async function revokeHouseholdInvite(householdId, inviteId) {
  return api.delete(`${HOUSEHOLDS_URL}/${householdId}/invites/${inviteId}`);
}

/**
 * @param {string} householdId
 * @param {string} userId
 */
export async function removeHouseholdMember(householdId, userId) {
  return api.delete(`${HOUSEHOLDS_URL}/${householdId}/members/${userId}`);
}

/** @param {{ token: string }} payload */
export async function acceptHouseholdInvite(payload) {
  return api.post(`${HOUSEHOLDS_URL}/invites/accept`, payload);
}

/** @param {string} householdId */
export async function leaveHousehold(householdId) {
  return api.post(`${HOUSEHOLDS_URL}/${householdId}/leave`);
}
