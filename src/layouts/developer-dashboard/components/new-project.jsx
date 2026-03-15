"use client"

import * as React from "react"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    ChevronDown,
    MoreVertical,
    Pencil,
    Plus,
    Save,
    Trash2,
    X,
} from "lucide-react"

import { Button } from "@/components/ui/button.jsx"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Textarea } from "@/components/ui/textarea.jsx"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.jsx"
import { Separator } from "@/components/ui/separator.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible.jsx"
import { ScrollArea } from "@/components/ui/scroll-area.jsx"
import {CreateNewProject} from "@/api-calls/building-routes.js";
import {toast} from "@/hooks/use-toast.js";
import {useDispatch} from "react-redux";
import {AddProject} from "@/redux/projectSlice.js";

const milestoneSchema = z.object({
    nume: z.string().min(1, { message: "Numele etapei este obligatoriu" }),
    procent: z.coerce
        .number({ invalid_type_error: "Procentajul este obligatoriu" })
        .min(0, { message: "Procentajul nu poate fi negativ" })
        .max(100, { message: "Procentajul nu poate depăși 100" }),
    descriere: z.string().min(1, { message: "Descrierea etapei este obligatorie" }),
})

const projectSchema = z
    .object({
        numeProiect: z.string().min(1, { message: "Numele proiectului este obligatoriu" }),
        descriere: z.string().min(1, { message: "Descrierea este obligatorie" }),
        oras: z.string().min(1, { message: "Orașul este obligatoriu" }),
        numarUnitati: z.coerce
            .number({ invalid_type_error: "Numărul de unități este obligatoriu" })
            .min(1, { message: "Numărul de unități trebuie să fie cel puțin 1" }),
        adresa: z.string().min(1, { message: "Adresa este obligatorie" }),
        milestones: z.array(milestoneSchema).min(1, {
            message: "Trebuie să existe cel puțin o etapă",
        }),
    })
    .superRefine((data, ctx) => {
        const total = data.milestones.reduce(
            (sum, item) => sum + Number(item.procent || 0),
            0
        )

        if (total !== 100) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["milestones"],
                message: `Totalul procentelor trebuie să fie 100%. Acum este ${total}%.`,
            })
        }
    })

const defaultMilestones = [
    {
        nume: "Pre-contract",
        procent: 5,
        descriere: "Etapa pre-contractuală",
    },
    {
        nume: "Structură de rezistență",
        procent: 25,
        descriere: "Finalizarea structurii de rezistență",
    },
    {
        nume: "Instalații",
        procent: 20,
        descriere: "Finalizarea instalațiilor",
    },
    {
        nume: "Etapa finală",
        procent: 50,
        descriere: "Finalizare construcție",
    },
]

function ProjectDetailsStep({ form }) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
                control={form.control}
                name="numeProiect"
                render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel>Nume proiect</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Nume proiect" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="descriere"
                render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel>Descriere</FormLabel>
                        <FormControl>
                            <Textarea
                                {...field}
                                placeholder="Descriere proiect"
                                className="min-h-[120px]"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="oras"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Oraș</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Oraș" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="numarUnitati"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Număr unități</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="number"
                                min="1"
                                placeholder="Număr unități"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="adresa"
                render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel>Adresă</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Adresă" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}

function StepIndicator({ step }) {
    return (
        <div className="px-6 pb-4">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                            step === 1
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                        }`}
                    >
                        1
                    </div>
                    <span className={step === 1 ? "font-medium" : "text-muted-foreground"}>
                        Detalii proiect
                    </span>
                </div>

                <Separator className="flex-1" />

                <div className="flex items-center gap-2">
                    <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                            step === 2
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                        }`}
                    >
                        2
                    </div>
                    <span className={step === 2 ? "font-medium" : "text-muted-foreground"}>
                        Etapele proiectului
                    </span>
                </div>
            </div>
        </div>
    )
}

