export default function PdfDialog({selectedInvoice,
                                      printRef,
                                      centerDetails,
                                      setSelectedInvoice,
                                      handlePrint,
                                      handleDownload,}){
    return <>
        {selectedInvoice && (
            <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
                <div className="modal-content" ref={printRef}>

                    {/* Invoice Header Image */}
                    <img
                        src="/invoice_Header.JPG"
                        alt="Invoice Header"
                        className="invoice-header-image"
                        style={{ width: '110%', marginBottom: '0rem', borderRadius: '0px' }}
                    />

                    {/* 🏢 Center Details Section */}
                    {centerDetails && (
                        <div className="center-details" style={{ marginTop: '0.5rem', fontSize: '12px', lineHeight: 1.2 }}>
                            <p><strong>{centerDetails.center_name}</strong></p>
                            <p>{centerDetails.address_1}</p>
                            <p>{centerDetails.address_2}</p>
                            <p>{centerDetails.state} - {centerDetails.pincode}</p>
                            <p><strong>GSTIN:</strong> {centerDetails.gst_number}</p>
                        </div>
                    )}

                    <header className="modal-header">
                        <h2 id="modalTitle">Invoice #{selectedInvoice.invoice_no}</h2>
                        
                    </header>

                    <section className="modal-body">
                        <p>
                            <strong>Guest:</strong> {selectedInvoice.guest_name} ({selectedInvoice.guest_code})
                        </p>
                        <p>
                            <strong>Date:</strong> {selectedInvoice.invoice_date}
                        </p>

                        <table className="modal-table table-auto">
                            <thead>
                            <tr>
                                <th>Description</th>
                                <th>HSN</th>
                                <th>QTY</th>
                                <th>Rate</th>
                                <th>Price</th>
                                <th>SGST %</th>
                                <th>CGST %</th>
                                <th>SGST Amt</th>
                                <th>CGST Amt</th>
                                <th>Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            {selectedInvoice.items.map((item, idx) => {
                                const sgstPercent = item.gst_percent / 2;
                                const cgstPercent = item.gst_percent / 2;
                                const sgstAmount = item.gst_amount / 2;
                                const cgstAmount = item.gst_amount / 2;
                                const tabletPrice = item.net_quantity > 0 ? item.total_price / item.net_quantity : 0;

                                return (
                                    <tr key={idx}>
                                        <td>{item.product_name}</td>
                                        <td>{item.hsn_code || 'N/A'}</td>
                                        <td>{item.net_quantity || '1'}</td>
                                        <td>₹{tabletPrice.toFixed(2)}</td>
                                        <td>₹{item.base_price.toFixed(2)}</td>
                                        <td>{sgstPercent}%</td>
                                        <td>{cgstPercent}%</td>
                                        <td>₹{sgstAmount.toFixed(2)}</td>
                                        <td>₹{cgstAmount.toFixed(2)}</td>
                                        <td>₹{item.total_price.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>

                        <div className="modal-totals">
                            <p>
                                <strong>Total Base:</strong> ₹{selectedInvoice.total_base.toFixed(2)}
                            </p>
                            <p>
                                <strong>Total GST:</strong> ₹{selectedInvoice.total_gst.toFixed(2)}
                            </p>
                            <p>
                                <strong>Total Amount:</strong> ₹{selectedInvoice.total_amount.toFixed(2)}
                            </p>
                        </div>
                        {/* ✅ Signature Section */}
                        <div style={{ textAlign: 'right', marginBottom: '0.5rem' }}>
                            <img
                                src="/Aatman Signature.jpg"
                                alt="Authorized Signature"
                                style={{ width: '150px', height: 'auto' }}
                            />
                            <p style={{ fontSize: '12px', marginTop: '0.2rem' }}><strong>Authorized Signatory</strong></p>
                        </div>

                        {/* ✅ Terms & Conditions Section */}
                        <div className="modal-terms terms-box-right">
                            <h3>Terms & Conditions</h3>
                            <ul>
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
                    </section>

                    <footer className="modal-footer">
                    <button
                            onClick={() => setSelectedInvoice(null)}
                            className="btn close-btn"
                            aria-label="Close invoice details"
                        >
                            Close
                        </button>
                        <button
                            onClick={handlePrint}
                            className="btn print-btn no-print"
                        >
                            Print
                        </button>
                        <button
                            onClick={handleDownload}
                            className="btn download-btn no-print"
                        >
                            Download
                        </button>
                    </footer>
                </div>
            </div>
        )}
    </>
}