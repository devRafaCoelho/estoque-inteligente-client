export const REGISTER_PAGE_CONFIG = {
  dashboardPath: "/dashboard",
  loginPath: "/login",
  defaultValues: {
    name: "",
    defaultState: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  formMode: "onTouched",
  stackSpacing: 2.5,
  stepFields: [
    ["name", "defaultState"],
    ["email", "password", "confirmPassword"],
  ],
};
