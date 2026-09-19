
import React, { useEffect,  useRef,  useState } from "react";
import { Tags, Textbox, Textarea, Image, CustomTable, ActionMenu, Button, TabsButton } from "../../controls/index.jsx";
import { EmptyState, IsLoading, NoResults } from "../../common/index.jsx";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import FetchData from '../../hook/fetchData.js'
import { useAlert } from "../../controls/AlertProvider.jsx";
import { decryptId, encryptId, getByKey, getDateRangeStatus } from "../../common/general.jsx";
import { ViewHeader } from "../../common/pageHeader.jsx";
import { get_Date, LocalDate, UTC_LocalDateTime } from "../../common/localDate.js";
import { Pencil, Plus,DollarSign, Percent,Download, Eye } from "lucide-react";
import { ButtonPermission } from "../../auth/protectedButton.js";
import { print_invoice } from "../Appointment/print_invoice.jsx";
import {TableHeaders} from "../Appointment/table_header.jsx";

export const Discount_View = () => {
    const navigate = useNavigate();
    const { saveData,refresh, getService,getUser } = useOutletContext();
    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState([]);
    const [servicesList, setServicesList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const { Id } = useParams();
    const id = decryptId(Id);
    const isEdit = !!id;
    const contentRef = useRef(null);
   const date = LocalDate();
    const headers = TableHeaders({userList,navigate});
   
    const [form, setForm] = useState({
        id: null,
        cid: null,
        name: "",
        description: "",
        startdate: date,
        enddate: date,
        discount: "",
        discounttype:"$",
        coupon: Math.random().toString(36).substring(2, 10).toUpperCase(),
        newcustomer: false,
        onetime: false,
        upto: 0,
        services: [],
        createdat: null,
        modifiedat: null,
    });

   useEffect(() => {
        Init();
    }, [refresh])

    const Init = async () => {
        setIsLoading(true);
        const Response = await getService();
        const UserResponse = await getUser();  
        setServicesList(Response);
        setUserList(UserResponse);
        setIsLoading(false);
    }

     useEffect(() => {
        if (!isEdit) return;

        const getById = async (id) => {
            setIsLoading(true);

            try {
                const Response = await FetchData({
                    endPoint: 'discount',
                    id: id
                });
                if (Response.status === 200) {
                    setForm({
                        ...Response.data,
                        startdate: get_Date(Response.data.startdate, 'MMM DD, YYYY'),
                        enddate: get_Date(Response.data.enddate, 'MMM DD, YYYY'),
                        status: getDateRangeStatus(Response.data.startdate, Response.data.enddate)
                    });
                    const AppointmentResponse = await FetchData({
                        endPoint: 'appointment',
                        query: {
                            orderBy: 'trndate',
                            orderDir: 'DESC',
                            filters: JSON.stringify({
                                coupon: {
                                    operator: "=",
                                    value: Response.data.coupon,
                                },
                            }),
                        }
                    })
                    setFilteredList(AppointmentResponse.data);
                }
                else {
                    showAlert({
                        type: "error",
                        message: "Not Found",
                        duration: 5000,
                    });
                    navigate(-1);
                }
                // set state here
            } catch (error) {
                showAlert({
                    type: "error",
                    message: error,
                    duration: 5000,
                });
                navigate(-1);
            } finally {
                setIsLoading(false);
            }
        };

        getById(id);
    }, [id, isEdit]);   
   
    return (
        <div class="flex flex-col gap-4 md:px-7 py-4 mb-12">
            <IsLoading isLoading={isLoading} rows={20} input={
                <>
                    <ViewHeader Title={form.name} EditButton={"Discount"} onClick={() => navigate('/Discount/Edit/' + encryptId(id))} Permission={"Discount"}  />
                    <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 md:px-10">

                        {/* Left Column */}
                        <div className="md:col-span-3  space-y-6">
                            <div className="rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden mb-4" >

                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            Discount Information
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Review the discount settings, including the discount type, amount, and applicable conditions.
                                        </p>
                                    </div>

                                    <Tags title={form.status} dot />
                                </div>

                                {/* Body */}
                                <div className="space-y-6 p-6">

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                        <Textbox  label="Title" value={form.name} disabled />
                                        <Textbox label="Start" value={form.startdate} disabled/>
                                        <Textbox label="End" value={form.enddate} disabled/>                      
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                        <Textbox icon={form.discounttype === "$"? DollarSign : Percent} label="Discount" value={form.discount} disabled />
                                        <Textbox label="Coupon" value={form.coupon} disabled/>                    
                                    </div>
                                    <Textarea label="Description" value={form.description} disabled  />

                                </div>
                            </div>
  
                        </div>

                        {/* Right Column */}
                        <div className="md:col-span-1 self-start space-y-6">
                            <div className="rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden">
                                <div className="space-y-5 p-6">

                                    <div className="rounded-2xl bg-cyan-50 p-4 border border-cyan-100 text-xs text-gray-500">
                                        <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                            Applicable on:
                                        </h2>

                                        {
                                            form.services.length === 0 ? "• All Services" :
                                                form.services.map((o) => <p>• {o.name}</p> )
                                        }

                                    </div>

                                    {(form.newcustomer || form.onetime || Number(form.upto) > 0) &&
                                        <div className="rounded-2xl bg-green-50 p-4 border border-green-100 text-xs text-slate-500">

                                            <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                                Eligibility
                                            </h2>
                                            {form.newcustomer && <p> 🔥 For New Customers Only. </p>}
                                            {form.onetime && <p> ⭐ One-Time Use Per Customer. </p>}
                                            {Number(form.upto) > 0 && <p> 🎉 Offer Valid for the First {form.upto} Customers Only. </p>}

                                        </div>
                                    }

                                </div>

                            </div>

                        </div>

                    </div>
                    <div className="w-full md:px-10">
                        <IsLoading isLoading={isLoading} rows={10} input={
                            filteredList.length === 0 ?
                                <EmptyState
                                    title="No Appointment"
                                    buttonText={"Appointment"}
                                    permission={"Appointment"}
                                    onClick={() => navigate('/Appointment/Create')}
                                    description="Book an appointment by choosing the customer, services, preferred date and time, and completing any required payment information." />
                                : <CustomTable headers={headers} data={filteredList} rowsPerPage={10} />
                        } />
                    </div>

                </>
            } />
        </div>
    );
};





