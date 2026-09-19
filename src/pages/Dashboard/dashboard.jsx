/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { SearchInput, Badge, Select, TabsButton, CustomTable, Calendar, Tags, ActionMenu, Button } from "../../controls/index.jsx";
import { NoResults, EmptyState, Header, IsLoading } from "../../common/index.jsx";
import { encryptId, getByKey, getMonthRange } from "../../common/general.jsx";
import { APPOINTMENT_STATUS_OPTIONS } from '../../common/enum.jsx'
import { StatCard } from "./statcard.jsx";
import { firstDateOfMonth, get_Date, lastDateOfMonth, LocalDate, UTC_LocalDateTime } from "../../common/localDate.js";
import { DollarSign, Download, Eye, Mail, Minus, Pencil, LayoutDashboard,UsersRound, DollarSignIcon,MessageSquareDot } from "lucide-react";
import { AreaChartCard } from "./graph.jsx";
import { Attendance } from "./attendance.jsx";
import dayjs from 'dayjs';
import { Services } from "./services.jsx";
import { Awaiting } from "./awaiting.jsx";
import { Payments } from "./payments.jsx";
import { usePermission } from "../../auth/protectedButton.js";

const Dashboard = () => {
    const headingLabel = 'Dashboard';
    const permissionText = "Dashboard";
    const navigate = useNavigate();
    const hasPermission = usePermission();
    const { refresh,saveData, getCompany, getAppointment,getAwaiting, getUser, getCustomer,getLogs,getAttendance,getService,setActiveSettingTab } = useOutletContext();
    const [isLoading, setIsLoading] = useState(false);
    const todaydate = LocalDate();

    const [appointmentList, setAppointmentList] = useState([]); 
    const [awaitingList, setAwaitingList] = useState([]); 
    const [salesList, setSalesList] = useState([]); 
    const [userList, setUserList] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [logsList, setLogsList] = useState([]);
    const [attendanceList, setAttendanceList] = useState([]);
    const [servicesList, setServicesList] = useState([]);

    const dates = Array.from(
        { length: 30 },
        (_, i) => {
            const date = dayjs().subtract(29 - i, "day");

            return {
                label: date.format("MMM DD"),
                date: date.format("YYYY-MM-DD")
            };
        }
    ); 

    const categoriesArray = dates.map((item) => item.label);
    
    useEffect(() => {
        Init();
    }, [refresh])

    const Init = async () => {
        setIsLoading(true);
        const [
            AppointmentResponse, 
            AwaitingResponse,
            UserResponse, 
            CustomerResponse, 
            CompanyResponse, 
            LogsResponse,
            AttendanceResponse,
            ServicesResponse
        ] = await Promise.all(
            [
                getAppointment(dates[0].date, todaydate),
                getAwaiting(),
                getUser(),
                getCustomer(),
                getCompany(),
                getLogs(),
                getAttendance(todaydate,todaydate),
                getService()
            ]);   
        setAppointmentList(AppointmentResponse);
        setSalesList(AppointmentResponse.filter((o) => o.status !== "Cancelled" && o.status !== "Rejected" && o.status !== "NoShow"));      
        setAwaitingList(AwaitingResponse);
        setUserList(UserResponse);
        setCustomerList(CustomerResponse);
        setCompanyList(CompanyResponse);
        setLogsList(LogsResponse);
        setAttendanceList(AttendanceResponse);
        setServicesList(ServicesResponse);
        setIsLoading(false);
    }

    const todayAppointments = appointmentList.filter(
        (o) => get_Date(o.trndate, "YYYY-MM-DD") === todaydate
    ).length;


    const last30Appointments = dates.map((day) => {
        return appointmentList.filter(
            (o) => get_Date(o.trndate, "YYYY-MM-DD") === day.date
        ).length;
    });


    
    const todaySales = salesList.filter(
        (o) => get_Date(o.trndate, "YYYY-MM-DD") === todaydate
    ).reduce(
        (sum, o) => sum + Number(o.total || 0),
        0
    );

    const last30Sales = dates.map((day) => {
        return salesList
            .filter(
                (o) => get_Date(o.trndate, "YYYY-MM-DD") === day.date
            )
            .reduce(
                (sum, o) => sum + Number(o.total || 0),
                0
            );
    });

     const last30Customer = dates.map((day) => {
        return customerList.filter(
            (o) => get_Date(o.createdat, "YYYY-MM-DD") === day.date
        ).length;
    });

  const last30TextLogs = dates.map((day) => {
        return logsList
            .filter(
                (o) => get_Date(o.createdat, "YYYY-MM-DD") === day.date && o.type === 'Twillio'
            )
            .reduce(
                (sum, o) => sum + Number(o.cost || 0),
                0
            );
    });

    const cards = [
        {
            title: "Today Appointments",
            value: todayAppointments,
            sign:"#",
            icon:LayoutDashboard,
            color: "bg-orange-300",
            chart:<AreaChartCard categoriesArray={categoriesArray} color={['#fdba74']} series={last30Appointments} name={'#'} />,
            onclick: () => hasPermission("Appointment.Open") && navigate("/Appointment")
        },
        {
            title: "Today Sales",
            value: todaySales,
            sign:"$",
            icon:DollarSignIcon,
            color: "bg-green-400",
            chart:<AreaChartCard categoriesArray={categoriesArray} color={['#4ade80']} series={last30Sales} name={'$'} />,
            onclick: () => hasPermission("Reports.Open") && navigate("/Reports")
        },
        {
            title: "Total Customers",
            value: customerList.length,
            sign:"#",
            icon:UsersRound,
            color: "bg-gradient-to-r from-red-400 to-pink-800",
            chart:<AreaChartCard categoriesArray={categoriesArray} color={['#9d174d']} series={last30Customer} name={'#'} />,
           onclick: () => hasPermission("Customers.Open") && navigate("/Customers")
        },
        {
            title: "Text Messaging",
            value: companyList?.credit || 0,
            sign:"$",
            icon:MessageSquareDot,
            color: "bg-sky-500",
            chart:<AreaChartCard categoriesArray={categoriesArray} color={['#0ea5e9']} series={last30TextLogs} name={'$'} />,
            onclick: () => hasPermission("Setting.Open") &&  (setActiveSettingTab(3),navigate("/Setting"))
        },
    ];

    const headers = [
        {
            label: "Employee",
            render: (row) => {
                const user = userList.find((item) => item.id === row.uid);
                return (<span class="font-semibold">{user?.fullname || ''}</span>)
            },
        },
        {
            label: "Status",
            render: (row) =>
                <div className="flex flex-row items-center gap-2">
                    <Tags title={row.status} dot />
                    {row.paymentstatus === 'Paid' && <Tags title={"Paid"} color="green" dot />}
                </div>,
        },

        {
            label: "Action",
            render: (row) =>
                <></>,
        },
    ]

    
    return (
        <div class="flex flex-col gap-6 md:px-7 py-4 mb-12 ">
            <Header Title={headingLabel} Permission={permissionText} IsExport={false} />

            <div className="space-y-6">
                {/* Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card, index) => ( 
                        <StatCard key={index} {...card} isLoading={isLoading} onClick={card.onclick}  />
                    ))}
                </div>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Column onClick={() => handleCardChange(index)} */}
                <div className="md:col-span-2  space-y-6">
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Attendance isLoading={isLoading} companyList={companyList} userList={userList} attendanceList={attendanceList} />
                        <Services isLoading={isLoading} servicesList={servicesList} appointmentList={appointmentList}/>
                    </div>
                     <div className="w-full grid grid-cols-1  gap-6">
                        <Payments/>
                     </div>
                </div>

                {/* Right Column  */}
                <div className="md:col-span-1 self-start space-y-6">
                    <Awaiting isLoading={isLoading} awaitingList={awaitingList} userList={userList} hasPermission={hasPermission} saveData={saveData} />
                </div>


            </div>
                
           
        </div>
    )
}

export default Dashboard;

