"use client";

import { useRouter } from "next/navigation";
import TableRow, { type TableRowProps } from "@mui/material/TableRow";

export default function LinkTableRow({
  href,
  children,
  sx,
  ...rest
}: TableRowProps & { href: string }) {
  const router = useRouter();
  return (
    <TableRow
      hover
      onClick={() => router.push(href)}
      sx={{ cursor: "pointer", ...sx }}
      {...rest}
    >
      {children}
    </TableRow>
  );
}
