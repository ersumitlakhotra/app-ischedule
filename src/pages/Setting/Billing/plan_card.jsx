import { CircleFadingArrowUp } from "lucide-react"
import { Button, Tags } from "../../../controls/index.jsx"
import { PricingCard } from "./pricing_card.jsx"
import { useState } from "react"

export const PlanCard = ({ form, className, onClick }) => {
    const [open, setOpen] = useState(false);
    return (
        <div id="billing-section"
            className={`rounded-2xl border bg-white shadow-md scroll-mt-40 ${onClick ? "cursor-pointer" : ""}`}
            onClick={onClick ? onClick : undefined}
        >
            <div className={`p-5 space-y-5 flex ${className}`}>
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{form.plan}</h3>
                        <Tags dot title={form.active ? 'Active' : "Inactive"} />
                    </div>
                    <p className="text-gray-500 text-xs mt-1">
                        {form.plan === "FREE TRIAL" ? 'Try iSchedule free with essential features.' :
                            form.plan === "STANDARD" ? 'Our most popular plan for growing businesses.' :
                                'Advanced tools for large teams and multi-location businesses.'}
                    </p>
                </div>
                <Button variant="secondary" icon={CircleFadingArrowUp} label="Change plan" onClick={() => setOpen(true)} />
            </div>

            <div className="border-t bg-gray-100 p-5 rounded-bl-2xl rounded-br-2xl">
                <span className="text-3xl font-bold">{`$${form.pricing}`}</span>
                <span className="text-gray-500 text-xs">+tax /month</span>
            </div>
            {open && (<PricingCard open={open} setOpen={setOpen} currentPlan={form.plan} />)}
        </div>
    )
}