import { useSelector } from "react-redux";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.jsx";
import { AppSidebar } from "@/components/app-sidebar.jsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { useEffect } from "react";
import { EmptyProject } from "@/layouts/developer-dashboard/components/empty-project.jsx";

import {ProjectsTable} from "@/layouts/developer-dashboard/components/projects-table.jsx";

export function DeveloperDashboard() {
    const developer = useSelector((state) => state.developerReducer.thisDeveloper);
    const projects = useSelector((state) => state.projectReducer.projectList);

    useEffect(() => {
        console.log("Developer:", developer);
        console.log("Projects:", projects);
    }, [developer, projects]);

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="w-full h-full">
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">Your Dashboard</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Proiectele mele</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {projects.length === 0 ? (
                        <EmptyProject />
                    ) : (
                        <ProjectsTable data={projects} />

                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}