import DataTable from "@/components/items-data-table"
import { AddPasswordDialog } from "@/components/add-password-dialog"
import { EditPasswordDialog } from "@/components/edit-password-dialog"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react";
import {
  Pen,
  TableOfContents,
} from "lucide-react"

const Headers = ["actions", "logo", "title", "created_at"]

const Actions = {
  "main": {
    "Icon": TableOfContents,
  },
  "cell": {
    "Icon": Pen
  },
}

interface Password {
  id: number
  title: string
  email: string
  username: string | null
  password: string
  logo: string | null
  fa_code: string | null
  created_at: string
  user_id: number
}

export function HomePage() {
  const [Data, setData] = useState<Password[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedPasswordId, setSelectedPasswordId] = useState<number | null>(null)

  const fetchPasswords = async () => {
    try {
      const userSecret = localStorage.getItem("user_secret")
      const authPassword = localStorage.getItem("auth_password")
      
      if (!userSecret || !authPassword) return

      const response = await fetch(
        "http://localhost:8000/api/v1/passwords/get-all",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ secret: userSecret, password: authPassword }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        setData(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error("Failed to fetch passwords:", err)
    }
  }

  useEffect(() => {
    fetchPasswords()
  }, [])

  const handleActionClick = (passwordId: number) => {
    setSelectedPasswordId(passwordId)
    setEditDialogOpen(true)
  }

  const filteredData = Data.filter((item) => {
    const searchValue = item.title
    if (!searchValue) return false

    if (typeof searchValue === "string") {
      return searchValue.toLowerCase().includes(searchQuery.toLowerCase())
    }
    return false
  })

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <Input
          type="text"
          placeholder="Search passwords..."
          className="flex-1"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <AddPasswordDialog onPasswordAdded={fetchPasswords} />
      </div>
      <DataTable
        Data={filteredData}
        Headers={Headers}
        Actions={Actions}
        onActionClick={handleActionClick}
      />
      {selectedPasswordId && (
        <EditPasswordDialog
          passwordId={selectedPasswordId}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onPasswordUpdated={fetchPasswords}
        />
      )}
    </div>
  );
}