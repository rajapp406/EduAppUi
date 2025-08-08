import Header from "./Header";
import Footer from "./Footer";
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