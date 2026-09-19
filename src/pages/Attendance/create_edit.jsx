
import React, { useEffect, useRef, useState } from "react";
import { BriefcaseBusiness, Users, CalendarDays } from "lucide-react";
import { Steps, Modal } from "../../controls/index.jsx";
import { HeaderModal, FooterModal, IsLoading } from "../../common/index.jsx";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import FetchData from '../../hook/fetchData.js';
import { useAlert } from "../../controls/AlertProvider.jsx";
import { decryptId } from "../../common/general.jsx";
import AttendanceInfo from "./attendance_info.jsx";

export const Attendance_Create_Edit = ({employeeId,Date}) => {
    const navigate = useNavigate();
    const { saveData,refresh, getUser } = useOutletContext();
    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState([]);
    const [userList, setUserList] = useState([]);
    const { Id } = useParams();
    const { state } = useLocation();
    const id = decryptId(Id);
    const isEdit = !!id;
    const contentRef = useRef(null);
   // const date = new Date();

    const attendanceStatus = [
        "Present",
        "Absent",
        "Late",
        "Half Day",
        "On Leave",
        "Holiday",
        "Weekend",
    ];

    const [form, setForm] = useState({
        id: null,
        cid: null,
        uid: state?.uid,
        trndate:state?.trndate,// date.toISOString().split("T")[0],

        isworking: state?.isworking,
        starttime:state?.start,
        endtime: state?.end,

        status: "Present",
        checkin: state?.start,
        checkout: state?.end,

        worktime: "0h 00m",
        minutes: 0,

        islate: false,
        latereason: "",

        isearly: false,
        earlyreason: "",

        leavereason: "",
        notes: "",

        createdat: "",
        modifiedat: "",  
    });

    useEffect(() => {
        Init();
    }, [refresh])

    const Init = async () => {
        setIsLoading(true);
        const Response = await getUser();
        setUserList(Response);
        setIsLoading(false);
    }

    useEffect(() => {
        if (!isEdit) return;

        const getById = async (id) => {
            setIsLoading(true);

            try {
                const Response = await FetchData({
                    endPoint: 'attendance',
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
            label: "Attendance",
            endPoint: "attendance",
            id: isEdit ? id : null,
            body: form
        });
        if (res.isSuccess) {
            navigate(-1);
        }
    };

    const [step, setStep] = useState(1);
    const steps = [
        { id: 1, label: "Attendance Info", icon: BriefcaseBusiness, content: <AttendanceInfo form={form} setForm={setForm} userList={userList} /> },
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

                if (form.uid === null)
                    errors.push("An employee must be selected before proceeding.");

                
                if (form.isworking && ((form.status === "Present" || form.status === "Half Day") && 
                    (form.checkin.trim() ==="" ||form.checkout.trim() ==="" )))
                errors.push("Both check-in and check-out times must be provided.");

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
                    Title={isEdit ? 'Edit Attendance Detail' : `Create New Attendance`}
                    Description={`${isEdit ? 'Edit' : 'Add'} employee attendance by managing work hours, check-ins, check-outs, leave status, and attendance records.`}
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





