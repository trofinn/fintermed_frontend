"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover.jsx";
import {
    Command,
    CommandInput,
    CommandList,
    CommandItem,
} from "@/components/ui/command.jsx";

import { useToast } from "@/hooks/use-toast.js";
import {
    ValidateClientInvitation,
    RegisterClient,
} from "@/api-calls/client-routes.js";

// ---------- SCHEMA ----------
const formSchema = z
    .object({
        nume: z.string().min(1, { message: "Numele este obligatoriu" }),
        prenume: z.string().min(1, { message: "Prenumele este obligatoriu" }),
        email: z.string().email({ message: "Introduceți un e-mail valid" }),
        telefon: z
            .string()
            .regex(/^\+?\d{10,15}$/, { message: "Introduceți un număr de telefon valid" }),
        dataNasterii: z.string().min(1, { message: "Data nașterii este obligatorie" }),
        orasNastere: z.string().min(1, { message: "Orașul nașterii este obligatoriu" }),
        taraNastere: z.string().min(1, { message: "Țara nașterii este obligatorie" }),
        nationalitate: z.string().min(1, { message: "Naționalitatea este obligatorie" }),
        password: z.string().min(8, { message: "Parola trebuie să aibă cel puțin 8 caractere" }),
        confirmPassword: z.string().min(8, { message: "Parola trebuie să aibă cel puțin 8 caractere" }),
    })
    .superRefine((data, ctx) => {
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["confirmPassword"],
                message: "Parolele nu coincid",
            });
        }
    });

// ---------- DATE DEMO ----------
const countries = [
    { code: "RO", name: "România" },
    { code: "US", name: "Statele Unite" },
    { code: "DE", name: "Germania" },
    { code: "FR", name: "Franța" },
    { code: "IT", name: "Italia" },
];

const nationalities = [
    { code: "RO", name: "Română" },
    { code: "US", name: "Americană" },
    { code: "DE", name: "Germană" },
    { code: "FR", name: "Franceză" },
    { code: "IT", name: "Italiană" },
];

// ---------- COMPONENTĂ SELECT ----------
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

// ---------- PAS 1 ----------
function PersonalStep({ form }) {
    return (
        <>
            <h2 className="lg:col-span-2 font-semibold mb-1">
                Informații personale
            </h2>

            <FormField
                control={form.control}
                name="prenume"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormControl>
                            <Input {...field} placeholder="Prenume" />
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
                            <Input {...field} placeholder="Nume" />
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

            <FormField
                control={form.control}
                name="orasNastere"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormControl>
                            <Input {...field} placeholder="Orașul nașterii" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <CountrySelect
                control={form.control}
                name="taraNastere"
                placeholder="Țara nașterii"
                options={countries}
            />

            <CountrySelect
                control={form.control}
                name="nationalitate"
                placeholder="Naționalitate"
                options={nationalities}
            />

            <FormField
                control={form.control}
                name="telefon"
                render={({ field }) => (
                    <FormItem className="w-full lg:col-span-2">
                        <FormControl>
                            <Input {...field} placeholder="Număr de telefon" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
}

// ---------- PAS 2 ----------
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
                    <FormItem className="w-full lg:col-span-2">
                        <FormControl>
                            <Input
                                {...field}
                                type="email"
                                placeholder="Email"
                                disabled
                                className="bg-muted"
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
                                    placeholder="Parola contului"
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
                                    placeholder="Confirmă parola"
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

// ---------- COMPONENTA PRINCIPALĂ ----------
export function ClientRegistrationForm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const { toast } = useToast();

    const [step, setStep] = React.useState(1);
    const [isValidatingToken, setIsValidatingToken] = React.useState(true);
    const [invitationError, setInvitationError] = React.useState("");
    const [invitationData, setInvitationData] = React.useState(null);

    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nume: "",
            prenume: "",
            email: "",
            telefon: "",
            dataNasterii: "",
            orasNastere: "",
            taraNastere: "",
            nationalitate: "",
            password: "",
            confirmPassword: "",
        },
    });

    React.useEffect(() => {
        async function validateInvitation() {
            if (!token) {
                setInvitationError("Link invalid. Tokenul lipsește.");
                setIsValidatingToken(false);
                return;
            }

            const response = await ValidateClientInvitation(token);

            if (response.success) {
                setInvitationData(response.data);
                form.setValue("email", response.data.email || "");
            } else {
                setInvitationError(response.message || "Invitația nu este validă.");
            }

            setIsValidatingToken(false);
        }

        validateInvitation();
    }, [token, form]);

    const step1Fields = [
        "prenume",
        "nume",
        "telefon",
        "dataNasterii",
        "orasNastere",
        "taraNastere",
        "nationalitate",
    ];

    const step2Fields = [
        "email",
        "password",
        "confirmPassword",
    ];

    const handleNext = async () => {
        const fieldsToValidate = step === 1 ? step1Fields : [];
        const valid = await form.trigger(fieldsToValidate);
        if (!valid) return;
        setStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setStep((prev) => prev - 1);
    };

    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    }

    const onSubmit = async (values) => {
        try {
            const hashedPassword = await hashPassword(values.password);

            const payload = {
                token,
                nume: values.nume,
                prenume: values.prenume,
                telefon: values.telefon,
                dataNasterii: values.dataNasterii,
                orasNastere: values.orasNastere,
                taraNastere: values.taraNastere,
                nationalitate: values.nationalitate,
                password: hashedPassword,
            };

            const response = await RegisterClient(payload);

            if (response.success) {
                toast({
                    title: "Înregistrare realizată",
                    description: "Contul de client a fost creat cu succes.",
                });

                form.reset();
                navigate("/client-login");
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

    if (isValidatingToken) {
        return (
            <div className="w-full flex justify-center px-4">
                <Card className="w-full max-w-2xl mx-auto p-6 lg:p-8">
                    <CardContent className="flex items-center justify-center py-10">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Se validează invitația...
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (invitationError) {
        return (
            <div className="w-full flex justify-center px-4">
                <Card className="w-full max-w-2xl mx-auto p-6 lg:p-8">
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl text-center">
                            Invitație invalidă
                        </CardTitle>
                        <CardDescription className="text-sm text-center">
                            Acest link nu mai poate fi folosit.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center text-sm text-destructive">
                        {invitationError}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full flex justify-center px-4">
            <Card className="w-full max-w-3xl mx-auto p-6 lg:p-8">
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl text-center">
                        Înregistrare Client
                    </CardTitle>
                    <CardDescription className="text-sm text-center">
                        Pasul {step} din 2
                        {invitationData?.unitId ? " • Invitație validată" : ""}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full"
                        >
                            {step === 1 && <PersonalStep form={form} />}

                            {step === 2 && (
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

                                {step < 2 && (
                                    <Button
                                        type="button"
                                        onClick={handleNext}
                                        className="w-full lg:w-auto ml-auto"
                                    >
                                        Următorul
                                    </Button>
                                )}

                                {step === 2 && (
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