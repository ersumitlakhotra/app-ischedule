/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ClockAlert, Eye, Pencil, Percent, UserCheck, Users, UserX, Warehouse, CalendarOff } from "lucide-react";
import { SearchInput, Badge, Select, TabsButton, CustomTable, Image, ProgressBar, Tooltip, Tags, ActionMenu, Stats, Calendar, ModalPortal } from "../../controls/index.jsx";
import { NoResults, EmptyState, Header, IsLoading } from "../../common/index.jsx";
import { encryptId, getByKey, getWeekDates } from "../../common/general.jsx";
import { get_Date, UTC_LocalDateTime } from "../../common/localDate.js";
import {
    Package,
    Boxes,
    AlertTriangle,
    CircleOff,
    DollarSign,
    ChevronRight,
} from "lucide-react";
import { EmployeeAttendance } from "./card.jsx";

const Attendance = () => {
    const headingLabel = 'Attendance';
    const permissionText = "Attendance";
    const navigate = useNavigate();
    const { refresh, getUser, getAttendance } = useOutletContext();
    const [isLoading, setIsLoading] = useState(false);
    const [List, setList] = useState([]);
    const [TodayList, setTodayList] = useState([]);
    const [exportList, setExportList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [userListFiltered, setUserListFiltered] = useState([]);
    const [searchInput, setSearchInput] = useState('');

    const today = new Date();
    const [date, setDate] = useState(today.toISOString().split("T")[0]);
    const weekdays = getWeekDates(date);

    useEffect(() => {
        Init();
    }, [refresh,date]) 
    
    const Init = async () => {
        setIsLoading(true);
        const Response = await getAttendance(weekdays[0].date,weekdays[6].date);
        const UserResponse = await getUser();        
        const TodayResponse = await getAttendance(today.toISOString().split("T")[0],today.toISOString().split("T")[0]);
        setUserList(UserResponse); 
        setUserListFiltered(UserResponse); 
        setList(Response);
        setTodayList(TodayResponse);
        setIsLoading(false);
    }

    useEffect(() => {
        const searchedList = userList.filter(item =>
            ((item.fullname || "").toLowerCase().includes(searchInput.toLowerCase())));
        setUserListFiltered(searchedList);
    }, [searchInput])

    const statsTypes = [
        {
            id: "present",
            title: "Present Today",
            value: TodayList.filter((o) => o.status === 'Present' || o.status === 'Half Day').length,
            description: "Checked in today",
            icon: UserCheck,
            color: "green",
        },
        {
            id: "late",
            title: "Late Arrivals",
            value: TodayList.filter((o) => o.islate || o.isearly).length,
            description: "After scheduled time",
            icon: ClockAlert,
            color: "amber",
        },
        {
            id: "absent",
            title: "Absent Today",
            value: TodayList.filter((o) => o.status === 'Absent').length,
            description: "Without informing",
            icon: UserX,
            color: "red",
        },
        {
            id: "leave",
            title: "On Leave",
            value: TodayList.filter((o) => o.status === 'Leave').length,
            description: "Approved leaves today",
            icon: CalendarOff,
            color: "violet",
        }
    ];
    return (
        <div class="flex flex-col gap-4 md:px-7 py-4 mb-12">
            <Header Title={headingLabel} Permission={permissionText} ExportList={exportList} userList={userList} IsExport={false} />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {statsTypes.map((item) => (
                    <Stats
                        key={item.id}
                        title={item.title}
                        value={item.value}
                        description={item.description}
                        icon={item.icon}
                        color={item.color}
                        cursor_pointer={false}
                    //active={selected === item.id}
                    //onClick={() => setSelected(item.id)}
                    />
                ))}

            </div>
             <div class='flex flex-col md:flex-row gap-2 items-center justify-between '>
                 <SearchInput value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder='Filter and search by employee name . . . ' />
                <div className="w-full md:w-[320px] pt-2"> <Calendar value={date} onChange={setDate} /></div>
            </div>
            <IsLoading isLoading={isLoading} rows={10} input={
                userList.length === 0 ?
                    <EmptyState
                        title="No Employees"
                        buttonText={"Employees"}
                        permission={"Employees"}
                        onClick={() => navigate('/Employee/Create')}
                        description="You haven't added any employees yet. Create your first employee to start managing your team." /> :
                    <EmployeeAttendance days={weekdays} date={date} userList={userListFiltered} attendanceList={List} />
            } />

        </div>
    )
}

export default Attendance;

