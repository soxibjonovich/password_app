import { AddPasswordDialog } from "@/components/add-password-dialog"
import { EditPasswordDialog } from "@/components/edit-password-dialog"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { Pen, List, Search, X, Copy, Eye, EyeOff, Mail, User, Calendar, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

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

// Password Detail Modal Component
function PasswordDetailModal({
  password,
  open,
  onClose,
}: {
  password: Password | null
  open: boolean
  onClose: () => void
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  if (!password || !open) return null

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-card shadow-lg animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-card px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {password.logo ? (
              <img
                src={password.logo}
                alt={password.title}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-md object-contain flex-shrink-0"
              />
            ) : (
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-md bg-primary/10 flex-shrink-0">
                <span className="text-base sm:text-lg font-bold text-primary">
                  {password.title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-bold truncate">{password.title}</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Password Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-2.5 hover:bg-muted transition-all duration-200 hover:rotate-90 flex-shrink-0"
            aria-label="Close"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 sm:space-y-4 px-4 py-4 sm:px-6 sm:py-6">
          {/* Email */}
          {password.email && (
            <div className="rounded-lg border bg-muted/30 p-3 sm:p-4 animate-in slide-in-from-left-4 duration-300">
              <div className="mb-2 flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>Email</span>
              </div>
              <div className="flex items-center justify-between gap-2 sm:gap-4">
                <p className="font-mono text-xs sm:text-sm break-all">{password.email}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(password.email, 'email')}
                  className="flex-shrink-0 transition-all duration-200 hover:scale-110 h-8 w-8 sm:h-9 sm:w-9 p-0"
                >
                  {copied === 'email' ? (
                    <span className="text-xs animate-in zoom-in-50 duration-200">✓</span>
                  ) : (
                    <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Username */}
          {password.username && (
            <div className="rounded-lg border bg-muted/30 p-3 sm:p-4 animate-in slide-in-from-left-4 duration-300 delay-75">
              <div className="mb-2 flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground">
                <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>Username</span>
              </div>
              <div className="flex items-center justify-between gap-2 sm:gap-4">
                <p className="font-mono text-xs sm:text-sm break-all">{password.username}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(password.username!, 'username')}
                  className="flex-shrink-0 transition-all duration-200 hover:scale-110 h-8 w-8 sm:h-9 sm:w-9 p-0"
                >
                  {copied === 'username' ? (
                    <span className="text-xs animate-in zoom-in-50 duration-200">✓</span>
                  ) : (
                    <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Password */}
          <div className="rounded-lg border bg-muted/30 p-3 sm:p-4 animate-in slide-in-from-left-4 duration-300 delay-150">
            <div className="mb-2 flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span>Password</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-xs sm:text-sm flex-1 break-all">
                {showPassword ? password.password : '••••••••••••'}
              </p>
              <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowPassword(!showPassword)}
                  className="transition-all duration-200 hover:scale-110 h-8 w-8 sm:h-9 sm:w-9 p-0"
                >
                  {showPassword ? (
                    <EyeOff className="h-3 w-3 sm:h-4 sm:w-4 animate-in zoom-in-50 duration-200" />
                  ) : (
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 animate-in zoom-in-50 duration-200" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(password.password, 'password')}
                  className="transition-all duration-200 hover:scale-110 h-8 w-8 sm:h-9 sm:w-9 p-0"
                >
                  {copied === 'password' ? (
                    <span className="text-xs animate-in zoom-in-50 duration-200">✓</span>
                  ) : (
                    <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* 2FA Code */}
          {password.fa_code && (
            <div className="rounded-lg border bg-muted/30 p-3 sm:p-4 animate-in slide-in-from-left-4 duration-300 delay-200">
              <div className="mb-2 flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>2FA Code</span>
              </div>
              <div className="flex items-center justify-between gap-2 sm:gap-4">
                <p className="font-mono text-xs sm:text-sm break-all">{password.fa_code}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(password.fa_code!, '2fa')}
                  className="flex-shrink-0 transition-all duration-200 hover:scale-110 h-8 w-8 sm:h-9 sm:w-9 p-0"
                >
                  {copied === '2fa' ? (
                    <span className="text-xs animate-in zoom-in-50 duration-200">✓</span>
                  ) : (
                    <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Created At */}
          <div className="rounded-lg border bg-muted/30 p-3 sm:p-4 animate-in slide-in-from-left-4 duration-300 delay-300">
            <div className="mb-2 flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span>Created</span>
            </div>
            <p className="text-xs sm:text-sm">
              {new Date(password.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-2 border-t bg-card px-4 py-3 sm:px-6 sm:py-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="transition-all duration-200 hover:scale-105 w-full sm:w-auto"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

// Inline DataTable component with improved styling
function DataTable({
  data,
  onActionClick,
  onRowClick,
}: {
  data: Password[]
  onActionClick: (id: number) => void
  onRowClick: (password: Password) => void
}) {
  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-fixed">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="w-20 px-4 py-5 align-middle">
                <div className="flex items-center justify-center h-full">
                  <List className="h-4.5 w-4.5 text-muted-foreground flex-shrink-0" />
                </div>
              </th>
              <th className="w-28 px-4 py-5 text-left text-sm font-medium text-muted-foreground align-middle">
                Logo
              </th>
              <th className="px-6 py-5 text-left text-sm font-medium text-muted-foreground align-middle">
                Title
              </th>
              <th className="w-40 px-6 py-5 text-left text-sm font-medium text-muted-foreground align-middle">
                Created At
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-sm text-muted-foreground"
                >
                  No passwords found. Add your first password to get started.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onRowClick(item)}
                  className="hover:bg-muted/50 transition-all duration-200 cursor-pointer hover:shadow-sm"
                >
                  <td className="w-20 px-4 py-5 align-middle">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onActionClick(item.id)
                        }}
                        className="inline-flex items-center justify-center rounded-md p-2.5 hover:bg-muted transition-all duration-200 flex-shrink-0 hover:scale-110 active:scale-95"
                        aria-label="Edit password"
                      >
                        <Pen className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>
                  </td>
                  <td className="w-28 px-4 py-5 align-middle">
                    <div className="flex items-center">
                      {item.logo ? (
                        <img
                          src={item.logo}
                          alt={item.title}
                          className="h-10 w-10 rounded-lg object-conatain flex-shrink-0"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 flex-shrink-0">
                          <span className="text-sm font-semibold text-primary">
                            {item.title.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 font-medium align-middle">{item.title}</td>
                  <td className="w-40 px-6 py-5 text-sm text-muted-foreground align-middle">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y">
        {data.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-muted-foreground">
            No passwords found. Add your first password to get started.
          </div>
        ) : (
          data.map((item) => (
            <div
              key={item.id}
              onClick={() => onRowClick(item)}
              className="p-4 hover:bg-muted/50 transition-all duration-200 cursor-pointer active:bg-muted"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {item.logo ? (
                    <img
                      src={item.logo}
                      alt={item.title}
                      className="h-12 w-12 rounded-md object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 flex-shrink-0">
                      <span className="text-base font-semibold text-primary">
                        {item.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onActionClick(item.id)
                  }}
                  className="inline-flex items-center justify-center rounded-md p-2.5 hover:bg-muted transition-all duration-200 flex-shrink-0 active:scale-95"
                  aria-label="Edit password"
                >
                  <Pen className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export function HomePage() {
  const [data, setData] = useState<Password[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedPasswordId, setSelectedPasswordId] = useState<number | null>(null)
  const [selectedPassword, setSelectedPassword] = useState<Password | null>(null)

  const fetchPasswords = async () => {
    try {
      const userSecret = localStorage.getItem("user_secret")
      const authPassword = localStorage.getItem("auth_password")

      if (!userSecret || !authPassword) return

      const response = await fetch("/api/v1/passwords/get-all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ secret: userSecret, password: authPassword }),
      })

      if (response.ok) {
        const responseData = await response.json()
        setData(Array.isArray(responseData) ? responseData : [])
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

  const handleRowClick = (password: Password) => {
    setSelectedPassword(password)
    setDetailModalOpen(true)
  }

  const filteredData = data.filter((item) => {
    const searchValue = item.title
    if (!searchValue) return false
    return searchValue.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 animate-in slide-in-from-top-4 duration-500">
          <div className="w-16 h-16 mb-2 relative">
            <img
              src="/white_mode.png"
              alt="LocalPass Logo"
              className="w-16 h-16 absolute inset-0 block dark:hidden"
            />
            <img
              src="/dark_mode.png"
              alt="LocalPass Logo dark"
              className="w-16 h-16 absolute inset-0 hidden dark:block"
          />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 sm:mb-2">
            LocalPass
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage and secure all your passwords in one place
          </p>
        </div>

        {/* Search and Add Section */}
        <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center animate-in slide-in-from-top-4 duration-500 delay-100">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search passwords..."
              className="pl-10 h-10 sm:h-11"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <AddPasswordDialog onPasswordAdded={fetchPasswords} />
        </div>

        {/* Data Table */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <DataTable
            data={filteredData}
            onActionClick={handleActionClick}
            onRowClick={handleRowClick}
          />
        </div>

        {/* Password Detail Modal */}
        <PasswordDetailModal
          password={selectedPassword}
          open={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
        />

        {/* Edit Dialog */}
        {selectedPasswordId && (
          <EditPasswordDialog
            passwordId={selectedPasswordId}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onPasswordUpdated={fetchPasswords}
          />
        )}
      </div>
    </div>
  )
}