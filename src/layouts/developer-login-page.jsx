"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LoginDeveloper } from "@/api-calls/developer-register.js";

const loginSchema = z.object({
    email: z.string().min(1, { message: "Emailul este obligatoriu" }).email("Email invalid"),
    password: z.string().min(1, { message: "Parola este obligatorie" }),
});

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    return hashHex;
}

export function DeveloperLoginPage() {
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const navigate = useNavigate();
    const { toast } = useToast();

    const onSubmit = async (values) => {

        try {
            const hashedPassword = await hashPassword(values.password);

            const payload = {
                email: values.email,
                password: hashedPassword,
            };

            const response = await LoginDeveloper(payload);

            if (response?.success) {
                toast({
                    title: "Autentificare reușită",
                    description: "V-ați conectat cu succes.",
                });

                localStorage.setItem("token", response.data);
                window.location.href = "/dashboard";
            } else {
                toast({
                    title: "Autentificare eșuată",
                    description: response?.message || "Credențiale invalide.",
                    variant: "destructive",
                });
            }
        } catch (error) {

            toast({
                title: "Autentificare eșuată",
                description: "A apărut o eroare. Încercați din nou mai târziu.",
                variant: "destructive",
            });
        }
    };

    React.useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            navigate("/dashboard");
        }
    }, [navigate]);

    return (
        <div className="flex items-center justify-center w-full h-full">
            <Card className="w-full h-full max-w-4xl grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8">
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl text-center">
                            Conectare dezvoltator
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(
                                    onSubmit
                                )}
                                className="flex flex-col gap-4"
                            >
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <input
                                                    {...field}
                                                    type="email"
                                                    placeholder="Adresa de email"
                                                    className="border rounded-md p-3 w-full"
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
                                        <FormItem>
                                            <FormControl>
                                                <input
                                                    {...field}
                                                    type="password"
                                                    placeholder="Parola"
                                                    className="border rounded-md p-3 w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-start">
                                    <Link to="/forgot-password" className="text-sm">
                                        Ți-ai uitat parola?
                                    </Link>
                                </div>

                                <Button type="submit" className="w-full">
                                    Conectează-te
                                </Button>
                            </form>
                        </Form>

                        <div className="flex justify-center mt-4">
                            <p className="text-sm">
                                Nu aveți cont?{" "}
                                <Link
                                    to="/register"
                                    className="text-blue-500 hover:underline"
                                >
                                    Înregistrare dezvoltator
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </div>

                <div className="hidden lg:block w-full h-full">
                    <img
                        src="https://via.placeholder.com/200x150"
                        alt="Side Illustration"
                        className="w-full h-full object-cover rounded-r"
                    />
                </div>
            </Card>
        </div>
    );
}