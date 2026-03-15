import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty.jsx";
import { Button } from "@/components/ui/button.jsx";
import { ArrowUpRightIcon } from "lucide-react";
import { IconFolderCode } from "@tabler/icons-react";
import { CreateUnityButton } from "@/layouts/developer-dashboard/components/create-unity-button.jsx";
import * as React from "react";

export function EmptyUnityList() {

    const { projectId } = useParams();

    const projects = useSelector((state) => state.projectReducer.projectList);

    const project = projects.find((p) => p._id === projectId);

    const projectName = project?.numeProiect || "";

    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <IconFolderCode />
                </EmptyMedia>

                <EmptyTitle>Încă nu aveți unități de vânzare</EmptyTitle>

                <EmptyDescription>
                    Proiectul <b>{projectName}</b> nu are încă unități rezidențiale. Începeți prin a adăuga prima unitate.
                </EmptyDescription>
            </EmptyHeader>

            <EmptyContent className="flex-row justify-center gap-2">
                <CreateUnityButton projectId={projectId} projectName={projectName} />
            </EmptyContent>

            <Button
                variant="link"
                asChild
                className="text-muted-foreground"
                size="sm"
            >
                <a href="#">
                    Learn More <ArrowUpRightIcon />
                </a>
            </Button>
        </Empty>
    );
}