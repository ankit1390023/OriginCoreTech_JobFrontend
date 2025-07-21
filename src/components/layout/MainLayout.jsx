import Header from "../shared/Header";
import Footer from "../shared/Footer";

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
} 