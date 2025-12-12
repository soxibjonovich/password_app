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

const Headers = ["actions", "id", "name", "barcode", "stock_quantity", "price", "category", "created_at"]

export function HomePage() {
  const [Data, setData] = useState<{ id: number; name: string; barcode: string; stock_quantity: number; stock_quantity_type: string; price: number; created_at: string; category: string; }[]>([]);
  const [category, setCategory] = useState<{ id: number; name: string; count: number; }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  type SearchField = "id" | "name" | "barcode" | "stock_quantity" | "stock_quantity_type" | "price" | "category";
  const [searchField, setSearchField] = useState<SearchField>("name");

  useEffect(() => {
    fetch("http://localhost:8000/products/list")
      .then((res) => res.json())
      .then((data) => setData(data as {
        id: number;
        name: string;
        barcode: string;
        stock_quantity: number;
        stock_quantity_type: string;
        price: number;
        category: string;
        created_at: string;
      }[]))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/categories/list")
      .then((res) => res.json())
      .then((data) => setCategory(data as { id: number; name: string; count: number; }[]))
      .catch((err) => console.error(err));
  }, []);

  const filteredData = Data.filter((item) => {
    const value = item[searchField];
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;

    if (typeof value === "string") {
      return value.toLowerCase().includes(searchQuery.toLowerCase()) && matchesCategory;
    }
    if (typeof value === "number") {
      return value.toString().includes(searchQuery) && matchesCategory;
    }
    return false;
  });

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 h-full">
            <div className="grid grid-cols-1 gap-4 @5xl/main:grid-cols-2">
              <div className="h-9 w-full flex gap-2">
                <Input
                  type="text"
                  placeholder=""
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
                        ["actions", "created_at"].includes(item)
                          ? null
                          : <SelectItem key={index} value={item}>{item}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value)}
                >
                  <SelectTrigger className="h-full rounded-md border shadow-sm pl-3">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All</SelectItem>
                      {category.map((item, index) => (
                        <SelectItem key={index} value={item.name}>{item.name}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <a href="/main/items/add">
                <Button className="h-[2.15rem] w-full cursor-pointer rounded-md">
                  <span className="select-none">Add New Password</span>
                </Button>
              </a>
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