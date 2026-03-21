"use client"

import * as React from "react"
import { Button } from "@/components/ui/button.jsx"
import {NewClientLink} from "@/layouts/project-dashboard/new-client.jsx";


export function CreateClientLinkBtn({
                                        projectId,
                                        projectName,
                                        unitId,
                                        apartmentNumber,
                                        hasClient,
                                        hasPendingInvitation,
                                        onInvitationCreated,
                                    }) {
    const [open, setOpen] = React.useState(false)

    const disabled = hasClient || hasPendingInvitation

    return (
        <>
            <Button
                variant="default"
                size="sm"
                onClick={() => setOpen(true)}
                disabled={disabled}
            >
                {hasClient
                    ? "Client asociat"
                    : hasPendingInvitation
                        ? "Invitație trimisă"
                        : "Trimite link"}
            </Button>

            <NewClientLink
                open={open}
                setOpen={setOpen}
                unitId={unitId}
                projectId={projectId}
                projectName={projectName}
                apartmentNumber={apartmentNumber}
                onInvitationCreated={onInvitationCreated}
            />
        </>
    )
}