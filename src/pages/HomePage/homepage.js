import { useNavigate, useOutletContext } from "react-router-dom";
import ProfileCard from "../Setting/profileCard";
import CalenderCard from "./calenderCard";
import { AppIcons } from "../../common/custom/appIcons";
import WaitingApproval from "./waitingApproval";
import UserSchedule from "./userSchedule";

import { IsLoading, PageHeader } from "../../common/index.jsx";
import AppIconsPermission from "../../common/custom/appIconsPermission";
import { useEffect, useRef, useState } from "react";
import { Tour } from 'antd';
import awaitingGif from '../../Images/tour/awaiting_request.gif'
import Warning from "./warning";
import useAlert from "../../common/alert";
import { checkBillingDetails, checkEmailStatus, checkPlanStatus } from "./general";
import { get_Date } from "../../common/localDate";
import SpiralNotebook from "./spiralNotebook";

function getMessageItem(key, label, type, description,moveto) {
    return { key, label, type, description,moveto };
} 

const Homepage = () => {
    const navigate = useNavigate();
    const { apps } = AppIconsPermission();
    const { isAdmin, refresh, isLoading, setIsLoading, companyList,billingList,getCompany,getBilling } = useOutletContext()
    const { contextHolderModal, allowAdminOnly } = useAlert();
    const [messageList,setMessageList] = useState([])

    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);
    const ref4 = useRef(null);
    const [open, setOpen] = useState(false);
    const steps = [
        {
            title: 'Calender Overview',
            description: 'Here, you may view every appointment scheduled for today as well as a general overview of the requests for approval, whether they are pending, completed, or canceled.',
            placement: 'top',
            target: () => ref1.current,
        },
        {
            title: 'Awaiting Request',
            description: 'The booking request will be displayed here, and you have the option to accept or reject it.',
            cover: (
                <img
                    draggable={false}
                    alt="awaiting_request.gif"
                    src={awaitingGif}
                />
            ),
            placement: 'right',
            target: () => ref2.current,
        },
        {
            title: 'User Schedule',
            description: 'With just one click, you may alter your working hours or designate any day as a workday or a day off.',
            placement: 'left',
            target: () => ref3.current,
        },
        {
            title: 'Tabs',
            description: 'These are all the options available to you, simply click the tab to navigate to that page.',
            placement: 'top',
            target: () => ref4.current,
        },
    ];

    useEffect(() => {
        Init();
    }, [refresh])

    const Init = async () => {
        setIsLoading(true);
        await getCompany();
        await getBilling();
        setIsLoading(false);
    }

    useEffect(() => {
        setIsLoading(true)
        if (companyList.length !== 0 && isAdmin) {
            let messages=[];

            const checkEmail = checkEmailStatus(companyList);
            if (checkEmail.status)
                messages.push(getMessageItem(1, 'Email', 'warning', checkEmail.message, "/setting?tab=1#gmailsetup"))

            const checkPlan = checkPlanStatus(companyList.plan,companyList.createdat)          
            if (checkPlan.status)
                messages.push(getMessageItem(2, 'Plan', 'error', checkPlan.message+' <b><u> Upgrade Plan </u></b>', "/setting?tab=2#plans"))
            

            if (companyList.plan !== "FREE TRIAL") {
                //const checkBilling = checkBillingDetails(companyList);
                //if (checkBilling.status)
                  //  messages.push(getMessageItem(3, 'BillingInformation', 'warning', checkBilling.message, "/setting?tab=2#billingdetail"))
                      
                const checkInvoice = billingList.filter(items => items.status.toLowerCase() === 'unpaid')
                if (checkInvoice.length > 0)
                {
                    messages.push(getMessageItem(4, 'Invoice', 'warning', `Your next payment bill is ready and due on ${get_Date(checkInvoice[0].duedate,'MMM DD, YYYY')}`, "/setting?tab=2#invoice"));
                    ((checkInvoice[0].failedreason).replace(/\s+/g, "") || '').length > 0 && messages.push(getMessageItem(5, 'Payment Failed', 'error', `Oops! Your payment failed! ${checkInvoice[0].failedreason || ''}`, "/setting?tab=2#invoice"))
                }

            }
            setMessageList(messages);
        }
        setIsLoading(false)
    }, [companyList,billingList])
   
    return (
        <div className=" relative">
            {isAdmin &&
                <IsLoading isLoading={isLoading} input={
                messageList.map(items => (
                    <Warning key={items.key} type={items.type} onClick={() => navigate(items.moveto)} description={items.description} />
                ))} />
            }
            <div class='flex flex-col gap-8 p-4 '>
                <div class='w-full flex flex-col md:flex-row gap-8 '>
                    <div class='w-full md:w-4/12 flex flex-col gap-6'>
                       {/*<SpiralNotebook/>*/}
                        <ProfileCard />
                        <CalenderCard ref={ref1} />
                    </div>
                    <div ref={ref2} class='w-full md:w-4/12'>
                        <WaitingApproval />
                    </div>
                    <div ref={ref3} class='w-full md:w-4/12'>
                        <UserSchedule />
                    </div>

                </div>
                <div ref={ref4} class="w-full flex flex-wrap justify-center gap-8 mt-4 ">
                    <IsLoading isLoading={isLoading} input={
                        apps.filter(active => active.isVisible && active.label !== 'Home').map((items, index) => {
                            return (
                                <AppIcons key={index} icon={items.icon} label={items.label} backgroundColor={items.color} onClick={() => navigate(items.navigate)} />
                            )
                        })}
                    />
                </div>

                <button
                    onClick={() => setOpen(true)}
                    className="fixed bottom-6 left-6 bg-yellow-400  hover:bg-yellow-500 px-5 py-3 rounded-full shadow-lg font-semibold z-50"
                >
                    Quick Tour ?
                </button>


                <Tour
                    open={open}
                    onClose={() => setOpen(false)}
                    steps={steps}
                    indicatorsRender={(current, total) => (
                        <span>
                            {current + 1} / {total}
                        </span>
                    )}
                />
            </div>
            {contextHolderModal}
        </div>
    );
};

export default Homepage;
