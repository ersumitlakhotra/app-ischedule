import React, { useEffect, useState } from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
} from "@react-pdf/renderer";
import { color } from "framer-motion";
import { get_Date } from "../../../common/localDate";

const styles = StyleSheet.create({
    page: {
        //padding: 30,
        fontSize: 10,
        fontFamily: "Helvetica",
        //  backgroundColor: "#f5f5f5",
    },

    /* Header */
    header: {
        backgroundColor: "#184d8f",
        color: "white",
        paddingHorizontal: 20,
        paddingVertical: 30,
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center'
    },
    invoiceTitle: {
        fontSize: 24,
        fontWeight: "bold",
    },
    invoiceNo: {
        fontSize: 10,
    },

    /* Bill Section */
    section: {
        backgroundColor: "white",
        padding: 20,
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    column: {
        width: "45%",
        fontSize: 10
    },
    bold: {
        fontWeight: "bold",
        marginBottom: 3,
    },
    lightText: {
        color: "#555",
    },

    /* Table */
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#184d8f",
        color: "white",
        padding: 6,
        marginTop: 10,
    },
    tableRow: {
        flexDirection: "row",
        padding: 6,
        borderBottom: "1 solid #ccc",
        borderLeft: "1 solid #ccc",
        borderRight: "1 solid #ccc",
    },
    colCategory: { width: "20%" },
    colDesc: { width: "48%" },
    colQty: { width: "15%", textAlign: "center" },
    colPrice: { width: "15%", textAlign: "center" },
    colTotal: { width: "20%", textAlign: "right" },

    /* Subtotal */
    subtotalContainer: {
        marginTop: 10,
        alignItems: "flex-end",
    },
    subtotalBox: {
        flexDirection: "row",
        backgroundColor: "#184d8f",
        color: "white",
        padding: 6,
        width: "40%",
        justifyContent: "space-between",
    },

    /* Total */
    totalContainer: {
        marginTop: 10,
        alignItems: "flex-end",
    },
    totalBox: {
        flexDirection: "row",
        backgroundColor: "#184d8f",
        color: "white",
        padding: 6,
        width: "35%",
        justifyContent: "space-between",
    },

    /* Footer */
    footerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 30,
    },
    thankYou: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#184d8f",
    },
    /* Stamp */
    stampWrapper: {
        position: "absolute",
        top: "70%",
        left: "30%",
        width: 200,
        height: 200,
        justifyContent: "center",
        alignItems: "center",
        transform: "rotate(-25deg)",
        opacity: 0.15,
    },

    stampOuter: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 4,
        justifyContent: "center",
        alignItems: "center",
    },

    stampInner: {
        width: 170,
        height: 170,
        borderRadius: 85,
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center",
    },

    stampText: {
        fontSize: 28,
        fontWeight: "bold",
        letterSpacing: 2,
    },

    textBold: { fontFamily: "Helvetica-Bold" },
    invDetail: { flexDirection: "row", justifyContent: "flex-end", textAlign: 'left', marginTop: 20 },
    invDetailRow: { flexDirection: "row", justifyContent: "space-between", textAlign: 'left', marginBottom: 10 },


});

