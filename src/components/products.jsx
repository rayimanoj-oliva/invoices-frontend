import {useEffect, useRef, useState} from "react";
import api from "@/api/api.js";

export const Products = () => {

    const [centers, setCenters] = useState([]);
    const [center, setCenter] = useState('');
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [centerDetails, setCenterDetails] = useState(null);
    const invoicesPerPage = 10;
    const intervalRef = useRef(null);
    const printRef = useRef();

    useEffect(() => {
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
        try {
            const response = await api.get(`/products?center=${selectedCenter}&from_date=${fromDate}&to_date=${toDate}`);
            if (!response.ok) throw new Error(`Error fetching invoices: ${response.statusText}`);
            const data = await response.data;
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
        }
    };

    useEffect(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (center) {
            fetchInvoices(center);
            intervalRef.current = setInterval(() => fetchInvoices(center), 60000);
        }
        return () => intervalRef.current && clearInterval(intervalRef.current);
    }, [center]);

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


    return <>
        
    </>
}