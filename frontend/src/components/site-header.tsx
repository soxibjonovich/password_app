import { ModeToggle } from "./mode-toggle"

export function SiteHeader() {
  return (
    <header className="flex h-[--header-height] shrink-0 items-center border-b px-6">
      <div className="ml-auto flex items-center gap-4">
        <ModeToggle />
      </div>
    </header>
  )
}
