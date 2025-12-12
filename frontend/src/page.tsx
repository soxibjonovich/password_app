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
        const token = localStorage.getItem("auth_token")
        if (token) {
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
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <SidebarInset>
                <SiteHeader />
                <HomePage />
            </SidebarInset>
        </SidebarProvider>
    )
}
