import * as React from "react"
import {
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Link } from "react-router-dom"
import {
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
    ColumnsIcon,
    MoreVerticalIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Label } from "@/components/ui/label.jsx"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.jsx"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.jsx"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs.jsx"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx"

import { CreateUnityButton } from "@/layouts/developer-dashboard/components/create-unity-button.jsx"
import { CreateClientLinkBtn } from "@/layouts/project-dashboard/create-client-link-btn.jsx"

const getColumns = ({ projectId, projectName, onInvitationCreated }) => [
    {
        accessorKey: "numarApartament",
        header: "Apartament",
        cell: ({ row }) => (
            <div className="font-medium">{row.original.numarApartament}</div>
        ),
    },
    {
        accessorKey: "etaj",
        header: "Etaj",
        cell: ({ row }) => <div>{row.original.etaj}</div>,
    },
    {
        accessorKey: "numarCamere",
        header: "Camere",
        cell: ({ row }) => <div>{row.original.numarCamere}</div>,
    },
    {
        accessorKey: "suprafata",
        header: "Suprafață",
        cell: ({ row }) => <div>{row.original.suprafata} m²</div>,
    },
    {
        accessorKey: "pret",
        header: "Preț",
        cell: ({ row }) => <div>{row.original.pret} €</div>,
    },
    {
        accessorKey: "status",
        header: "Status unitate",
        cell: ({ row }) => (
            <Badge variant="outline">{row.original.status}</Badge>
        ),
        filterFn: "equals",
    },
    {
        accessorKey: "achitat",
        header: "Achitat",
        cell: ({ row }) => (
            <Badge variant="outline">{row.original.achitat ? "Da" : "Nu"}</Badge>
        ),
        filterFn: (row, columnId, value) => {
            if (!value) return true
            return String(row.getValue(columnId)) === value
        },
    },
    {
        id: "clientStatus",
        header: "Status client",
        cell: ({ row }) => {
            if (row.original.client) {
                return <Badge>Client înregistrat</Badge>
            }

            if (row.original.clientInvitationStatus === "pending") {
                return <Badge variant="secondary">Invitație trimisă</Badge>
            }

            return <Badge variant="outline">Fără client</Badge>
        },
        enableSorting: false,
    },
    {
        id: "newClientBtn",
        header: "Acțiune client",
        cell: ({ row }) => (
            <CreateClientLinkBtn
                projectId={projectId}
                projectName={projectName}
                unitId={row.original._id}
                apartmentNumber={row.original.numarApartament}
                hasClient={!!row.original.client}
                hasPendingInvitation={row.original.clientInvitationStatus === "pending"}
                onInvitationCreated={onInvitationCreated}
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                        size="icon"
                    >
                        <MoreVerticalIcon />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem asChild>
                        <Link to={`/units/${row.original._id}`}>Vezi</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
        enableSorting: false,
        enableHiding: false,
    },
]

export function UnitsTable({ data: initialData, projectId, projectName }) {
    const [data, setData] = React.useState(() => initialData || [])
    const [columnVisibility, setColumnVisibility] = React.useState({})
    const [columnFilters, setColumnFilters] = React.useState([])
    const [sorting, setSorting] = React.useState([])
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })

    React.useEffect(() => {
        setData(initialData || [])
    }, [initialData])

    const handleInvitationCreated = React.useCallback(({ unitId, email }) => {
        setData((current) =>
            current.map((unit) =>
                unit._id === unitId
                    ? {
                        ...unit,
                        clientInvitationStatus: "pending",
                        clientInvitationEmail: email,
                    }
                    : unit
            )
        )
    }, [])

    const columns = React.useMemo(
        () =>
            getColumns({
                projectId,
                projectName,
                onInvitationCreated: handleInvitationCreated,
            }),
        [projectId, projectName, handleInvitationCreated]
    )

    const uniqueStatuses = React.useMemo(() => {
        return [...new Set((data || []).map((item) => item.status).filter(Boolean))]
    }, [data])

    const uniquePaymentStatuses = React.useMemo(() => {
        return [...new Set((data || []).map((item) => String(item.achitat)))]
    }, [data])

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            columnFilters,
            pagination,
        },
        getRowId: (row) => row._id?.toString?.() ?? row.numarApartament,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    return (
        <Tabs defaultValue="outline" className="flex w-full flex-col justify-start gap-6">
            <div className="flex items-center justify-between px-4 lg:px-6">
                <Label htmlFor="view-selector" className="sr-only">
                    View
                </Label>

                <Select defaultValue="outline">
                    <SelectTrigger className="@4xl/main:hidden flex w-fit" id="view-selector">
                        <SelectValue placeholder="Select a view" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="outline">Unități</SelectItem>
                        <SelectItem value="stats">Statistici</SelectItem>
                    </SelectContent>
                </Select>

                <TabsList className="@4xl/main:flex hidden">
                    <TabsTrigger value="outline">Unități</TabsTrigger>
                    <TabsTrigger value="stats">Statistici</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <ColumnsIcon />
                                <span className="hidden lg:inline">Customize Columns</span>
                                <span className="lg:hidden">Columns</span>
                                <ChevronDownIcon />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {typeof column.columnDef.header === "string"
                                            ? column.columnDef.header
                                            : column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <CreateUnityButton projectId={projectId} projectName={projectName} />
                </div>
            </div>

            <TabsContent
                value="outline"
                className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
            >
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <Input
                        placeholder="Caută după numărul apartamentului..."
                        value={table.getColumn("numarApartament")?.getFilterValue() ?? ""}
                        onChange={(event) =>
                            table.getColumn("numarApartament")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />

                    <Select
                        value={table.getColumn("status")?.getFilterValue() ?? "all"}
                        onValueChange={(value) =>
                            table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
                        }
                    >
                        <SelectTrigger className="w-[220px]">
                            <SelectValue placeholder="Filtrează după status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toate statusurile</SelectItem>
                            {uniqueStatuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={table.getColumn("achitat")?.getFilterValue() ?? "all"}
                        onValueChange={(value) =>
                            table.getColumn("achitat")?.setFilterValue(value === "all" ? "" : value)
                        }
                    >
                        <SelectTrigger className="w-[220px]">
                            <SelectValue placeholder="Filtrează după achitare" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toate</SelectItem>
                            {uniquePaymentStatuses.includes("true") && (
                                <SelectItem value="true">Achitat</SelectItem>
                            )}
                            {uniquePaymentStatuses.includes("false") && (
                                <SelectItem value="false">Neachitat</SelectItem>
                            )}
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        onClick={() => {
                            table.getColumn("numarApartament")?.setFilterValue("")
                            table.getColumn("status")?.setFilterValue("")
                            table.getColumn("achitat")?.setFilterValue("")
                        }}
                    >
                        Resetează filtrele
                    </Button>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <Table>
                        <TableHeader className="sticky top-0 z-10 bg-muted">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>

                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        Nu există rezultate.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between px-4">
                    <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
                        {table.getFilteredRowModel().rows.length} unități găsite.
                    </div>

                    <div className="flex w-full items-center gap-8 lg:w-fit">
                        <div className="hidden items-center gap-2 lg:flex">
                            <Label htmlFor="rows-per-page" className="text-sm font-medium">
                                Rânduri pe pagină
                            </Label>

                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value))
                                }}
                            >
                                <SelectTrigger className="w-20" id="rows-per-page">
                                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                                </SelectTrigger>

                                <SelectContent side="top">
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex w-fit items-center justify-center text-sm font-medium">
                            Pagina {table.getState().pagination.pageIndex + 1} din {table.getPageCount()}
                        </div>

                        <div className="ml-auto flex items-center gap-2 lg:ml-0">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Prima pagină</span>
                                <ChevronsLeftIcon />
                            </Button>

                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Pagina anterioară</span>
                                <ChevronLeftIcon />
                            </Button>

                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Pagina următoare</span>
                                <ChevronRightIcon />
                            </Button>

                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Ultima pagină</span>
                                <ChevronsRightIcon />
                            </Button>
                        </div>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="stats" className="flex flex-col px-4 lg:px-6">
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed" />
            </TabsContent>
        </Tabs>
    )
}