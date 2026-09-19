const Template = ({ heading, name, order_no, professional, date, slot, services, store, address, storeId,reason,ref }) => {
    return (
        <html>
            <body
                style={{
                    margin: 0,
                    padding: 0,
                    backgroundColor: "#f2f6fa",
                    fontFamily: "Arial, sans-serif",
                }}
            >
                <table width="100%" cellPadding="0" cellSpacing="0">
                    <tbody>
                        <tr>
                            <td align="center" style={{ padding: "30px 0" }}>
                                <table
                                    width="600"
                                    cellPadding="0"
                                    cellSpacing="0"
                                    style={{
                                        backgroundColor: "#ffffff",
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                    }}
                                >
                                    <tbody>
                                        {/* Header */}
                                        <tr>
                                            <td
                                                style={{
                                                    backgroundColor: (heading === 'Confirmed' || heading === 'Rescheduled' || heading === 'Awaiting' ) ? "#2563eb" :"#ef4444",
                                                    padding: "20px",
                                                    textAlign: "center",
                                                    color: "#ffffff",
                                                    fontSize: "22px",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Appointment {heading}
                                            </td>
                                        </tr>

                                        {/* Content */}
                                        <tr>
                                            <td
                                                style={{
                                                    padding: "30px",
                                                    color: "#333333",
                                                    fontSize: "16px",
                                                }}
                                            >
                                                <h2
                                                    style={{
                                                        color: "#2563eb",
                                                        marginBottom: "15px",
                                                    }}
                                                >
                                                    Hello {name},
                                                </h2>

                                                <p style={{ marginTop: 0 }}>

                                                    Your appointment has been <strong>{heading === 'Awaiting' ? 'Waiting for approval. Once your appointment has been reviewed, you will receive an email. ' : heading}</strong>.
                                                   
                                                   {(heading === 'Rejected' || heading === 'Cancelled') && reason !== "None" && (
                                                        <p style={{ color:'red' }}>Reason: {reason}</p>
                                                    )}

                                                    <p style={{ marginTop: 10 }}>Here are the details:</p>
                                                </p>

                                                <table
                                                    width="100%"
                                                    cellPadding="0"
                                                    cellSpacing="0"
                                                    style={{
                                                        backgroundColor: "#f9fafb",
                                                        border: "1px solid #e5e7eb",
                                                        marginTop: "15px",
                                                    }}
                                                >
                                                    <tbody>
                                                        <tr>
                                                            <td
                                                                style={{
                                                                    padding: "12px",
                                                                    fontSize: "14px",
                                                                    borderBottom: "1px solid #e5e7eb",
                                                                }}
                                                            >
                                                                <strong>Booking#:</strong> {order_no}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style={{
                                                                    padding: "12px",
                                                                    fontSize: "14px",
                                                                    borderBottom: "1px solid #e5e7eb",
                                                                }}
                                                            >
                                                                <strong>Booked With:</strong> {professional}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style={{
                                                                    padding: "12px",
                                                                    fontSize: "14px",
                                                                    borderBottom: "1px solid #e5e7eb",
                                                                }}
                                                            >
                                                                <strong>Date:</strong> {date}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style={{
                                                                    padding: "12px",
                                                                    fontSize: "14px",
                                                                    borderBottom: "1px solid #e5e7eb",
                                                                }}
                                                            >
                                                                <strong>Slot:</strong> {slot}
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td
                                                                style={{
                                                                    padding: "12px",
                                                                    fontSize: "14px",
                                                                    borderBottom: "1px solid #e5e7eb",
                                                                }}
                                                            >
                                                                <strong>Services:</strong> {services}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style={{
                                                                    padding: "12px",
                                                                    fontSize: "14px", 
                                                                    borderBottom: "1px solid #e5e7eb",
                                                                }}
                                                            >
                                                                <strong>Location:</strong> {store}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style={{
                                                                    padding: "12px",
                                                                    fontSize: "14px",
                                                                }}
                                                            >
                                                                <strong>Address:</strong> {address}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>

                                                <div style={{ textAlign: "center", margin: "30px 0" }}>
                                                    <a
                                                        href={`${process.env.REACT_APP_DOMAIN}/book-appointment?store=${storeId}&ref=${ref}`}
                                                        style={{
                                                            backgroundColor: "#2563eb",
                                                            color: "#ffffff",
                                                            padding: "12px 24px",
                                                            textDecoration: "none",
                                                            borderRadius: "5px",
                                                            fontSize: "16px",
                                                            display: "inline-block",
                                                        }}
                                                    >
                                                        Manage Appointment
                                                    </a>
                                                </div>

                                                <p
                                                    style={{
                                                        fontSize: "14px",
                                                        color: "#555555",
                                                        marginBottom: 0,
                                                    }}
                                                >
                                                    If you need to reschedule or cancel, please use the
                                                    button above.
                                                </p>
                                            </td>
                                        </tr>

                                        {/* Footer */}
                                        <tr>
                                            <td
                                                style={{
                                                    backgroundColor: "#f3f4f6",
                                                    padding: "15px",
                                                    textAlign: "center",
                                                    fontSize: "12px",
                                                    color: "#6b7280",
                                                }}
                                            >
                                                © 2026 iSchedule Inc. · All rights reserved
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </body>
        </html>
    )
}
export default Template