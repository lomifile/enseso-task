import { ColumnDef } from "@tanstack/react-table";
import { EconomicOperator } from "../../types/models/economic-operator";

const columns: ColumnDef<EconomicOperator>[] = [
  {
    id: "id",
    accessorKey: "EO_ID",
    size: 15,
    header: "ID",
  },
  {
    id: "name1",
    accessorKey: "EO_Name1",
    size: 20,
    header: "table.name1",
  },
  {
    id: "name2",
    accessorKey: "EO_Name2",
    size: 20,
    header: "table.name2",
  },
  {
    id: "email",
    accessorKey: "EO_Email",
    size: 20,
    header: "Email",
  },
];

export { columns };
