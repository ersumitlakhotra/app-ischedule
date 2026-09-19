import {
    Bookmark,
    CalendarDays,
    MapPin,
    Clock3,
    Star,Eye, Pencil,
} from "lucide-react";
import { useState } from "react";
import { Tags, Tooltip, Button, Image, Rating, ActionMenu } from "../../controls/index.jsx";
import { UTC_LocalDateTime } from "../../common/localDate.js";
import { useNavigate } from "react-router-dom";
import { encryptId,getByKey } from "../../common/general.jsx";

export default function Card({ item, categoryList }) {  
    const navigate=useNavigate();
    const category2 = getByKey(categoryList, "id", item.category2);
    return (
        <div className="max-w-2xl bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="flex p-3 h-44 min-w-[500px]">

                {/* Image */}
                   <Image rounded='rounded-md' className="flex-shrink-0" height="h-full" width="w-44" src={item.profilepic} name={item.name} avatar={false} />

                {/* Content */}
                <div className="flex flex-col justify-between flex-1 p-1 ms-2">

                    {/* Top */}
                    <div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {item.name}
                                </h2>

                                <p className="text-xs text-gray-500 ">
                                    {item.category1} • {category2?.label}
                                </p>
                            </div>

                          <ActionMenu actions={[
                            {
                                label: "Edit",
                                permission:"Services.Edit",
                                icon: Pencil,
                                shortcut: "⌘E",
                                onClick: () => navigate('/Services/Edit/'+ encryptId(item.id)),
                            },
                            /*{
                                label: "View",
                                permission:"Services.View",
                                icon: Eye,
                                shortcut: "⌘V",
                                onClick: () => { },
                            }*/
                        ]} />
                        </div>

                        {/* Details */}
                        <div className="mt-4 space-y-2 text-xs">
                            <div className="flex items-center gap-2 text-gray-600 text-xs">
                                <CalendarDays size={14} />
                                <span>{UTC_LocalDateTime(item.modifiedat, 'DD MMM YYYY')}</span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-600 text-xs">
                                <Clock3 size={14} />
                                <span>{item.timing}</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="flex items-end justify-between mt-1">
                        <div>
                            <p className="text-[11px] text-gray-400">
                                Starting From
                            </p>

                            <div className="flex items-end gap-1">
                                <span className="text-2xl font-bold text-gray-900">
                                    ${item.price}
                                </span>
                            </div>
                        </div>

                         <Tags title={item.status}  dot />
                    </div>

                </div>
            </div>
        </div>
    );
}