const Invoice = ({ form }) => {
const billfrom = form.ischeduleInfo?.[0] || {};
const billto = form.companyInfo?.[0] || {};
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerRow}>
                        <Text style={styles.invoiceTitle}>INVOICE</Text>
                        <Text style={styles.invoiceNo}>
                            Invoice #: {form.invoice}
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    {/* Bill To / From */}
                    <View style={styles.rowBetween}>
                        <View style={styles.column}>
                            <Text style={styles.bold}>Bill To:</Text>
                            <Text>{billto.name}</Text>
                            <Text>{billto.cell}</Text>
                            <Text>{billto.email}</Text>
                            <Text>{billto.address}</Text>
                        </View>

                        <View style={styles.column}>
                            <Text style={styles.bold}>From:</Text>
                            <Text>{billfrom.name}</Text>
                            <Text>{billfrom.cell}</Text>
                            <Text>{billfrom.email}</Text>
                            <Text>{billfrom.address}</Text>
                        </View>
                    </View>

                    <View style={styles.column}>
                        <Text style={{ marginTop: 10 }}>
                            <Text style={styles.bold}>Invoice Date : </Text>{get_Date(form.trnDate, 'DD MMM, YYYY')}
                        </Text>
                        <Text style={{ marginBottom: 10 }}>
                            <Text style={styles.bold}>Due Date      : </Text>{get_Date(form.trnDate, 'DD MMM, YYYY')}
                        </Text>

                    </View>

                    {/* Table Header */}
                    <View style={styles.tableHeader}>
                        <Text style={styles.colDesc}>Title</Text>
                        <Text style={styles.colQty}>Qty</Text>
                        <Text style={styles.colPrice}>Price</Text>
                        <Text style={styles.colTotal}>Total</Text>
                    </View>

                    {/* Table Rows  */}
                    <View key={11} style={styles.tableRow}>
                        <Text style={styles.colDesc}>{form.title}</Text>
                        <Text style={styles.colQty}>1</Text>
                        <Text style={styles.colPrice}>${form.pricing}</Text>
                        <Text style={styles.colTotal}>${form.pricing}</Text>
                    </View>
                    {form.processingfee !== null && form.processingfee.trim() !== "" && Number(form.processingfee || 0) > 0 &&
                        <View key={12} style={styles.tableRow}>
                            <Text style={styles.colDesc}>Processing Fee</Text>
                            <Text style={styles.colQty}>1</Text>
                            <Text style={styles.colPrice}>${form.processingfee}</Text>
                            <Text style={styles.colTotal}>${form.processingfee}</Text>
                        </View>
                    }

                    {Number(form.discount) > 0 &&
                        <View key={13} style={styles.tableRow}>
                            <Text style={styles.colDesc}>Discount</Text>
                            <Text style={styles.colQty}> </Text>
                            <Text style={styles.colPrice}> </Text>
                            <Text style={[styles.colTotal, { color: "red" }]}>-${parseFloat(form.discount).toFixed(2)}</Text>
                        </View>
                    }
                  
                    {/* Empty Table Rows */}
                    {Array.from({ length: 4 }).map((_, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={styles.colDesc}> </Text>
                            <Text style={styles.colQty}> </Text>
                            <Text style={styles.colPrice}> </Text>
                            <Text style={styles.colTotal}> </Text>
                        </View>
                    ))}

                    {/* Circular Status Stamp */}
                    <View style={styles.stampWrapper}>
                        <View
                            style={[
                                styles.stampOuter,
                                { borderColor: form.status.toLowerCase() === "paid" ? "green" : "red" },
                            ]}
                        >
                            <View
                                style={[
                                    styles.stampInner,
                                    { borderColor: form.status.toLowerCase() === "paid" ? "green" : "red" },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.stampText,
                                        { color: form.status.toLowerCase() === "paid" ? "green" : "red" },
                                    ]}
                                >
                                    {form.status}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Invoice Details*/}
                    
                    <View style={styles.invDetail}>
                        <View style={{ flexDirection: "column", columnGap: 10, width: '30%', marginRight: 10 }}>

                            <View style={styles.invDetailRow}>
                                <Text style={styles.text}>Sub total</Text>
                                <Text style={styles.text}>${parseFloat(form.subtotal).toFixed(2)}</Text>
                            </View>
                       
                            <View style={styles.invDetailRow}>
                                <Text style={styles.text}>Tax ({form.tax})</Text>
                                <Text style={styles.text}>${parseFloat(form.taxamount).toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Total */}
                    <View style={styles.totalContainer}>
                        <View style={styles.totalBox}>
                            <Text>Total</Text>
                            <Text>${parseFloat(form.totalamount).toFixed(2)}</Text>
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.footerRow}>
                        <View></View>
                        <Text style={styles.thankYou}>Thank You!</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default Invoice;
