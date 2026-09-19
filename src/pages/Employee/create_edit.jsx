
import React, { useEffect, useRef, useState } from "react";
import { BriefcaseBusiness, Users, CalendarDays } from "lucide-react";
import { Steps, Modal } from "../../controls/index.jsx";
import { HeaderModal, FooterModal, IsLoading } from "../../common/index.jsx";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import FetchData from '../../hook/fetchData.js'
import PersonalInfo from './personal_info.jsx';
import ScheduleInfo from './schedule_info.jsx';
import PermissionInfo from './permission_info.jsx';
import { uploadToS3 } from "../../common/upload_toS3.jsx";
import { useAlert } from "../../controls/AlertProvider.jsx";
import { decryptId } from "../../common/general.jsx";
import { LocalDate } from "../../common/localDate.js";

export const Employee_Create_Edit = () => {
    const navigate = useNavigate();
    const { saveData } = useOutletContext();
    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState([]);
    const { Id } = useParams();
    const id = decryptId(Id);
    const isEdit = !!id;
    const contentRef = useRef(null);
    const defaultTimingInfo = [{
        monday: ["09:00:00", "21:00:00", true, "14:00:00", "14:30:00"],
        tuesday: ["09:00:00", "21:00:00", true, "14:00:00", "14:30:00"],
        wednesday: ["09:00:00", "21:00:00", true, "14:00:00", "14:30:00"],
        thursday: ["09:00:00", "21:00:00", true, "14:00:00", "14:30:00"],
        friday: ["09:00:00", "21:00:00", true, "14:00:00", "14:30:00"],
        saturday: ["09:00:00", "21:00:00", true, "14:00:00", "14:30:00"],
        sunday: ["09:00:00", "21:00:00", true, "14:00:00", "14:30:00"],
    }];
    const defaultPermissionInfo = [
        "Appointment.Open", "Appointment.Create", "Appointment.Edit", "Appointment.View",
        "Calender.Open", "Calender.Create", "Calender.Edit", "Calender.View",
    ]
    const [form, setForm] = useState({
        id: null,
        cid: null,
        username: "",
        password: "",
        role: "Employee",
        status: "Active",
        createdat: null,
        modifiedat: null,
        email: "",
        cell: "",
        rating: "4.5",
        fullname: "",
        accounttype: "",
        gender: "Male",
        address: "",
        bio:"",
        joining:LocalDate(),
        appschedule: true,
        timinginfo: defaultTimingInfo,
        permissioninfo: defaultPermissionInfo,
        profilepic: null,
    });

    const [image, setImage] = useState({
        isNew: false,
        profilepic: null,
        file: null,
        fileType: null,
    })

    useEffect(() => {
        if (!isEdit) return;

        const getById = async (id) => {
            setIsLoading(true);

            try {
                const Response = await FetchData({
                    endPoint: 'user',
                    id: id
                });
                if (Response.status === 200) {
                    setForm({
                        ...Response.data,
                        timinginfo: Response.data.timinginfo ?? defaultTimingInfo,
                        permissioninfo: Response.data.permissioninfo ?? defaultPermissionInfo

                    });
                    setImage({
                        ...image,
                        profilepic: Response.data.profilepic
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
        };

        getById(id);
    }, [id, isEdit]);



    const handleProfilePic = async () => {
        const path = await uploadToS3({
            Name: form.cell.replace(/\D/g, ""),
            Folder: 'user',
            File: image.file,
            FileType: image.fileType
        });

        if (Boolean(path.status))
            return path.message;
        else
            return '';
    }

    const handleSubmit = async () => {
        {/* Upload image */ }
        const dp = Boolean(image.isNew) ? await handleProfilePic() : form.profilepic;

        {/* Save data*/ }
        const res = await saveData({
            label: "Users",
            endPoint: "user",
            id: isEdit ? id : null,
            body: { ...form, profilepic: dp }
        });
        if (res.isSuccess) {
            navigate(-1);
        }
    };

    const [step, setStep] = useState(1);
    const steps = [
        { id: 1, label: "Personal Info", icon: BriefcaseBusiness, content: <PersonalInfo form={form} setForm={setForm} image={image} setImage={setImage} /> },
        { id: 2, label: "Schedule", icon: Users, content: <ScheduleInfo form={form} setForm={setForm} /> },
        { id: 3, label: "Permission", icon: CalendarDays, content: <PermissionInfo form={form} setForm={setForm} /> },
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

                if (!form.fullname.trim())
                    errors.push("Full Name is required.");

                if (!form.cell.trim())
                    errors.push("Cell Number is required.");

                if (form.cell && form.cell.length !== 12)
                    errors.push("Cell Number must be in the format 123-456-7890.");

                if (!form.password.trim())
                    errors.push("Password is required.");

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
                    Title={isEdit ? 'Edit Employee Detail' : `Create New Employee`}
                    Description={`${isEdit ? 'Edit' : 'Add'} an employee by entering their personal details, schedule, and permissions.`}
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
                            onComplete={() => handleSubmit()}
                        />
                    </>
                } />
            </>
        } />
    );
};





