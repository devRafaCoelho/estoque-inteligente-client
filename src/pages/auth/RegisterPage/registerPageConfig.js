export const REGISTER_PAGE_CONFIG = {
  dashboardPath: "/dashboard",
  loginPath: "/login",
  defaultValues: {
    firstName: "",
    lastName: "",
    defaultState: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  formMode: "onTouched",
  stackSpacing: 2.5,
  stepFields: [
    ["firstName", "lastName", "defaultState"],
    ["email", "password", "confirmPassword"],
  ],
};
