export const FORM_AUTOCOMPLETE_SLOT_PROPS = {
  popper: {
    placement: "bottom-start",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 8],
        },
      },
      {
        name: "flip",
        options: {
          padding: 16,
          fallbackPlacements: ["top-start"],
        },
      },
      {
        name: "preventOverflow",
        options: {
          padding: 12,
          altAxis: true,
        },
      },
    ],
    sx: {
      zIndex: (theme) => theme.zIndex.modal + 2,
    },
  },
  listbox: {
    sx: {
      maxHeight: 220,
      overflowY: "auto",
    },
  },
};
