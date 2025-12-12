import { LoginForm } from "@/components/login-form"

export default function LoginPage({ onLoginSuccess }: { onLoginSuccess: (email: string) => void }) {
    return (
        <div className="bg-background flex flex-col h-full items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <LoginForm onLoginSuccess={onLoginSuccess} />
            </div>
        </div>
    )
}