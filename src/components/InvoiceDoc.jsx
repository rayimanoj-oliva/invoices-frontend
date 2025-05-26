import React from 'react';

export default function InvoicePrint({ invoiceData, centerDetails }) {
    return (
        <div className="p-8 text-sm font-sans mx-auto bg-white text-black">
            {/* Header */}
            <img src="/invoice_Header.JPG" alt="Oliva Logo" className="w-full" />
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="font-bold text-lg">{centerDetails.center_name}</h2>
                    <p>{centerDetails.address_1}, {centerDetails.address_2}</p>
                    <p>{centerDetails.state} - {centerDetails.pincode}</p>
                    <p>GSTIN: {centerDetails.gst_number}</p>
                </div>

            </div>

            {/* Invoice Info */}
            <div className="mb-4 border-t pt-2">
                <h3 className="text-lg font-semibold">Invoice #{invoiceData.invoice_no}</h3>
                <p><strong>Guest:</strong> {invoiceData.guest_name} ({invoiceData.guest_code})</p>
                <p><strong>Date:</strong> {invoiceData.invoice_date}</p>
            </div>

            {/* Table */}
            <table className="w-full border border-collapse mb-4">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border px-2 py-1">Description</th>
                    <th className="border px-2 py-1">HSN</th>
                    <th className="border px-2 py-1">QTY</th>
                    <th className="border px-2 py-1">Rate</th>
                    <th className="border px-2 py-1">Price</th>
                    <th className="border px-2 py-1">SGST %</th>
                    <th className="border px-2 py-1">CGST %</th>
                    <th className="border px-2 py-1">SGST Amt</th>
                    <th className="border px-2 py-1">CGST Amt</th>
                    <th className="border px-2 py-1">Total</th>
                </tr>
                </thead>
                <tbody>
                {invoiceData.items.map((item, idx) => {
                    const sgst = item.gst_percent / 2;
                    const cgst = item.gst_percent / 2;
                    const sgstAmt = item.gst_amount / 2;
                    const cgstAmt = item.gst_amount / 2;
                    return (
                        <tr key={idx}>
                            <td className="border px-2 py-1">{item.product_name}</td>
                            <td className="border px-2 py-1">{item.hsn_code}</td>
                            <td className="border px-2 py-1">{item.net_quantity}</td>
                            <td className="border px-2 py-1">₹{(item.total_price).toFixed(2)}</td>
                            <td className="border px-2 py-1">₹{(item.base_price).toFixed(2)}</td>
                            <td className="border px-2 py-1">{sgst}%</td>
                            <td className="border px-2 py-1">{cgst}%</td>
                            <td className="border px-2 py-1">₹{sgstAmt.toFixed(2)}</td>
                            <td className="border px-2 py-1">₹{cgstAmt.toFixed(2)}</td>
                            <td className="border px-2 py-1">₹{item.total_price.toFixed(2)}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            {/* Totals */}
            <div className="text-sm mb-6">
                <p><strong>Total Base:</strong> ₹{invoiceData.total_base.toFixed(2)}</p>
                <p><strong>Total GST:</strong> ₹{invoiceData.total_gst.toFixed(2)}</p>
                <p><strong>Total Amount:</strong> ₹{invoiceData.total_amount.toFixed(2)}</p>
            </div>

            {/* Signature */}
            <div className="text-right mb-6">
                <img src="/Aatman Signature.jpg" alt="Signature" className="w-32 inline-block" />
                <p className="text-xs mt-1"><strong>Authorized Signatory</strong></p>
            </div>

            {/* Terms & Conditions */}
            <div className="text-xs">
                <h3 className="font-semibold mb-2">Terms & Conditions</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li>The report is only for the referred patient.</li>
                    <li>Results are subject to clinical correlation by a qualified physician.</li>
                    <li>Test results are confidential and meant only for the patient and referring doctor.</li>
                    <li>Oliva Diagnostics shall not be responsible for any misuse of the report.</li>
                    <li>Please contact Oliva Diagnostics for any discrepancies within 48 hours of receiving the report.</li>
                    <li>Reports generated electronically are valid without signature.</li>
                    <li>The test results are indicative and must not be used as the sole basis for medical diagnosis or treatment.</li>
                    <li>All disputes are subject to jurisdiction of local courts.</li>
                </ul>
            </div>
        </div>
    );
}
