import { DocsSidebar } from "@/components/docs/sidebar"
import { DocsHeader } from "@/components/docs/header"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <DocsHeader />
      <div className="flex flex-1">
        <DocsSidebar />
        <main className="flex-1 lg:pl-[17rem]">
          <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
