import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
import { EmptyUnityList } from "@/layouts/developer-dashboard/components/empty-unity-list.jsx";
import { GetUnitiesByProjectId } from "@/api-calls/unity-routes.js";
import { SetUnitiesForProject } from "@/redux/projectSlice.js";
import {ProjectTimeline} from "@/layouts/project-dashboard/project-timeline.jsx";
import {UnitsTable} from "@/layouts/project-dashboard/units-table.jsx";
// import { UnitiesTable } from "@/layouts/developer-dashboard/components/unities-table.jsx";

export function ProjectUnitiesDashboard() {
    const { projectId } = useParams();
    const dispatch = useDispatch();

    const projects = useSelector((state) => state.projectReducer.projectList);

    const project = useMemo(() => {
        return projects.find((p) => p._id === projectId);
    }, [projects, projectId]);

    const unities = project?.unitati || [];
    const projectName = project?.numeProiect || "";
    const etape = project?.etape || [];

    const progresTotalProiect = useMemo(() => {
        return etape.reduce((acc, etapa) => {
            if (etapa.etapaValidata) {
                return acc + Number(etapa.procentaj || 0);
            }
            return acc;
        }, 0);
    }, [etape]);

    useEffect(() => {
        const fetchUnities = async () => {
            const response = await GetUnitiesByProjectId(projectId);

            if (response.success) {
                dispatch(
                    SetUnitiesForProject({
                        projectId,
                        unities: response.data || [],
                    })
                );
            }
        };

        if (projectId) {
            fetchUnities();
        }
    }, [projectId, dispatch]);

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
                                    <BreadcrumbPage>
                                        {projectName
                                            ? `Unități - ${projectName}`
                                            : "Unitățile proiectului"}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <ProjectTimeline
                        etape={etape}
                        progresTotalProiect={progresTotalProiect}
                        title={`Timeline proiect - ${projectName || "Fără nume"}`}
                        subtitle="Evoluția proiectului în funcție de etapele definite"
                    />

                    {unities.length === 0 ? (
                        <EmptyUnityList />
                    ) : (
                        <UnitsTable data={unities} projectId={projectId} projectName={projectName} />
                        // <UnitiesTable data={unities} />
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}