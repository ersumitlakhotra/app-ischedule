
import React, { useEffect, useRef, useState } from "react";
import { BriefcaseBusiness, Users, CalendarDays } from "lucide-react";
import { Steps, Modal } from "../../controls/index.jsx";
import { HeaderModal, FooterModal, IsLoading } from "../../common/index.jsx";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import FetchData from '../../hook/fetchData.js'
import { uploadToS3 } from "../../common/upload_toS3.jsx";
import { useAlert } from "../../controls/AlertProvider.jsx";
import { decryptId, updateField } from "../../common/general.jsx";
import DetailInfo from "./detail_info.jsx";
import { LocalDate } from "../../common/localDate.js";
import { getStorage } from "../../common/localStorage.js";

export const GiftCard_Create_Edit = () => {
    const navigate = useNavigate();
    const { saveData} = useOutletContext();
    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState([]);
    const { Id, Custid } = useParams();
    const id = decryptId(Id);
    const custid = decryptId(Custid);
    const isEdit = !!id;
    const contentRef = useRef(null);
   

    const generateGiftCode = () => {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O, 0, I, 1

        const randomPart = (length) =>
            Array.from({ length }, () =>
                chars[Math.floor(Math.random() * chars.length)]
            ).join("");

        return `GFT-${randomPart(4)}-${randomPart(4)}`;
    };

    const [form, setForm] = useState({
        id: null,
        cid: null,
        giftcard:[],    
        modifiedat: null,  
    });   
    
    const [formGiftcard, setFormGiftcard] = useState({
        id: generateGiftCode(),
        name:'',
        cardtype:"Basic",
        amount:'0',
        used:'0',
        balance:'0',
        startdate:LocalDate(),
        enddate:LocalDate(),   
        uid:"",
        createdat:null,
        modifiedat: null,  
    });

    useEffect(() => {
        
        const getById = async (id) => {
            setIsLoading(true);

            const localStorage = await getStorage();
            try {
                const Response = await FetchData({
                    endPoint: 'customers',
                    id: custid
                });
                if (Response.status === 200) {
                    setForm({
                        id: custid,
                        cid: Response.data.cid,
                        giftcard: Response.data.giftcard || [],
                        modifiedat: Response.data.modifiedat
                    });
                    { isEdit ? 
                        setFormGiftcard(Response.data.giftcard.find((item) => item.id.toString() === id.toString())) :
                        updateField("uid",localStorage.uid,setFormGiftcard) ;
                    };
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

 const updateGiftcard = () => {
    const updatedForm = {
        ...form,
        giftcard: isEdit
            ? [
                ...form.giftcard.filter((g) => g.id !== formGiftcard.id),
                formGiftcard,
            ]
            : [...form.giftcard, formGiftcard],
    };

    setForm(updatedForm);
    return updatedForm;
};

    const handleSubmit = async () => {
        {/* Save data*/ }
        const res = await saveData({
            label: "Customers",
            endPoint: "customers",
            id: custid,
            body: updateGiftcard()
        });
        if (res.isSuccess) {
            navigate(-1);
        }
    };

    const [step, setStep] = useState(1);
    const steps = [
        { id: 1, label: "Detail Info", icon: BriefcaseBusiness, content: <DetailInfo form={formGiftcard} setForm={setFormGiftcard} /> },
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

                if (!formGiftcard.name.trim())
                    errors.push("Title is required.");

                if (Number(formGiftcard.amount) < 1)
                    errors.push("Amount is required.");


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
                    Title={isEdit ? 'Edit Gift Card Detail' : `Create New Gift Card`}
                    Description={`${isEdit ? 'Update' : 'Create'} a gift card by setting its value, validity period, and other details.`}
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





