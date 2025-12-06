import "@/styles/globals.css";
import { cn } from "@/lib";
import { generateMetadata } from "@/utils";
import { base, heading } from "@/constants";
import { Toaster } from "@/components/ui/sonner";
import { subheading } from "@/constants/fonts";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = generateMetadata();

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning>
                <body
                    className={cn(
                        "min-h-screen bg-background text-foreground antialiased font-base overflow-x-hidden !scrollbar-hide",
                        base.variable,
                        heading.variable,
                        subheading.variable,
                    )}
                >
                    <Toaster richColors theme="light" position="top-right" />
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
};
