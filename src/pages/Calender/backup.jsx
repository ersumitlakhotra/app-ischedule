import { useState } from "react";
import { SearchInput,Calendar } from "../../controls/index.jsx";
import { LocalDate } from "../../common/localDate.js";

export default function CalendarSidebar({ open,searchInput, setSearchInput }) {
    const [date,setDate]= useState(LocalDate())  
    return (
        <aside
            className={`
                absolute
                inset-0
                overflow-hidden
                border-r
                transition-transform
                duration-300
                ${open ? "translate-x-0" : "-translate-x-full"}
            `}
        >

            <div className="flex h-full flex-col gap-4 pe-4">
                <h1 className="text-3xl font-bold">Calender</h1>
                <SearchInput value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder='Filter and search . . . ' />
                <Calendar value={date} onChange={setDate} calendarMode="permanent" />

                {/* User */}
                <div className="border-b p-6">
                    

                    <div className="flex items-center gap-3">

                        <div className="h-14 w-14 rounded-full bg-gray-300" />

                        <div>

                            <h2 className="font-semibold">
                                John Doe
                            </h2>

                            <p className="text-sm text-gray-500">
                                Barber
                            </p>

                        </div>

                    </div>

                </div>

                {/* Upcoming */}

                <div className="border-b p-6">

                    <p className="mb-3 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        Upcoming
                    </p>

                    <div className="rounded-2xl bg-blue-50 p-4">

                        <h3 className="font-medium">
                            Haircut
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Today • 2:00 PM
                        </p>

                    </div>

                </div>

                {/* Mini Calendar */}

                <div className="flex-1 overflow-auto p-6">

                    Mini Calendar Here

                </div>

                {/* Bottom */}

                <div className="border-t p-6">

                    Time Breakdown

                </div>

            </div>

        </aside>

    );

}