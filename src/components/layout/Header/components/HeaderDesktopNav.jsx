import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function HeaderDesktopNav({ items, isActive, onNavigate }) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 0.5,
        flexGrow: 1,
        alignItems: "center",
      }}
    >
      {items.map((item) => {
        const active = isActive(item.path);
        return (
          <Button
            key={item.path}
            onClick={() => onNavigate(item.path)}
            sx={{
              color: "white",
              fontSize: "0.85rem",
              fontWeight: active ? 800 : 600,
              px: 1.5,
              py: 0.75,
              minWidth: "auto",
              bgcolor: active ? "rgba(255,255,255,0.18)" : "transparent",
              "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
            }}
          >
            {item.label}
          </Button>
        );
      })}
    </Box>
  );
}
