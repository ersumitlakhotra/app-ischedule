import { useState } from "react";
import { Mail, Phone, MapPin, Briefcase, SquarePen, Clock3, Eye, Pencil, Trash2 } from "lucide-react";
import { Tags, Tooltip, Button, Image, Rating, ActionMenu } from "../../controls/index.jsx";
import { UTC_LocalDateTime } from "../../common/localDate.js";
import { useNavigate } from "react-router-dom";
import { encryptId } from "../../common/general.jsx";

export default function Card({ item }) {
    const [flip, setFlip] = useState(false);
    const navigate=useNavigate();
    const schedule = Object.entries(item.timinginfo?.[0] || {}).map(
        ([day, value]) => ({
            day: day.charAt(0).toUpperCase() + day.slice(1),
            start: value[0],
            end: value[1],
            working: value[2],
        })
    );
    const formatTime = (time) => {
        const [hour, minute] = time.split(":");

        const h = Number(hour);

        return `${((h + 11) % 12) + 1}:${minute} ${h >= 12 ? "PM" : "AM"}`;
    };
    return (
        <div className="w-[300px] h-[400px] cursor-pointer " style={{ perspective: "1200px" }} onClick={() => setFlip(!flip)}>
            <div className={`relative w-full h-full duration-700 hover:-translate-y-2 hover:shadow-2xl rounded-3xl `}
                style={{
                    transformStyle: "preserve-3d",
                    transform: flip ? "rotateY(180deg)" : "rotateY(0deg)",
                    transition: "transform .7s cubic-bezier(.175,.885,.32,1.275)",
                }}
            >
                {/* FRONT */}
                <div className="absolute inset-0 bg-white rounded-3xl overflow-hidden border border-gray-200"
                    style={{
                        backfaceVisibility: "hidden",
                        boxShadow:
                            "0 15px 35px rgba(0,0,0,.08),0 5px 15px rgba(0,0,0,.06)",
                    }}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-4">
                        <Tags title={item.status}  dot />
                        <ActionMenu actions={[
                            {
                                label: "Edit",
                                permission:"Employees.Edit",
                                icon: Pencil,
                                shortcut: "⌘E",
                                onClick: () => navigate('/Employee/Edit/'+ encryptId(item.id)),
                            },
                             /*{
                                label: "View",
                                permission:"Employees.View",
                                icon: Eye,
                                shortcut: "⌘V",
                                onClick: () => { },
                            },
                           { divider: true },{
                                label: "Delete",
                                icon: Trash2,
                                danger: true,
                                shortcut: "Del",
                                onClick: () => { },
                            },*/
                        ]} />
                    </div>

                    {/* Avatar */}
                    <div className="flex justify-center ">
                        <Image src={item.profilepic} name={item.fullname} />
                    </div>

                    <div className="flex flex-col justify-center items-center gap-3 mt-2 ">
                        <h2 className="font-bold text-xl">
                            {item.fullname}
                        </h2>
                        <Rating disabled value={item.rating} />
                    </div>

                    <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 m-3">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex-1">
                                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                    Role
                                </p>
                                <h4 className="mt-1 text-sm font-semibold text-gray-900">
                                    {item.role}
                                </h4>
                            </div>

                            <div className="h-10 w-px bg-gray-200 mx-6" />

                            <div className="flex-1 text-right">
                                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                    Hired
                                </p>
                                <h4 className="mt-1 text-sm font-semibold text-gray-900">
                                    {UTC_LocalDateTime(item.modifiedat, 'DD MMM YYYY')}
                                </h4>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex gap-3 items-center">
                                <Mail size={18} className="text-gray-400" />
                                <span className="text-xs">
                                    {item.email}
                                </span>
                            </div>

                            <div className="flex gap-3 items-center">
                                <Phone size={18} className="text-gray-400" />
                                <span className="text-xs">
                                    +1 {item.username}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* BACK */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white p-3"
                    style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                        boxShadow:
                            "0 20px 40px rgba(0,0,0,.25),0 8px 20px rgba(0,0,0,.18)",
                    }}
                >
                    {/* Schedule */}
                    <div className="space-y-1">
                        {schedule.map((item) => (
                            <div
                                key={item.day}
                                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10 transition"
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`w-2.5 h-2.5 rounded-full ${item.working
                                                ? "bg-green-400"
                                                : "bg-red-400"
                                            }`}
                                    />

                                    <span className="font-medium">
                                        {item.day}
                                    </span>
                                </div>

                                <span
                                    className={`text-sm ${item.working
                                            ? "text-gray-300"
                                            : "text-red-300 font-semibold"
                                        }`}
                                >
                                    {item.working
                                        ? `${formatTime(item.start)} - ${formatTime(item.end)}`
                                        : "Day Off"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}