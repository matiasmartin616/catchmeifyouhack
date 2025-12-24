import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../(ui)/globals.css";
import Providers from "../(modules)/shared/providers";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "CatchMeIfYouHack",
    description: "Advanced Automated Security Assessment Tool",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col font-mono bg-black text-green-500 antialiased selection:bg-green-500 selection:text-black`}
            >
                <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-green-900/10 via-black to-black -z-10" />

                <header className="text-center space-y-4 pt-12">
                    <h1 className="text-5xl font-black tracking-tighter sm:text-7xl uppercase italic">
                        CatchMe<span className="text-zinc-800 bg-green-500 px-2 not-italic">IfYouHack</span>
                    </h1>
                    <div className="flex items-center justify-center gap-4 text-[10px] tracking-[0.2em] text-green-500/50 font-bold uppercase">
                        <span>[ Scanning_Active ]</span>
                        <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                        <span>[ System_Secure ]</span>
                    </div>
                </header>

                <main className="w-full flex-1 flex flex-col items-center justify-center p-8">
                    <Providers>{children}</Providers>
                </main>

                <footer className="pb-12 text-[10px] text-green-900 flex flex-col items-center gap-2 font-bold uppercase tracking-widest">
                    <p>© 2025 CATCH_ME_IF_YOU_HACK</p>
                    <p className="animate-pulse text-[8px]">Waiting for target input...</p>
                </footer>
            </body>
        </html>
    );
}

