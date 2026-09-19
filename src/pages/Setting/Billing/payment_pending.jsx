import { DollarSign } from "lucide-react";
import { Button } from "../../../controls/index.jsx";
import { print_invoice } from "../Invoice/print_invoice.jsx";
import { useNavigate } from "react-router-dom";
import { encryptId } from "../../../common/general.jsx";

export const PaymentPending = ({ billingList = [],onClick }) => {
    const navigate= useNavigate();
    const hasPendingPayment = billingList.length > 0;
    const invoice = billingList?.[0] ?? {
        id: 0,
        totalamount: "0",
    };
    return (
        <div className="rounded-2xl border bg-white shadow-sm p-5 cursor-pointer"  onClick={onClick}>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                            {hasPendingPayment
                                ? "Payment required"
                                : "Payment up to date"}
                        </h3>

                        <span
                            className={`h-2 w-2 rounded-full ${
                                hasPendingPayment
                                    ? "bg-red-500"
                                    : "bg-green-500"
                            }`}
                        />
                    </div>

                    <p className="mt-1 text-xs text-gray-500">
                        {hasPendingPayment
                            ? "Your account has an outstanding payment."
                            : "You have no outstanding balance at this time."}
                    </p>
                </div>

                {hasPendingPayment && (
                    <div className="text-right">
                        <p className="text-xs text-gray-500">
                            Remaining balance
                        </p>
                        <p className="mt-1 text-xl font-semibold text-gray-900">
                            ${Number(invoice.totalamount).toFixed(2)}
                        </p>
                    </div>
                )}
            </div>

            {hasPendingPayment && (
                <div className="mt-5 flex justify-end gap-2"> 
                    <Button variant="secondary" label="View Invoice" onClick={async () => await print_invoice(invoice.id)}/>
                    <Button variant="orange"  icon={DollarSign} label="Pay Now"  onClick={() => navigate('/Checkout/' + encryptId(invoice.id))} />
                </div>
            )}
        </div>
    );
};