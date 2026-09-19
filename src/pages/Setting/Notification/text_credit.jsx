import {  Plus } from "lucide-react"
import { Button, Toggle } from "../../../controls/index.jsx"
import { ButtonPermission } from "../../../auth/protectedButton.js"
import { getStorage } from "../../../common/localStorage.js";
import { useState } from "react";
import { IsLoading } from "../../../common/isLoading.jsx";
import { encryptId } from "../../../common/general.jsx";
import { useNavigate } from "react-router-dom";

export const TextCredit = ({ smsCredit,textreminder ,onClick, saveData ,inModal=false}) => {
    const navigate=useNavigate();
    const hasCredit = smsCredit > 0;
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        const localStorage = await getStorage();
        await saveData({
            label: "Company",
            endPoint: "company",
            id: localStorage.cid,
            body: JSON.stringify({
                textreminder: !textreminder
            })
        });
        setIsLoading(false);
    };

    return (
        <IsLoading isLoading={isLoading} input={
        <div className={`${!inModal && 'rounded-2xl border bg-white shadow-sm p-5 cursor-pointer'}`} onClick={onClick}>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                            Text Message Credits
                        </h3>

                        <span
                            className={`h-2 w-2 rounded-full ${textreminder
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                        />
                        {inModal &&  <Toggle variant="primary" value={textreminder} onChange={() =>handleSubmit() }  />}
                    </div>

                    <p className="mt-1 text-xs text-gray-500">
                        {hasCredit
                            ? "Use your credits to send appointment reminders and notifications by text message. $0.04 (4 cents) per text."
                            : "You have no text message credits remaining. Add more credits to continue sending messages. $0.04 (4 cents) per text."}
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-xs text-gray-500">
                        Available credits
                    </p>

                    <p
                        className={`mt-1 text-xl font-semibold ${hasCredit
                                ? "text-gray-900"
                                : "text-amber-600"
                            }`}
                    >
                        ${smsCredit.toLocaleString()}
                    </p>
                </div>
            </div>

           {/* onChange={(e) => updateField("textreminder", e, setForm)}*/}
            <div className="mt-5 flex justify-end">
                <ButtonPermission permission={`Setting.Edit`} children={
                    <Button
                        variant="orange"
                        icon={Plus}
                        label={"Buy Credit "}
                        onClick={() => navigate('/Checkout/' + encryptId("TextCredit"))}
                    />} />
            </div>
        </div>} />
    )
}