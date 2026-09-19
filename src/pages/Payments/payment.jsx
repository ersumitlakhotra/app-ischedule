/* eslint-disable react-hooks/exhaustive-deps */
import  { useEffect, useRef, useState } from "react";
import { BriefcaseBusiness } from "lucide-react";
import {  Modal } from "../../controls/index.jsx";
import { HeaderModal, FooterModal, IsLoading } from "../../common/index.jsx";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import FetchData from '../../hook/fetchData.js'
import { decryptId, updateField} from "../../common/general.jsx";
import { useAlert } from "../../controls/AlertProvider.jsx";
import {  LocalDateTime } from "../../common/localDate.js";
import PaymentInfo from "./payment_info.jsx";

const Payment = () => {
    const navigate = useNavigate();  
    const { saveData,getAppointment, getCustomer, getCompany } = useOutletContext();
    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const [appointmentList, setAppointmentList] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const { Id } = useParams();
    const id = decryptId(Id);
    const contentRef = useRef(null);

    const [form, setForm] = useState({
        id: null,
        cid: null,
        tip:0,
        total:0,
        payments: [],
        paymentstatus:'Unpaid',
        status:"completed",
        custid:0,
        referral:0,
        
        points:0,
        referralpoints:0,
        punchpoints:0,
        badgepoints:0,
         pointsused:0,
        isnewcustomer:false,
        createdat: null,
        modifiedat: null,
    });

    const [prevRewardPayment,setPrevRewardPayment]= useState({
        hasReward:false,
        custid:0,
        points:0,
        referralpoints:0,
        punchpoints:0,
        badgepoints:0,
         pointsused:0,
    })

    const loyalty = companyList?.loyaltyinfo?.[0] ?? {
        active: false,
        redeem: 100,

        ispoint: false,
        pointreward: 10,

        ispunch: false,
        punchcomplete: 10,
        punchreward: 2000,

        isreferral: false,
        referralreward: 2000,

        istier: false,
        bronzetier: 10,
        bronzereward: 2000,
        silvertier: 20,
        silverreward: 2000,
        goldtier: 30,
        goldreward: 2000,
        platinumtier: 40,
        platinumreward: 2000
    };
    const [badge,setBadge]= useState(null);
   
    const invoiceTotal = Number(form.total).toFixed(2);

    const totalReceived = form.payments.reduce(
        (sum, payment) => sum + (parseFloat(payment.amount) || 0),
        0
    );
    const tip = totalReceived > invoiceTotal
        ? totalReceived - invoiceTotal
        : 0;

    const balance = totalReceived < invoiceTotal
        ? invoiceTotal - totalReceived
        : 0;

   

    const handleEmptyorNull = (payment,total) => {
        if (payment.length > 0)
            return payment
        else
            return [{
                id: 0,
                paymenttype: "Cash", // Cash, Card, Interac, Cheque, etc.
                amount: total,
                transaction: "InStore",
                createdat: LocalDateTime()
            }]
    }
    
    useEffect(() => {
        const getById = async (id) => {
            setIsLoading(true);

            try {
                const [AppointmentResponse, CustomerResponse,CompanyResponse,Response] = await Promise.all([getAppointment(), getCustomer(), getCompany(),
                    FetchData({
                    endPoint: 'appointment',
                    id: id
                })]);
                setAppointmentList(AppointmentResponse);
                setCustomerList(CustomerResponse);
                setCompanyList(CompanyResponse);
                if (Response.status === 200) {
                    setForm({
                        id: Response.data.id,
                        cid: Response.data.cid,
                        total: Response.data.total,
                        payments: handleEmptyorNull(Response.data.payments || [], Response.data.total),
                        paymentstatus: Response.data.paymentstatus || 'Unpaid',
                        status: "Completed",
                        points: Response.data.points,
                        custid: Response.data.custid,
                        referral: Response.data.referral,
                        referralpoints:  Response.data.referralpoints,
                        punchpoints:  Response.data.punchpoints,
                        badgepoints:  Response.data.badgepoints,
                         pointsused:Response.data.pointsused,
                        isnewcustomer: Response.data.isnewcustomer,
                        createdat: Response.data.createdat,
                        modifiedat: Response.data.modifiedat,
                    });

                    const prevHasReward=Response.data.payments.filter(payment => payment.paymenttype === "Reward")
                    setPrevRewardPayment({
                        points: Response.data.points,
                        custid: prevHasReward && (prevHasReward[0]?.custid || 0),
                        referralpoints: Response.data.referralpoints, 
                        punchpoints:  Response.data.punchpoints,
                        badgepoints:  Response.data.badgepoints,
                         pointsused:Response.data.pointsused,
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
    }, [id]);

    const hasReward = form.payments.filter(payment => payment.paymenttype === "Points");
    const payments = form.payments.filter(payment => payment.paymenttype !== "Points");
    const customer = customerList.find(o => o.id.toString() === form.custid.toString());

    useEffect(() => {
        if (hasReward.length > 0) {
            const pointReedem = Number(loyalty?.redeem || 0);
            hasReward.forEach((o) => {
                updateField("pointsused", -Math.floor(Number(o.amount || 0) * pointReedem), setForm);
            })
        }
        else
            updateField("pointsused","0", setForm);  
        
        calculateLoyaltyPoints();
    }, [form.payments])

    const calculateLoyaltyPoints = () => {

        if (!loyalty?.active) {
            updateField("points", "0", setForm);
        }

        const completed = appointmentList.filter(o =>
            o.custid.toString() === customer?.id.toString() &&
            o.paymentstatus === 'Paid' &&
            o.id !== id).length + 1;

        // Purchase points
        if (loyalty?.ispoint) {
            const pointReward = Number(loyalty?.pointreward || 0);
         
            let points=0;
            payments.forEach((o) => {
                points += Math.floor(Number(o.amount || 0) * pointReward)
            })
            updateField("points", points.toString(), setForm);
        }

        // Punch reward
        if (loyalty?.ispunch) {
            const punchComplete = Number(loyalty?.punchcomplete || 0);
            const punchReward = Number(loyalty?.punchreward || 0);

            if (punchComplete > 0 && Number(completed) % punchComplete === 0) {
                updateField("punchpoints", punchReward, setForm);
            }
        }

        // Tier reward
        if (loyalty?.istier) {
            if (completed === Number(loyalty?.bronzetier) && customer?.badge === "") {
                updateField("badgepoints", Number(loyalty?.bronzereward || 0).toString(), setForm);
                setBadge('bronze');
            }

            if (completed === Number(loyalty?.silvertier) && customer?.badge === "bronze") {
                updateField("badgepoints", Number(loyalty?.silverreward || 0).toString(), setForm);
                setBadge('silver');
            }

            if (completed === Number(loyalty?.goldtier) && customer?.badge === "silver") {
                updateField("badgepoints", Number(loyalty?.goldreward || 0).toString(), setForm);
                setBadge('gold');
            }

            if (completed === Number(loyalty?.platinumtier) && customer?.badge === "gold") {
                updateField("badgepoints", Number(loyalty?.platinumreward || 0).toString(), setForm);
                setBadge('platinum');
            }
        }
    };


    const handleRewardPoints = async () => {

       // const newPoints = Number(form.points);
        const newPoints =Number(form.points || 0) + Number(form.punchpoints || 0) + Number(form.badgepoints || 0) + Number(form.pointsused || 0) ;
        const prevPoints =Number(prevRewardPayment?.points ||0) + Number(prevRewardPayment?.punchpoints || 0) + Number(prevRewardPayment?.badgepoints ||0) + Number(prevRewardPayment?.pointsused ||0) ;
        const currentPoints = Number(customer?.points || 0) + newPoints -prevPoints ;      
        await saveData({
            label: "Customers",
            endPoint: "customers",
            id: form.custid,
            notify: false,
            body: { points: currentPoints,
                 ...(badge !== null && { badge: badge })
                }
        })   
    };

    const handleReferralRewardPoints = async () => {
        const ReferralId = Number(form.referral || 0);

        if (!loyalty?.active || !loyalty?.isreferral || !Boolean(form.isnewcustomer) || ReferralId === 0)
            return 0;

        const referralPoints = balance > 0 ? 0 : Number(loyalty?.referralreward || 0);
        const prevReferralPoints = Number(prevRewardPayment?.referralpoints || 0);
        const newPoints = referralPoints - prevReferralPoints;

        const referralCustomer = customerList.find(o => o.id.toString() === ReferralId.toString());
        const currentPoints = Number(referralCustomer?.points || 0) + newPoints;
        await saveData({
            label: "Customers",
            endPoint: "customers",
            id: ReferralId,
            notify: false,
            body: { ...referralCustomer, points: currentPoints }
        })

        return referralPoints;
    };

    const handleSubmit = async () => {
      
        await handleRewardPoints();
        const referralPoints=await handleReferralRewardPoints();

        const res = await saveData({
            label: "Payment",
            endPoint: "appointment",
            id:  id ,
            body: {...form, paymentstatus:balance > 0 ? "Unpaid": "Paid", referralpoints:referralPoints}
        });
        if (res.isSuccess) {
            navigate(-1);
        }
    };

    const [step, setStep] = useState(1);
    const steps = [
        { id: 1, label: "Payment Info", icon: BriefcaseBusiness, 
            content: 
            <PaymentInfo 
            form={form} 
            setForm={setForm} 
            customer={customer} 
            hasReward={hasReward} 
            loyalty={loyalty}
            invoiceTotal={invoiceTotal} 
            totalReceived={totalReceived} 
            tip={tip} 
            balance={balance} 
            /> },
    ];

    const currentContent = steps.find(item => item.id === step)?.content;

    useEffect(() => {
        contentRef.current?.scrollTo({
            top: 0,
            behavior: "smooth", // optional
        });
    }, [step]);


    return (
        <Modal open={true} message={[]} messageType="error" children={
            <>
                <HeaderModal
                    Title={`Receive Payment`}
                    Description={`Record one or more payment methods, including partial payments and tips. Any unpaid amount will be tracked as the remaining balance.`}
                    className="border-b border-gray-200"
                    onClick={() => navigate(-1)}
                />
                <IsLoading isLoading={isLoading} rows={10} input={
                    <>
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
                            onComplete={() =>  handleSubmit()}
                        />
                    </>
                } />
            </>
        } />
    );
};

export default Payment;





