import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

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

interface EditPasswordDialogProps {
  passwordId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onPasswordUpdated?: () => void
}

export function EditPasswordDialog({
  passwordId,
  open,
  onOpenChange,
  onPasswordUpdated,
}: EditPasswordDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    email: "",
    username: "",
    password: "",
    logo: "",
    fa_code: "",
  })

  useEffect(() => {
    if (open) {
      fetchPasswordData()
    }
  }, [open, passwordId])

  const fetchPasswordData = async () => {
    try {
      const userSecret = localStorage.getItem("user_secret")
      const authPassword = localStorage.getItem("auth_password")

      if (!userSecret || !authPassword) {
        toast.error("Authentication failed")
        return
      }

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

      if (!response.ok) {
        toast.error("Failed to fetch password data")
        return
      }

      const passwords: Password[] = await response.json()
      const password = passwords.find((p) => p.id === passwordId)

      if (!password) {
        toast.error("Password not found")
        return
      }

      setFormData({
        title: password.title,
        email: password.email,
        username: password.username || "",
        password: password.password,
        logo: password.logo || "",
        fa_code: password.fa_code || "",
      })
    } catch (err) {
      console.error("Error fetching password:", err)
      toast.error("Failed to load password data")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const userSecret = localStorage.getItem("user_secret")

      if (!userSecret) {
        toast.error("User secret not found")
        return
      }

      const response = await fetch(
        `http://localhost:8000/api/v1/passwords/${passwordId}?secret=${encodeURIComponent(userSecret)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            email: formData.email,
            username: formData.username || null,
            password: formData.password,
            logo: formData.logo || null,
            fa_code: formData.fa_code || null,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.detail || "Failed to update password")
        return
      }

      toast.success("Password updated successfully!")
      onOpenChange(false)
      onPasswordUpdated?.()
    } catch (err) {
      console.error("Error updating password:", err)
      toast.error("Failed to connect to server")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this password?")) {
      return
    }

    setIsDeleting(true)

    try {
      const userSecret = localStorage.getItem("user_secret")

      if (!userSecret) {
        toast.error("User secret not found")
        return
      }

      const response = await fetch(
        `http://localhost:8000/api/v1/passwords/${passwordId}?secret=${encodeURIComponent(userSecret)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.detail || "Failed to delete password")
        return
      }

      toast.success("Password deleted successfully!")
      onOpenChange(false)
      onPasswordUpdated?.()
    } catch (err) {
      console.error("Error deleting password:", err)
      toast.error("Failed to connect to server")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Password</DialogTitle>
          <DialogDescription>
            Update the password details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Gmail, GitHub"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="your_username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="your_password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Logo URL</Label>
            <Input
              id="logo"
              name="logo"
              placeholder="https://example.com/logo.png"
              value={formData.logo}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fa_code">2FA Code</Label>
            <Input
              id="fa_code"
              name="fa_code"
              placeholder="optional_2fa_code"
              value={formData.fa_code}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-between gap-2 pt-4">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading || isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading || isDeleting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || isDeleting}>
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
