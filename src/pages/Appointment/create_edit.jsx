
import React, { useEffect, useMemo, useRef, useState } from "react";
import { BriefcaseBusiness, Users, CalendarDays, Receipt, NotepadText, Contact } from "lucide-react";
import { Steps, Modal } from "../../controls/index.jsx";
import { HeaderModal, FooterModal, IsLoading } from "../../common/index.jsx";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import FetchData from '../../hook/fetchData.js'
import { useAlert } from "../../controls/AlertProvider.jsx";
import { decryptId, getTimingInfo, updateField } from "../../common/general.jsx";
import ServicesInfo from "./services_info.jsx";
import { generateTimeSlotsWithDate } from "../../common/generateTimeSlots.js";
import InvoiceInfo from "./invoice_info.jsx";
import OtherInfo from "./other_info.jsx";
import CustomerInfo from "./customer_info.jsx";
import { get_Date, LocalDate } from "../../common/localDate.js";
import { APPOINTMENT_STATUS_OPTIONS, EMAIL_STATUS } from "../../common/enum.jsx";

export const Appointment_Create_Edit = () => {
    const navigate = useNavigate();
    const initialEditRef = useRef(null);
    const { saveData, refresh, getAppointment, getCompany, getCustomer, getDiscount, getService, getUser, getAttendance, getInventory } = useOutletContext();
    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(null);

    const [appointmentList, setAppointmentList] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [attendanceList, setAttendanceList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [servicesList, setServicesList] = useState([]);
    const [inventoryList, setInventoryList] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [couponList, setCouponList] = useState([]);
    const [message, setMessage] = useState([]);

    const [appointments, setAppointments] = useState([]);
    const [workingHours, setWorkingHours] = useState({
        open: null,
        startTime: "09:00",
        endTime: "21:00",
    });
    const requestId = useRef(0);

    const [morningSlot, setMorningSlot] = useState([]);
    const [afternoonSlot, setAfternoonSlot] = useState([]);
    const [eveningSlot, setEveningSlot] = useState([]);
    const options = [
        { key: 1, label: 'Morning', slotList: morningSlot },
        { key: 2, label: 'Afternoon', slotList: afternoonSlot },
        { key: 3, label: 'Evening', slotList: eveningSlot },
    ];

    const { Id } = useParams();
    const id = decryptId(Id);
    const isEdit = !!id;
    const contentRef = useRef(null);

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


        custid: 0,
        name: "",
        cell: "",
        email: "",
        reason: "",
        notes: "",
        additionalnotes: "",

        payments: [],
        logs: [],
        paymentstatus: 'Unpaid',

        referral: 0,
        isnewcustomer: false,
        points: 0,
        referralpoints:0,
        punchpoints:0,
        badgepoints:0,
        pointsused:0,
        createdat: null,
        modifiedat: null,
    });
    const [prevForm, setPrevForm] = useState({
        products: [],
    }); 
    const [prevSlot, setPrevSlot] = useState({
        trndate: date,
        slot: "",
    });

    useEffect(() => {
        Init();
    }, [refresh])

    const Init = async () => {
        setIsLoading(true);

        const [
            AppointmentResponse,
            ServiceResponse,
            UserResponse,
            CompanyResponse,
            CustomerResponse,
            InventoryResponse,
            CouponResponse
        ] = await Promise.all([
            getAppointment(),
            getService(),
            getUser(),
            getCompany(),
            getCustomer(),
            getInventory(),
            getDiscount()
        ]);

        setAppointmentList(AppointmentResponse);
        setUserList(UserResponse);
        setServicesList(ServiceResponse);
        setCompanyList(CompanyResponse);
        setCustomerList(CustomerResponse);
        setInventoryList(InventoryResponse);
        setCouponList(CouponResponse);
        setIsLoading(false);
    };

    const totalMinutes = useMemo(() => {
        return form.services.reduce(
            (sum, service) => sum + (Number(service.minutes) || 0),
            0
        );
    }, [form.services]);

    useEffect(() => {
        if (!form.trndate || !form.uid) return;

        fetchSchedule();
    }, [form.trndate, form.uid]);

    const fetchSchedule = async () => {
        const currentRequest = ++requestId.current;

        setIsLoading(true);

        try {
            // Business hours
            const business = getTimingInfo(companyList.timinginfo, form.trndate);
            setIsOpen(business ? business.open : null);

            // Fetch attendance + appointments together
            const [attendanceResponse] = await Promise.all([getAttendance(form.trndate, form.trndate)]);

            // Ignore if another request started
            if (currentRequest !== requestId.current) return;

            const attendance = attendanceResponse.find(
                (o) => o.uid === form.uid
            );

            let open = business?.open ?? null;
            let startTime = business?.starttime ?? "09:00";
            let endTime = business?.endtime ?? "21:00";

            if (attendance) {
                open = attendance.isworking;
                startTime = attendance.starttime > business?.starttime ? attendance.starttime : business?.starttime;
                endTime = attendance.endtime < business?.endtime ? attendance.endtime : business?.endtime;
            } else {
                const user = userList.find((o) => o.id === form.uid);

                if (user) {
                    const employee = getTimingInfo(user.timinginfo, form.trndate);

                    if (employee) {
                        open = employee.open;
                        startTime = employee.starttime > business?.starttime ? employee.starttime : business?.starttime;
                        endTime = employee.endtime < business?.endtime ? employee.endtime : business?.endtime;
                    }
                }
            }

            setWorkingHours({
                open,
                startTime,
                endTime,
            });

            const appointmentResponse = appointmentList.filter(
                (o) =>
                    Number(o.uid) === Number(form.uid) &&
                    (o.status === "Pending" || o.status === "Completed") &&
                    get_Date(o.trndate, 'YYYY-MM-DD') === get_Date(form.trndate, 'YYYY-MM-DD') &&
                    (!isEdit || o.id !== id)
            );
            setAppointments(appointmentResponse ?? []);
        } catch (err) {
            // console.error(err);
        } finally {
            if (currentRequest === requestId.current) {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        if (!form.trndate) return;


        const slots = generateTimeSlotsWithDate(
            form.trndate,
            workingHours.startTime,
            workingHours.endTime,
            totalMinutes || 30,
            appointments,
            form.uid
        );

        setMorningSlot(slots.filter((o) => o.category === "Morning"));
        setAfternoonSlot(slots.filter((o) => o.category === "Afternoon"));
        setEveningSlot(slots.filter((o) => o.category === "Evening"));

        const isSameEditSlot =
            isEdit &&
            initialEditRef.current &&
            initialEditRef.current.trndate === form.trndate &&
            initialEditRef.current.uid === form.uid;

        // Clear only when user changes date/user/service
        if (!isSameEditSlot) {
            updateField("slot", "", setForm);
        }
    }, [
        appointments,
        workingHours,
        totalMinutes,
        form.trndate,
        form.uid,
    ]);

    useEffect(() => {
        if (!isEdit || !id) return;

        const getById = async (id) => {
            try {
                const Response = await FetchData({
                    endPoint: 'appointment',
                    id: id
                });
                if (Response.status === 200) {
                    setForm({
                        ...Response.data,
                        trndate: get_Date(Response.data.trndate, 'YYYY-MM-DD'),
                    });
                    setPrevForm({
                        products: Response.data.products,
                        coupon: Response.data.coupon,
                        isdiscount: Response.data.isdiscount,
                        discounttype: Response.data.discounttype,
                        discount: Response.data.discount,
                        custid: Response.data.custid

                    })
                    setPrevSlot({
                         trndate: get_Date(Response.data.trndate, 'YYYY-MM-DD'),
                         slot:Response.data.slot
                    })
                    if (!initialEditRef.current) {
                        initialEditRef.current = {
                            trndate: get_Date(Response.data.trndate, 'YYYY-MM-DD'),
                            uid: Response.data.uid
                        };
                    }
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
            }
        };

        const loadEdit = async () => {
            setIsLoading(true);
            await Init();
            await getById(id);
            setIsLoading(false);
        };

        loadEdit();
    }, [id, isEdit]);

    const handleProductChanges = async (res) => {
        const appointment_id = res.data.id || "0";
        const order_no = res.data.order_no || "0";

        const deleted = prevForm.products.filter(
            prev => !form.products.some(curr => curr.id === prev.id)
        ).map(item => ({
            ...item,
            stock: Number(inventoryList.find((o) => o.id === item.id.toString())?.stock) + Number(item.unit)
        }));

        const created = form.products.filter(
            curr => !prevForm.products.some(prev => prev.id === curr.id)
        ).map(item => ({
            ...item,
            stock: Number(inventoryList.find((o) => o.id === item.id.toString())?.stock) - Number(item.unit)
        }));

        const modified = form.products.filter(curr => {
            const prev = prevForm.products.find(p => p.id === curr.id);
            return prev && JSON.stringify(prev) !== JSON.stringify(curr);
        }).map(item => ({
            ...item,
            stock: Number(inventoryList.find((o) => o.id === item.id.toString())?.stock) + Number(prevForm.products.find(p => p.id === item.id).unit) - Number(item.unit)
        }));

        const unchanged = form.products
            .filter(curr => {
                const prev = prevForm.products.find(p => p.id === curr.id);
                return prev && JSON.stringify(prev) === JSON.stringify(curr);
            })
            .map(item => ({
                ...item,
                stock: Number(inventoryList.find(o => o.id === item.id.toString())?.stock)
            }));

        const deletedProducts = await Promise.all(
            deleted.map(async (c) => {
                const res = await handleProductSubmit({
                    c,
                    appointment_id,
                    order_no,
                    isNew: false,
                    method: 'DELETE'
                });

                return res.isSuccess
                    ? { ...c, itemid: res.itemid }
                    : null;
            })
        );

        const modifiedProducts = await Promise.all(
            modified.map(async (c) => {
                const res = await handleProductSubmit({
                    c,
                    appointment_id,
                    order_no,
                    isNew: false
                });

                return res.isSuccess
                    ? { ...c, itemid: res.itemid }
                    : null;
            })
        );

        const createdProducts = await Promise.all(
            created.map(async (c) => {
                const res = await handleProductSubmit({
                    c,
                    appointment_id,
                    order_no,
                    isNew: true
                });

                return res.isSuccess
                    ? { ...c, itemid: res.itemid }
                    : null;
            })
        );

        const products = [
            ...unchanged,
            ...modifiedProducts.filter(Boolean),
            ...createdProducts.filter(Boolean),
        ];

        await saveData({
            label: "Appointment",
            endPoint: "appointment",
            id: appointment_id,
            body: JSON.stringify({
                id: null,
                cid: null,
                products: products,
                createdat: null,
                modifiedat: null,
            }),
            notify: false

        });
    }

    const handleProductSubmit = async ({
        c,
        appointment_id,
        order_no,
        isNew,
        method = "POST"
    }) => {
        const subTotal = (Number(c.sellprice) || 0);
        const tax = (subTotal * Number(form.taxpercentage)) / 100;
        const total = subTotal + tax;
        {/* Save data*/ }
        const inventoryResponse = await saveData({
            label: "Inventory",
            endPoint: "inventory",
            id: c.id,
            body: { stock: c.stock },
            notify: false
        });

        const itemResponse = await saveData({
            label: "InventoryDetail",
            endPoint: "inventorydetail",
            method: method,
            id: isNew ? null : Number(c.itemid),
            body: JSON.stringify({
                id: null,
                cid: null,
                invid: c.id,
                appid: appointment_id,
                order_no: order_no,
                unit: c.unit,
                subtotal: c.sellprice,
                tax: Number(tax).toFixed(2),
                total: Number(total).toFixed(2),
                costprice: c.price,
                transaction: "Sell",
                trndate: date,
                modifiedat: null,
                ...(isNew && { createdat: null }),
            }),
            notify: false
        });
        return {
            isSuccess: itemResponse.isSuccess,
            itemid: itemResponse.data.id
        }
    };
    const updateGiftCardBalance = (giftCards, id, amount, type) => {
        return giftCards.map((g) =>
            g.id.toString() === id.toString()
                ? {
                    ...g,
                    balance:
                        type === "credit"
                            ? Number(g.balance) + Number(amount)
                            : Number(g.balance) - Number(amount),

                    used:
                        type === "credit"
                            ? Number(g.used) - Number(amount)
                            : Number(g.used) + Number(amount),
                }
                : g
        );
    };
    const handleCustomerSubmit = async () => {
        const selected = customerList.find((item) => item.cell === form.cell);
        let isnew = !selected;
        let custid = selected?.id || 0;
        if (!selected) {
            const res = await saveData({
                label: "Customers",
                endPoint: "customers",
                id: null,
                body: JSON.stringify({
                    name: form.name,
                    cell: form.cell,
                    email: form.email
                }),
                notify: false
            });

            if (res.isSuccess)
                custid = res.data.id;
        }

        // Customer changed?
        if (prevForm.custid !== custid) {
            // Restore previous customer's gift card
            if (prevForm.discounttype === "giftcard" ) {
                const previousCustomer = customerList.find(
                    (item) => item.id === prevForm.custid
                );

                if (previousCustomer) {
                    const restoredCards = updateGiftCardBalance(
                        [...(previousCustomer.giftcard || [])],
                        prevForm.coupon,
                        prevForm.discount,
                        "credit"
                    );

                    await saveData({
                        label: "Customers",
                        endPoint: "customers",
                        id: previousCustomer.id,
                        body: JSON.stringify({
                            giftcard: restoredCards,
                        }),
                        notify: false,
                    });
                }
            }

            // Apply to new customer
            let updatedGiftCards = [...(selected.giftcard || [])];

            if (form.discounttype === "giftcard") {
                updatedGiftCards = updateGiftCardBalance(
                    updatedGiftCards,
                    form.coupon,
                    form.discount,
                    "debit"
                );
            }

            await saveData({
                label: "Customers",
                endPoint: "customers",
                id: custid,
                body: JSON.stringify({
                    giftcard: updatedGiftCards,
                }),
                notify: false,
            });
        } else {
            // Same customer - existing logic
            let updatedGiftCards = [...(selected.giftcard || [])];

            if (
                prevForm.discounttype === "giftcard"
            ) {
                updatedGiftCards = updateGiftCardBalance(
                    updatedGiftCards,
                    prevForm.coupon,
                    prevForm.discount,
                    "credit"
                );
            }

            if (
                form.discounttype === "giftcard" 
            ) {
                updatedGiftCards = updateGiftCardBalance(
                    updatedGiftCards,
                    form.coupon,
                    form.discount,
                    "debit"
                );
            }

            await saveData({
                label: "Customers",
                endPoint: "customers",
                id: custid,
                body: JSON.stringify({
                    giftcard: updatedGiftCards,
                }),
                notify: false,
            });
        }

        return { custid, isnew };
    }

    const handleEmail = async (res) => {

        if (!Boolean(companyList?.emailreminder))
            return;

        const appointment_id = res.data.id || "0";
        const order_no = res.data.order_no || "0";
        const toEmail = res.data.email || "";

        const isRescheduled =
            get_Date(prevSlot?.trndate,"YYYY-MM-DD") !==   get_Date(form?.trndate,"YYYY-MM-DD") ||
            prevSlot?.slot !== form?.slot;

        const emailType = !isEdit
            ? form.status === "Cancelled"
                ? EMAIL_STATUS.CANCELLED
                : form.status === "Rejected"
                    ? EMAIL_STATUS.REJECTED
                    : form.status === "Pending"
                        ? EMAIL_STATUS.CONFIRMED
                        : ""
            : form.status === "Cancelled"
                ? EMAIL_STATUS.CANCELLED
                : form.status === "Rejected"
                    ? EMAIL_STATUS.REJECTED
                    : form.status === "Pending" && isRescheduled
                        ? EMAIL_STATUS.RESCHEDULED
                        : "";

        const emailRes = await FetchData({
            method: "POST",
            endPoint: 'appointment-mail',
            id: null,
            body: JSON.stringify({
                id: appointment_id,
                status: emailType
            })
        });

        if (emailRes?.status === 200 && (emailRes?.data?.accepted || []).length > 0) {
          await saveData({
                label: "Logs",
                endPoint: "logs",
                id: null,
                body: {
                    id: null,
                    cid: null,
                    type: "Email",
                    order_no: order_no,
                    sendfrom: companyList?.emailuser || "",
                    sendto: toEmail,
                    message: `${emailType} E-Mail have been sent successfully.`,
                    status: "Delivered",
                    oid: appointment_id,
                    createdat: null,
                    modifiedat:null
                },
                notify: false,
            });
        }
    }

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            const customer = await handleCustomerSubmit();

            const res = await saveData({
                label: "Appointment",
                endPoint: "appointment",
                id: isEdit ? id : null,
                body: {
                    ...form,
                    custid: customer.custid,
                    ...(!isEdit && { isnewcustomer: customer.isnew })
                }
            });

            await handleProductChanges(res);
            await handleEmail(res);

            if (res.isSuccess) {
                navigate(-1);
            }
        } catch (error) {
             showAlert({
                    type: "error",
                    message: `Error saving appointment: ${error}`,
                    duration: 5000,
                });
        } finally {
            setIsLoading(false);
        }
    };

    const [step, setStep] = useState(1);
    const steps = [
        { id: 1, label: "Services & Professional", icon: BriefcaseBusiness, content: <ServicesInfo form={form} setForm={setForm} servicesList={servicesList} userList={userList} options={options} isOpen={isOpen} workingHours={workingHours} /> },
        { id: 2, label: "Customer", icon: Contact, content: <CustomerInfo form={form} setForm={setForm} customerList={customerList} /> },
        { id: 3, label: "Other Information", icon: NotepadText, content: <OtherInfo form={form} setForm={setForm} /> },
        { id: 4, label: "Invoice", icon: Receipt, content: <InvoiceInfo form={form} setForm={setForm} prevForm={prevForm} isEdit={isEdit} companyList={companyList} customerList={customerList} appointmentList={appointmentList} inventoryList={inventoryList} couponList={couponList} /> },
    ];

    const currentContent = steps.find(item => item.id === step)?.content;

    useEffect(() => {
        contentRef.current?.scrollTo({
            top: 0,
            behavior: "smooth", // optional
        });
    }, [step]);

    const Validate = () => {
        switch (step) {
            case 1: {
                const errors = [];

                if (isOpen === false)
                    errors.push("The business is closed on the selected date. Please choose another date.");

                if (form.uid === 0)
                    errors.push("Please select employee.");

                if (workingHours.open === false)
                    errors.push("The selected employee is not available on the chosen date. Please select another employee.");

                if (form.services.length === 0)
                    errors.push("Please select at least one service to view available appointment slots.");

                if (form.slot === "")
                    errors.push("Please select an available appointment time.");

                setMessage(errors);
                return errors.length === 0;
            }
            case 2: {
                const errors = [];

                if (!form.name.trim())
                    errors.push("Full Name is required.");

                if (!form.cell.trim())
                    errors.push("Cell Number is required.");

                if (form.cell && form.cell.length !== 12)
                    errors.push("Cell Number must be in the format 123-456-7890.");

                setMessage(errors);
                return errors.length === 0;
            }
            case 4: {
                const errors = [];

                if (form.payments.length > 0)
                    errors.push("This appointment cannot be modified while a payment is applied. Please remove the payment first.");

                setMessage(errors);
                return errors.length === 0;
            }
            default:
                return true;
        }
    };



    return (
        <Modal open={true} message={message} messageType="error" children={
            <>
                <HeaderModal
                    Title={isEdit ? 'Edit Appointment Detail : ' + form.order_no : `Create New Appointment`}
                    Description={`${isEdit ? "Edit" : "Add"} an appointment with customer information, service details, and scheduling preferences.`}
                    onClick={() => navigate(-1)}
                />
                <IsLoading isLoading={isLoading} rows={10} input={
                    <>
                        <div className="px-8 py-2">
                            <Steps currentStep={step} steps={steps} />
                        </div>

                        {/* Scrollable Content */}
                        <div ref={contentRef} className="flex-1 overflow-y-auto px-8 py-4">
                            <div className="space-y-6 px-8 ">
                                {currentContent}
                            </div>
                        </div>

                        <FooterModal
                            step={step}
                            totalSteps={steps.length}
                            onNext={() => {
                                if (Validate())
                                    setStep((prev) => prev + 1);
                            }}
                            onPrevious={() => {
                                setStep((prev) => prev - 1);
                            }}
                            onSkip={() => {
                                setStep((prev) => prev + 1);
                            }}
                            //showSkip={step === 2}
                            completeLabel="Save"
                            onComplete={() => Validate() && handleSubmit()}
                        />
                    </>
                } />
            </>
        } />
    );
};





