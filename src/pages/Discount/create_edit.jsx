
import React, { useEffect, useRef, useState } from "react";
import { BriefcaseBusiness, Users, CalendarDays } from "lucide-react";
import { Steps, Modal } from "../../controls/index.jsx";
import { HeaderModal, FooterModal, IsLoading } from "../../common/index.jsx";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import FetchData from '../../hook/fetchData.js'
import { useAlert } from "../../controls/AlertProvider.jsx";
import { decryptId } from "../../common/general.jsx";
import DiscountInfo from "./discount_info.jsx";
import { get_Date, LocalDate } from "../../common/localDate.js";

export const Discount_Create_Edit = () => {
    const navigate = useNavigate();
    const { saveData,refresh, getService } = useOutletContext();
    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState([]);
    const { Id } = useParams();
    const id = decryptId(Id);
    const isEdit = !!id;
    const contentRef = useRef(null);
   const date = LocalDate();
const [servicesList, setServicesList] = useState([]);
   
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
        setServicesList(Response);
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
                    setForm({...Response.data,
                        startdate:get_Date(Response.data.startdate,'YYYY-MM-DD'),
                        enddate:get_Date(Response.data.enddate,'YYYY-MM-DD')
                });
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



    const handleSubmit = async () => {
        {/* Save data*/ }
        const res = await saveData({
            label: "Discount",
            endPoint: "discount",
            id: isEdit ? id : null,
            body: form
        });
        if (res.isSuccess) {
            navigate(-1);
        }
    };

    const [step, setStep] = useState(1);
    const steps = [
        { id: 1, label: "Personal Info", icon: BriefcaseBusiness, content: <DiscountInfo  form={form} setForm={setForm} servicesList={servicesList}/> },
       // { id: 2, label: "Schedule", icon: Users, content: <ScheduleInfo form={form} setForm={setForm} /> },
       // { id: 3, label: "Permission", icon: CalendarDays, content: <PermissionInfo form={form} setForm={setForm} /> },
        //  { id: 4, label: "Complete", icon: CircleCheckBig, content: <Complete Title="Work Order Published" Description="Your work order is now available and ready for workers." /> }
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

                if (!form.name.trim())
                    errors.push("Title is required.");

                if (!form.discount.trim())
                    errors.push("Discount is required.");

                if (form.discount ===0)
                    errors.push("The discount amount must be greater than zero before saving.");          

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
                    Title={isEdit ? 'Edit Discount Detail' : `Create New Discount`}
                    Description={`${isEdit ? "Edit" : "Create"} a discount by defining the offer details, eligibility, validity period, and discount value.`}
                    className="border-b border-gray-200"
                    onClick={() => navigate(-1)}
                />
                <IsLoading isLoading={isLoading} rows={10} input={
                    <>                   
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





