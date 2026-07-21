import { apiRequest } from "./apiClient";

export const shoppingListService = {
  getActive() {
    return apiRequest("/api/shopping-lists/active");
  },

  generate(mode = "rules") {
    return apiRequest("/api/shopping-lists/generate", {
      method: "POST",
      body: JSON.stringify({ mode }),
    });
  },

  setViewMode(viewMode) {
    return apiRequest("/api/shopping-lists/view-mode", {
      method: "PATCH",
      body: JSON.stringify({ viewMode }),
    });
  },

  addItem(payload) {
    return apiRequest("/api/shopping-lists/items", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateItem(id, payload) {
    return apiRequest(`/api/shopping-lists/items/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  deleteItem(id) {
    return apiRequest(`/api/shopping-lists/items/${id}`, {
      method: "DELETE",
    });
  },
};
