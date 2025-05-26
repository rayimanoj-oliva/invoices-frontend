import React, { useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function InvoiceModal({ selectedInvoice, centerDetails, onClose }) {
    const printRef = useRef();
    const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    const handleDownload = () => {
        const element = printRef.current;

        const opt = {
            margin: [0, 0, 0, 0],
            filename: `invoice_${selectedInvoice.invoice_no}.pdf`,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: {
                scale: 2,
                windowWidth: 794,
                windowHeight: 1123,
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };

        return html2pdf().set(opt).from(element).outputPdf('blob');
    };

    const handleSendEmail = async (e) => {
        e.preventDefault();
        setIsSending(true);
        try {
            // Generate PDF blob
            const pdfBlob = await handleDownload();
            
            // Create FormData
            const formData = new FormData();
            formData.append('file', pdfBlob, `invoice_${selectedInvoice.invoice_no}.pdf`);
            formData.append('recipient_email', email);
            formData.append('subject', 'Invoice from Oliva Skin and Hair Clinic');
            formData.append('guest_name', selectedInvoice.guest_name);

            // Send to backend
            const response = await fetch('http://192.168.2.180:8000/send-invoice-email', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to send email');
            }

            toast.success('Invoice sent successfully!');
            setIsEmailDialogOpen(false);
            setEmail('');
        } catch (error) {
            console.error('Error sending email:', error);
            toast.error('Failed to send email. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    if (!selectedInvoice) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <div className="bg-white w-full max-w-4xl h-[90vh] overflow-y-auto rounded shadow relative p-4">
                    <div className="flex justify-end gap-2 mb-4 no-print">
                        <button onClick={onClose} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                            Close
                        </button>
                        <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                            Print
                        </button>
                        <button onClick={() => handleDownload().then(blob => {
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `invoice_${selectedInvoice.invoice_no}.pdf`;
                            a.click();
                            window.URL.revokeObjectURL(url);
                        })} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                            Download
                        </button>
                        <button 
                            onClick={() => setIsEmailDialogOpen(true)} 
                            className="px-4 py-2 bg-[#00A4A7] text-white rounded hover:bg-[#008487] transition-colors"
                        >
                            Send Email
                        </button>
                    </div>

                    <div ref={printRef} className="a4-wrapper px-10 py-4">
                        <img src="/invoice_Header.JPG" alt="Header" className="w-full mb-4" />

                        {centerDetails && (
                            <div className="mb-4 text-xs">
                                <p><strong>{centerDetails.center_name}</strong></p>
                                <p>{centerDetails.address_1}</p>
                                <p>{centerDetails.address_2}</p>
                                <p>{centerDetails.state} - {centerDetails.pincode}</p>
                                <p><strong>GSTIN:</strong> {centerDetails.gst_number}</p>
                            </div>
                        )}

                        <h2 className="text-lg font-semibold mb-1">Invoice <span className="text-gray-600">#{selectedInvoice.invoice_no}</span></h2>
                        <p><strong>Guest:</strong> {selectedInvoice.guest_name} ({selectedInvoice.guest_code})</p>
                        <p><strong>Date:</strong> {selectedInvoice.invoice_date}</p>

                        <table className="w-full mt-4 border border-collapse text-xs">
                            <thead>
                            <tr className="bg-gray-100 border">
                                <th className="border px-2 py-2">Description</th>
                                <th className="border px-2 py-2">HSN</th>
                                <th className="border px-2 py-2">QTY</th>
                                <th className="border px-2 py-2">Rate</th>
                                <th className="border px-2 py-2">Price</th>
                                <th className="border px-2 py-2">SGST %</th>
                                <th className="border px-2 py-2">CGST %</th>
                                <th className="border px-2 py-2">SGST Amt</th>
                                <th className="border px-2 py-2">CGST Amt</th>
                                <th className="border px-2 py-2">Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            {selectedInvoice.items.map((item, i) => {
                                const sgst = item.gst_percent / 2;
                                const cgst = item.gst_percent / 2;
                                const sgstAmt = item.gst_amount / 2;
                                const cgstAmt = item.gst_amount / 2;
                                const unitPrice = item.net_quantity > 0 ? item.total_price / item.net_quantity : 0;

                                return (
                                    <tr key={i} className="border">
                                        <td className="border px-2 py-2">{item.product_name}</td>
                                        <td className="border px-2 py-2">{item.hsn_code}</td>
                                        <td className="border px-2 py-2">{item.net_quantity}</td>
                                        <td className="border px-2 py-2">₹{unitPrice.toFixed(2)}</td>
                                        <td className="border px-2 py-2">₹{item.base_price.toFixed(2)}</td>
                                        <td className="border px-2 py-2">{sgst}%</td>
                                        <td className="border px-2 py-2">{cgst}%</td>
                                        <td className="border px-2 py-2">₹{sgstAmt.toFixed(2)}</td>
                                        <td className="border px-2 py-2">₹{cgstAmt.toFixed(2)}</td>
                                        <td className="border px-2 py-2">₹{item.total_price.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>

                        <div className="mt-4 text-sm">
                            <p><strong>Total Base:</strong> ₹{selectedInvoice.total_base.toFixed(2)}</p>
                            <p><strong>Total GST:</strong> ₹{selectedInvoice.total_gst.toFixed(2)}</p>
                            <p><strong>Total Amount:</strong> ₹{selectedInvoice.total_amount.toFixed(2)}</p>
                        </div>
                        <div className="text-right mt-6">
                            <img src="/Aatman Signature.jpg" alt="Signature" className="w-[150px] inline-block" />
                            <p className="text-xs"><strong>Authorized Signatory</strong></p>
                        </div>
                        <div className="mt-4 text-xs">
                            <h3 className="font-semibold">Terms & Conditions</h3>
                            <ul className="list-disc pl-5">
                                <li>The report is only for the referred patient.</li>
                                <li>Results are subject to clinical correlation by a qualified physician.</li>
                                <li>Test results are confidential and meant only for the patient and referring doctor.</li>
                                <li>Oliva Diagnostics shall not be responsible for any misuse of the report.</li>
                                <li>Contact Oliva Diagnostics for discrepancies within 48 hours.</li>
                                <li>Reports generated electronically are valid without signature.</li>
                                <li>The test results must not be the sole basis for diagnosis or treatment.</li>
                                <li>Disputes subject to local court jurisdiction.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Send Invoice</DialogTitle>
                        <DialogDescription>
                            Enter the recipient's email address to send the invoice.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSendEmail}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="client@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEmailDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit"
                                disabled={isSending}
                                className="bg-[#00A4A7] hover:bg-[#008487]"
                            >
                                {isSending ? "Sending..." : "Send Invoice"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
