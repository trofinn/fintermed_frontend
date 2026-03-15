import {Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty.jsx";
import {Button} from "@/components/ui/button.jsx";
import {ArrowUpRightIcon} from "lucide-react";
import {CreateProjectButton} from "@/layouts/developer-dashboard/components/create-project-button.jsx";
import { IconFolderCode } from "@tabler/icons-react";


export function EmptyProject() {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <IconFolderCode />
                </EmptyMedia>

                <EmptyTitle>No Projects Yet</EmptyTitle>

                <EmptyDescription>
                    You haven&apos;t created any projects yet. Get started by creating
                    your first project.
                </EmptyDescription>
            </EmptyHeader>

            <EmptyContent className="flex-row justify-center gap-2">
                <CreateProjectButton />
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
    )
}