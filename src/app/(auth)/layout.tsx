import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
            <div className="w-full max-w-md">
                <div className="bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
