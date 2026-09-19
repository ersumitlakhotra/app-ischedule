
import { Modal, Button } from "../../../controls/index.jsx";
import { HeaderModal } from "../../../common/index.jsx";
import QrCodePage from "./Qr_code.jsx";
import { useState } from "react";
import { QrCode } from "lucide-react";

export const BookingLink = ({ store ,onClick}) => {
    const bookingLink = `https://www.booking.ischedule.ca/${store}`;
    return (
        <>
            <div className="rounded-2xl border bg-white shadow-sm px-5 py-3 cursor-pointer" onClick={onClick}>

                <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                            Booking Link
                        </h3>
                        <span className="h-2 w-2 rounded-full bg-orange-500" />
                    </div>
                    <Button variant="default" icon={QrCode} onClick={onClick} />
                </div>

                <p className="mt-1 text-xs text-gray-500">
                    Share this link with your customers to let them
                    conveniently book appointments online.
                </p>

                <div className="mt-4 flex items-center  rounded-lg border bg-gray-50 px-1 py-2 text-[11px]">
                    <span className="flex-1 truncate  text-gray-600">
                        {bookingLink || "Booking link not available"}
                    </span>

                    {bookingLink && (
                        <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(bookingLink)}
                            className="shrink-0 rounded-md p-1 font-medium text-cyan-600 hover:bg-cyan-50"
                        >
                            Copy
                        </button>
                    )}
                </div>

            </div>          
        </>
    );
}

