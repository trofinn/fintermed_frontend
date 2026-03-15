"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button.jsx";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card.jsx";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.jsx";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command.jsx";
import { Eye, EyeOff } from "lucide-react";

import { useToast } from "@/hooks/use-toast.js";
import { DeveloperRegister } from "@/api-calls/developer-register.js";

// ---------- SCHEMA ZOD CU CONFIRMĂRI ----------
const formSchema = z
    .object({
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
        telefon: z
            .string()
            .regex(/^\+?\d{10,15}$/, { message: "Introduceți un număr de telefon valid" }),
        taraRezidenta: z.string().min(1, { message: "Țara de reședință a reprezentantului este obligatorie" }),

        email: z.string().email({ message: "Introduceți un e-mail valid" }),
        confirmEmail: z.string().email({ message: "Introduceți un e-mail valid" }),

        password: z.string().min(8, { message: "Parola trebuie să aibă cel puțin 8 caractere" }),
        confirmPassword: z.string().min(8, { message: "Parola trebuie să aibă cel puțin 8 caractere" }),
    })
    .superRefine((data, ctx) => {
        if (data.email !== data.confirmEmail) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["confirmEmail"],
                message: "Adresele de email nu coincid",
            });
        }
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["confirmPassword"],
                message: "Parolele nu coincid",
            });
        }
    });

// ---------- DATE DEMO ȚĂRI / NAȚIONALITĂȚI ----------
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

// ---------- COMPONENTĂ SELECT ȚARĂ / NAȚIONALITATE ----------
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

// ---------- PAS 1: ENTITATE JURIDICĂ ----------
function EntityStep({ form }) {
    return (
        <>
            <h2 className="lg:col-span-2 font-semibold mb-1">
                Informații Entitate Juridică
            </h2>

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
                            <Input
                                {...field}
                                placeholder="Numărul de înregistrare al companiei"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <CountrySelect
                control={form.control}
                name="tara"
                placeholder="Țara în care este înregistrată compania"
                options={countries}
            />

            <FormField
                control={form.control}
                name="denumireCompanie"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormControl>
                            <Input
                                {...field}
                                placeholder="Denumirea completă a companiei"
                            />
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
        </>
    );
}

// ---------- PAS 2: REPREZENTANT LEGAL ----------
function RepresentativeStep({ form }) {
    return (
        <>
            <h2 className="lg:col-span-2 font-semibold mb-1">
                Informații Reprezentant Legal
            </h2>

            <FormField
                control={form.control}
                name="prenume"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormControl>
                            <Input
                                {...field}
                                placeholder="Prenumele reprezentantului legal"
                            />
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
                            <Input
                                {...field}
                                placeholder="Numele reprezentantului legal"
                            />
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

            <CountrySelect
                control={form.control}
                name="taraReprezentant"
                placeholder="Țara de origine a reprezentantului"
                options={countries}
            />

            <CountrySelect
                control={form.control}
                name="nationalitate"
                placeholder="Naționalitatea reprezentantului"
                options={nationalities}
            />

            <FormField
                control={form.control}
                name="telefon"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormControl>
                            <Input
                                {...field}
                                placeholder="Numărul de telefon al reprezentantului"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <CountrySelect
                control={form.control}
                name="taraRezidenta"
                placeholder="Țara de reședință a reprezentantului"
                options={countries}
            />
        </>
    );
}

// ---------- PAS 3: DATE DE CONECTARE ----------
function CredentialsStep({
                             form,
                             showPassword,
                             setShowPassword,
                             showConfirmPassword,
                             setShowConfirmPassword,
                         }) {
    return (
        <>
            <h2 className="lg:col-span-2 font-semibold mb-1">
                Informații de conectare
            </h2>

            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormControl>
                            <Input
                                {...field}
                                type="email"
                                placeholder="Emailul reprezentantului"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="confirmEmail"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormControl>
                            <Input
                                {...field}
                                type="email"
                                placeholder="Confirmați adresa de email"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormControl>
                            <div className="relative">
                                <Input
                                    {...field}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Parola contului pentru reprezentant"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormControl>
                            <div className="relative">
                                <Input
                                    {...field}
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirmați parola"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
}

// ---------- COMPONENTA PRINCIPALĂ CU WIZARD 3 PAȘI ----------
export function DeveloperRegistrationForm() {
    const { toast } = useToast();
    const [step, setStep] = React.useState(1);
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

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
            telefon: "",
            taraRezidenta: "",
            email: "",
            confirmEmail: "",
            password: "",
            confirmPassword: "",
        },
    });

    // câmpurile relevante pentru fiecare pas (pentru validare parțială)
    const step1Fields = [
        "tipEntitate",
        "numarInregistrare",
        "tara",
        "denumireCompanie",
        "dataInregistrarii",
    ];

    const step2Fields = [
        "prenume",
        "nume",
        "dataNasterii",
        "taraReprezentant",
        "nationalitate",
        "telefon",
        "taraRezidenta",
    ];

    const step3Fields = [
        "email",
        "confirmEmail",
        "password",
        "confirmPassword",
    ];

    const handleNext = async () => {
        let fieldsToValidate = [];
        if (step === 1) fieldsToValidate = step1Fields;
        if (step === 2) fieldsToValidate = step2Fields;

        const valid = await form.trigger(fieldsToValidate);
        if (!valid) return;

        setStep((prev) => prev + 1);
    };

    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
        return hashHex; // string hex
    }

    const handleBack = () => {
        setStep((prev) => prev - 1);
    };

    const onSubmit = async (values) => {
        try {
            // 1) Hash parola pe frontend
            const hashedPassword = await hashPassword(values.password);

            // 2) Construim payload-ul pentru backend
            const payload = {
                ...values,
                password: hashedPassword,
            };

            // scoatem câmpurile de confirmare – backend nu are nevoie de ele
            delete payload.confirmPassword;
            delete payload.confirmEmail;

            const response = await DeveloperRegister(payload);

            if (response.success) {
                toast({
                    title: "Înregistrare realizată",
                    description: "Procesul de înregistrare a fost finalizat cu succes.",
                });
                form.reset();
                // eventual resetare și step la 1, dacă vrei
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
                    <CardTitle className="text-lg sm:text-xl text-center">
                        Înregistrare Dezvoltator
                    </CardTitle>
                    <CardDescription className="text-sm text-center">
                        Pasul {step} din 3
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full"
                        >
                            {step === 1 && <EntityStep form={form} />}
                            {step === 2 && <RepresentativeStep form={form} />}
                            {step === 3 && (
                                <CredentialsStep
                                    form={form}
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword}
                                    showConfirmPassword={showConfirmPassword}
                                    setShowConfirmPassword={setShowConfirmPassword}
                                />
                            )}

                            <div className="lg:col-span-2 flex justify-between gap-2 mt-4">
                                {step > 1 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleBack}
                                        className="w-full lg:w-auto"
                                    >
                                        Înapoi
                                    </Button>
                                )}

                                {step < 3 && (
                                    <Button
                                        type="button"
                                        onClick={handleNext}
                                        className="w-full lg:w-auto ml-auto"
                                    >
                                        Următorul
                                    </Button>
                                )}

                                {step === 3 && (
                                    <Button
                                        type="submit"
                                        className="w-full lg:w-auto ml-auto"
                                    >
                                        Înregistrează
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}