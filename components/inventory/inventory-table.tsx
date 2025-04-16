"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, ArrowRightLeft, AlertTriangle } from "lucide-react"
import AddEditInventoryModal from "./add-edit-inventory-modal"
import TransferItemModal from "./transfer-item-modal"
import DeleteInventoryDialog from "./delete-inventory-dialog"

// Mock inventory data
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
  {
    id: "inv-006",
    name: "Work Gloves",
    description: "Cut-resistant work gloves, size L",
    category: "ppe",
    site: "site-b",
    siteName: "Site B",
    quantity: 4,
    minThreshold: 5,
    lastUpdated: "2023-04-06",
  },
  {
    id: "inv-007",
    name: "Measuring Tape",
    description: "25ft Stanley measuring tape",
    category: "tools",
    site: "warehouse",
    siteName: "Warehouse",
    quantity: 7,
    minThreshold: 3,
    lastUpdated: "2023-04-07",
  },
]

export default function InventoryTable() {
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Site Location</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{getCategoryLabel(item.category)}</TableCell>
                <TableCell>{item.siteName}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{getStatusBadge(item.quantity, item.minThreshold)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleTransfer(item)}>
                      <ArrowRightLeft className="h-4 w-4" />
                      <span className="sr-only">Transfer</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
