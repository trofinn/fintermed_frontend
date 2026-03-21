"use client"

import * as React from "react"
import {
    CheckCircle2,
    Clock3,
    CircleDashed,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import { Separator } from "@/components/ui/separator.jsx"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.jsx"
import { Progress } from "@/components/ui/progress.jsx"

function formatDate(dateString) {
    if (!dateString) return "Fără dată"

    return new Date(dateString).toLocaleDateString("ro-RO", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })
}

function getStatusConfig(status) {
    switch (status) {
        case "Validată":
            return {
                icon: CheckCircle2,
                iconClass: "text-green-600",
                lineClass: "bg-green-600",
                badgeVariant: "default",
            }

        case "În progres":
            return {
                icon: Clock3,
                iconClass: "text-amber-600",
                lineClass: "bg-amber-500",
                badgeVariant: "secondary",
            }

        case "În așteptarea validării":
            return {
                icon: Clock3,
                iconClass: "text-yellow-600",
                lineClass: "bg-yellow-500",
                badgeVariant: "secondary",
            }

        case "Nevalidată":
            return {
                icon: CircleDashed,
                iconClass: "text-muted-foreground",
                lineClass: "bg-border",
                badgeVariant: "outline",
            }

        case "În viitor":
        default:
            return {
                icon: CircleDashed,
                iconClass: "text-muted-foreground",
                lineClass: "bg-border",
                badgeVariant: "outline",
            }
    }
}

function TimelineStep({ etapa, isLast, status }) {
    const config = getStatusConfig(status)
    const Icon = config.icon

    return (
        <div className="relative min-w-[250px] flex-1">
            <div className="mb-10 flex items-center">
                <div className="z-10 flex h-9 w-9 items-center justify-center rounded-md border bg-background shadow-sm">
                    <Icon className={`h-4 w-4 ${config.iconClass}`} />
                </div>

                {!isLast && (
                    <div className="mx-3 flex-1">
                        <Separator className={config.lineClass} />
                    </div>
                )}
            </div>

            <div className="flex min-h-[120px] max-w-[240px] flex-col">
                {/* row 1 */}
                <div className="min-h-[20px]">
                    <p className="text-xs text-muted-foreground">
                        {etapa.validatedAt
                            ? `Validată la ${formatDate(etapa.validatedAt)}`
                            : ""}
                    </p>
                </div>

                {/* row 2 */}
                <div className="mt-1 min-h-[56px]">
                    <h3 className="text-2xl font-bold leading-tight tracking-tight whitespace-normal break-words">
                        {etapa.numeEtapa}
                    </h3>
                </div>

                {/* row 3 */}
                <div className="mt-3 flex items-center gap-2">
                    <Badge variant={config.badgeVariant}>
                        {status}
                    </Badge>

                    <Badge variant="outline">
                        {etapa.procentaj}%
                    </Badge>
                </div>

                {/* descriere */}
                <div className="mt-3">
                    <p className="text-sm text-muted-foreground whitespace-normal break-words">
                        {etapa.descriereEtapa || "Fără descriere"}
                    </p>
                </div>
            </div>
        </div>
    )
}

export function ProjectTimeline({
                                    etape = [],
                                    progresTotalProiect = 0,
                                    title = "Etapele proiectului",
                                    subtitle = "Evoluția proiectului în funcție de progresul total",
                                }) {
    if (!etape.length) {
        return (
            <Card className="rounded-2xl border shadow-sm">
                <CardHeader className="items-center text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight">
                        {title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Nu există etape definite pentru acest proiect.
                    </p>
                </CardHeader>
            </Card>
        )
    }

    let progresCumulat = 0

    const etapeCuStatus = etape.map((etapa) => {
        const start = progresCumulat
        const end = progresCumulat + Number(etapa.procentaj || 0)

        progresCumulat = end

        return {
            ...etapa,
            _statusCalculat: etapa.statusEtapa,
            _start: start,
            _end: end,
        }
    })

    return (
        <div className="w-full space-y-4">
            <Card className="rounded-2xl border shadow-sm">
                <CardHeader className="items-center text-center">
                    <Badge variant="outline">Timeline</Badge>

                    <CardTitle className="text-4xl font-bold tracking-tight">
                        {title}
                    </CardTitle>

                    <p className="max-w-2xl text-sm text-muted-foreground">
                        {subtitle}
                    </p>

                    <div className="w-full max-w-md space-y-2 pt-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progres total proiect</span>
                            <span className="font-semibold">{progresTotalProiect}%</span>
                        </div>
                        <Progress value={progresTotalProiect} />
                    </div>
                </CardHeader>

                <CardContent>
                    <ScrollArea className="w-full whitespace-nowrap">
                        <div className="flex min-w-max gap-0 px-1 py-6">
                            {etapeCuStatus.map((etapa, index) => (
                                <TimelineStep
                                    key={etapa._id || index}
                                    etapa={etapa}
                                    status={etapa._statusCalculat}
                                    isLast={index === etapeCuStatus.length - 1}
                                />
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}