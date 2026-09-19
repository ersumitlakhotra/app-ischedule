/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { SearchInput, Button, Tags } from "../../controls/index.jsx";
import { NoResults, EmptyState, Header, IsLoading } from "../../common/index.jsx";
import AsideList from "./aside.jsx";
import { ChevronLeftCircle, Upload } from "lucide-react";
import Card from "./card.jsx";
import {TableHeaders} from "../Appointment/table_header.jsx";
import { get_Date } from "../../common/localDate.js";
import { ButtonPermission } from "../../auth/protectedButton.js";

const Customer = () => {
    const headingLabel = 'Customers';
    const permissionText = "Customers";
    const navigate = useNavigate();
    const { refresh,selectedCustomer, setSelectedCustomer, getCustomer,getAppointment,getUser } = useOutletContext();
    const [isLoading, setIsLoading] = useState(false);
    const [List, setList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [appointmentList, setAppointmentList] = useState([]);
    const [searchInput, setSearchInput] = useState('');

    const [showSidebar, setShowSidebar] = useState(true);
    const [activeLetter, setActiveLetter] = useState("All");
    const headers = TableHeaders({userList,navigate}).filter((header) => header.label !== "Customer" && header.label !== "Modified");

   const rewardHeader = [
    {
        label: "Order No",
        render: (row) => (
            <span className="font-semibold">{row.order_no}</span>
        ),
    },
    {
        label: "Date",
        render: (row) => (
            <div className="flex flex-col items-start">
                <span className="font-semibold">
                    {get_Date(row.trndate, "DD MMM YYYY")}
                </span>
                <span className="text-xs font-medium text-gray-400">
                    {row.slot}
                </span>
            </div>
        ),
    },
    {
        label: "Services",
        render: (row) => (
            <div className="flex flex-col items-start">
                {row.services?.map((o, index) => (
                    <span key={index} className="text-xs font-medium">
                        {o.name}
                    </span>
                ))}
            </div>
        ),
    },
    {
        label: "Points",
        render: (row) => {
            const value= Number(row.points || 0)
            return value === 0 || Boolean(row.isReferral)  ? ( <span className="text-slate-400"> — </span>) : (<Tags title={value} color={value > 0? "green":  "red"} />);
        },
    },
    {
        label: "Punch",
         render: (row) => {
            const value= Number(row.punchpoints || 0)
            return value === 0 || Boolean(row.isReferral)  ? ( <span className="text-slate-400"> — </span>) : (<Tags title={value} color={value > 0? "green":  "red"} />);
      },
    },
    {
        label: "Badge",
         render: (row) => {
            const value= Number(row.badgepoints || 0)
            return value === 0 || Boolean(row.isReferral)  ? ( <span className="text-slate-400"> — </span>) : (<Tags title={value} color={value > 0? "green":  "red"} />);
      },
    },
    {
        label: "Referral",
         render: (row) => {
            const value= Number(row.referralpoints || 0)
            return value === 0 || !Boolean(row.isReferral)  ? ( <span className="text-slate-400"> — </span>) : (<Tags title={value} color={value > 0? "green":  "red"} />);
      },
    },
    {
        label: "Used",
         render: (row) => {
            const value= Number(row.pointsused || 0)
            return value === 0 || Boolean(row.isReferral)  ? ( <span className="text-slate-400"> — </span>) : (<Tags title={value} color={value > 0? "green":  "red"} />);
      },
    },
    {
        label: "Total",
        render: (row) => {
            const value = Number(row.totalpoints || 0);

            return (
                <Tags dot title={value} color={value > 0 ? "green" : value < 0 ?  "red":"gray"}
                />
            );
        },
    },
];
    useEffect(() => {
        Init();
    }, [refresh])

    const Init = async () => {
        setIsLoading(true);
        const Response = await getCustomer();
        const UserResponse = await getUser();  
        const AppointmentResponse = await getAppointment();
        setList(Response);
        setFilteredList(Response);
        setUserList(UserResponse);
        setAppointmentList(AppointmentResponse);
        setSelectedCustomer(selectedCustomer ? Response.find((o) => o.id ===selectedCustomer.id) : null);
        setIsLoading(false);
    }

    useEffect(() => {
        setActiveLetter("All");
         const search = searchInput.toLowerCase();

        const searchedList = List.filter(item =>
            ((item.name || "").toLowerCase().includes(search) ||
            (item.cell || "").replace(/\D/g, "").includes(search)
        ));
        setFilteredList(searchedList);
    }, [searchInput])

    const filteredCustomers = useMemo(() => {
        if (activeLetter === "All") return filteredList;

        return filteredList.filter((customer) =>
            (customer.name || "")
                .trim()
                .toUpperCase()
                .startsWith(activeLetter)
        );
    }, [filteredList, activeLetter]);

    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);
        
        // Hide sidebar on mobile
        if (window.innerWidth < 1024) {
            setShowSidebar(false);
        }
    };


    return (
        <div class="flex flex-col gap-4 md:px-7 py-4 mb-12">
            <Header Title={headingLabel} Permission={permissionText} AddButton={headingLabel} ExportList={filteredList} onClick={() => navigate('/Customers/Create')}
                Extra={<ButtonPermission permission={`${permissionText}.Create`} children={
                    <Button
                        variant="secondary"
                        icon={Upload}
                        label={"Import" }
                        onClick={() => navigate('/Customers/Import')}
                    />} />}
            />
            <SearchInput value={searchInput} onChange={(e) => {setSearchInput(e.target.value);  setSelectedCustomer(null);}} placeholder='Filter and search . . . ' />

            <IsLoading isLoading={isLoading} rows={10} input={
                List.length === 0 ?
                    <EmptyState
                        title={`No ${headingLabel}`}
                        buttonText={headingLabel}
                        permission={permissionText}
                        onClick={() => navigate('/Customers/Create')}
                        description="Get started by adding your first customer. Once added, you'll be able to manage client information, appointments, and service history." /> :

                    <div className="flex h-[100vh] max-h-screen w-full ">

                        {/* Sidebar */}
                        <div className={`${showSidebar ? "block" : "hidden"} lg:block w-full lg:w-96 border-r border border-gray-200`}>
                            <AsideList
                                filteredCustomers={filteredCustomers}
                                activeLetter={activeLetter}
                                setActiveLetter={setActiveLetter}
                                selectedCustomer={selectedCustomer}
                                onSelect={handleSelectCustomer}
                                setSelectedCustomer={setSelectedCustomer}
                            />
                        </div>

                        {/* Details */}
                        <div className={`flex-1 ${showSidebar ? "hidden lg:block" : "block"} `} >
                            <main className={`h-full `}>

                                {/* Mobile Header */}
                                <div className="sticky top-0 z-20 flex items-center gap-3 border-b bg-white p-3 lg:hidden">
                                    <Button variant="secondary" icon={ChevronLeftCircle} label={'List'} onClick={() => setShowSidebar(true)} />                                    
                                </div>

                                {selectedCustomer ? (
                                    <Card 
                                    id={selectedCustomer?.id || 0} 
                                    form={selectedCustomer}
                                    headers={headers}
                                    rewardHeader={rewardHeader}
                                    appointments={appointmentList}
                                    userList={userList}
                                    />
                                ) : (
                                    filteredList.length > 0 ?
                                        <div className="flex h-full items-center justify-center text-gray-500">
                                            Select a customer
                                        </div> :
                                        <NoResults buttonText={headingLabel} permission={permissionText} onClick={() => navigate("/Customers/Create")} />
                                )}
                            </main>
                        </div>

                    </div>
            } />
        </div>
    )
}

export default Customer;

