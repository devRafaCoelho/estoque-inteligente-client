export const MY_ACCOUNT_CONFIG = {
  paths: {
    login: "/login",
  },
  providers: {
    google: "google",
    apple: "apple",
  },
  preferenceDefaults: {
    notifyLowStock: true,
    notifyOutOfStock: true,
    notifyConsumptionNudge: true,
    consumptionNudgeDays: 5,
  },
  nudgeDaysMin: 1,
  nudgeDaysMax: 30,
};
