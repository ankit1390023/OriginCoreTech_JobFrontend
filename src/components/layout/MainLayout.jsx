import Header from "../shared/Header";
import Footer from "../shared/Footer";

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="sticky top-0 z-50">
                <Header />
            </div>
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
} 