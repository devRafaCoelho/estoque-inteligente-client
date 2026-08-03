import { nonNegativeDecimalInputProps } from "../../../utils/numberInput";

export const CONSUME_PRODUCT_DIALOG_CONFIG = {
  maxWidth: "xs",
  defaultValues: {
    quantity: 1,
    note: "",
  },
  quantityInputProps: nonNegativeDecimalInputProps(),
};
