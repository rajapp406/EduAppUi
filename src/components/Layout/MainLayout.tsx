"use client";

import dynamic from "next/dynamic";
import Footer from "./Footer";

const Header = dynamic(() => import("./Header"), { ssr: false });

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header />
            <main className="min-h-[calc(100vh-4rem)] p-4">
                {children}
            </main>
            <Footer />
        </>
    )
}