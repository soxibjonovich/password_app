import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface AddPasswordDialogProps {
  onPasswordAdded?: () => void
}

export function AddPasswordDialog({ onPasswordAdded }: AddPasswordDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    email: "",
    username: "",
    password: "",
    logo: "",
    fa_code: "",
  })

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
        `/api/v1/passwords?secret=${encodeURIComponent(userSecret)}`,
        {
          method: "POST",
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
        toast.error(errorData.detail || "Failed to create password")
        return
      }

      toast.success("Password created successfully!")
      setFormData({
        title: "",
        email: "",
        username: "",
        password: "",
        logo: "",
        fa_code: "",
      })
      setOpen(false)
      onPasswordAdded?.()
    } catch (err) {
      console.error("Error creating password:", err)
      toast.error("Failed to connect to server")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="cursor-pointer md:size-auto md:px-4 md:py-2 w-full sm:w-auto">
          <span className="select-none">Add Password</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Add New Password</DialogTitle>
          <DialogDescription>
            Create a new password entry. Fill in the details below.
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
              autoComplete="off"
              value={formData.password}
              onChange={handleChange}
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

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Password"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
