/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { SearchInput, Badge, Select, TabsButton, CustomTable, Calendar, Tags, ActionMenu, Button } from "../../controls/index.jsx";
import { NoResults, EmptyState, Header, IsLoading } from "../../common/index.jsx";
import { encryptId, getByKey, getMonthRange } from "../../common/general.jsx";
import { APPOINTMENT_STATUS_OPTIONS } from '../../common/enum.jsx'
import { StatCard } from "./statcard.jsx";
import { firstDateOfMonth, get_Date, lastDateOfMonth, LocalDate, UTC_LocalDateTime } from "../../common/localDate.js";
import { DollarSign, Download, Eye, Minus, Pencil } from "lucide-react";
import { Tooltip } from "antd";
import { print_invoice } from "./print_invoice.jsx";
import { TableHeaders } from "./table_header.jsx";

const Appointment = () => {
    const headingLabel = 'Appointment';
    const permissionText = "Appointment";
    const navigate = useNavigate();
    const { refresh, apptDate: date, setApptDate: setDate, getAppointment, getUser } = useOutletContext();
    const [isLoading, setIsLoading] = useState(false);
    const [List, setList] = useState([]);
    const [monthlyList, setMonthlyList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [sortStatus, setSortStatus] = useState('All Status');
    const [employee, setEmployee] = useState(0);
    const [activeCard, setActiveCard] = useState(-1);
    const monthRange = getMonthRange(date);
    const headers = TableHeaders({userList,navigate});

    const [today, setToday] = useState({
        pending: 0,
        total: 0,
        percentage: 0
    })
    const [month, setMonth] = useState({
        pending: 0,
        total: 0,
        percentage: 0,
        name: ''
    })
    const [awaiting, setAwaiting] = useState({ pending: 0, name: '' })
    const [paymentReceived, setPaymentReceived] = useState({ pending: 0, percentage: 0 })

    useEffect(() => {
        Init();
    }, [refresh])

    const Init = async () => {
        setIsLoading(true);
        
        const [Response,UserResponse] = await Promise.all([getAppointment(),getUser()]);
        setUserList(UserResponse);
        const monthlyListResponse = Response.filter((item) =>
            get_Date(item.trndate, "YYYY-MM-DD") >= monthRange.first &&
            get_Date(item.trndate, "YYYY-MM-DD") <= monthRange.last);

        setList(Response);
        setFilteredList(Response);
        handleSearch(Response);
        setMonthlyList(monthlyListResponse);
        cards_Init(monthlyListResponse);
        setIsLoading(false);
    }

    useEffect(() => {
        handleSearch(List);
    }, [searchInput, sortStatus, employee, date]);

    const handleSearch = async (dataList) => {
        setIsLoading(true);
        setActiveCard(-1);
        try {
            const search = searchInput.toLowerCase();

            const searchedList = dataList.filter((item) => {
                const phone = (item.cell || "").replace(/\D/g, "");

                return (
                    (
                        (item.order_no || "").toString().toLowerCase().includes(search) ||
                        (item.name || "").toLowerCase().includes(search) ||
                        phone.includes(search)
                    ) &&
                    (sortStatus === "All Status" || item.status === sortStatus) &&
                    (employee === 0 || item.uid === employee) &&
                    (get_Date(item.trndate, "YYYY-MM-DD") === get_Date(date, "YYYY-MM-DD"))
                );
            });

            setFilteredList(searchedList);
            // set state here
        } finally {
            setIsLoading(false);
        }
    };

    const handleCardChange = async (index) => {
        setIsLoading(true);
        try {
            setActiveCard(index);
            const searchedList =
                String(index) === "0" ? monthlyList.filter((o) => ["Pending", "Awaiting"].includes(o.status) && get_Date(o.trndate, "YYYY-MM-DD") === LocalDate()) :
                    String(index) === "1" ? monthlyList.filter((o) => ["Pending", "Awaiting"].includes(o.status)) :
                        String(index) === "2" ? monthlyList.filter((o) => ["Awaiting"].includes(o.status)) :
                            String(index) === "3" ? monthlyList.filter((o) => o.paymentstatus !== "Paid") : [];

            if (Number(index) > -1)
                setFilteredList(searchedList);
        } catch (error) {
        } finally {
            setIsLoading(false);
        }

    }

    const cards_Init = async (dataList) => {
        setIsLoading(true);
        try {
            const monthRange = getMonthRange(date)
            const month = new Date(date).toLocaleString("en-US", { month: "long", });
            //const searchedList = List.filter((item) => get_Date(item.trndate, "YYYY-MM-DD") >= monthRange.first && get_Date(item.trndate, "YYYY-MM-DD") <= monthRange.last);

            {/* Today*/ }
            const todayList = dataList.filter((o) => get_Date(o.trndate, "YYYY-MM-DD") === LocalDate())
            const todayPending = todayList.filter((o) => o.status !== "Pending" && o.status !== "Awaiting").length;
            const todayTotal = todayList.length;
            setToday({
                pending: todayPending,
                total: todayTotal,
                percentage: todayTotal === 0 ? 100 : Math.round((todayPending / todayTotal) * 100)

            })

            {/* Month*/ }
            const monthPending = dataList.filter((o) => o.status !== "Pending" && o.status !== "Awaiting").length;
            const monthTotal = dataList.length;
            setMonth({
                name: month,
                pending: monthPending,
                total: monthTotal,
                percentage: monthTotal === 0 ? 100 : Math.round((monthPending / monthTotal) * 100)
            })

            {/* Awaiting*/ }
            setAwaiting({
                name: month,
                pending: dataList.filter((o) => o.status === "Awaiting").length
            })

            {/* Payment Pending*/ }
            //const paymentAppt = searchedList.filter((o) => o.status === "Pending" || o.status === "Completed");
            const totalAmount = dataList.reduce(
                (sum, amount) => sum + (parseFloat(amount.total) || 0),
                0
            );

            const pendingAmount = dataList.filter((o) => o.paymentstatus !== "Paid").reduce(
                (sum, amount) => sum + (parseFloat(amount.total) || 0),
                0
            );
            const receivedAmount = dataList.filter((o) => o.paymentstatus === "Paid").reduce((sum, appt) => {
                const paymentTotal = (appt.payments || []).reduce(
                    (paymentSum, payment) => paymentSum + (parseFloat(payment.amount) || 0),
                    0
                );

                return sum + paymentTotal;
            }, 0);

            setPaymentReceived({
                pending: Number(pendingAmount).toFixed(2),
                percentage: totalAmount === 0 ? 100 : Math.round((receivedAmount / totalAmount) * 100)
            })


        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };

    const cards = [
        {
            title: "Visits Today",
            value: today.pending,
            subValue: `/ ${today.total} today`,
            percentage: `${today.percentage}%`,
            progress: today.percentage,
        },
        {
            title: "Visits Per Month",
            value: month.pending,
            subValue: `/ ${month.total} in ${month.name}`,
            percentage: `${month.percentage}%`,
            progress: month.percentage,
        },
        {
            title: "Awaiting Request",
            value: `⚠️${awaiting.pending}`,
            subValue: `in ${awaiting.name}`,
            progress: 0,
            isprogress: false
        },
        {
            title: "Payment Pending",
            value: `$${paymentReceived.pending}`,
            percentage: `${paymentReceived.percentage}%`,
            progress: paymentReceived.percentage,
        },
    ];

    
    return (
        <div class="flex flex-col gap-4 md:px-7 py-4 mb-12">
            <Header Title={headingLabel} Permission={permissionText} AddButton={headingLabel} ExportList={filteredList} userList={userList} onClick={() => navigate('/Appointment/Create')} />

            <div className="space-y-6">
                {/* Cards */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card, index) => (
                        <StatCard key={index} {...card}
                            active={activeCard === index}
                            onClick={() => handleCardChange(index)} />
                    ))}
                </div>
            </div>


            <div className="flex flex-col gap-2  md:flex-row md:justify-end  ">
                <SearchInput value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder='Filter and search . . . ' />
                <Select value={employee} style={{ height: 50, fontSize: 16 }} onChange={(e) => setEmployee(e)} isSearch={false}
                    options={[
                        { id: 0, value: 0, label: <Badge color="blue" text="All Employees" />, },
                        ...userList.map((o) => ({ id: o.id, value: o.id, label: <Badge color={o.status === "Active" ? 'green' : 'red'} text={o.fullname} /> }))
                    ]}
                />
                <Select value={sortStatus} style={{ height: 50, fontSize: 16 }} onChange={(e) => setSortStatus(e)} isSearch={false}
                    options={APPOINTMENT_STATUS_OPTIONS}
                />
                <div className="w-full md:w-[1200px]"> <Calendar value={date} onChange={setDate} /></div>
            </div>
           
             <IsLoading isLoading={isLoading} rows={10} input={
                List.length === 0 ?
                    <EmptyState
                        title="No Appointment"
                        buttonText={headingLabel}
                        permission={permissionText}
                        onClick={() => navigate('/Appointment/Create')}
                        description="Book an appointment by choosing the customer, services, preferred date and time, and completing any required payment information." /> :
                    filteredList.length > 0 ?
                        <CustomTable headers={headers} data={filteredList} rowsPerPage={10} /> :
                        <NoResults
                            buttonText={headingLabel}
                            permission={permissionText}
                            onClick={() => navigate('/Appointment/Create')} />
            } />
        </div>
    )
}

export default Appointment;

