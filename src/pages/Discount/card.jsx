import { useState } from "react";
import { Gift, QrCode, CalendarCheck, Sparkles, Ticket } from "lucide-react";
import { get_Date } from "../../common/localDate";

export default function Card({ item }) {
    const [flip, setFlip] = useState(false);

    return (
        <div className=" flex items-center justify-center pt-8  ">
            <div className="w-[420px] h-[600px] cursor-pointer " style={{ perspective: "1200px" }} onClick={() => setFlip(!flip)}>
                <div className={`relative w-full h-full duration-700 hover:-translate-y-2 hover:shadow-2xl rounded-3xl `}
                    style={{
                        transformStyle: "preserve-3d",
                        transform: flip ? "rotateY(180deg)" : "rotateY(0deg)",
                        transition: "transform .7s cubic-bezier(.175,.885,.32,1.275)",
                    }}
                >
                    {/* FRONT SIDE */}
                    <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-red-500 via-indigo-900 to-blue-900 text-white [backface-visibility:hidden]">
                        <div className="h-full flex flex-col items-center justify-center text-center p-10">
                            <div className="bg-orange-300 backdrop-blur p-6 rounded-full mb-8">
                                <Gift size={60} />
                            </div>

                            <h1 className=" text-5xl font-black tracking-wide ">
                                {item.name}
                            </h1>

                            <p className="mt-3 text-lg text-cyan-100">
                               ⚡ Exclusive Offer: A treat for you on services! 
                            </p>


                            <div className="mt-10 bg-white text-red-500 px-10 py-5 rounded-2xl text-4xl font-black shadow-xl">
                                {item.discounttype === "$" ? `$${item.discount}` : `${item.discount}%`} OFF
                            </div>

                            <p className="mt-5 text-lg text-cyan-100">
                                Offer Period<br />
                                {`${get_Date(item.startdate, "MMM DD, YYYY")} - ${get_Date(item.enddate, "MMM DD, YYYY")}`}
                            </p>

                            <div className="mt-12 flex items-center gap-2 text-sm animate-pulse">
                                <Sparkles size={18} />
                                Click to open offer
                            </div>
                        </div>
                    </div>

                    {/* BACK SIDE */}
                    <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl bg-white p-8  text-slate-800 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                        <h2 className="text-3xl font-bold text-center">
                            Special Offers
                        </h2>

                        <p className="text-center text-slate-500 mt-2">
                            Don't miss these deals
                        </p>

                        <div className="mt-8 space-y-5">

                            {/* Coupon */}
                            <div className="rounded-2xl bg-yellow-50 p-5 flex items-center gap-4">
                                <QrCode size={50} className="text-yellow-600" />
                                <div>
                                    <p className="text-sm text-slate-500">
                                        Coupon Code
                                    </p>
                                    <p className="text-xl font-black">
                                        {item.coupon}
                                    </p>
                                </div>
                            </div>


                            {/* Applicable*/}
                            <div className="rounded-2xl bg-cyan-50 p-5 border border-cyan-100">
                                <h3 className="font-bold text-xl mb-2">
                                    Applicable on:
                                </h3>

                                {
                                    item.services.length === 0 ? "• All Services" :
                                        item.services.map((o) => (
                                            <p className="text-sm text-slate-500">
                                                • {o.name}
                                            </p>
                                        ))}

                            </div>

                            {/* Limited*/}
                            {(item.newcustomer || item.onetime || Number(item.upto) > 0) &&
                                <div className="rounded-2xl bg-green-50 p-5 border border-green-100">
                                    <h3 className="font-bold text-xl mb-2">
                                        Eligibility
                                    </h3>
                                    {item.newcustomer && <p className="text-sm text-slate-500"> 🔥 For New Customers Only. </p>}
                                    {item.onetime && <p className="text-sm text-slate-500"> ⭐ One-Time Use Per Customer. </p>}
                                    {Number(item.upto) > 0 && <p className="text-sm text-slate-500"> 🎉 Offer Valid for the First {item.upto} Customers Only. </p>}

                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}