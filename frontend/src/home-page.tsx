import DataTable from "@/components/items-data-table"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react";
import {
  Pen,
  TableOfContents,
} from "lucide-react"

const Actions = {
  "main": {
    "Icon": TableOfContents,
  },
  "cell": {
    "Icon": Pen
  },
}

const Headers = ["id", "title", "email", "username", "created_at"]

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
  type SearchField = "id" | "title" | "email" | "username" | "created_at"
  const [searchField, setSearchField] = useState<SearchField>("title")

  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        const secret = localStorage.getItem("auth_secret")
        const masterPassword = localStorage.getItem("auth_password")
        
        if (!secret || !masterPassword) return

        const response = await fetch(
          `http://localhost:8000/api/v1/passwords?secret=${encodeURIComponent(secret)}&master_password=${encodeURIComponent(masterPassword)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          setData(Array.isArray(data) ? data : data.data || [])
        }
      } catch (err) {
        console.error("Failed to fetch passwords:", err)
      }
    }

    fetchPasswords()
  }, [])

  const filteredData = Data.filter((item) => {
    const searchValue = item[searchField]
    if (!searchValue) return false

    if (typeof searchValue === "string") {
      return searchValue.toLowerCase().includes(searchQuery.toLowerCase())
    }
    if (typeof searchValue === "number") {
      return searchValue.toString().includes(searchQuery)
    }
    return false
  })

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 h-full">
            <div className="grid grid-cols-1 gap-4 @5xl/main:grid-cols-2">
              <div className="h-9 w-full flex gap-2">
                <Input
                  type="text"
                  placeholder="Search passwords..."
                  className="h-full rounded-md border shadow-sm pl-3"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Select
                  onValueChange={(value) => setSearchField(value as SearchField)}
                  value={searchField}
                >
                  <SelectTrigger className="h-full rounded-md border shadow-sm pl-3">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Headers.map((item, index) => (
                        item === "created_at"
                          ? null
                          : <SelectItem key={index} value={item}>{item}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Button className="h-[2.15rem] w-full cursor-pointer rounded-md">
                <span className="select-none">Add New Password</span>
              </Button>
            </div>
            <DataTable
              Data={filteredData}
              Headers={Headers}
            />
          </div>
        </div>
      </div>
    </>
  );
}