import { useState } from "react";
import {
    Gift,
    CreditCard,
    CalendarDays,
    Sparkles,
    Gem,
    Crown,
    Star,
    Pencil,
    Eye
} from "lucide-react";
import { get_Date } from "../../common/localDate.js";
import { ActionMenu } from "../../controls/index.jsx";
import { encryptId } from "../../common/general.jsx";


export const GiftCard = ({ item, custid, navigate, userList }) => {
    const [flip, setFlip] = useState(false);
    const [theme, setTheme] = useState("cyan");

    const cardTypes = {
        Basic: {
            name: "Starter",
            gradient: "from-sky-400 to-blue-600",
            icon: Gift
        },

        Premium: {
            name: "Premium",
            gradient: "from-violet-500 to-indigo-900",
            icon: Star
        },

        Vip: {
            name: "Elite",
            gradient: "from-yellow-400 via-amber-500 to-orange-700",
            icon: Crown
        },

        Signature: {
            name: "Signature",
            gradient: "from-slate-600 via-black to-zinc-900",
            icon: Gem
        }
    };
    const Icon = cardTypes[item.cardtype]?.icon;
    return (
        <div className="w-[400px] h-[200px] cursor-pointer " style={{ perspective: "1200px" }} onClick={() => setFlip(!flip)}>
            <div className={`relative w-full h-full duration-700 hover:-translate-y-2  rounded-3xl `}
                style={{
                    transformStyle: "preserve-3d",
                    transform: flip ? "rotateY(180deg)" : "rotateY(0deg)",
                    transition: "transform .7s cubic-bezier(.175,.885,.32,1.275)",
                }}
            >

                {/* FRONT */}
                <div className={`group absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-br ${cardTypes[item.cardtype].gradient}`}
                    style={{
                        backfaceVisibility: "hidden",
                    }}
                >
                    <div className="pointer-events-none absolute inset-y-0 -left-[175%] w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/50 to-transparent transition-all duration-[2200ms] ease-out group-hover:left-[175%]" />
                    {/* LEFT C CUT */}
                    <div className=" absolute -left-5 top-1/2 -translate-y-1/2 w-10  h-10  rounded-full  bg-white z-30" />
                    {/* SHINE EFFECT */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-white/20 blur-3xl" />

                    <div className="relative flex h-full flex-col justify-between p-7 gap-3">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-xs uppercase tracking-[4px] text-white/80">
                                    <Sparkles size={14} color="white" />
                                    {item.cardtype}
                                </div>

                                <h1 className="mt-1 text-3xl font-black text-white drop-shadow-lg">
                                    {item.name}
                                </h1>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
                                <Icon size={25} className="text-white" />
                            </div>

                        </div>

                        <div className="text-xs text-white">
                            <p className=" uppercase tracking-[3px] text-white/70 ">
                                Available Balance
                            </p>
                            <h2 className="text-2xl font-black  drop-shadow-xl mb-3">
                                {`$${item.balance}`}
                            </h2>
                            <div className="flex items-start justify-between">
                                <p>
                                    Valid Period<br />
                                    {`${get_Date(item.startdate, "MMM DD, YYYY")} - ${get_Date(item.enddate, "MMM DD, YYYY")}`}
                                </p>
                                <ActionMenu placement="left" width="w-48" actions={[
                                    {
                                        label: "Edit",
                                        permission: "Customers.Edit",
                                        icon: Pencil,
                                        shortcut: "⌘E",
                                        onClick: () => navigate('/Gift/Edit/' + encryptId(custid) + '/' + encryptId(item.id)),
                                    },
                                    {
                                        label: "View",
                                        permission: "Customers.View",
                                        icon: Eye,
                                        shortcut: "⌘V",
                                        onClick: () => navigate('/Gift/Edit/' + encryptId(custid) + '/' + encryptId(item.id)),
                                    }
                                ]} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= BACK ================= */}
                <div className="absolute inset-0 rounded-3xl bg-white border"
                    style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                    }}
                >
                    {/* HEADER STRIPE */}
                    <div className={`h-14 rounded-tl-3xl rounded-tr-3xl p-3 flex flex-row items-center justify-between text-white  bg-gradient-to-r ${cardTypes[item.cardtype].gradient}`} >
                        <p className=" uppercase tracking-[3px] text-white/70 ">
                            Amount
                        </p>
                        <h2 className="text-2xl font-black  drop-shadow-xl">
                            {`$${item.amount}`}
                        </h2>
                    </div>

                    <div className="px-6 mt-3 flex  items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-wider text-slate-400">
                                From
                            </p>
                            <p className="mt-1 font-bold text-slate-800">
                                {
                                    (() => {
                                        const user = userList.find((o) => o.id.toString() === item.uid);
                                        return user?.fullname || 'Admin';
                                    })()
                                }
                            </p>
                        </div>

                    </div>
                    {/* GIFT CODE */}
                    <div className="m-3 rounded-2xl bg-slate-100 px-4 py-2">
                        <p className="text-xs uppercase tracking-[3px] text-slate-400">
                            Gift Code
                        </p>
                        <p className="text-lg font-black tracking-[4px] text-slate-800">
                            GFT-5X82-KP71
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )

}