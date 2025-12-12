import { KeyRound } from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  onLoginSuccess,
  ...props
}: React.ComponentProps<"div"> & { onLoginSuccess: (secret: string) => void }) {
  const [secret, setSecret] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:8000/api/v1/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ secret, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.detail || "Invalid secret or password")
        setIsLoading(false)
        return
      }

      const data = await response.json()
      localStorage.setItem("auth_secret", secret)
      localStorage.setItem("auth_password", password)
      localStorage.setItem("user_id", data.id)
      onLoginSuccess(secret)
    } catch (err) {
      setError("Failed to connect to server")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href=""
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <KeyRound className="size-6" />
              </div>
              <span className="sr-only">LocalPass</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to LocalPass</h1>
          </div>
          <Field>
            <FieldLabel htmlFor="secret">Secret</FieldLabel>
            <Input
              id="secret"
              type="text"
              placeholder="your_secret_key"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Master Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="your_master_password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Field>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
