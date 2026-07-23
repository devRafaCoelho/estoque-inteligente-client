import { clearBrazilianStatesCache } from "../services/brazilianStateService";
import { clearProductCategoriesCache } from "../services/productCategoryService";
import { clearStockUnitsCache } from "../services/stockUnitService";
import { clearMyPreferencesCache } from "../services/userService";
import { clearUnreadNotificationsCountCache } from "../services/notificationService";

/** Limpa caches de API ligados à sessão (padrão clearPermissoesCache da Neoenergia). */
export function clearSessionCaches() {
  clearBrazilianStatesCache();
  clearProductCategoriesCache();
  clearStockUnitsCache();
  clearMyPreferencesCache();
  clearUnreadNotificationsCountCache();
}
