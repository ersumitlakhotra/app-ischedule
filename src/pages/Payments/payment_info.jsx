/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Button, Tooltip, Select, Textbox } from "../../controls/index.jsx";
import { Plus, Minus, DollarSign } from "lucide-react";
import { updateField } from "../../common";
import {  PriceFormat } from "../../common/validate";
import { LocalDateTime } from "../../common/localDate.js";

const PaymentInfo = ({ form, setForm, customer,loyalty,hasReward, invoiceTotal, totalReceived, tip, balance }) => {
    const paymentTypes = [
        { id: 1, value: 'Cash', search: 'Cash', label: 'Cash' },
        { id: 2, value: 'Card', search: 'Card', label: "Card" },
        { id: 3, value: 'Interac', search: 'Interac', label: "Interac" },
        { id: 3, value: 'Cheque', search: 'Cheque', label: "Cheque" }
    ];

    const isLoyalty = loyalty?.active || false;
    const payments = form.payments.filter(o => o.paymenttype !== "Points");
    const redeemableAmount = Math.floor(Number(customer?.points || 0) / loyalty?.redeem || 0);

    const lineReceived = form.payments.reduce(
        (sum, payment) => sum + (parseFloat(payment.amount) || 0),
        0
    );
    const remaining = invoiceTotal - lineReceived;
    const amount = remaining > 0 ? remaining : 0;

    const handleAddLine = () => {
        updateField("payments", [...form.payments,
        {
            id: form.payments.length,
            paymenttype: "Cash", // Cash, Card, Interac, Cheque, etc.
            amount: Number(amount).toFixed(2),
            transaction: "InStore",       
            createdat: LocalDateTime()
        }
        ], setForm)
    }  

    const maxRewardPointsRedeem = (e) => {
        const rawValue = PriceFormat(e.toString());
        const value = Number(rawValue);

        const finalValue = Math.min(
            Math.max(value || 0, 0),
            redeemableAmount
        );  

        return finalValue.toString()
    }
    
    const handleAddRewardLine = () => {
        updateField("payments", [...form.payments,
        {
            id: 99,
            paymenttype: "Points", // Cash, Card, Interac, Cheque, etc.
            amount: maxRewardPointsRedeem(0),
            transaction: "InStore",
            custid:form.custid,
            createdat: LocalDateTime()
        }
        ], setForm)
    }

    const updatePaymentField = (id, field, value) => {
        const payments = form.payments.map((payment) =>
            payment.id === id
                ? {
                    ...payment,
                    [field]: value
                }
                : payment
        );

        updateField(
            "payments",
            payments,
            setForm
        );
    };

    useEffect(() => {
        updateField(
            "paymentstatus",
            balance > 0 ? 'Unpaid' : 'Paid',
            setForm
        );
    }, [balance])

   
    return (
        <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">

            {/* Header */}
            <div className="border-b bg-gray-50 px-5 py-3 ">
                <h3 className="text-lg font-semibold text-gray-800">
                    Summary
                </h3>
            </div>

            {/* Services */}
            <div className="divide-y">

                {/* Products */}
                {payments.map((item) => (
                    <div key={item.id} className="flex items-center justify-between px-5 py-3">
                        <div className="inline-flex gap-2 w-full md:w-1/3">
                            <Tooltip title="Remove " placement="right" >
                                <Button variant="danger" shape='circle' icon={Minus}
                                    onClick={() => {
                                        const payments = form.payments.filter((i) => i.id !== item.id);
                                        updateField("payments", payments, setForm);
                                    }} />
                            </Tooltip>
                            <Select label="" value={item.paymenttype} onChange={(e) => updatePaymentField(item.id, "paymenttype", e)} options={paymentTypes} isSearch={false} />

                        </div>
                        <div className="w-[140px]">
                            <Textbox label="" icon={DollarSign} className='w-[80px]' value={item.amount} setValue={(e) => updatePaymentField(item.id, "amount", PriceFormat(e.toString()))} />

                        </div>
                    </div>
                ))}

                <div className="flex p-2 justify-end items-center">
                    <Button variant="primary" icon={Plus} label="Add Line "
                        onClick={() => handleAddLine()} />
                </div>

                {/* Reward Points */}
                {hasReward.length ===0 ? <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-3">
                    {/* Loyalty Status */}
                    <div className="flex min-w-0 items-center gap-3">
                        <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isLoyalty
                                    ? "bg-green-100 text-green-600"
                                    : "bg-red-100 text-red-600"
                                }`}
                        >
                            <span className="text-lg">
                                {isLoyalty ? "✓" : "!"}
                            </span>
                        </div>

                        <div className="min-w-0">
                            <p
                                className={`text-sm font-semibold ${isLoyalty ? "text-green-700" : "text-red-700"
                                    }`}
                            >
                                {isLoyalty
                                    ? "Loyalty Program Active"
                                    : "Loyalty Program Inactive"}
                            </p>

                            <p className="text-sm leading-5 text-gray-600">
                                {isLoyalty
                                    ? "Customers will earn loyalty points on eligible purchases and can redeem their points on future visits."
                                    : "New loyalty points will not be awarded while the program is inactive, but customers can still redeem their existing points."}
                            </p>
                        </div>
                    </div>

                    {/* Reward Button */}
                    <div className="flex shrink-0 items-center justify-center">
                        <Button
                            variant="primary"
                            icon={Plus}
                            label={`Apply Reward Points (${customer?.points || 0})`}
                            onClick={() => handleAddRewardLine()}
                        />
                    </div>
                </div>
                    :
                    hasReward.map((item) => (
                        <div key={item.id} className="flex items-center justify-between px-5 py-3">
                            <div className="inline-flex gap-2 items-center w-full md:w-2/3">
                                <Tooltip title="Remove " placement="right" >
                                    <Button variant="danger" shape='circle' icon={Minus}
                                        onClick={() => {
                                            updateField("points", "0", setForm);
                                            updateField("payments", payments, setForm);
                                        }} />
                                </Tooltip>
                                <div className="inline-flex items-center gap-2 rounded-lg border border-cyan-100 bg-cyan-50 px-3 py-1.5 whitespace-nowrap">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-600 text-xs font-bold text-white">
                                        ★
                                    </span>

                                    <span className="text-sm font-bold text-cyan-700">
                                        {customer?.points || 0}
                                    </span>

                                    <span className="text-sm text-gray-600">
                                        Points
                                    </span>

                                    <span className="text-gray-300">|</span>

                                    <span className="text-sm font-semibold text-emerald-600">
                                        Up to ${redeemableAmount} off
                                    </span>
                                </div>

                            </div>
                            <div className="w-[140px]">
                                <Textbox label="" icon={DollarSign} className='w-[80px]' value={item.amount}
                                    setValue={(e) => {
                                        updatePaymentField(
                                            item.id,
                                            "amount",
                                            maxRewardPointsRedeem(e)
                                        );
                                    }} />

                            </div>
                        </div>
                    ))
                }
            </div>

            {/* Totals */}
            <div className="border-t bg-gray-50 px-5 py-4">

                <div className="ml-auto max-w-sm space-y-2">

                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Amount</span>
                        <span>${Number(invoiceTotal).toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Received</span>
                        <span>${Number(totalReceived).toFixed(2)}</span>
                    </div>

                    {tip > 0 && <div className="flex justify-between text-sm text-green-600 font-bold">
                        <span>Tip</span>
                        <span>${Number(tip).toFixed(2)}</span>
                    </div>}

                    <div className="my-2 border-t" />

                    <div className={`flex justify-between text-lg font-bold text-gray-900 ${balance > 0 && "text-red-600"}`}>
                        <span>Balance</span>
                        <span>
                            {balance > 0 && "-"} ${Number(balance).toFixed(2)}
                        </span>
                    </div>

                </div>

            </div>

        </div>

    )
}

export default PaymentInfo