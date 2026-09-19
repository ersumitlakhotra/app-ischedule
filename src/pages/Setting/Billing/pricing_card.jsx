import React from "react";
import { motion } from "framer-motion";
import { Modal } from "../../../controls/index.jsx";
import { HeaderModal } from "../../../common/index.jsx";
import { Check } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { getStorage } from "../../../common/localStorage.js";
import { PLANS } from "../../../common/enum.jsx";

export const PricingCard = ({ open, setOpen, currentPlan }) => {
    const { saveData } = useOutletContext();

    const handleSubmit = async (plan,pricing) => {

        const localStorage = await getStorage();   
        await saveData({
            label: "Company",
            endPoint: "company",
            id: localStorage.cid,
            body: JSON.stringify({
                plan: plan,
                pricing: pricing
            })
        });
       
    };
    return (
        <Modal open={open} message={[]} messageType="error" children={
            <>
                <HeaderModal
                    Title={"Upgrade Your Plan"}
                    Description={`Choose the plan that best fits your business needs and get more from iSchedule.`}
                    className="border-b border-gray-200"
                    onClick={() => setOpen(false)}
                />

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-10">
                    <div className="grid md:grid-cols-3 gap-4 max-w-6xl mx-auto">

                        {PLANS.map((plan, index) => {

                            const price = plan.monthly;
                            const current = currentPlan === plan.name;
                            //const currentKey = currentPlan === 'FREE TRIAL' ? 1 : currentPlan === 'STANDARD' ? 2 : 3;

                            return (
                                <motion.div
                                    key={plan.name}

                                    initial={{ opacity: 0, y: 80 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.25, duration: 0.3 }}

                                    whileHover={{ y: -12, scale: 1.03 }}

                                    className={`relative rounded-2xl p-[2px]
              ${current
                                            ? "bg-gradient-to-r from-blue-500 to-purple-500"
                                            : "bg-transparent"
                                        }`}
                                >

                                    {/* Card */}
                                    <div className="relative bg-white rounded-2xl p-8 h-full shadow-xl overflow-hidden">

                                        {/* Shine effect */}
                                        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-500
                bg-gradient-to-r from-transparent via-white/40 to-transparent
                -skew-x-12 translate-x-[-200%] hover:translate-x-[200%]" />

                                        {/* Header */}
                                        <div className="flex justify-between items-center mb-2">

                                            <h2 className="text-xl font-semibold">
                                                {plan.name}
                                            </h2>

                                            {plan.badge && (
                                                <span className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">
                                                    {plan.badge}
                                                </span>
                                            )}

                                        </div>

                                        <p className="text-gray-500 text-sm mb-6">
                                            {plan.name === 'ENTERPRISE' ? "Unlimited": "Limited"} data storage.
                                        </p>

                                        {/* Price */}
                                        <div className="mb-6">

                                            <span className="text-4xl font-bold">${price}
                                                {price > 0 && <span className="text-xs text-gray-500 font-normal"> + Tax</span>}
                                            </span>

                                            <span className="text-gray-500"> / month</span>

                                        </div>

                                        {/* Button */}

                                        <button
                                             onClick={() => handleSubmit(plan.name, price)}
                                            className={`w-full py-3 rounded-xl font-medium transition
                  ${current
                                                    ? "bg-white border border-gray-200 hover:shadow-md"
                                                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                                                }`}
                                        >
                                            {current ? 'Current Plan' : plan.title}
                                        </button>

                                        {/* Features */}
                                        <ul className="mt-8 space-y-4 text-sm text-gray-700">

                                            {plan.features.map((feature, i) => (

                                                <li key={i} className="flex gap-3">

                                                    <Check
                                                        size={16}
                                                        className="text-blue-500 mt-1"
                                                    />

                                                    {feature}

                                                </li>

                                            ))}

                                        </ul>

                                    </div>

                                </motion.div>
                            );

                        })}

                    </div>
                </div>
            </>
        } />
    );
}

