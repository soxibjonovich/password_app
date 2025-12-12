import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { LoginForm } from "@/components/login-form"

export default function Page() {
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
                <div className="bg-background flex flex-col h-full items-center justify-center gap-6 p-6 md:p-10">
                    <div className="w-full max-w-sm">
                        <LoginForm />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
