"use client"

import { Link } from "react-router-dom";
import * as React from "react"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  GripVerticalIcon,
  LoaderIcon,
  MoreVerticalIcon,
  PlusIcon,
  TrendingUpIcon,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import { Button } from "@/components/ui/button.jsx"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart.jsx";
import { Checkbox } from "@/components/ui/checkbox.jsx"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Label } from "@/components/ui/label.jsx"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx"
import { Separator } from "@/components/ui/separator.jsx"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.jsx"
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
import {CreateProjectButton} from "@/layouts/developer-dashboard/components/create-project-button.jsx";
import {CreateUnityButton} from "@/layouts/developer-dashboard/components/create-unity-button.jsx";
import {useDispatch} from "react-redux";
import {UpdateProject} from "@/redux/projectSlice.js";
import {UpdateProjectCall} from "@/api-calls/building-routes.js";
import {toast} from "@/hooks/use-toast.js";

export const schema = z.object({
  _id: z.string(),
  numeProiect: z.string(),
  oras: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  unitati: z.string(),
})

// Create a separate component for the drag handle
function DragHandle({
  id
}) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent">
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

const columns = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original._id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
              checked={
                  table.getIsAllPageRowsSelected() ||
                  (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
          />
        </div>
    ),
    cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
          />
        </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "numeProiect",
    header: "Proiect",
    cell: ({ row }) => <TableCellViewer item={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "oras",
    header: "Oraș",
    cell: ({ row }) => (
        <div className="w-32">
          <Badge variant="outline" className="px-1.5 text-muted-foreground">
            {row.original.oras}
          </Badge>
        </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
        <Badge
            variant="outline"
            className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
        >
          {row.original.status === "Finalizat" ? (
              <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
          ) : (
              <LoaderIcon />
          )}
          {row.original.status}
        </Badge>
    ),
  },
  {
    accessorKey: "unitati",
    header: "Unități vândute",
    cell: ({ row }) => {
      return row.original.unitati.length + "/" + row.original.numarUnitati
    },
  },
  {
    id: "newUnityBtn",
    cell: ({ row }) => (
        <CreateUnityButton projectId={row.original._id} projectName={row.original.numeProiect} />
    ),
  },
  {
    id: "actions",
    cell: ({row}) => (
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
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem><Link to={`/projects/${row.original._id}`}>Vezi unități</Link></DropdownMenuItem>
            <DropdownMenuItem>Favorite</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
    ),
  },
]

