
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAlert } from "../../controls/AlertProvider.jsx";
import { FooterModal, Header, HeaderModal, IsLoading } from "../../common/index.jsx";
import BasicInfo from "../../pages/Setting/General/basic_info.jsx";
import { Clock, Info, Mail, Phone } from "lucide-react";
import { Steps } from "../../controls/steps.jsx";
import { Modal } from "../../controls/modal.jsx";
import BusinessHours from "../../pages/Setting/General/business_hours.jsx";
import { TextCredit } from "../../pages/Setting/Notification/text_credit.jsx";
import EmailInfo from "../../pages/Setting/Notification/email_info.jsx";
import AppointmentOptions from "../../pages/Setting/Options/appointment_options.jsx";
import LoyaltyOptions from "../../pages/Setting/Options/loyalty_option.jsx";
import Options from "./options.jsx";
import { CompanyCategories } from "./category.jsx";
import { getStorage } from "../../common/localStorage.js";
import { uploadToS3 } from "../../common/upload_toS3.jsx";

export const FirstTimeLogin = () => {
    const navigate = useNavigate();
       const { showAlert } = useAlert();
       const { refresh,saveData, getBilling, getLogs,getCompany, activeSettingTab, setActiveSettingTab } = useOutletContext();
       const [isLoading, setIsLoading] = useState(false);
       const contentRef = useRef(null);
           const [message, setMessage] = useState([]);
   
       const [form, setForm] = useState({
           id: 0,
           cid: 0,
   
           name: "",
           email: "",
           cell: "",
           addressinfo: [],
           timinginfo: [],
   
           pricing: "",
           plan: "",
           socialinfo: [],
           loyaltyinfo: [],
           password: "",
           bookingdays: 7,
           emailuser: "",
           emailpass: "",
           emailservice: "gmail",
           autoaccept: false,
           emailreminder: false,
           textreminder: false,
           credit: 0,
           logo: null,
   
           
           owner: "",
           ownercell: "",
           slot: 30,
           store: "",
           discount: 0,
           issetupcomplete: false,
           billinginfo: [],
           active: true,
           category: "",
           twilliocell: "",
   
           createdat: null,
           modifiedat: null,
       });
       const [image, setImage] = useState({
           isNew: false,
           profilepic: null,
           file: null,
           fileType: null,
       })
   
       useEffect(() => {
           Init();
       }, [refresh])
   
       const Init = async () => {
           try {
               setIsLoading(true);
   
               const Response = await getCompany();
               if (Response) {
                   setForm(Response);
                   setImage({
                       ...image,
                       profilepic: Response.logo
                   })
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
       }

    const handleProfilePic = async () => {
        const path = await uploadToS3({
            Name: "logo",
            Folder: 'company',
            File: image.file,
            FileType: image.fileType
        });

        if (Boolean(path.status))
            return path.message;
        else
            return '';
    }

    const handleSubmit = async () => {
        const dp = Boolean(image.isNew) ? await handleProfilePic() : form.logo;

        const localStorage = await getStorage();
        const res = await saveData({
            label: "Company",
            endPoint: "company",
            id: localStorage.cid,
            body: Boolean(image.isNew) ? { ...form, logo: dp,  issetupcomplete: true } : {...form,issetupcomplete: true}
        });
        if (res.isSuccess) {
            navigate("/Dashboard");
        }

    };



    const [step, setStep] = useState(1);
    const steps = [
        { id: 1, label: "Basic Information", icon: Info, content: <BasicInfo form={form} setForm={setForm} image={image} setImage={setImage} saveButton={false} /> },
        { id: 2, label: "Business Hours", icon: Clock, content: <BusinessHours form={form} setForm={setForm} saveButton={false} /> },
        { id: 3, label: "Category", icon: Mail, content: <CompanyCategories setForm={setForm} /> },
        { id: 4, label: "Options", icon: Phone, content: <Options form={form} setForm={setForm} /> },
        { id: 5, label: "Loyalty Program", icon: Phone, content: <LoyaltyOptions form={form} setForm={setForm} saveButton={false} /> },
    ];

    const currentContent = steps.find(item => item.id === step)?.content;

    useEffect(() => {
        contentRef.current?.scrollTo({
            top: 0,
            behavior: "smooth", // optional
        });
    }, [step]);

    return (
        <Modal open={true} message={message} messageType="error" children={
            <>
                <HeaderModal
                    Title={"Finish Setting Up Your Account"}
                    Description={"You’re almost ready! Complete the remaining steps to start managing your appointments."}
                    className="border-b border-gray-300"
                    onClick={() => navigate(-1)}
                />
                <IsLoading isLoading={isLoading} rows={10} input={
                    <>
                        <div className="px-8 py-2">
                         {/*  <Steps currentStep={step} steps={steps} />*/} 
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
                            onComplete={() => handleSubmit()}
                        />
                    </>
                } />
            </>
        } />
    );
};





