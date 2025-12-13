import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import LoginPage from "./login-page"
import { HomePage } from "./home-page"
import { useEffect, useState } from "react"

export default function Page() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const authEmail = localStorage.getItem("auth_email")
        const authPassword = localStorage.getItem("auth_password")
        if (authEmail && authPassword) {
            setIsAuthenticated(true)
        }
        setIsLoading(false)
    }, [])

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>
    }

    if (!isAuthenticated) {
        return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
    }

    return (
        <HomePage />
    )
}
