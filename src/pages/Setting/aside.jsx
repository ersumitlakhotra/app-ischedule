import {  Image  } from "../../controls/index.jsx";
import { PlanCard } from "./Billing/plan_card.jsx";
import { PaymentPending } from "./Billing/payment_pending.jsx";
import { BookingLink } from "./Security/booking_link.jsx";
import { TextCredit } from "./Notification/text_credit.jsx";

export default function Aside({ form, setForm,saveData,billingList,setActiveSettingTab }) {
     
    return (
        <div className="md:col-span-1 self-start space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden p-4 space-y-5">

                {/* UserCard*/}
                <div className="flex items-center gap-4 border rounded-2xl p-2 hover:shadow-sm transition overflow-hidden cursor-pointer"
                onClick={() => setActiveSettingTab(1)}>
                    <Image
                        src={form.logo}
                        name={form.name}
                        height="h-12"
                        width="w-12"
                        className="flex-shrink-0"
                        avatar={false}
                    />
                    <div>
                        <p className="font-semibold text-sm">{form.name}</p>
                        <p className="text-gray-500 text-xs">{form.email}</p>
                    </div>
                </div>

                {/* Premium Card*/}
                <PlanCard form={form} className={'flex-col'}  onClick={() => setActiveSettingTab(2)}/>

                {/* Payment Card*/}
                <PaymentPending billingList={billingList}  onClick={() => setActiveSettingTab(2)}/>

                <BookingLink store={form.store || ''}  onClick={() => setActiveSettingTab(4)}/>
                <TextCredit smsCredit={form.credit || 0} textreminder={form.textreminder} saveData={saveData}  onClick={() => setActiveSettingTab(3)}/>

               


                {/* Stripe Card
                <div className="rounded-2xl border p-4 flex justify-between items-center">

                    <div className="flex gap-3">

                        <div className="w-10 h-10 rounded-xl bg-violet-600" />

                        <div>

                            <p className="font-semibold">
                                Stripe Connect
                            </p>

                            <p className="text-sm text-gray-500">
                                caitlyn@untitledui.com
                            </p>

                        </div>

                    </div>

                    <MoreHorizontal
                        size={18}
                        className="text-gray-400"
                    />

                </div>
*/}

                {/* Bandwidth Card
                <div className="rounded-2xl border p-5">

                    <div className="flex justify-between">

                        <div>

                            <div className="flex items-center gap-2">

                                <h3 className="font-semibold">
                                    Bandwidth
                                </h3>

                                <span className="bg-green-100 text-green-700 text-xs rounded-full px-2 py-1">
                                    +12%
                                </span>

                            </div>

                            <p className="text-sm text-gray-500 mt-1">
                                You've used 30% of your available bandwidth.
                            </p>

                        </div>

                        <MoreHorizontal
                            size={18}
                            className="text-gray-400"
                        />

                    </div>

                    <div className="mt-6">

                        <div className="text-4xl font-bold">
                            60.2GB
                            <span className="text-base font-medium text-gray-400">
                                {" "}
                                of 200GB
                            </span>
                        </div>

                    </div>

                    <div className="mt-8 h-36 rounded-xl bg-gradient-to-b from-violet-50 to-white border flex items-end px-4">

                        <svg
                            viewBox="0 0 300 80"
                            className="w-full"
                            fill="none"
                        >
                            <path
                                d="M0 55 C40 48 60 60 95 52 C120 46 150 54 175 46 C205 40 230 48 260 38 C280 32 295 36 300 34"
                                stroke="#6D5EF7"
                                strokeWidth="3"
                            />
                        </svg>

                    </div>

                </div>
                */}

            </div>
        </div>
    )
}