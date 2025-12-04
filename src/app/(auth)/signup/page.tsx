"use client";

import Icons from "@/components/global/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";
import { LoaderIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from 'react';
import { toast } from "sonner";

const SignUpPage = () => {
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!emailAddress || !password || !fullName) {
            return toast.warning("Please fill in all fields");
        }

        if (password !== confirmPassword) {
            return toast.error("Passwords don't match");
        }

        if (password.length < 8) {
            return toast.error("Password must be at least 8 characters");
        }

        setIsLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email: emailAddress,
                password: password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                }
            });

            if (error) {
                throw error;
            }

            if (data.user) {
                toast.success("Account created successfully!");
                router.push('/onboarding');
            }
        } catch (err: any) {
            console.error('Sign up error:', err);
            switch (err.message) {
                case 'User already registered':
                    toast.error("This email is already registered. Please sign in.");
                    break;
                case 'Password should be at least 6 characters':
                    toast.error("Password must be at least 6 characters");
                    break;
                default:
                    toast.error("An error occurred. Please try again");
                    break;
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            });

            if (error) throw error;
        } catch (err: any) {
            console.error('Google sign up error:', err);
            toast.error("Failed to sign up with Google");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col space-y-6">
            <div className="flex flex-col space-y-2 text-center">
                <Icons.icon className="h-6 mx-auto text-white" />
                <h1 className="text-2xl font-semibold tracking-tight pt-2 text-white">
                    Create your account
                </h1>
                <p className="text-sm text-neutral-400">
                    Enter your details below to create your account
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="fullName" className="text-neutral-200">Full Name</Label>
                    <Input
                        id="fullName"
                        placeholder="John Doe"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        autoComplete="name"
                        className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                        disabled={isLoading}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email" className="text-neutral-200">Email</Label>
                    <Input
                        id="email"
                        placeholder="name@example.com"
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                        disabled={isLoading}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password" className="text-neutral-200">Password</Label>
                    <Input
                        id="password"
                        placeholder="••••••••"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                        disabled={isLoading}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="confirmPassword" className="text-neutral-200">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        placeholder="••••••••"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                        disabled={isLoading}
                    />
                </div>
                <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full rounded-full bg-white text-black hover:bg-neutral-100 font-medium mt-2"
                >
                    {isLoading ? (
                        <LoaderIcon className="w-4 h-4 animate-spin" />
                    ) : "Create Account"}
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-neutral-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-neutral-900 px-2 text-neutral-500">
                        Or continue with
                    </span>
                </div>
            </div>

            <Button
                variant="outline"
                type="button"
                disabled={isLoading}
                onClick={handleGoogleSignUp}
                className="w-full rounded-full bg-white border-neutral-700 text-neutral-900 hover:bg-neutral-100 font-medium"
            >
                {isLoading ? (
                    <LoaderIcon className="w-4 h-4 animate-spin mr-2" />
                ) : (
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                )}
                Sign up with Google
            </Button>

            <p className="text-center text-sm text-neutral-400">
                Already have an account?{" "}
                <Link
                    href="/signin"
                    className="underline underline-offset-4 hover:text-white font-medium text-white"
                >
                    Sign in
                </Link>
            </p>

            <p className="text-xs text-center text-neutral-500 px-8">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="underline underline-offset-4 hover:text-white">
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline underline-offset-4 hover:text-white">
                    Privacy Policy
                </Link>
            </p>
        </div>
    );
};

export default SignUpPage;
