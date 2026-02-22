"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button.jsx";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card.jsx";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { Input } from "@/components/ui/input.jsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast.js";
import { DeveloperRegister } from "@/api-calls/developer-register.js";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.jsx";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";

// Form schema cu mesaje de validare în română
const formSchema = z.object({
    tipEntitate: z.string().min(1, { message: "Tipul entității juridice este obligatoriu" }),
    numarInregistrare: z.string().min(1, { message: "Numărul de înregistrare este obligatoriu" }),
    tara: z.string().min(1, { message: "Țara entității este obligatorie" }),
    denumireCompanie: z.string().min(1, { message: "Denumirea companiei este obligatorie" }),
    dataInregistrarii: z.string().min(1, { message: "Data înregistrării este obligatorie" }),
    prenume: z.string().min(1, { message: "Prenumele reprezentantului legal este obligatoriu" }),
    nume: z.string().min(1, { message: "Numele reprezentantului legal este obligatoriu" }),
    dataNasterii: z.string().min(1, { message: "Data nașterii este obligatorie" }),
    taraReprezentant: z.string().min(1, { message: "Țara de origine a reprezentantului este obligatorie" }),
    nationalitate: z.string().min(1, { message: "Naționalitatea reprezentantului este obligatorie" }),
    email: z.string().email({ message: "Introduceți un e-mail valid" }),
    telefon: z.string().regex(/^\+?\d{10,15}$/, { message: "Introduceți un număr de telefon valid" }),
    taraRezidenta: z.string().min(1, { message: "Țara de reședință a reprezentantului este obligatorie" }),
});

// Exemplu scurt de țări și naționalități (poți completa lista completă)
const countries = [
    { code: "RO", name: "România" },
    { code: "US", name: "Statele Unite" },
    { code: "DE", name: "Germania" },
];

const nationalities = [
    { code: "RO", name: "Română" },
    { code: "US", name: "Americană" },
    { code: "DE", name: "Germană" },
];

// Componentă generică CountrySelect
function CountrySelect({ control, name, placeholder, options }) {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");

    const filtered = inputValue
        ? options.filter((c) =>
            c.name.toLowerCase().includes(inputValue.toLowerCase())
        )
        : options;

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="w-full">
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between text-left"
                                >
                                    {field.value
                                        ? options.find((c) => c.code === field.value)?.name
                                        : placeholder}
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-full min-w-[var(--radix-popover-trigger-width)]">
                            <Command>
                                <CommandInput
                                    placeholder={`Căutați ${placeholder.toLowerCase()}`}
                                    value={inputValue}
                                    onValueChange={setInputValue}
                                />
                                <CommandList>
                                    {filtered.map((c) => (
                                        <CommandItem
                                            key={c.code}
                                            onSelect={() => {
                                                field.onChange(c.code);
                                                setOpen(false);
                                                setInputValue("");
                                            }}
                                        >
                                            {c.name}
                                        </CommandItem>
                                    ))}
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

export function DeveloperRegistrationForm() {
    const { toast } = useToast();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tipEntitate: "",
            numarInregistrare: "",
            tara: "",
            denumireCompanie: "",
            dataInregistrarii: "",
            prenume: "",
            nume: "",
            dataNasterii: "",
            taraReprezentant: "",
            nationalitate: "",
            email: "",
            telefon: "",
            taraRezidenta: "",
        },
    });

    const onSubmit = async (values) => {
        try {
            const response = await DeveloperRegister(values);
            if (response.success) {
                toast({
                    title: "Înregistrare realizată",
                    description: "Procesul de înregistrare a fost finalizat cu succes.",
                });
                form.reset();
            } else {
                toast({
                    title: "Eroare la înregistrare",
                    description: response.message,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Eroare la înregistrare",
                description: "A apărut o problemă. Vă rugăm să încercați mai târziu.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="w-full flex justify-center px-4">
            <Card className="w-full max-w-3xl mx-auto p-6 lg:p-8">
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl text-center">Înregistrare Dezvoltator</CardTitle>
                    <CardDescription className="text-sm text-center">
                        Completați toate câmpurile pentru a finaliza înregistrarea.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">

                            <h2 className="lg:col-span-2 font-semibold">Informații Entitate Juridică</h2>

                            <FormField
                                control={form.control}
                                name="tipEntitate"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormControl>
                                            <Select {...field} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selectați tipul entității" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="SRL">SRL</SelectItem>
                                                    <SelectItem value="SA">SA</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="numarInregistrare"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormControl>
                                            <Input {...field} placeholder="Numărul de înregistrare al companiei" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <CountrySelect control={form.control} name="tara" placeholder="Țara în care este înregistrată compania" options={countries} />

                            <FormField
                                control={form.control}
                                name="denumireCompanie"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormControl>
                                            <Input {...field} placeholder="Denumirea completă a companiei" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dataInregistrarii"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormControl>
                                            <Input {...field} type="date" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <h2 className="lg:col-span-2 font-semibold mt-4">Informații Reprezentant Legal</h2>

                            <FormField
                                control={form.control}
                                name="prenume"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormControl>
                                            <Input {...field} placeholder="Prenumele reprezentantului legal" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="nume"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormControl>
                                            <Input {...field} placeholder="Numele reprezentantului legal" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dataNasterii"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormControl>
                                            <Input {...field} type="date" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <CountrySelect control={form.control} name="taraReprezentant" placeholder="Țara de origine a reprezentantului" options={countries} />
                            <CountrySelect control={form.control} name="nationalitate" placeholder="Naționalitatea reprezentantului" options={nationalities} />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormControl>
                                            <Input {...field} type="email" placeholder="Emailul reprezentantului" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="telefon"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormControl>
                                            <Input {...field} placeholder="Numărul de telefon al reprezentantului" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <CountrySelect control={form.control} name="taraRezidenta" placeholder="Țara de reședință a reprezentantului" options={countries} />

                            <div className="lg:col-span-2 flex justify-center mt-4">
                                <Button type="submit" className="w-full lg:w-auto">Înregistrează</Button>
                            </div>

                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}