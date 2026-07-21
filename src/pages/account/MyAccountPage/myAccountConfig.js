export const MY_ACCOUNT_CONFIG = {
  paths: {
    login: "/login",
  },
  defaultStateMaxLength: 2,
  providers: {
    google: "google",
    apple: "apple",
  },
  profileDefaults: {
    name: "",
    defaultState: "",
  },
  passwordDefaults: {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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
