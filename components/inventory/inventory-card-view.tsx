"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, ArrowRightLeft, AlertTriangle, Package, HardHat, Hammer, Wrench, Boxes } from "lucide-react"
import AddEditInventoryModal from "./add-edit-inventory-modal"
import TransferItemModal from "./transfer-item-modal"
import DeleteInventoryDialog from "./delete-inventory-dialog"

// Mock inventory data - same as in table view
const inventoryItems = [
  {
    id: "inv-001",
    name: "Cordless Drill",
    description: "DeWalt 20V MAX Cordless Drill",
    category: "tools",
    site: "site-a",
    siteName: "Site A",
    quantity: 5,
    minThreshold: 2,
    lastUpdated: "2023-04-01",
  },
  {
    id: "inv-002",
    name: "Safety Helmets",
    description: "Hard hats with adjustable ratchet",
    category: "ppe",
    site: "warehouse",
    siteName: "Warehouse",
    quantity: 12,
    minThreshold: 5,
    lastUpdated: "2023-04-02",
  },
  {
    id: "inv-003",
    name: "Concrete Mix",
    description: "50lb bags of quick-setting concrete",
    category: "materials",
    site: "site-b",
    siteName: "Site B",
    quantity: 8,
    minThreshold: 10,
    lastUpdated: "2023-04-03",
  },
  {
    id: "inv-004",
    name: "Circular Saw",
    description: 'Makita 7-1/4" Circular Saw',
    category: "tools",
    site: "site-c",
    siteName: "Site C",
    quantity: 0,
    minThreshold: 1,
    lastUpdated: "2023-04-04",
  },
  {
    id: "inv-005",
    name: "Extension Cords",
    description: "50ft heavy duty extension cords",
    category: "equipment",
    site: "site-a",
    siteName: "Site A",
    quantity: 3,
    minThreshold: 2,
    lastUpdated: "2023-04-05",
  },
]

export default function InventoryCardView() {
  const [editItem, setEditItem] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [transferItem, setTransferItem] = useState<any>(null)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [deleteItem, setDeleteItem] = useState<any>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const getStatusBadge = (quantity: number, minThreshold: number) => {
    if (quantity === 0) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-current" />
          Out of Stock
        </Badge>
      )
    } else if (quantity < minThreshold) {
      return (
        <Badge variant="warning" className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600">
          <AlertTriangle className="h-3 w-3" />
          Low Stock
        </Badge>
      )
    } else {
      return (
        <Badge variant="success" className="flex items-center gap-1 bg-green-500 hover:bg-green-600">
          <span className="h-2 w-2 rounded-full bg-current" />
          In Stock
        </Badge>
      )
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "tools":
        return <Hammer className="h-4 w-4" />
      case "ppe":
        return <HardHat className="h-4 w-4" />
      case "materials":
        return <Package className="h-4 w-4" />
      case "equipment":
        return <Wrench className="h-4 w-4" />
      case "consumables":
        return <Boxes className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      tools: "Tools",
      ppe: "PPE",
      materials: "Materials",
      equipment: "Equipment",
      consumables: "Consumables",
    }
    return categories[category] || category
  }

  const handleEdit = (item: any) => {
    setEditItem(item)
    setShowEditModal(true)
  }

  const handleTransfer = (item: any) => {
    setTransferItem(item)
    setShowTransferModal(true)
  }

  const handleDelete = (item: any) => {
    setDeleteItem(item)
    setShowDeleteDialog(true)
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {inventoryItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  {getStatusBadge(item.quantity, item.minThreshold)}
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(item.category)}
                    <span>{getCategoryLabel(item.category)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Site: </span>
                    <span>{item.siteName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Quantity: </span>
                    <span className="font-medium">{item.quantity}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Min Threshold: </span>
                    <span>{item.minThreshold}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(item)}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleTransfer(item)}>
                <ArrowRightLeft className="h-4 w-4" />
                <span className="sr-only">Transfer</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDelete(item)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Modals */}
      {editItem && (
        <AddEditInventoryModal open={showEditModal} onOpenChange={setShowEditModal} mode="edit" item={editItem} />
      )}

      {transferItem && (
        <TransferItemModal open={showTransferModal} onOpenChange={setShowTransferModal} item={transferItem} />
      )}

      {deleteItem && (
        <DeleteInventoryDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} item={deleteItem} />
      )}
    </>
  )
}