function DraggableRow({
  row
}) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function ProjectsTable({ data: initialData }) {
  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [columnFilters, setColumnFilters] = React.useState([])
  const [sorting, setSorting] = React.useState([])

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  React.useEffect(() => {
    setData(initialData)
  }, [initialData])

  const sortableId = React.useId()
  const sensors = useSensors(
      useSensor(MouseSensor, {}),
      useSensor(TouchSensor, {}),
      useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo(() => data?.map(({ _id }) => _id) || [], [data])

  const uniqueCities = React.useMemo(() => {
    return [...new Set(data.map((item) => item.oras).filter(Boolean))]
  }, [data])

  const uniqueStatuses = React.useMemo(() => {
    return [...new Set(data.map((item) => item.status).filter(Boolean))]
  }, [data])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row._id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
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

  function handleDragEnd(event) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((currentData) => {
        const oldIndex = currentData.findIndex((item) => item._id === active.id)
        const newIndex = currentData.findIndex((item) => item._id === over.id)
        return arrayMove(currentData, oldIndex, newIndex)
      })
    }
  }

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
              <SelectItem value="outline">Outline</SelectItem>
              <SelectItem value="past-performance">Past Performance</SelectItem>
              <SelectItem value="key-personnel">Key Personnel</SelectItem>
              <SelectItem value="focus-documents">Focus Documents</SelectItem>
            </SelectContent>
          </Select>

          <TabsList className="@4xl/main:flex hidden">
            <TabsTrigger value="outline">Outline</TabsTrigger>
            <TabsTrigger value="past-performance" className="gap-1">
              Past Performance
              <Badge
                  variant="secondary"
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/30"
              >
                3
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="key-personnel" className="gap-1">
              Key Personnel
              <Badge
                  variant="secondary"
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/30"
              >
                2
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
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
                    .filter(
                        (column) =>
                            typeof column.accessorFn !== "undefined" && column.getCanHide()
                    )
                    .map((column) => {
                      return (
                          <DropdownMenuCheckboxItem
                              key={column.id}
                              className="capitalize"
                              checked={column.getIsVisible()}
                              onCheckedChange={(value) =>
                                  column.toggleVisibility(!!value)
                              }
                          >
                            {column.id}
                          </DropdownMenuCheckboxItem>
                      )
                    })}
              </DropdownMenuContent>
            </DropdownMenu>

            <CreateProjectButton />
          </div>
        </div>

        <TabsContent
            value="outline"
            className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
        >
          {/* FILTRE */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <Input
                placeholder="Caută după numele proiectului..."
                value={table.getColumn("numeProiect")?.getFilterValue() ?? ""}
                onChange={(event) =>
                    table.getColumn("numeProiect")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
            />

            <Select
                value={table.getColumn("oras")?.getFilterValue() ?? "all"}
                onValueChange={(value) =>
                    table.getColumn("oras")?.setFilterValue(value === "all" ? "" : value)
                }
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Filtrează după oraș" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toate orașele</SelectItem>
                {uniqueCities.map((oras) => (
                    <SelectItem key={oras} value={oras}>
                      {oras}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>

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

            <Button
                variant="outline"
                onClick={() => {
                  table.getColumn("numeProiect")?.setFilterValue("")
                  table.getColumn("oras")?.setFilterValue("")
                  table.getColumn("status")?.setFilterValue("")
                }}
            >
              Resetează filtrele
            </Button>
          </div>

          <div className="overflow-hidden rounded-lg border">
            <DndContext
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis]}
                onDragEnd={handleDragEnd}
                sensors={sensors}
                id={sortableId}
            >
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-muted">
                  {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                          return (
                              <TableHead key={header.id} colSpan={header.colSpan}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                              </TableHead>
                          )
                        })}
                      </TableRow>
                  ))}
                </TableHeader>

                <TableBody className="**:data-[slot=table-cell]:first:w-8">
                  {table.getRowModel().rows?.length ? (
                      <SortableContext
                          items={dataIds}
                          strategy={verticalListSortingStrategy}
                      >
                        {table.getRowModel().rows.map((row) => (
                            <DraggableRow key={row.id} row={row} />
                        ))}
                      </SortableContext>
                  ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          Nu există rezultate.
                        </TableCell>
                      </TableRow>
                  )}
                </TableBody>
              </Table>
            </DndContext>
          </div>

          <div className="flex items-center justify-between px-4">
            <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
              {table.getFilteredSelectedRowModel().rows.length} din{" "}
              {table.getFilteredRowModel().rows.length} rând(uri) selectate.
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
                Pagina {table.getState().pagination.pageIndex + 1} din{" "}
                {table.getPageCount()}
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

        <TabsContent value="past-performance" className="flex flex-col px-4 lg:px-6">
          <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
        </TabsContent>

        <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
          <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
        </TabsContent>

        <TabsContent value="focus-documents" className="flex flex-col px-4 lg:px-6">
          <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
        </TabsContent>
      </Tabs>
  )
}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },

  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  }
}

function TableCellViewer({
  item
}) {
  const isMobile = useIsMobile()

  const dispatch = useDispatch()
  const [numeProiect, setNumeProiect] = React.useState(item.numeProiect)
  const [oras, setOras] = React.useState(item.oras)
  const [numarUnitati, setNumarUnitati] = React.useState(item.numarUnitati)

  async function handleUpdateProject() {
    try {
      const response = await UpdateProjectCall(item._id, {
        numeProiect,
        oras,
        numarUnitati,
      })

      if (response.success) {
        dispatch(UpdateProject(response.data))

        toast({
          title: "Proiect actualizat cu succes!",
          description: "Proiectul a fost actualizat și modificările au fost salvate.",
        })
      } else {
        toast({
          title: "Eroare la actualizarea proiectului",
          description: response.message || "A apărut o eroare necunoscută.",
          variant: "destructive",
        })
      }
    } catch (error) {
        toast({
          title: "Eroare la actualizarea proiectului",
          description: error.message || "A apărut o eroare necunoscută. Te rugăm să încerci din nou.",
          variant: "destructive",
        })
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {item.numeProiect}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader className="gap-1">
          <SheetTitle>{item.numeProiect}</SheetTitle>
          <SheetDescription>
            Showing total visitors for the last 6 months
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.6}
                    stroke="var(--color-mobile)"
                    stackId="a" />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a" />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 font-medium leading-none">
                  Trending up by 5.2% this month{" "}
                  <TrendingUpIcon className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Showing total visitors for the last 6 months. This is just
                  some random text to test the layout. It spans multiple lines
                  and should wrap around.
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="proiect">Proiect</Label>
              <Input
                  value={numeProiect}
                  onChange={(e) => setNumeProiect(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="oras">Oraș</Label>
                <Input
                    value={oras}
                    onChange={(e) => setOras(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="unitati">Număr unități</Label>
              <Input
                  type="number"
                  value={numarUnitati}
                  onChange={(e) => setNumarUnitati(e.target.value)}
              />
            </div>
          </form>
        </div>
        <SheetFooter className="mt-auto flex gap-2 sm:flex-col sm:space-x-0">
          <Button className="w-full" onClick={handleUpdateProject}>Actualizează</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
