import { useEffect, useRef, useState } from "react";
import { PanelLeftOpen, PanelLeftClose, ChevronLeft, ChevronRight } from "lucide-react";
import Aside from "./aside.jsx";
import { SearchInput, Button, Calendar, Badge, Select, Image, Tags } from "../../controls/index.jsx";
import { get_Date, LocalDate } from "../../common/localDate.js";
import { useNavigate, useOutletContext } from "react-router-dom";
import { IsLoading } from "../../common/isLoading.jsx";
import { generateTimeSlotsWithDate, toMinutes, convertTo12Hour, toHHMM } from "../../common/generateTimeSlots.js";
import { getTimingInfo } from "../../common/general.jsx";
import Card from "./card.jsx";
import { APPOINTMENT_STATUS_OPTIONS } from "../../common/enum.jsx";

const Calendar_Main = () => {
    const navigate = useNavigate();
    const { refresh, calenderDate: date, setCalenderDate: setDate, getAppointment, getUser, getCompany, getAttendance } = useOutletContext();
    const calendarRef = useRef(null);
    const firstMatchRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [List, setList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [attendanceList, setAttendanceList] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [sortStatus, setSortStatus] = useState('All Status');
    const [workingHours, setWorkingHours] = useState({
        open: null,
        startTime: "09:00",
        endTime: "21:00",
    });
    const [slots, setSlots] = useState([]);
    const [data, setData] = useState({
        total: 0,
        allstatus: 0,
        allstatus_percentage: 0,
        awaiting: 0,
        awaiting_percentage: 0,
        pending: 0,
        pending_percentage: 0,
        completed: 0,
        completed_percentage: 0,
        rejected: 0,
        rejected_percentage: 0,
        cancelled: 0,
        cancelled_percentage: 0,
        noshow: 0,
        noshow_percentage: 0,
    });
    const firstAppointment =
    (searchInput.trim() !== "" || sortStatus !== "All Status") ? filteredList[0] : null;

    useEffect(() => {
        Init();
    }, [refresh])

    const Init = async () => {
        setIsLoading(true);
        const CompanyResponse = await getCompany();
        const UserResponse = await getUser();
        const AttendanceResponse = await getAttendance(date, date)
        const Response = await getAppointment();
        setCompanyList(CompanyResponse);
        setUserList(UserResponse.filter(item => !item.status.toLowerCase().includes("inactive")));
        handleAttendance(AttendanceResponse); 
        setList(Response);
        setFilteredList(Response.filter((o) => get_Date(o.trndate, 'YYYY-MM-DD') === get_Date(date, 'YYYY-MM-DD')));
        setIsLoading(false);
    }

      useEffect(() => {
        handleSearch()
    }, [searchInput, sortStatus]);

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const search = searchInput.toLowerCase();

            const searchedList = List.filter((item) => {
                const phone = (item.cell || "").replace(/\D/g, "");

                return (
                    (
                        (item.order_no || "").toString().toLowerCase().includes(search) ||
                        (item.name || "").toLowerCase().includes(search) ||
                        phone.includes(search)
                    ) &&
                    (sortStatus === "All Status" || item.status === sortStatus) &&
                    (get_Date(item.trndate, "YYYY-MM-DD") === get_Date(date, "YYYY-MM-DD"))
                );
            });
           
           setFilteredList(searchedList);
            // set state here
        } finally {
            setIsLoading(false);
        }
    };
    const handleProgress = () => {
        const filterList = List.filter((o) => get_Date(o.trndate,'YYYY-MM-DD') === get_Date(date,'YYYY-MM-DD') );
        const total = filterList.length;

        const awaiting = filterList.filter(o => o.status === "Awaiting").length;
        const pending = filterList.filter(o => o.status === "Pending").length;
        const completed = filterList.filter(o => o.status === "Completed").length;
        const rejected = filterList.filter(o => o.status === "Rejected").length;
        const cancelled = filterList.filter(o => o.status === "Cancelled").length;
        const noshow = filterList.filter(o => o.status === "NoShow").length;

        const getPercentage = count =>
            total === 0 ? 0 : Math.round((count / total) * 100);

        setData({
            total,

            allstatus: total,
            allstatus_percentage: getPercentage(completed + rejected + cancelled + noshow),

            awaiting,
            awaiting_percentage: getPercentage(awaiting),

            pending,
            pending_percentage: getPercentage(pending),

            completed,
            completed_percentage: getPercentage(completed),

            rejected,
            rejected_percentage: getPercentage(rejected),

            cancelled,
            cancelled_percentage: getPercentage(cancelled),

            noshow,
            noshow_percentage: getPercentage(noshow),
        });
    }

    const handleAttendance = (dataList) => {
        const data = userList.map((user) => {
            const attendance = dataList.find(
                (o) => o.uid === user.id
            );

            let open = null;
            let startTime = "09:00";
            let endTime = "21:00";

            if (attendance) {
                open = attendance.isworking;
                startTime = attendance.starttime;
                endTime = attendance.endtime;
            } else {
                const employee = getTimingInfo(user.timinginfo, date);

                if (employee) {
                    open = employee.open;
                    startTime = employee.starttime;
                    endTime = employee.endtime;
                }
            }

            return {
                id: user.id,
                open,
                startTime,
                endTime,
            };
        });
        setAttendanceList(data);
    };

    useEffect(() => {
        fetchSchedule();
    }, [date, companyList]);

    const fetchSchedule = async () => {
        setIsLoading(true);
        try {

            // Business hours
            const business = getTimingInfo(companyList.timinginfo, date);
            let open = business?.open ?? null;
            let startTime = business?.starttime ?? "09:00";
            let endTime = business?.endtime ?? "21:00";

            setWorkingHours({
                open,
                startTime,
                endTime,
            });
            // Fetch attendance + appointments together
            const [attendanceResponse] = await Promise.all([getAttendance(date, date)]);
            handleSearch();
            handleAttendance(attendanceResponse);           
            const slot = generateTimeSlotsWithDate(
                date,
                startTime,
                toHHMM(toMinutes(endTime) + 15),
                15,
                []
            );
            setSlots(slot);
            handleProgress();
        } catch (err) {
            // console.error(err);
        } finally {
            setIsLoading(false);
        }
    };



    const getAppointmentPerSlot = (appointments) => {
        if (appointments.length === 0) return null;
        if (appointments.length === 1) return appointments[0];

        return (
            appointments.find(
                ({ status }) =>
                    !["REJECTED", "CANCELLED"].includes(status.toUpperCase())
            ) ?? appointments[0]
        );
    };

  const getCurrentTimePosition = () => {
    if (!slots.length) return null;

    const now = new Date();

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const startMinutes = toMinutes(slots[0].start);
    const endMinutes = toMinutes(slots[slots.length - 1].end);

    const diff = currentMinutes - startMinutes;

    // Hide before start or after end
    if (currentMinutes < startMinutes - 7.5 || currentMinutes > endMinutes) {
        return null;
    }

    // 48px per 15 minutes + center offset
    return (diff / 15) * 48 + 24;
};

    const currentTimeTop = getCurrentTimePosition();
    const isToday = get_Date(date, 'YYYY-MM-DD') === get_Date(LocalDate(), 'YYYY-MM-DD');
    useEffect(() => {
        if (!calendarRef.current || !slots.length) return;

        const top = getCurrentTimePosition();

        if (top == null) return;

        {
            isToday && calendarRef.current.scrollTo({
                top: Math.max(top - 250, 0),
                behavior: "smooth",
            });
        }
    }, [slots]);

    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    const [contentWidth, setContentWidth] = useState(0);

    useEffect(() => {
        if (calendarRef.current) {
            setContentWidth(calendarRef.current.scrollWidth);
        }
    }, [userList]);


    
 useEffect(() => {
    if (
        (searchInput.trim() === "" && sortStatus === "All Status") ||
        isLoading ||
        !firstMatchRef.current ||
        !calendarRef.current
    ) {
        return;
    }

    const container = calendarRef.current;
    const card = firstMatchRef.current;

    const containerRect = container.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    container.scrollTo({
        top:
            container.scrollTop +
            (cardRect.top - containerRect.top) -
            container.clientHeight / 2 +
            cardRect.height / 2,
        left:
            container.scrollLeft +
            (cardRect.left - containerRect.left) -
            container.clientWidth / 2 +
            cardRect.width / 2,
        behavior: "smooth",
    });
}, [isLoading, filteredList, searchInput,sortStatus]);

    return (
        <div className="relative flex min-h-screen gap-4 py-4 md:px-7 mb-12">

            {/* Sidebar */}
            <div className={` relative shrink-0 overflow-hidden transition-all duration-300   ${sidebarOpen ? "w-[338px]" : "w-0"}`}>
                <Aside open={sidebarOpen} date={date} setDate={setDate} data={data} setSortStatus={setSortStatus} />
            </div>

            <div className={`absolute top-4 z-40 transition-all duration-300 ${sidebarOpen ? "left-[320px] md:left-[340px]" : "left-0"}`}>
                <Button variant="secondary" icon={sidebarOpen ? ChevronLeft : ChevronRight} onClick={() => setSidebarOpen(!sidebarOpen)} />
            </div>

            {/* Main */}
            <div className="flex flex-1 flex-col overflow-hidden px-4 ">

                {/* Temporary Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-2">
                    <h1 className="text-xl font-semibold">{get_Date(date, 'MMMM DD, YYYY')} {isToday && " ( Today )"} </h1>
                    <div className="w-full flex gap-1 md:w-1/2">
                        <SearchInput value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder='Filter and search . . . ' />
                        <Select value={sortStatus} style={{ height: 50, fontSize: 16 }} onChange={(e) => setSortStatus(e)} isSearch={false}
                            options={APPOINTMENT_STATUS_OPTIONS}
                        />
                    </div>
                </div>

                <div ref={calendarRef} className="relative flex-1 overflow-auto w-full max-h-[80vh] mt-4">
                    <div className="sticky top-0 z-[60] w-max min-w-full h-14 bg-gray-50 border-b border-gray-200 inline-flex text-gray-700">
                        <div className="sticky left-0 top-0 z-[70] flex w-20 items-center justify-center border-r border-gray-200 bg-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Slots
                        </div>

                        {userList
                            .map(o => (
                                <div
                                    key={o.id}
                                    className="flex w-44 items-center gap-3 border-r border-gray-200 bg-gray-50 px-3"
                                >
                                    <Image
                                        src={o.profilepic}
                                        name={o.fullname}
                                        height="h-8"
                                        width="w-8"
                                        className="flex-shrink-0"
                                        avatar={false}
                                        offimage={false}
                                    />

                                    <span className="truncate text-sm font-medium text-gray-800">
                                        {o.fullname}
                                    </span>
                                </div>
                            ))}
                    </div>
                    {currentTimeTop != null && isToday && (
                        <div
                            className="pointer-events-none absolute left-0 right-0 z-50"
                            style={{
                                top: `${56 + currentTimeTop}px`,
                                width: `${contentWidth}px`,
                            }}
                        >
                            <div className="relative ">
                                <div className="absolute left-20 right-0 h-0.5  bg-sky-600" />
                                <div className="absolute left-1 top-1/2 -translate-y-1/2 rounded bg-sky-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                    {now.toLocaleTimeString("en-US", {
                                        hour: "numeric",
                                        minute: "2-digit",
                                    })}
                                </div>
                                <div className="absolute left-[76px] -top-1 h-2.5 w-2.5 rounded-full bg-sky-600" />
                            </div>
                        </div>
                    )}

                    <IsLoading
                        isLoading={isLoading}
                        rows={20}
                        input={
                            workingHours?.open ? (
                                slots.map((item, index) => (
                                    <div key={index} className="flex h-12 w-max min-w-full border-b border-gray-200 bg-white text-sm hover:bg-gray-50">
                                        <div className="sticky left-0 z-40 flex w-20 items-center justify-center border-r border-gray-200 bg-white text-xs font-medium text-gray-500">
                                            {convertTo12Hour(item.start)}
                                        </div>

                                        {userList.map(user => {
                                            const appointment = getAppointmentPerSlot(
                                                filteredList.filter(
                                                    a =>
                                                        a.uid.toString() === user.id.toString() &&
                                                        a.starttime.toString() === item.start.toString()
                                                )
                                            );
                                            const attendance = attendanceList.find((o) => o.id === user.id);
                                            const isOnLeave = attendance && !attendance.open;
                                            const isStartTime =
                                                attendance?.startTime?.toString().slice(0, 5) === item.start.toString().slice(0, 5);

                                            const isEndTime =
                                                attendance?.endTime?.toString().slice(0, 5) === item.start.toString().slice(0, 5);
                                            
                                                const isFirstMatch =
                                                firstAppointment &&
                                                appointment &&
                                                appointment.id.toString() === firstAppointment.id.toString();

                                            return (
                                                <div key={user.id} className={`relative w-44  border-r border-gray-200 ${isOnLeave ? "bg-gray-100" : ""}`}>
                                                    
                                                    {isOnLeave ? (
                                                        <div className="pointer-events-none absolute inset-0 bg-gray-50/70 bg-[repeating-linear-gradient(135deg,transparent_0px,transparent_18px,rgba(107,114,128,0.22)_18px,rgba(107,114,128,0.22)_20px)]" />
                                                    ) : (
                                                        <>
                                                            {isStartTime && (
                                                                <div className="absolute left-0 right-0 top-0 z-30 flex items-center">
                                                                    <div className="h-px flex-1 bg-emerald-700" />
                                                                    <span className="mx-2 rounded bg-emerald-700 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                                                                        {convertTo12Hour(attendance.startTime)}
                                                                    </span>
                                                                    <div className="h-px flex-1 bg-emerald-700" />
                                                                </div>
                                                            )}

                                                            {isEndTime && (
                                                                <div className="absolute bottom-0 left-0 right-0 z-30 flex items-center">
                                                                    <div className="h-px flex-1 bg-red-600" />
                                                                    <span className="mx-2 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                                                                        {convertTo12Hour(attendance.endTime)}
                                                                    </span>
                                                                    <div className="h-px flex-1 bg-red-600" />
                                                                </div>
                                                            )}
                                                        </>)}

                                                    {appointment &&
                                                        (<div ref={isFirstMatch ? firstMatchRef : null}>
                                                            <Card
                                                                id={user.id}
                                                                startTime={item.start}
                                                                appointments={[appointment]}
                                                            />
                                                        </div>)
                                                    }
                                                </div>
                                            );
                                        })}
                                    </div>
                                )))
                                : (
                                    <div className="flex h-32 items-center justify-center ">
                                        <Tags dot title={"Business Closed"} color={"red"} /> 
                                    </div>
                                )
                        }
                    />

                </div>
            </div>

        </div>
    );

}

export default Calendar_Main