import React from "react";
import { User, Clock3, MapPin, Pencil, DollarSign, Percent, Notebook, Eye } from "lucide-react";
import { get_Date, LocalDate } from "../../common/localDate";
import { ActionMenu } from "../../controls/index.jsx";
import { encryptId } from "../../common/general.jsx";
import { useNavigate } from "react-router-dom";

const statusColor = {
    Past: "border-red-500",
    Live: "border-green-500",
    Upcoming: "border-yellow-500",
};


export default function Aside({ item,selected,onSelect}) {
    const navigate = useNavigate();
    const groupedData = item.reduce((acc, o) => {
        const dateKey = get_Date(o.startdate,"YYYY-MM-DD");

        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }

        acc[dateKey].push(o);
        return acc;
    }, {});

    return (
            <div className="space-y-4 ">
                {Object.entries(groupedData).map(([startdate, events]) => (
                    <div key={startdate} className="flex gap-4">
                        {/* Date */}
                        <div className={`w-28 shrink-0 rounded-lg border p-3 text-center ${get_Date(startdate,"YYYY-MM-DD") === LocalDate()
                            ? "bg-sky-600 text-white"
                            : "bg-gray-50"
                            }`}
                        >
                            <div className="text-xl font-bold">
                                {get_Date(startdate,"MMM")} {get_Date(startdate,"DD")}
                            </div>

                            <div className={`text-xs ${get_Date(startdate,"YYYY-MM-DD") === LocalDate()
                                ? "text-sky-100"
                                : "text-gray-400"
                                }`}
                            >
                                {get_Date(startdate,"dddd")}
                            </div>
                        </div>

                        {/* Events */}
                        <div className="flex-1 space-y-3">
                            {events.map((event) => (
                                <div key={event.id} onClick={() => onSelect?.(event)} className={`rounded-lg shadow-md border-2  p-3 w-full cursor-pointer ${selected ===event && "bg-sky-600 text-white"}`}>
                                    <div key={event.id} className={` px-3 border-l-4 ${statusColor[event.status]} flex flex-row items-center justify-between `} >
                                        <div >
                                            <h3 className={`font-medium  ${selected !==event && "text-gray-900"}`}>
                                                {event.name}
                                            </h3>
                                            <div className={`mt-2 flex flex-col gap-1 text-xs ${selected !==event && "text-gray-500"}`}>
                                                

                                                <div className="flex items-center gap-1">
                                                    <Clock3 size={14} />
                                                    {`${get_Date(event.startdate, "MMM DD, YYYY")} - ${get_Date(event.enddate, "MMM DD, YYYY")}`}
                                                </div>

                                                <div className="flex items-center gap-1">
                                                   {event.discounttype === "$"? <DollarSign size={14} /> : <Percent size={14} />}
                                                    {event.discount} Discount
                                                </div>

                                                {event.description && <div className="flex items-center gap-1">
                                                    <Notebook size={14} />
                                                    {event.description}
                                                </div>}
                                            </div>
                                        </div>
                                        <ActionMenu actions={[
                                            {
                                                label: "Edit",
                                                permission: "Discount.Edit",
                                                icon: Pencil,
                                                shortcut: "⌘E",
                                                onClick: () => navigate('/Discount/Edit/' + encryptId(event.id)),
                                            },
                                            {
                                                label: "View",
                                                permission: "Discount.View",
                                                icon: Eye,
                                                shortcut: "⌘V",
                                                onClick: () => navigate('/Discount/View/' + encryptId(event.id)),
                                            },
                                        ]} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
    );
}