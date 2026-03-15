"use client"

import * as React from "react"
import * as z from "zod"
import { useDispatch } from "react-redux"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

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
import { ScrollArea } from "@/components/ui/scroll-area.jsx"
import { Separator } from "@/components/ui/separator.jsx"
import { toast } from "@/hooks/use-toast.js"
import {CreateNewUnity} from "@/api-calls/building-routes.js";
import {AddUnityToProject} from "@/redux/projectSlice.js";


const unitySchema = z.object({
    numarApartament: z.string().min(1, { message: "Numărul apartamentului este obligatoriu" }),
    etaj: z.coerce
        .number({ invalid_type_error: "Etajul este obligatoriu" })
        .min(0, { message: "Etajul nu poate fi negativ" }),
    suprafata: z.coerce
        .number({ invalid_type_error: "Suprafața este obligatorie" })
        .min(1, { message: "Suprafața trebuie să fie mai mare decât 0" }),
    numarCamere: z.coerce
        .number({ invalid_type_error: "Numărul de camere este obligatoriu" })
        .min(1, { message: "Numărul de camere trebuie să fie cel puțin 1" }),
    pret: z.coerce
        .number({ invalid_type_error: "Prețul este obligatoriu" })
        .min(1, { message: "Prețul trebuie să fie mai mare decât 0" }),
    infoSuplimentare: z.string().optional(),
})

function UnityDetailsStep({ form }) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
                control={form.control}
                name="numarApartament"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Număr apartament</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Ex: A12" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="etaj"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Etaj</FormLabel>
                        <FormControl>
                            <Input {...field} type="number" min="0" placeholder="Ex: 3" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="suprafata"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Suprafață (mp)</FormLabel>
                        <FormControl>
                            <Input {...field} type="number" min="1" step="0.01" placeholder="Ex: 74.5" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="numarCamere"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Număr camere</FormLabel>
                        <FormControl>
                            <Input {...field} type="number" min="1" placeholder="Ex: 3" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="pret"
                render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel>Preț (EUR)</FormLabel>
                        <FormControl>
                            <Input {...field} type="number" min="1" step="0.01" placeholder="Ex: 125000" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="infoSuplimentare"
                render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel>Informații suplimentare</FormLabel>
                        <FormControl>
                            <Textarea
                                {...field}
                                value={field.value || ""}
                                placeholder="Detalii suplimentare despre unitate"
                                className="min-h-[130px]"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}

export function NewUnity({ open, setOpen, projectId, projectName }) {
    const dispatch = useDispatch()

    const form = useForm({
        resolver: zodResolver(unitySchema),
        defaultValues: {
            numarApartament: "",
            etaj: "",
            suprafata: "",
            numarCamere: "",
            pret: "",
            infoSuplimentare: "",
        },
    })

    const onSubmit = async (values) => {
        try {
            const payload = {
                ...values,
                projectId,
            }

            const response = await CreateNewUnity(payload)

            if (response.success) {
                dispatch(
                    AddUnityToProject({
                        projectId,
                        unity: response.data,
                    })
                );
                toast({
                    title: "Unitate creată cu succes!",
                    description: "Unitatea a fost adăugată în proiect.",
                })
                form.reset()
                setOpen(false)
             } else {
                 toast({
                     title: "Eroare la crearea unității",
                     description: response.message || "A apărut o eroare necunoscută.",
                     variant: "destructive",
                 })
             }

            form.reset()
            setOpen(false)
        } catch (error) {
            toast({
                title: "Eroare la crearea unității",
                description: error.message || "A apărut o eroare necunoscută. Te rugăm să încerci din nou.",
                variant: "destructive",
            })
        }
    }

    return (
        <Drawer
            open={open}
            onOpenChange={(value) => {
                setOpen(value)
                if (!value) {
                    form.reset({
                        numarApartament: "",
                        etaj: "",
                        suprafata: "",
                        numarCamere: "",
                        pret: "",
                        infoSuplimentare: "",
                    })
                }
            }}
        >
            <DrawerContent className="h-[92vh]">
                <div className="mx-auto flex h-full w-full max-w-3xl flex-col">
                    <DrawerHeader className="shrink-0 pb-2">
                        <DrawerTitle>Unitate nouă în proiectul {projectName}</DrawerTitle>
                        <DrawerDescription>
                            Completați informațiile unității rezidențiale.
                        </DrawerDescription>
                    </DrawerHeader>

                    <Separator />

                    <div className="flex-1 overflow-hidden px-6 py-6">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="flex h-full flex-col"
                            >
                                <div className="flex-1 overflow-hidden">
                                    <ScrollArea className="h-full pr-3">
                                        <Card className="rounded-2xl">
                                            <CardHeader>
                                                <CardTitle>Detalii unitate</CardTitle>
                                                <CardDescription>
                                                    Introduceți informațiile generale ale unității.
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <UnityDetailsStep form={form} />
                                            </CardContent>
                                        </Card>
                                    </ScrollArea>
                                </div>

                                <DrawerFooter className="shrink-0 px-0 pb-0 pt-4">
                                    <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                        <div className="flex gap-2">
                                            <DrawerClose asChild>
                                                <Button variant="outline" type="button">
                                                    Anulează
                                                </Button>
                                            </DrawerClose>

                                            <Button type="submit">
                                                Creează unitate
                                            </Button>
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