
import React, { useEffect, useState } from "react";
import { Tags, Textbox, Textarea, Image, CustomTable, ActionMenu, Button, TabsButton, Tooltip } from "../../controls/index.jsx";
import { EmptyState, IsLoading, NoResults } from "../../common/index.jsx";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import FetchData from '../../hook/fetchData.js'
import { useAlert } from "../../controls/AlertProvider.jsx";
import { decryptId, encryptId, getByKey, getWeekday } from "../../common/general.jsx";
import { ViewHeader } from "../../common/pageHeader.jsx";
import { get_Date, LocalDate, UTC_LocalDateTime } from "../../common/localDate.js";
import { CircleDollarSign, Download, ListCheck, NotebookPen, CircleCheckBig, Plus, X, ReceiptText } from "lucide-react";
import { ButtonPermission } from "../../auth/protectedButton.js";
import Invoice, { print_invoice } from "./print_invoice.jsx";
import { accept_reject } from "./accept_reject.jsx";

export const Appointment_View = () => {
    const navigate = useNavigate();
    const { refresh,saveData, getAppointment, getCompany, getCustomer, getDiscount, getService, getUser, getAttendance, getInventory } = useOutletContext();
    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const [List, setList] = useState([]);
    const [categoryList, setCategotyList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [userList, setUserList] = useState([]);
    const { Id } = useParams();
    const id = decryptId(Id);
    const isEdit = !!id;

    const date = LocalDate();
    const [form, setForm] = useState({
        id: null,
        cid: null,
        status: "Pending",
        order_no: "0",
        trndate: date,
        slot: "",
        starttime: "",
        endtime: "",
        uid: 0,
        services: [],
        products: [],
        subtotal: 0,

        coupon: "",
        isdiscount: false,
        discounttype: "coupon",
        discount: "0",

        istax: false,
        tax: 0,
        taxpercentage: 0,

        total: 0,    
        tip: 0,
        bookedvia: "Walk-In",

        name: "",
        cell: "",
        email: "",
        reason: "",
        notes: "",
        additionalnotes: "",

        payments: [],
        logs: [],
        paymentstatus:'Unpaid',
        createdat: null,
        modifiedat: null,
    });

    useEffect(() => {
        Init();
    }, [refresh])

    const Init = async () => {
        setIsLoading(true);
        const UserResponse = await getUser();
        setUserList(UserResponse);
        setIsLoading(false);
    }

    const employee =
        userList?.length && Number(form.uid)
            ? userList.find((o) => o.id === form.uid)
            : null;

    useEffect(() => {
        if (!isEdit) return;

        const getById = async (id) => {
            setIsLoading(true);

            try {
                const Response = await FetchData({
                    endPoint: 'appointment',
                    id: id
                });
                if (Response.status === 200) {
                    setForm(Response.data);
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
    }, [id, isEdit,refresh]);

    const LineItem = ({ index, name, desc, amount }) => {
        return (
            <div key={index} className="flex items-center justify-between px-5 py-3" >
                <div>
                    <p className="font-medium text-gray-800">{name}</p>
                    <p className="text-sm text-gray-500">{desc}</p>
                </div>
                <p className={`font-medium text-gray-700`}>${Number(amount).toFixed(2)}</p>
            </div>
        )
    }

    const CustomerLineItem = ({ index, icon, title, description }) => {
        return (
            <div key={index} className="flex items-center gap-3">
                {icon}
                <div className="flex flex-col items-start">
                    <span className="font-semibold"> {title} </span>
                    <span className="text-xs font-medium text-gray-400"> {description}</span>
                </div>
            </div>
        )
    }

    const invoiceTotal = Number(form.total).toFixed(2);

    const totalReceived = form.payments.reduce(
        (sum, payment) => sum + (parseFloat(payment.amount) || 0),
        0
    );
    const tip = totalReceived > invoiceTotal
        ? totalReceived - invoiceTotal
        : 0;

    const balance = totalReceived < invoiceTotal
        ? invoiceTotal - totalReceived
        : 0;

    return (
        <div class="flex flex-col gap-4 md:px-7 py-4 mb-12">
            <IsLoading isLoading={isLoading} rows={20} input={
                <>
                    <ViewHeader Title={'# ' + form.order_no} EditButton={" "} onClick={() => navigate('/Appointment/Edit/' + encryptId(id))} Permission={"Appointment"}
                        Description={`Order History / Via ${form.bookedvia} / Created - ${UTC_LocalDateTime(form.createdat, 'MMMM, DD YYYY - hh:mm A ')}`}
                        AddButton=
                        {<>
                            <ButtonPermission permission={`Appointment.View`} children={
                                <Button
                                    variant="secondary"
                                    icon={Download}
                                    label={"Print Invoice"}
                                    onClick={async() => await print_invoice(id)}
                                />} />
                           
                            {form.status === "Awaiting" && <>   
                                <Tooltip title="Accept" placement="bottom" children={
                                    <Button variant="primary" icon={CircleCheckBig} label="Accept" onClick={async () => await accept_reject(id, true, saveData)} />}
                                />
                                <Tooltip title="Reject" placement="bottom" children={
                                    <Button variant="danger" icon={X} label="Reject"  onClick={async () => await accept_reject(id, false, saveData)} />}
                                />
                            </>}
                            {balance > 0 ?
                                <ButtonPermission permission={`Payment.Create`} children={
                                    <Button
                                        variant="primary"
                                        icon={Plus}
                                        label={"Receive Payment"}
                                        onClick={() => navigate('/Payment/' + encryptId(id))}
                                    />} /> :
                                <ButtonPermission permission={`Payment.Create`} children={
                                    <Button
                                        variant="secondary"
                                        icon={CircleDollarSign}
                                        label={"View Payment"}
                                        onClick={() => navigate('/Payment/' + encryptId(id))}
                                    />} />
                            }
                        </>}
                    />

                    <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 md:px-10">

                        {/* Left Column */}
                        <div className="md:col-span-3  space-y-6">
                            {/* First  */}
                            <div className="rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden mb-4" >
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Appointment Information
                                    </h2>

                                    <Tags title={form.status} dot />
                                </div>

                                {/* Body */}
                                <div className="space-y-6 p-6 ">
                                    <div className="flex flex-col md:flex-row items-start md:items-center">
                                        {/* Left Section */}
                                        <div className="w-full md:w-auto md:min-w-[200px] border-b md:border-b-0 md:border-r border-gray-200 px-6 py-5">
                                            <p className="text-sm font-medium text-sky-600">{getWeekday(get_Date(form.trndate, 'YYYY-MM-DD'))}</p>

                                            <h2 className="mt-1 text-2xl font-semibold text-gray-900">
                                                {get_Date(form.trndate, 'MMM DD, YYYY')}
                                            </h2>

                                            <span class="mt-4 text-xs font-medium text-gray-400">{form.slot}</span>

                                            <div className="mt-4 flex items-center gap-2 ">
                                                <Image src={employee?.profilepic || null} name={employee?.fullname || ""} width="w-8" height="h-8" className="" avatar={false} />
                                                <span className="font-semibold text-xs">{employee?.fullname || ""}</span>
                                            </div>
                                        </div>

                                        {/* Right Section */}
                                        <div className="flex-1 px-6 py-5">
                                            <div className="flex items-start justify-between">
                                                <div className="flex flex-col gap-3">
                                                    <CustomerLineItem index={1} title={form.name} icon={<span className="h-3 w-3 rounded-full bg-lime-500"></span>} description={form.cell + (form.email && ` | ${form.email}`)} />
                                                    <CustomerLineItem index={2} title={"Services"} icon={<ListCheck size={16} color="black" />} description={form.services.map((o) => o.name).join(" | ")} />
                                                    <CustomerLineItem index={3} title={"Notes"} icon={<NotebookPen size={16} color="black" />} description={form.notes || "Empty"} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden mb-4" >

                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            Additional Information
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Provide any additional information, comments, or special instructions that may be helpful.
                                        </p>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="space-y-6 p-6">
                                    <Textbox label="Reason for Cancel/Reject/No Show" value={form.reason} disabled />
                                    <Textarea label="Additional Notes" value={form.additionalnotes} disabled />
                                </div>

                            </div>

                        </div>

                        {/* Right Column  */}
                        <div className="md:col-span-1 self-start space-y-6">

                            <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">

                                {/* Header */}
                                <div className="border-b bg-gray-50 px-5 py-3 flex flex-row items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Invoice Summary
                                    </h3>
                                    {form.paymentstatus === 'Paid' && <Tags title={"Paid"} color="green" dot />}
                                </div>


                                <div className="divide-y">
                                    {/* Services */}
                                    {form.services.map((item, index) => (
                                        <LineItem index={index} name={item.name} desc={item.minutes + " minutes"} amount={item.price} />
                                    ))}

                                    {/* Products */}
                                    {form.products.map((item, index) => (
                                        <LineItem index={index} name={item.name} desc={item.unit + " unit"} amount={item.sellprice} />
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="border-t bg-gray-50 px-5 py-4">

                                    <div className="ml-auto max-w-sm space-y-2">

                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Subtotal</span>
                                            <span>${Number(form.subtotal).toFixed(2)}</span>
                                        </div>

                                        <div className="flex justify-between items-center text-sm text-red-600">
                                            <span>Discount
                                                {form.isdiscount &&
                                                    <span className="text-xs"> {`( ${form.coupon || form.discounttype} )`}</span>}
                                            </span>
                                            <span>-${Number(form.discount).toFixed(2)}</span>
                                        </div>

                                        {form.istax &&
                                            <div className="flex justify-between text-sm text-gray-600">
                                                <span>Tax</span>
                                                <span>
                                                    ${Number(form.tax).toFixed(2)}
                                                </span>
                                            </div>
                                        }


                                        <div className="my-2 border-t" />


                                        <div className={`flex justify-between text-lg font-bold text-gray-900 ${form.total < 0 && "text-red-600"}`}>
                                            <span>Total</span>
                                            <span>
                                                ${Number(form.total).toFixed(2)}
                                            </span>
                                        </div>

                                        {/* Payments */}
                                        {form.payments.map((item, index) => (
                                            <div key={index} className="flex justify-between text-sm text-gray-600">
                                                <span>{item.paymenttype}</span>
                                                <span>${Number(item.amount).toFixed(2)}</span>
                                            </div>
                                        ))}
                                        

                                        {tip > 0 && <div className="flex justify-between text-sm text-gray-600">
                                            <span>Tip</span>
                                            <span>${Number(tip).toFixed(2)}</span>
                                        </div>}

                                        <div className="my-2 border-t" />

                                        <div className={`flex justify-between text-lg font-bold text-gray-900 ${balance > 0 && "text-red-600"}`}>
                                            <span>Balance</span>
                                            <span>
                                                {balance > 0 && "-"} ${Number(balance).toFixed(2)}
                                            </span>
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>


                    </div>


                </>
            } />
        </div>
    );
};





