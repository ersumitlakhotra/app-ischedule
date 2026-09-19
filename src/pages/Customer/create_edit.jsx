
import  { useEffect, useRef, useState } from "react";
import { BriefcaseBusiness } from "lucide-react";
import {  Modal } from "../../controls/index.jsx";
import { HeaderModal, FooterModal, IsLoading } from "../../common/index.jsx";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import FetchData from '../../hook/fetchData.js'
import { useAlert } from "../../controls/AlertProvider.jsx";
import { decryptId } from "../../common/general.jsx";
import CustomerInfo from "./customer_info.jsx";

export const Customer_Create_Edit = () => {
    const navigate = useNavigate();
    const { saveData} = useOutletContext();
    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState([]);
    const { Id } = useParams();
    const id = decryptId(Id);
    const isEdit = !!id;
    const contentRef = useRef(null);

    const [form, setForm] = useState({
        id: null,
        cid: null,
        name: "",
        email: "",
        cell: "",   
        badge: "",
        appointments: "0",
        points: "0",    
        giftcard:[],
        createdat: null,
        modifiedat: null,  
    });

    useEffect(() => {
        if (!isEdit) return;

        const getById = async (id) => {
            setIsLoading(true);

            try {
                const Response = await FetchData({
                    endPoint: 'customers',
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
    }, [id, isEdit]);

    const handleSubmit = async () => {
        {/* Save data*/ }
        const res = await saveData({
            label: "Customers",
            endPoint: "customers",
            id: isEdit ? id : null,
            body:form
        });
        if (res.isSuccess) {
            navigate(-1);
        }
    };

    const [step, setStep] = useState(1);
    const steps = [
        { id: 1, label: "Customer Info", icon: BriefcaseBusiness, content: <CustomerInfo form={form} setForm={setForm} /> },
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
                    errors.push("Full Name is required.");

               if (!form.cell.trim())
                    errors.push("Cell Number is required.");

                if (form.cell && form.cell.length !== 12)
                    errors.push("Cell Number must be in the format 123-456-7890.");

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
                    Title={isEdit ? 'Edit Customer Detail' : `Create New Customer`}
                    Description={`${isEdit ? 'Edit' : 'Add'} an customer by entering their details.`}
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





