/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SaveData from "../hook/saveData";
import { useEmail } from "../email/email";
import { initNotification } from "../Firebase/requestPermission";
import { getStorage } from "../common/localStorage";
import FetchData from "../hook/fetchData";
import { get_Date, get_lastDaysDate, LocalDate } from "../common/localDate";
import NetworkBanner from "../common/isinternet";
import Header from "../components/Layout/header.jsx"
import Footer from "../components/Layout/footer.jsx"

import { checkPlanStatus } from "../pages/HomePage/general";
import IsSetupComplete from "../pages/HomePage/isSetupComplete";
import { checkIfPastOrToday } from "../common/general";

import { getDateRangeStatus, getWeekDates} from '../common/general.jsx'
import { useAlert } from "../controls/AlertProvider.jsx";
import { LoaderCircle } from "lucide-react";
import { Modal } from "../controls/modal.jsx";
import { HeaderModal } from "../common/index.jsx";

const ProtectedLayout = () => {
    const ranOnce = useRef(false);
    const ref = useRef();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { sendEmail } = useEmail()
    const { showAlert } = useAlert();
    
    const [apptDate, setApptDate] = useState(LocalDate());
    const [calenderDate, setCalenderDate] = useState(LocalDate());
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [activeSettingTab, setActiveSettingTab] = useState(1);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [refresh, setRefresh] = useState(0);

    const [isAdmin, setIsAdmin] = useState(false);
    const [uid, setUid] = useState(0);
    const [expired, setExpired] = useState(false);
    const [isSetupComplete, setIsSetupComplete] = useState(true);
    const [isPaymentPending, setIsPaymentPending] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
   

    /*  Lists */
    const [companyList, setCompanyList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [notificationList, setNotificationList] = useState([]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pathname]);

    useEffect(() => {
        if (ranOnce.current) return;
        ranOnce.current = true;
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/firebase-messaging-sw.js")
                .then(registration => initNotification(registration, saveData, onNotification))
                .catch(console.error);
        };
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data?.type === 'DATA_REFRESH') {
                    setRefresh(refresh + 1);
                }
            });
        }
       init();
    }, []);

    const init = async () => {
        await Promise.all([getCompany(), getUser(), getNotification()]);     
    }

    useEffect(() => {

        if(!companyList) return;
        
        
       {/* if (companyList.length !== 0) {
            setIsLoading(true)
            const checkPlan = checkPlanStatus(companyList.plan, companyList.createdat)
            setExpired(pathname === '/setting' ? false : checkPlan.expired)
            setIsSetupComplete(companyList.issetupcomplete);

            const checkInvoice = billingList.filter(items => items.status.toLowerCase() === 'unpaid')
            let isDue = checkInvoice.length > 0 && checkIfPastOrToday(checkInvoice[0].duedate) === 'past';
            setIsPaymentPending(pathname === '/setting' ? false : isDue)

            setIsDisabled(checkPlan.expired || isDue)

            setIsLoading(false)
        }*/}
        
    }, [companyList]);
    
    const getAppointment = async (start = null,end=null) => {
        const response = await FetchData({
            endPoint: 'appointment',
            query: {
                orderBy: 'order_no',
                orderDir: 'DESC',
                ...(start !== null && end !== null && {
                    filters: JSON.stringify({
                        trndate: {
                            operator: "BETWEEN",
                            value: [start, end],
                        },
                    }),
                }),
            }
        })
        return response.data;
    } 
   
    const getAwaiting = async () => {
        const response = await FetchData({
            endPoint: 'appointment',
            query: {
                filters: JSON.stringify({
                    status: {
                        operator: "=",
                        value: "Awaiting",
                    },
                }),
            }
        })

        const result= (response.data).sort((a, b) => {
            const dateA = new Date(`${get_Date(a.trndate,'YYYY-MM-DD')}T${a.starttime}`);
            const dateB = new Date(`${get_Date(b.trndate,'YYYY-MM-DD')}T${b.starttime}`);

            return dateA - dateB;
        });
        return result
    }

   const getCustomer = async () => {
        const response = await FetchData({
            endPoint: 'customers',
             query: {
                orderBy: 'name',
                orderDir: 'ASC',
            }
        })
        return response.data;
    }

    const getDiscount = async () => {
        const response = await FetchData({
            endPoint: 'discount',
             query: {
                orderBy: 'startdate',
                orderDir: 'DESC',
            }
        })
        const responseData=response.data.map(item => ({ ...item,
            status: getDateRangeStatus(item.startdate, item.enddate)
        }))
        return responseData;
    }   
    
    const getInventory = async () => {
        const response = await FetchData({
            endPoint: 'inventory',
             query: {
                orderBy: 'name',
                orderDir: 'ASC',
            }
        })
        return response.data;
    }
    const getInventoryDetail = async () => {
        const response = await FetchData({
            endPoint: 'inventorydetail',
             query: {
                orderBy: 'createdat',
                orderDir: 'DESC',
            }
        })
        return response.data;
    }
    const getAttendance = async (start,end) => {    
        const response = await FetchData({
            endPoint: 'attendance',
            query: {
                orderBy: 'trndate',
                orderDir: 'DESC',
                filters: JSON.stringify({
                    trndate: {
                        operator: "BETWEEN",
                        value: [start, end],
                    },
                }),
            }
        })
        return response.data;
    }
    
    const getService = async () => {
        const response = await FetchData({
            endPoint: 'services',
                query: {
                orderBy: 'name',
                orderDir: 'ASC',
            }
        })
        return response.data;
    }
    
    const getCategory = async () => {
        const response = await FetchData({
            endPoint: 'category',
                query: {
                orderBy: 'name',
                orderDir: 'ASC',
            }
        })
        return response.data;
    }
    const getUser = async (activeOnly=true) => {
        const response = await FetchData({
            endPoint: 'user',
            query: {
                orderBy: 'fullname',
                orderDir: 'ASC',
                 ...(activeOnly && {
                    filters: JSON.stringify({
                        status: {
                            operator: "=",
                            value: 'Active',
                        },
                    }),
                }),
            }
        })
        setUserList(response.data);
        return response.data;
    }
    const getCompany = async () => {
        const localStorage = await getStorage();

        const response = await FetchData({
            endPoint: 'company',
            id: localStorage.cid
        })
        setCompanyList(response.data);
        return response.data;
    }
    const getBilling = async () => {
        const response = await FetchData({
            endPoint: 'billing'
        })
        return response.data;
    }
    
    const getLogs = async () => {
        const response = await FetchData({
            endPoint: 'logs'
        })
        return response.data;
    }
    const getNotification = async () => {
        const end = LocalDate();
        const start = get_lastDaysDate(end,30);
        
         const response = await FetchData({
            endPoint: 'notification',
            query: {
                orderBy: 'createdat',
                orderDir: 'DESC',
                filters: JSON.stringify({
                    createdat: {
                        operator: "BETWEEN",
                        value: [start, end],
                    },
                }),
            }
        })
        setNotificationList(response.data);
        return response.data;
    }
    

    const onNotification = ({ title, description }) => {
       // notifications({ title: `${title} Appointment`, description: description, cancel: title === 'Cancel' });
        setRefresh(refresh + 1);
    }

    const saveData = async ({ label, method='POST', endPoint, id = null, body = null, notify = true, email = false }) => {
        setIsLoading(true)
        const res = await SaveData({
            label: label,
            method: method,
            endPoint: endPoint,
            id: id,
            body: body
        })
        
        setIsLoading(false)

        if (res.isSuccess) {
            notify && showAlert({
                type: "success",
                message: res.message,
                duration: 5000,
            });
            setRefresh(prev => prev + 1);
        }
        else
            notify && showAlert({
                type: "error",
                message: res.message,
                duration: 5000,
            });

        return res;
    }

    const [step, setStep] = useState(1);
    const steps = [
        { id: 1, label: "Free Trail Endded", content:<></> },
       // { id: 2, label: "Booking Link", content: <QrCodePage store={companyList?.store || ''} inModal={true} /> },
     //   { id: 3, label: "Help Centre", content: <ContactUs /> },
    ];

    const currentContent = steps.find(item => item.id === step)?.content;

    const handleClick = (id) => {
        setStep(id);
        setOpen(true);
    }
    //"https://embed.tawk.to/69b8b3b92c788c1c3c2391e1/1jjsns31t";
    return (
        <div class='min-h-screen w-full flex flex-col  '>
            <NetworkBanner/>
            <Header
                refresh={refresh}
                saveData={saveData}
                companyList={companyList}
                setCompanyList={setCompanyList}
                userList={userList}
                notificationList={notificationList}
            />

            <main class="flex-1 p-3 md:px-8 scroll-auto ">
                <Outlet context={{
                    saveData, refresh, setRefresh, localStorage ,                                                  
                    getAppointment,apptDate, setApptDate,
                    getAwaiting,
                    getAttendance, 
                    getBilling,
                    getCategory,
                    getCustomer,selectedCustomer, setSelectedCustomer,
                    calenderDate, setCalenderDate,
                    getCompany, activeSettingTab, setActiveSettingTab,         
                    getDiscount,
                    getInventory,
                    getInventoryDetail,
                    getNotification,
                    getLogs,
                    getService,
                    getUser                   
                }} />
            </main>

          <Footer/>

            {isLoading &&
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999, // Ensure it's on top
                    }}
                >
                  <LoaderCircle className="h-12 w-12 animate-spin " />
                </div>
            }
            <Modal open={open} message={[]} messageType="error" children={
                <>
                    <HeaderModal onClick={() => setOpen(false)} />
                    <div className="flex-1 overflow-y-auto px-8 py-4 mb-10 ">
                        {currentContent}
                    </div>
                </>
            } />
                 
