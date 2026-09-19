import React from "react";
import DiscountImage from "../Images/ExclusiveDiscount.png"
import { get_Date } from "../common/localDate";
import { CalendarOutlined } from '@ant-design/icons';

const EventTemplate = ({ companyName, storeId, footer = true, discountList, additionalMessage }) => {
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
                                            <td style={{ textAlign: "center", padding: "20px" }}>
                                                <img
                                                    src={"https://apptbackendbucket.s3.ca-central-1.amazonaws.com/ExclusiveDiscount.png"}  // 🔥 IMPORTANT
                                                    alt="Exclusive Discounts"
                                                    width="100%"
                                                    style={{
                                                        maxWidth: "560px",
                                                        borderRadius: "8px",
                                                        display: "block",
                                                        margin: "0 auto",
                                                    }}
                                                />
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
                                                        fontWeight: 600,
                                                        marginBottom: "12px",
                                                    }}
                                                >
                                                    Dear Client,
                                                </h2>

                                                <p style={{ marginTop: 0 }}>
                                                    Thank you for being a valued part of the <strong>{companyName}</strong> family !
                                                </p>

                                                <p style={{ marginTop: 10 }}>We are committed to helping you , which is why we want to offer you an exclusive discount on our services.</p>
                                                {additionalMessage !== '' && <p style={{ marginTop: 10 }}>{additionalMessage}</p>}
                                                <table
                                                    width="100%"
                                                    cellPadding="0"
                                                    cellSpacing="0"
                                                    style={{
                                                        // backgroundColor: "#f9fafb",
                                                        // border: "1px solid #e5e7eb",
                                                        marginTop: "25px",
                                                    }}
                                                >
                                                    <tbody>
                                                        {discountList.map(item => (
                                                            <tr>
                                                                <td
                                                                    style={{
                                                                        padding: "12px",
                                                                        fontSize: "14px",
                                                                        borderBottom: "1px solid #e5e7eb",
                                                                    }}
                                                                >
                                                                    <div style={{
                                                                        width: "100%",
                                                                        display: "flex",
                                                                        justifyContent: "space-between"
                                                                    }}>

                                                                        <div style={{
                                                                            display: "flex",
                                                                            flexDirection: "column",
                                                                            alignItems: "flex-start",
                                                                            gap: "8px"
                                                                        }}>
                                                                            <p style={{
                                                                                fontSize: "14px",
                                                                                fontWeight: 600
                                                                            }}>
                                                                                {item.name}
                                                                            </p>

                                                                            <div style={{
                                                                                display: "flex",
                                                                                flexDirection: "row",
                                                                                gap: "8px",
                                                                                alignItems: "center"
                                                                            }}>
                                                                                <CalendarOutlined />
                                                                                <span style={{
                                                                                    fontSize: "12px"
                                                                                }}>
                                                                                    {get_Date(item.start, 'MMM, DD YYYY')} - {get_Date(item.end, 'MMM, DD YYYY')}
                                                                                </span>
                                                                            </div>
                                                                        </div>

                                                                        <div style={{
                                                                            display: "flex",
                                                                            flexDirection: "column",
                                                                            alignItems: "flex-start",
                                                                            gap: "8px"
                                                                        }}>

                                                                            <div style={{
                                                                                backgroundColor: "#f3f4f6", // gray-100
                                                                                padding: "4px 8px",
                                                                                color: "#4b5563", // gray-600
                                                                                fontWeight: 600,
                                                                                fontFamily: "sans-serif",
                                                                                borderRight: "1px solid #e5e7eb",
                                                                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                                                                borderTopRightRadius: "6px",
                                                                                borderBottomRightRadius: "6px",
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                gap: "8px"
                                                                            }}>

                                                                                <span style={{
                                                                                    position: "relative",
                                                                                    fontSize: "14px",
                                                                                    fontWeight: "bold",
                                                                                    color: "black"
                                                                                }}>
                                                                                    $ {parseFloat(item.price).toFixed(2)}

                                                                                    {/* line-through effect (pseudo replaced manually) */}
                                                                                    <span style={{
                                                                                        position: "absolute",
                                                                                        top: "50%",
                                                                                        left: 0,
                                                                                        width: "100%",
                                                                                        height: "2px",
                                                                                        backgroundColor: "red",
                                                                                        transform: "rotate(-15deg)"
                                                                                    }} />
                                                                                </span>

                                                                                <span style={{
                                                                                    fontSize: "14px",
                                                                                    fontWeight: "bold",
                                                                                    color: "black"
                                                                                }}>
                                                                                    $ {parseFloat(item.newprice).toFixed(2)}
                                                                                </span>
                                                                            </div>

                                                                            <span style={{
                                                                                fontSize: "12px",
                                                                                color: "white",
                                                                                backgroundColor: "#ef4444", // red-500
                                                                                padding: "2px 8px",
                                                                                borderRadius: "4px"
                                                                            }}>
                                                                                -{item.percentage}%
                                                                            </span>

                                                                        </div>
                                                                    </div>

                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>

                                                {footer &&
                                                    <><div style={{ textAlign: "center", margin: "30px 0" }}>
                                                        <a
                                                            href={`${process.env.REACT_APP_DOMAIN}/book-appointment?store=` + storeId}
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
                                                            If you need to book, reschedule or cancel, please use the
                                                            button above.
                                                        </p>
                                                    </>}

                                            </td>
                                        </tr>

                                        {/* Footer */}
                                        {footer && <tr>
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
                                        }
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
export default EventTemplate;