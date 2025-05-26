import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { UserProvider } from "@/context/user-context.js"
import { useEffect, useState } from "react"
import { LoginForm } from "@/components/login-form.jsx"
import InvoiceTable from "@/components/table.jsx"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Services from "@/components/services.jsx"
import InvoiceTableProducts from "./components/table"
import InvoiceTableServices from "./components/services-table"
import AllInvoices from "./components/all"
import Dashboard from "./components/Dashboard"
import { Toaster } from "sonner"

export default function App() {
    const [username, setUsername] = useState(null);
    const [currentInvoices, setCurrentInvoices] = useState([]);
    const [centers, setCenters] = useState(() => {
        try {
            const storedCenters = localStorage.getItem('centers');
            return storedCenters ? JSON.parse(storedCenters) : [];
        } catch (error) {
            console.error('Error parsing centers from localStorage:', error);
            return [];
        }
    });
    const [currentCenter, setCurrentCenter] = useState(null);

    useEffect(() => {
        if(localStorage.getItem('centers') !== null)
            setUsername("yes");

        if(centers.length > 0)
            setCurrentCenter(centers[0]);
    }, [centers]);

    return (
        <Router>
            <UserProvider value={{username, setUsername}}>
                <Toaster position="top-right" />
                {username ? (
                    <SidebarProvider>
                        <AppSidebar variant="inset" />
                        <SidebarInset className="!pl-0">
                            <Routes>
                                <Route path="/login" element={<Navigate to="/dashboard" replace />} />
                                <Route path="/products" element={<InvoiceTableProducts currentInvoices={currentInvoices} setSelectedInvoice={setCurrentInvoices} />} />
                                <Route path="/services" element={<InvoiceTableServices currentInvoices={currentInvoices} setSelectedInvoice={setCurrentInvoices} />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/" element={<AllInvoices currentInvoices={currentInvoices} setSelectedInvoice={setCurrentInvoices} />} />
                            </Routes>
                        </SidebarInset>
                    </SidebarProvider>
                ) : (
                    <Routes>
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                )}
            </UserProvider>
        </Router>
    )
}
