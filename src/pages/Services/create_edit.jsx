
import React, { useEffect, useRef, useState } from "react";
import { BriefcaseBusiness, Users, CalendarDays } from "lucide-react";
import { Steps, Modal } from "../../controls/index.jsx";
import { HeaderModal, FooterModal, IsLoading } from "../../common/index.jsx";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import FetchData from '../../hook/fetchData.js'
import { uploadToS3 } from "../../common/upload_toS3.jsx";
import { useAlert } from "../../controls/AlertProvider.jsx";
import { decryptId } from "../../common/general.jsx";
import ServiceInfo from "./service_info.jsx";

export const Services_Create_Edit = () => {
    const navigate = useNavigate();
    const { saveData, refresh, getCategory } = useOutletContext();
    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState([]);
    const [categoryList,setCategotyList]= useState([]);
    const { Id } = useParams();
    const id = decryptId(Id);
    const isEdit = !!id;
    const contentRef = useRef(null);

    const [form, setForm] = useState({
        id: null,
        cid: null,
        name: "",
        price: "",
        timing: "15 Minutes",
        status: "Active",
        description: "",
        minutes: 15,
        category1: "All Types",
        category2: 0,
        profilepic: null,
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
        setIsLoading(true);
        const Response = await getCategory();
        const category2Types = Response.filter((o) =>o.category === 'services')
        .map((o, index) => ({
            id: o.id ?? index + 1,
            label: o.name,
            value: o.id
        }));
        setCategotyList(category2Types);
        setIsLoading(false);
    }

    useEffect(() => {
        if (!isEdit) return;

        const getById = async (id) => {
            setIsLoading(true);

            try {
                const Response = await FetchData({
                    endPoint: 'services',
                    id: id
                });
                if (Response.status === 200) {
                    setForm(Response.data);
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
            Name: form.name.trim().toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "_"),
            Folder: 'services',
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
            label: "Services",
            endPoint: "services",
            id: isEdit ? id : null,
            body: { ...form, profilepic: dp }
        });
        if (res.isSuccess) {
            navigate(-1);
        }
    };

    const [step, setStep] = useState(1);
    const steps = [
        { id: 1, label: "Service Info", icon: BriefcaseBusiness, content: <ServiceInfo form={form} setForm={setForm} image={image} setImage={setImage} categoryList={categoryList} /> },
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

                if (!form.price.trim())
                    errors.push("Price is required.");

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
                    Title={isEdit ? 'Edit Services Detail' : `Create New Services`}
                    Description={`${isEdit ? 'Edit' : 'Add'} an services by entering their details.`}
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





