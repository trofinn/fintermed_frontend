import { Button } from "@/components/ui/button.jsx"
import { useState } from "react"
import { NewProject } from "@/layouts/developer-dashboard/components/new-project.jsx"

export function CreateProjectButton({ children = "Proiect nou", variant = "default" }) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button variant={variant} onClick={() => setOpen(true)}>
                {children}
            </Button>

            <NewProject open={open} setOpen={setOpen} />
        </>
    )
}