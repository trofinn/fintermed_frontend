"use client"

import * as React from "react"
import * as z from "zod"
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
import { Separator } from "@/components/ui/separator.jsx"
import { toast } from "@/hooks/use-toast.js"
import { CreateClientInvitation } from "@/api-calls/client-routes.js"

const emailSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Adresa de email este obligatorie" })
        .email({ message: "Adresa de email nu este validă" }),
})

export function NewClientLink({
                                  open,
                                  setOpen,
                                  unitId,
                                  projectId,
                                  projectName,
                                  apartmentNumber,
                                  onInvitationCreated,
                              }) {
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const form = useForm({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: "",
        },
    })

    React.useEffect(() => {
        if (open) {
            setTimeout(() => {
                form.setFocus("email")
            }, 100)
        }
    }, [open, form])

    const onSubmit = async (values) => {
        try {
            setIsSubmitting(true)

            const payload = {
                email: values.email,
                unitId,
                projectId,
            }

            const response = await CreateClientInvitation(payload)

            if (response.success) {
                toast({
                    title: "Link trimis cu succes",
                    description:
                        response.message ||
                        "Clientul va primi pe email linkul pentru completarea înregistrării.",
                })

                onInvitationCreated?.({
                    unitId,
                    email: values.email,
                    status: "pending",
                    invitation: response.data,
                })

                form.reset()
                setOpen(false)
            } else {
                toast({
                    title: "Eroare la trimiterea invitației",
                    description:
                        response.message || "A apărut o eroare necunoscută.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "Eroare la trimiterea invitației",
                description:
                    error?.message ||
                    "A apărut o problemă. Te rugăm să încerci din nou.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Drawer
            open={open}
            onOpenChange={(value) => {
                setOpen(value)
                if (!value) {
                    form.reset({
                        email: "",
                    })
                }
            }}
        >
            <DrawerContent className="h-[40vh]">
                <div className="mx-auto flex w-full max-w-md flex-col">
                    <DrawerHeader>
                        <DrawerTitle>Invită client în proiect</DrawerTitle>
                        <DrawerDescription>
                            Introdu adresa de email a clientului pentru a-i trimite linkul de
                            înregistrare pentru unitatea {apartmentNumber || unitId}
                            {projectName ? ` în proiectul ${projectName}` : ""}.
                        </DrawerDescription>
                    </DrawerHeader>

                    <Separator />

                    <div className="px-6 py-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Adresa de email client</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    placeholder="ex: client@email.com"
                                                    autoComplete="email"
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <DrawerFooter className="px-0 pt-6">
                                    <div className="flex justify-end gap-2">
                                        <DrawerClose asChild>
                                            <Button variant="outline" type="button" disabled={isSubmitting}>
                                                Anulează
                                            </Button>
                                        </DrawerClose>

                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? "Se trimite..." : "Trimite link client"}
                                        </Button>
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