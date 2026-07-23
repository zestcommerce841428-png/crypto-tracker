"use client";

import Select, { type SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useSettingsStore } from "@/lib/store/useSettingsStore";
import { VS_CURRENCIES } from "@/lib/utils/format";

export default function CurrencySelector() {
  const vsCurrency = useSettingsStore((s) => s.vsCurrency);
  const setVsCurrency = useSettingsStore((s) => s.setVsCurrency);

  const handleChange = (event: SelectChangeEvent) => {
    setVsCurrency(event.target.value);
  };

  return (
    <Select
      size="small"
      value={vsCurrency}
      onChange={handleChange}
      variant="outlined"
      sx={{ minWidth: 84, textTransform: "uppercase" }}
      aria-label="Select currency"
    >
      {VS_CURRENCIES.map((c) => (
        <MenuItem key={c} value={c} sx={{ textTransform: "uppercase" }}>
          {c}
        </MenuItem>
      ))}
    </Select>
  );
}