{/*
            <Modal
                open={expired}
                closable={false}
                maskClosable={false}
                keyboard={false}
                footer={[
                    isAdmin && <Button
                        type="primary"
                        key="upgrade"
                        onClick={() => navigate('/setting?tab=2#plans')}
                    >
                        Upgrade Plan
                    </Button>
                ]}
            >
                <div className="text-center py-6">

                    <h2 className="text-xl font-semibold mb-2">
                        Your app free trial has ended !
                    </h2>

                    <p className="text-gray-500 mt-4">
                        Your free trial of {process.env.REACT_APP_PROJECT_NAME} has ended. To keep using this app, Administrator must choose a subsciption plan that works for your team.
                    </p>

                </div>
            </Modal>

            <Modal
                open={isPaymentPending}
                closable={false}
                maskClosable={false}
                keyboard={false}
                footer={[
                    isAdmin && <Button
                        type="primary"
                        key="paynow"
                        onClick={() => navigate('/setting?tab=2#invoice')}
                    >
                        Pay Now
                    </Button>
                ]}
            >
                <div className="text-center py-6">

                    <h2 className="text-xl font-semibold mb-2">
                        Pay your bill to continue usign {process.env.REACT_APP_PROJECT_NAME} 
                    </h2>

                    <p className="text-gray-500 mt-4">
                        Your payment is past due, and your {process.env.REACT_APP_PROJECT_NAME} will be disabled if we don't receive the payment soon. To continue , ask your billing administrator to pay the amount due.
                    </p>

                </div>
            </Modal>

             <Modal
                open={!isSetupComplete && isAdmin}
                width={'90%'}
                closable={false}
                maskClosable={false}
                keyboard={false}
                footer={[]}
            >
                <IsSetupComplete companyList={companyList} loyaltyList={loyaltyList} saveData={saveData} logoList={logoList}  setIsSetupComplete={setIsSetupComplete} getCompany={getCompany}/>
            </Modal>
*/}
           

        </div>
    );
};

export default ProtectedLayout;