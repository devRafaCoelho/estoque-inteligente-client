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
    notifyRepurchase: true,
    notifyConsumptionNudge: true,
    notifyEmailDigest: false,
    pushEnabled: false,
    consumptionNudgeDays: 5,
    quietHoursEnabled: true,
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
    quietHoursTimezone: "America/Sao_Paulo",
  },
  nudgeDaysMin: 1,
  nudgeDaysMax: 30,
};
