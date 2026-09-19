
import React, { useEffect, useRef, useState } from "react";
import { BriefcaseBusiness, Users, CalendarDays, Warehouse } from "lucide-react";
import { Steps, Modal } from "../../../controls/index.jsx";
import { HeaderModal, FooterModal, IsLoading } from "../../../common/index.jsx";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import FetchData from '../../../hook/fetchData.js'
import { decryptId } from "../../../common/general.jsx";
import ItemInfo from "./item_info.jsx";
import { useAlert } from "../../../controls/AlertProvider.jsx";
import { get_Date, LocalDate } from "../../../common/localDate.js";

export const Inventory_Detail_Create_Edit = () => {
    const navigate = useNavigate();
    const { saveData, refresh, getInventoryDetail ,getInventory} = useOutletContext();
    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState([]);
    const { Id,Pid } = useParams();
    const id = decryptId(Id);
    const pid = decryptId(Pid);
    const isEdit = !!id;
    const contentRef = useRef(null);
    const date = LocalDate();

    const [form, setForm] = useState({
        id: null,
        cid: null,
        invid: pid,
        appid: null,
        order_no: null,
        unit: "1",
        subtotal: "0",
        tax: "0",
        total:"0.00",
        costprice:"0",
        transaction: "Purchase",
        trndate: date, 
        createdat: null,
        modifiedat: null,
    });
    const [prevForm, setPrevForm] = useState({
        prevTransaction: '',
        prevUnit: '0',     
    });
    const [onHand,setOnHand]=useState(0);

    useEffect(() => {
        const getById = async (pid) => {
            setIsLoading(true);

            try {
                const Response = await FetchData({
                    endPoint: 'inventory',
                    id: pid
                });
                if (Response.status === 200) {
                    setOnHand(Response.data.stock)
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

        getById(pid);
    }, [pid]);
   
    useEffect(() => {
        if (!isEdit) return;

        const getById = async (id) => {
            setIsLoading(true);

            try {
                const Response = await FetchData({
                    endPoint: 'inventorydetail',
                    id: id
                });
                if (Response.status === 200) {
                    setForm({...Response.data, 
                        trndate: get_Date((Response?.data?.trndate || date),'YYYY-MM-DD')});
                    setPrevForm({
                        prevTransaction:Response.data.transaction,
                        prevUnit:Response.data.unit
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

    const handleSubmit = async () => {
        const currentOnHand = Number(onHand) || 0;
        const previousUnit = Number(prevForm.prevUnit) || 0;
        const newUnit = Number(form.unit) || 0;

        const previousMultiplier =
            prevForm.prevTransaction === "Purchase" ? 1 : -1;

        const newMultiplier =
            form.transaction === "Purchase" ? 1 : -1;

        const inStock = isEdit
            ? currentOnHand - (previousUnit * previousMultiplier) + (newUnit * newMultiplier)
            : currentOnHand + (newUnit * newMultiplier);
      
    {/* Save data*/ }
         await saveData({
            label: "Inventory",
            endPoint: "inventory",
            id: pid,
            body: {stock: inStock},
            notify:false
        });

        const res = await saveData({
            label: "InventoryDetail",
            endPoint: "inventorydetail",
            id: isEdit ? id : null,
            body: form
        });
        if (res.isSuccess) {
            navigate(-1);
        }
    };

    const [step, setStep] = useState(1);
    const steps = [
        { id: 1, label: "Item Info", icon: BriefcaseBusiness, content: <ItemInfo form={form} setForm={setForm}   /> },
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
                const unit = Number(form.unit || 0);
                const errors = [];

                 if (unit === 0) {
                    errors.push("Unit cannot be less than 1.");
                }

                if (!form.subtotal.trim())
                    errors.push("Subtotal is required.");

                if (!form.tax.trim())
                    errors.push("Tax is required.");

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
                    Title={isEdit ? 'Edit Item Detail' : `Create New Item`}
                    Description={`${isEdit ? 'Edit' : 'Add'} an item by providing its product name, pricing, and stock details.`}
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





