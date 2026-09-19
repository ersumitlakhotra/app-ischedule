
import React, { useEffect, useRef, useState } from "react";
import { BriefcaseBusiness, Users, CalendarDays } from "lucide-react";
import { Steps, Modal } from "../../controls/index.jsx";
import { HeaderModal, FooterModal, IsLoading } from "../../common/index.jsx";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import FetchData from '../../hook/fetchData.js'
import { useAlert } from "../../controls/AlertProvider.jsx";
import { decryptId } from "../../common/general.jsx";
import CategoryInfo from './category_info.jsx'

export const Category_Create_Edit = ({onClose,category,createOnly=false}) => {
    const navigate = useNavigate();
    const header='Category'
    const { saveData, refresh, getCategory } = useOutletContext();
    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState([]);
    const { Id } = useParams();
    const id = createOnly ? null :decryptId(Id);
    const isEdit = !!id;
    const contentRef = useRef(null);
    const [categoryList,setCategotyList]= useState([]);

    useEffect(() => {
        Init();
    }, [refresh])

    const Init = async () => {
        setIsLoading(true);
        const Response = await getCategory();
        setCategotyList(Response);
        setIsLoading(false);
    }
    const [form, setForm] = useState({
        id: null,
        cid: null,
        name: "",
        category: category || '',
        createdat: null,
        modifiedat: null,  
    });

    useEffect(() => {
        if (!isEdit) return;

        const getById = async (id) => {
            setIsLoading(true);

            try {
                const Response = await FetchData({
                    endPoint: 'category',
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
                      handleClose();
                }
                // set state here
            } catch (error) {
                showAlert({
                    type: "error",
                    message: error,
                    duration: 5000,
                });
                 handleClose();
            } finally {
                setIsLoading(false);
            }
        };

        getById(id);
    }, [id, isEdit]);

    const handleSubmit = async () => {
        {/* Save data*/ }
        const res = await saveData({
            label: header,
            endPoint: "category",
            id: isEdit ? id : null,
            body: form
        });
        if (res.isSuccess) {
            handleClose();
        }
    };
    const handleClose = () => {
        if (onClose) onClose();
        else navigate(-1);
    };
    const [step, setStep] = useState(1);
    const steps = [
        { id: 1, label: "Category Info", icon: BriefcaseBusiness, content: <CategoryInfo form={form} setForm={setForm} /> },
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
                    errors.push("Name is required.");

                const isDuplicate = categoryList.some(
                    (o) =>
                        o.name.trim().toLowerCase() === form.name.trim().toLowerCase() &&
                        o.category === category
                );

                if (isDuplicate) 
                    errors.push("Category name already exists.");

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
                    Title={isEdit ? `Edit ${header} Detail` : `Create New ${header}`}
                    Description={`${isEdit ? 'Edit' : 'Add'} an ${header.toLowerCase()} by entering their details.`}
                    className="border-b border-gray-200"
                    onClick={handleClose}
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





