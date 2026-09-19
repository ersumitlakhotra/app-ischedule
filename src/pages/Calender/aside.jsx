import { useState } from "react";
import { SearchInput, Calendar, Badge, Button, Tooltip } from "../../controls/index.jsx";
import { LocalDate } from "../../common/localDate.js";
import { APPOINTMENT_STATUS_OPTIONS } from '../../common/enum.jsx'
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Aside({ open, date, setDate,data,setSortStatus }) {
    return (
        <aside
            className={`
                absolute
                inset-0
                border-r
                transition-transform
                duration-300
                ${open ? "translate-x-0" : "-translate-x-full"}
            `}
        >

            <div className="flex h-full flex-col gap-4 pe-4 ">
                <h1 className="text-3xl font-bold mb-3">Calender</h1>
                <Calendar value={date} onChange={setDate} dateMode={false} calendarMode="permanent" />
                 <div className="w-full flex flex-col gap-1 text-xs">
                    {APPOINTMENT_STATUS_OPTIONS.map((o) => {
                        const key = o.value.toLowerCase().replace(" ", "");

                        return (
                            <Tooltip key={o.id} placement="top"                         
                                title={
                                    <div className="flex flex-col items-center gap-1">
                                        <span>{`${data[key] ?? 0} ${o.value} appointment${(data[key] ?? 0) !== 1 ? "s" : ""}`}</span>                             
                                        <span>{data[`${key}_percentage`] ?? 0}%</span>
                                    </div>
                                }           
                                children={
                                    <div className="w-full flex items-center justify-between text-xs cursor-pointer" onClick={() =>setSortStatus(o.value)}>
                                        <Badge
                                            color={o.color}
                                            text={o.value}
                                            className="text-xs font-normal w-3/12 items-start"
                                        />

                                        <div className="h-1 w-8/12 overflow-hidden rounded-full bg-gray-200">
                                            <div
                                                className={`h-full rounded-full ${o.color === 'blue' ? 'bg-blue-400':`bg-${o.color}-400`}`}
                                                style={{
                                                    width: `${data[`${key}_percentage`] ?? 0}%`,
                                                }}
                                            />
                                        </div>

                                        {/* <span className="w-1/12 text-right text-gray-500">
                                    {data[`${key}_percentage`] ?? 0}%
                                </span>*/}
                                    </div>} />
                        );
                    })}
                </div>
            </div>
        </aside>

    );

}