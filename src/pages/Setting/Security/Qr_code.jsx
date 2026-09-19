import { useState, useRef, useEffect, useMemo } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import { Button } from "../../../controls/index.jsx";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        padding: 30,
        gap: 20,
        marginTop: 30,
    },
    header: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 18,
        fontFamily: "Helvetica-Bold",
    },
    text: {
        flexDirection: "row",
        justifyContent: "center",
        alignSelf: "center",
        fontSize: 12,
    },
    textItalic: {
        fontSize: 12,
        fontStyle: "italic",
    },
    image: {
        width: 300,
        height: 300,
        margin: 10,
        alignSelf: "center",
    },
});

function PrintQRcode({ link, urlImage }) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text>SCAN TO BOOK</Text>
                </View>

                <Text style={styles.text}>
                    Book your appointment instantly
                </Text>

                <Text style={styles.textItalic}>
                    Open your phone camera app and scan the QR code below to
                    check availability, see more details, and reserve your
                    spot today!
                </Text>

                {urlImage && (
                    <Image
                        src={urlImage}
                        style={styles.image}
                    />
                )}

                <Text style={styles.textItalic}>
                    {link}
                </Text>
            </Page>
        </Document>
    );
}

export default function QrCodePage({ store, inModal=false }) {
    // Only recreate the URL when store actually changes
    const link = useMemo(() => {
        return `https://www.booking.ischedule.ca/${store}`;
    }, [store]);

    const qrCodeRef = useRef(null);

    const [urlImage, setUrlImage] = useState("");
    const [qrReady, setQrReady] = useState(false);

    useEffect(() => {
        setQrReady(false);
        setUrlImage("");

        // Wait until QRCodeCanvas has rendered
        const timer = setTimeout(() => {
            const container = qrCodeRef.current;

            if (!container) {
                return;
            }

            const canvas = container.querySelector("canvas");

            if (!canvas) {
                return;
            }

            try {
                const dataURL = canvas.toDataURL("image/png");

                if (dataURL) {
                    setUrlImage(dataURL);
                    setQrReady(true);
                }
            } catch (error) {
                console.error("QR Code generation error:", error);
            }
        }, 50);

        return () => {
            clearTimeout(timer);
        };
    }, [link]);

    return (
        <div className={`${!inModal && 'rounded-2xl border border-gray-200 bg-white shadow-md px-6 py-5' }`}>
            <div className="space-y-5">

                <div className="flex items-center justify-between border-b border-gray-100 py-3">
                    <div>
                        <p className="text-lg font-semibold">Booking Link</p>
                        <p className=" text-xs text-gray-500">Share this QR code so customers can quickly access your booking page.</p>
                    </div>
                    {qrReady && urlImage ? 
                    (
                        <PDFDownloadLink
                            document={
                                <PrintQRcode
                                    link={link}
                                    urlImage={urlImage}
                                />
                            }
                            fileName="ScanQR.pdf"
                        >
                            {({ loading }) =>
                                loading ? (
                                    "Generating PDF..."
                                ) : (
                                    <Button
                                        type="secondary"
                                        icon={Download}
                                        label="Download"
                                    />
                                )
                            }
                        </PDFDownloadLink>
                    ) : null
                    }
                </div>

                <p className="text-gray-600">
                    To visit the website, open your phone camera and scan the
                    QR code below.
                </p>

                <div className="mt-4 flex items-center  rounded-lg border bg-gray-50 px-1 py-2 text-[11px]">
                    <span className="flex-1 truncate  text-gray-600">
                        {link || "Booking link not available"}
                    </span>

                    {link && (
                        <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(link)}
                            className="shrink-0 rounded-md p-1 font-medium text-cyan-600 hover:bg-cyan-50"
                        >
                            Copy
                        </button>
                    )}
                </div>

                {/* Hidden QR Canvas */}
                <div
                    ref={qrCodeRef}
                    className="absolute -left-[9999px] top-0"
                >
                    <QRCodeCanvas
                        key={link}
                        value={link}
                        size={500}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="H"
                    />
                </div>

                {/* Visible QR Code */}
                {urlImage && (
                    <div className="flex justify-start">
                        <img
                            src={urlImage}
                            alt="QR Code"
                            className="w-60 h-60 rounded-xl border shadow-sm"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}