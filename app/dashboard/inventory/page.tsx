import type { Metadata } from "next"
import InventoryHeader from "@/components/inventory/inventory-header"
import InventoryFilters from "@/components/inventory/inventory-filters"
import InventoryTable from "@/components/inventory/inventory-table"
import InventoryCardView from "@/components/inventory/inventory-card-view"

export const metadata: Metadata = {
  title: "Inventory | Trades Flow",
  description: "Manage your inventory across job sites",
}

export default function InventoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <InventoryHeader />
      <InventoryFilters />
      <div className="hidden md:block">
        <InventoryTable />
      </div>
      <div className="md:hidden">
        <InventoryCardView />
      </div>
    </div>
  )
}
