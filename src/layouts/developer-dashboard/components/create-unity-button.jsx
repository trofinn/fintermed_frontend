import {useState} from "react";
import {Button} from "@/components/ui/button.jsx";
import {NewUnity} from "@/layouts/developer-dashboard/components/new-unity.jsx";


export function CreateUnityButton({projectId, projectName, children = "Adaugă unitate nouă", variant = "default" }) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button variant={variant} onClick={() => setOpen(true)}>
                {children}
            </Button>

            <NewUnity open={open} setOpen={setOpen} projectId={projectId} projectName={projectName} />
        </>
    )
}