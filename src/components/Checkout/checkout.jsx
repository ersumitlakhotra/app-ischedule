
import  { useEffect, useRef, useState } from "react";
import {  Modal, Textbox } from "../../controls/index.jsx";
import { HeaderModal, FooterModal, IsLoading } from "../../common/index.jsx";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import FetchData from '../../hook/fetchData.js'
import { useAlert } from "../../controls/AlertProvider.jsx";
import { decryptId, getTax } from "../../common/general.jsx";
import { DollarSign } from "lucide-react";
import { getStorage } from "../../common/localStorage.js";
import { NumberFormat, PriceFormat } from "../../common/validate.jsx";

export const Checkout = () => {
    const navigate = useNavigate();
    const { getCompany } = useOutletContext();
    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const { Id } = useParams();
    const id = decryptId(Id);
    const isBilling = id === "TextCredit" ? false : true;
    const heading = !isBilling ? "Text_Message_Credit" : "iSchedule_Payment";
    const description = !isBilling ? "How much would you like to add to your account balance today?" : "Your account has an outstanding payment.";
    const urls= "/login"
    const contentRef = useRef(null);

    const [form, setForm] = useState({
        id: null,
        cid: null,    
        pricing: 0,  
        discount: 0,
        createdat: null,
        modifiedat: null,
    });

    const address = companyList?.addressinfo?.[0] ?? {
        street: "",
        country: "",
        province: "",
        postal: "",
        city: "",
    };  

    const [textCredit,setTextCredit]= useState(10)

    const amount =  isBilling ? Number(form.pricing || 0): Number(textCredit || 0);
    const amountError = amount < 1 || amount > 2000;
    const discount = isBilling ? Number(form.discount || 0): 0;
    const processingFee = amount > 0 ? Number(((amount - discount) * 0.03) + 0.30) : 0;
    const subtotal = Number(amount - discount + processingFee);
    const taxList = getTax(address.province);
    const taxamount =  Number((subtotal * taxList.tax) / 100);
    const totalAmount = Number(subtotal+ taxamount).toFixed(2);
    const currency = address.country === 'Canada' ? "cad" : "usd";

    useEffect(() => {
        Init();
    }, [])

    const Init = async () => {
        setIsLoading(true);
        const Response = await getCompany();
        setCompanyList(Response);
        setIsLoading(false);
    }

    useEffect(() => {
        if (!isBilling) return;

        const getById = async (id) => {
            setIsLoading(true);

            try {
                const Response = await FetchData({
                    endPoint: 'billing',
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
    }, [id]);

    const handleSubmit = async () => {
        const localstorage = await getStorage();
        const Body = JSON.stringify({
            cid: localstorage.cid,
            title: heading,
            urls: `${process.env.REACT_APP_DOMAIN}${urls}`,
            sub_total: Number(subtotal).toFixed(2),
            processing_fee: Number(processingFee).toFixed(2),
            tax: taxList.tax,
            tax_amount: Number(taxamount).toFixed(2),
            amount: Number(amount).toFixed(2),
            total_amount: Number(totalAmount).toFixed(2),
            currency: currency,
            invoiceid: id

        });
        const response = await FetchData({
            method: 'POST',
            endPoint: 'checkout',
            body: Body
        })
        window.location.href = response.data.url;
    };

    const [step, setStep] = useState(1);
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

                if (amountError)
                    errors.push("Amount must be between $1 and $2,000.")

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
                    Title={heading}
                    Description={description}
                    className="border-b border-gray-200"
                    onClick={() => navigate(-1)}
                />
                <IsLoading isLoading={isLoading} rows={10} input={
                    <>                       
                        {/* Scrollable Content */}
                        <div ref={contentRef} className="flex-1 overflow-y-auto px-8 py-4">
                            <div className="space-y-6 px-8 ">
                                <div className="mt-8 flex flex-col md:flex-row gap-8  justify-between">
                                    
                                    {/* LEFT SECTION */}
                                    <Textbox
                                        required
                                        label="Amount"
                                        icon={DollarSign}
                                        disabled={isBilling}
                                        placeholder="Enter an amount between $1 and $2000"
                                        value={amount}
                                        setValue={(e) => setTextCredit(PriceFormat(e))}
                                        {...(amountError
                                            ? { error: "Amount must be between $1 and $2,000." }
                                            : {}
                                        )}
                                    />

                                    {/* RIGHT SECTION */}
                                    <div className="w-full  bg-gray-50 rounded-lg p-6 border">
                                        <h3 className="text-lg font-semibold mb-4">Overview</h3>

                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">Payment amount:</span>
                                            <span className="font-medium">
                                                ${Number(amount || 0).toFixed(2)}
                                            </span>
                                        </div>
                                        {discount > 0 && <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">Discount:</span>
                                            <span className="font-medium text-red-400">
                                                -${Number(discount || 0).toFixed(2)}
                                            </span>
                                        </div>}
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">Processing Fee:</span>
                                            <span className="font-medium">
                                                ${Number(processingFee || 0).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">{`Tax (${taxList.tax}%):`}</span>
                                            <span className="font-medium">
                                                ${Number(taxamount || 0).toFixed(2)}
                                            </span>
                                        </div>

                                        <hr className="my-3" />

                                        <div className="flex justify-between">
                                            <span className="text-gray-700 font-medium">Total Amount:</span>
                                            <span className="font-semibold">${totalAmount}</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <FooterModal
                            step={1}
                            totalSteps={1}
                            //showSkip={step === 2}
                            completeLabel="Pay Now"
                            onComplete={() => Validate() && handleSubmit()}
                        />
                    </>
                } />
            </>
        } />
    );
};





