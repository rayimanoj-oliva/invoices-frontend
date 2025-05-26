import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from "@/lib/utils";
import PdfDialog from "@/components/pdf-dialog.jsx";
import InvoicePrint from "@/components/InvoiceDoc.jsx";
import InvoiceDialogWrapper from "@/components/InvoiceDialogWrapper.jsx";
import InvoiceModal from "@/components/InvoiceDialogWrapper.jsx";

function InvoiceTableProducts() {
    const [centers, setCenters] = useState([]);
    const [center, setCenter] = useState('');
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [fromCalendarOpen, setFromCalendarOpen] = useState(false);
    const [toCalendarOpen, setToCalendarOpen] = useState(false);
    const [centerDetails, setCenterDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const invoicesPerPage = 10;
    const intervalRef = useRef(null);
    const printRef = useRef();

    useEffect(() => {
        // Set default dates
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        setToDate(format(today, 'yyyy-MM-dd'));
        setFromDate(format(yesterday, 'yyyy-MM-dd'));

        const storedCenters = JSON.parse(localStorage.getItem('centers') || '[]');
        setCenters(storedCenters);
        if (storedCenters.length > 0) {
            setCenter(storedCenters[0]);
            fetchInvoices(storedCenters[0]);
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };

    const fetchInvoices = async (selectedCenter) => {
        if (!selectedCenter) {
            setInvoices([]);
            setFilteredInvoices([]);
            setCenterDetails(null);
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/invoices/products?center=${selectedCenter}&from_date=${fromDate}&to_date=${toDate}`);
            if (!response.ok) throw new Error(`Error fetching invoices: ${response.statusText}`);
            const data = await response.json();
            if (data.length > 0) {
                const { center_name, address_1, address_2, state, pincode, gst_number } = data[0];
                setCenterDetails({ center_name, address_1, address_2, state, pincode, gst_number });
            }
            const seen = new Set();
            const uniqueInvoices = data
                .flatMap(d => d.invoices || [])
                .filter((inv) => {
                    if (seen.has(inv.invoice_no)) return false;
                    seen.add(inv.invoice_no);
                    return true;
                });
            setInvoices(uniqueInvoices);
            setFilteredInvoices(uniqueInvoices);
            setCurrentPage(1);
            setSearchTerm('');
        } catch (error) {
            console.error('Failed to fetch invoices:', error);
            setCenterDetails(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (center) {
            fetchInvoices(center);
            // Update interval to 2 minutes (120000 milliseconds)
            intervalRef.current = setInterval(() => fetchInvoices(center), 120000);
        }
        return () => intervalRef.current && clearInterval(intervalRef.current);
    }, [center, fromDate, toDate]);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = invoices.filter(
            (inv) =>
                inv.invoice_no.toLowerCase().includes(term) ||
                inv.guest_name.toLowerCase().includes(term) ||
                inv.guest_code.toLowerCase().includes(term)
        );
        setFilteredInvoices(filtered);
        setCurrentPage(1);
    };

    const handleDownload = async () => {
        const element = printRef.current;
        if (!element) return;
        const hiddenEls = element.querySelectorAll('.no-print');
        hiddenEls.forEach(el => el.style.display = 'none');
        const originalHeight = element.style.height;
        element.style.height = 'auto';
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            scrollY: -window.scrollY,
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`invoice_${selectedInvoice.invoice_no}.pdf`);
        element.style.height = originalHeight;
        hiddenEls.forEach(el => el.style.display = '');
    };

    const handlePrint = () => {
        const printContent = printRef.current?.cloneNode(true);
        if (!printContent) return;
        const noPrintEls = printContent.querySelectorAll('.no-print');
        noPrintEls.forEach(el => el.remove());
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; font-size: 10px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            img.invoice-header-image { width: 100%; margin-bottom: 10px; }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };

    const indexOfLastInvoice = currentPage * invoicesPerPage;
    const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
    const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
    const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const [openDialog, setOpenDialog] = useState(false);
    return <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Oliva Invoice Application</h1>
            <Button variant="destructive" onClick={handleLogout}>Logout</Button>
        </div>

        <div className="flex gap-4 items-center">
            <Select value={center} onValueChange={setCenter}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Center" />
                </SelectTrigger>
                <SelectContent>
                    {centers.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
            </Select>

            <Popover open={fromCalendarOpen} onOpenChange={setFromCalendarOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-[200px] justify-start text-left font-normal",
                            !fromDate && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {fromDate ? format(new Date(fromDate), "PPP") : <span>From date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={fromDate ? new Date(fromDate) : undefined}
                        onSelect={(date) => {
                            setFromDate(date ? format(date, 'yyyy-MM-dd') : '');
                            setFromCalendarOpen(false);
                        }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>

            <Popover open={toCalendarOpen} onOpenChange={setToCalendarOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-[200px] justify-start text-left font-normal",
                            !toDate && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {toDate ? format(new Date(toDate), "PPP") : <span>To date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={toDate ? new Date(toDate) : undefined}
                        onSelect={(date) => {
                            setToDate(date ? format(date, 'yyyy-MM-dd') : '');
                            setToCalendarOpen(false);
                        }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>

            <Button onClick={() => fetchInvoices(center)} disabled={!fromDate || !toDate || !center}>
                Fetch Invoices
            </Button>
        </div>

        <Input
            placeholder="Search by invoice no, guest name or guest code"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full"
        />

        <table className="w-full table-auto border mt-4">
            <thead>
            <tr className="bg-gray-100">
                <th className="border px-2 py-1">Invoice No</th>
                <th className="border px-2 py-1">Guest</th>
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Actions</th>
            </tr>
            </thead>
            <tbody>
            {isLoading ? (
                // Loading skeleton rows
                [...Array(5)].map((_, index) => (
                    <tr key={`skeleton-${index}`}>
                        <td className="border px-2 py-1"><Skeleton className="h-6 w-24" /></td>
                        <td className="border px-2 py-1"><Skeleton className="h-6 w-48" /></td>
                        <td className="border px-2 py-1"><Skeleton className="h-6 w-24" /></td>
                        <td className="border px-2 py-1"><Skeleton className="h-6 w-16" /></td>
                    </tr>
                ))
            ) : currentInvoices.length > 0 ? currentInvoices.map(inv => (
                <tr key={inv.invoice_no}>
                    <td className="border px-2 py-1">{inv.invoice_no}</td>
                    <td className="border px-2 py-1">{`${inv.guest_name} (${inv.guest_code})`}</td>
                    <td className="border px-2 py-1">{inv.invoice_date}</td>
                    <td className="border px-2 py-1">
                        <Button size="sm" onClick={() => {
                            console.log(inv);
                            setSelectedInvoice(inv)
                            setOpenDialog(true);
                        }}>View</Button>
                    </td>
                </tr>
            )) : (
                <tr>
                    <td colSpan="4" className="text-center py-2">No invoices found.</td>
                </tr>
            )}
            </tbody>
        </table>

        <div className="flex justify-center gap-2">
            <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Prev</Button>
            {[...Array(totalPages)].map((_, i) => (
                <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? 'default' : 'outline'}
                    onClick={() => paginate(i + 1)}
                >
                    {i + 1}
                </Button>
            ))}
            <Button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>Next</Button>
        </div>

        <InvoiceModal
            isOpen={selectedInvoice !== null}
            onClose={() => setSelectedInvoice(null)}
            selectedInvoice={selectedInvoice}
            centerDetails={centerDetails}
        />
    </div>;
}

export default InvoiceTableProducts;