export function MilestoneFormCard({ form, index, onCancel, onSave, isNew }) {
    return (
        <Card className="rounded-2xl border shadow-sm">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle className="text-base">
                            {isNew ? "Etapă nouă" : `Editare etapă ${index + 1}`}
                        </CardTitle>
                        <CardDescription>
                            Completați informațiile pentru această etapă.
                        </CardDescription>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button type="button" variant="ghost" size="icon" onClick={onCancel}>
                            <X className="h-4 w-4" />
                        </Button>

                        <Button type="button" size="sm" onClick={onSave}>
                            <Save className="mr-2 h-4 w-4" />
                            Salvează
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <Separator />

            <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name={`milestones.${index}.nume`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nume</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Nume etapă" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name={`milestones.${index}.procent`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Procentaj din totalul construcției</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="number"
                                        min="0"
                                        max="100"
                                        placeholder="Procent"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name={`milestones.${index}.descriere`}
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Descriere</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Descriere etapă"
                                        className="min-h-[110px]"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

export function MilestoneDisplayCard({ milestone, onEdit, onDelete, isImplicit }) {
    return (
        <Card className="rounded-2xl border shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <CardTitle className="text-base">{milestone.nume}</CardTitle>
                            <Badge variant="secondary">{milestone.procent}%</Badge>
                            {isImplicit && <Badge variant="outline">Implicit</Badge>}
                        </div>

                        <CardDescription className="mt-2">
                            {milestone.descriere}
                        </CardDescription>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={onEdit}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Editează
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={onDelete}
                                className="text-red-600 focus:text-red-600"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Șterge
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
        </Card>
    )
}

function MilestonesStep({ form, fields, append, remove }) {
    const milestones = form.watch("milestones") || []
    const [editingIndex, setEditingIndex] = React.useState(null)

    const totalPercent = milestones.reduce(
        (sum, item) => sum + Number(item?.procent || 0),
        0
    )

    const handleAddNew = () => {
        append({
            nume: "",
            procent: 0,
            descriere: "",
        })
        setEditingIndex(fields.length)
    }

    const handleCancelEdit = () => {
        if (editingIndex === null) return

        const current = form.getValues(`milestones.${editingIndex}`)

        const isEmpty =
            !current?.nume &&
            !current?.descriere &&
            (!current?.procent || Number(current?.procent) === 0)

        if (isEmpty) {
            remove(editingIndex)
        }

        setEditingIndex(null)
    }

    const handleSaveMilestone = async (index) => {
        const valid = await form.trigger([
            `milestones.${index}.nume`,
            `milestones.${index}.procent`,
            `milestones.${index}.descriere`,
        ])

        if (!valid) return
        setEditingIndex(null)
    }

    return (
        <div className="flex h-full flex-col space-y-4">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Etapele proiectului</h2>
                    <p className="text-sm text-muted-foreground">
                        Administrați etapele proiectului
                    </p>
                </div>

                <Button type="button" onClick={handleAddNew}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adaugă etapă
                </Button>
            </div>

            <div className="rounded-2xl border bg-muted/20 p-4">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Total procent etape
                    </div>
                    <div
                        className={`text-sm font-semibold ${
                            totalPercent === 100 ? "text-green-600" : "text-red-600"
                        }`}
                    >
                        {totalPercent}%
                    </div>
                </div>
            </div>

            <div className="min-h-0 flex-1">
                <ScrollArea className="h-[420px] pr-3">
                    <div className="space-y-3">
                        {fields.map((field, index) =>
                            editingIndex === index ? (
                                <MilestoneFormCard
                                    key={field.id}
                                    form={form}
                                    index={index}
                                    isNew={
                                        !form.getValues(`milestones.${index}.nume`) &&
                                        !form.getValues(`milestones.${index}.descriere`)
                                    }
                                    onCancel={handleCancelEdit}
                                    onSave={() => handleSaveMilestone(index)}
                                />
                            ) : (
                                <MilestoneDisplayCard
                                    key={field.id}
                                    milestone={milestones[index]}
                                    index={index}
                                    isImplicit={index < 4}
                                    onEdit={() => setEditingIndex(index)}
                                    onDelete={() => {
                                        remove(index)
                                        if (editingIndex === index) setEditingIndex(null)
                                    }}
                                />
                            )
                        )}
                    </div>
                </ScrollArea>
            </div>

            <FormField
                control={form.control}
                name="milestones"
                render={() => (
                    <FormItem>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}

export function NewProject({ open, setOpen }) {
    const [step, setStep] = React.useState(1)
    const dispatch = useDispatch();
    const form = useForm({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            numeProiect: "",
            descriere: "",
            oras: "",
            numarUnitati: "",
            adresa: "",
            milestones: defaultMilestones,
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "milestones",
    })

    const step1Fields = [
        "numeProiect",
        "descriere",
        "oras",
        "numarUnitati",
        "adresa",
    ]

    const handleNext = async () => {
        const valid = await form.trigger(step1Fields)
        if (!valid) return
        setStep(2)
    }

    const handleBack = () => {
        setStep(1)
    }

    const onSubmit = async (values) => {
        console.log("project form =", values)

        try {
            const response = await CreateNewProject(values);
            if(response.success) {
                dispatch(AddProject(response.data));
                toast({
                    title: "Proiect creat cu succes!",
                    description: "Proiectul tău a fost creat și este acum vizibil în dashboard."
                });
                form.reset({
                    numeProiect: "",
                    descriere: "",
                    oras: "",
                    numarUnitati: "",
                    adresa: "",
                    milestones: defaultMilestones,
                })

                setStep(1)
                setOpen(false)
            }
            else {
                toast({
                    title: "Eroare la crearea proiectului",
                    description: response.message || "A apărut o eroare necunoscută. Te rugăm să încerci din nou.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Eroare la crearea proiectului",
                description: error.message || "A apărut o eroare necunoscută. Te rugăm să încerci din nou.",
                variant: "destructive",
            });
        }
    };

    return (
        <Drawer
            open={open}
            onOpenChange={(value) => {
                setOpen(value)
                if (!value) {
                    setStep(1)
                }
            }}
        >
            <DrawerContent className="h-[92vh]">
                <div className="mx-auto flex h-full w-full max-w-4xl flex-col">
                    <DrawerHeader className="shrink-0 pb-2">
                        <DrawerTitle>Proiect nou</DrawerTitle>
                        <DrawerDescription>
                            Completați informațiile proiectului și configurați etapele.
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="shrink-0">
                        <StepIndicator step={step} />
                    </div>

                    <div className="flex-1 overflow-hidden px-6 pb-6">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="flex h-full flex-col"
                            >
                                <div className="flex-1 overflow-hidden">
                                    {step === 1 && (
                                        <ScrollArea className="h-full pr-3">
                                            <Card className="rounded-2xl">
                                                <CardHeader>
                                                    <CardTitle>Detalii proiect</CardTitle>
                                                    <CardDescription>
                                                        Introduceți informațiile generale ale proiectului.
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <ProjectDetailsStep form={form} />
                                                </CardContent>
                                            </Card>
                                        </ScrollArea>
                                    )}

                                    {step === 2 && (
                                        <MilestonesStep
                                            form={form}
                                            fields={fields}
                                            append={append}
                                            remove={remove}
                                        />
                                    )}
                                </div>

                                <DrawerFooter className="shrink-0 px-0 pb-0 pt-4">
                                    <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                                        <div>
                                            {step === 2 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={handleBack}
                                                >
                                                    Înapoi
                                                </Button>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <DrawerClose asChild>
                                                <Button variant="outline" type="button">
                                                    Anulează
                                                </Button>
                                            </DrawerClose>

                                            {step === 1 && (
                                                <Button type="button" onClick={handleNext}>
                                                    Continuă
                                                </Button>
                                            )}

                                            {step === 2 && (
                                                <Button type="submit">
                                                    Creează proiect
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </DrawerFooter>
                            </form>
                        </Form>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}