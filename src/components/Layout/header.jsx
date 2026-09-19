import {
    Bell,
    MessageSquare,
    CreditCard,
    HelpCircle,
    ChevronDown,
    Settings,
    LogOut,
    User,
    Home,
    MessageSquareDot,
    LogOutIcon,
    QrCode,
    Mail
} from "lucide-react";

import { Badge, Button, Image, Modal, ModalPortal, Tooltip, TopBadge } from "../../controls/index.jsx";
import logo from "../../Images/logo.png";
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/authContext.js";
import { HeaderModal } from "../../common/index.jsx";
import QrCodePage from "../../pages/Setting/Security/Qr_code.jsx";
import { BookingLink } from "../../pages/Setting/Security/booking_link.jsx";
import { TextCredit } from "../../pages/Setting/Notification/text_credit.jsx";
import ContactUs from "../../pages/Extra/contact_us.jsx";
import { ButtonPermission } from "../../auth/protectedButton.js";
import { useNavigate } from "react-router-dom";
import { getStorage } from "../../common/localStorage.js";
import EmailInfo from "../../pages/Setting/Notification/email_info.jsx";

const Header = ({
    refresh,
    saveData,
    companyList,
    setCompanyList,
    userList,
    notificationList
}) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [user, setuser] = useState({ name: "", role: "", image: null })

    useEffect(() => {
        const init = async () => {
            const storage = await getStorage();

            const isAdmin = Boolean(storage.isAdmin);

            const selected = userList.find(
                (o) => o.id?.toString() === storage.uid?.toString()
            );

            setuser({
                name: isAdmin
                    ? (companyList?.owner || "Admin")
                    : (selected?.fullname || "User"),

                role: storage.role,

                image: isAdmin
                    ? (companyList?.logo || null)
                    : (selected?.profilepic || null)
            });
        };

        init();
    }, [companyList, userList]); 

     const notificationBadge =notificationList.filter((item) => item.unread).length || 0;

    const [step, setStep] = useState(1);
    const steps = [
        { id: 1, label: "Text Credit", content: <TextCredit smsCredit={companyList?.credit || 0} textreminder={companyList?.textreminder} saveData={saveData} inModal={true} /> },
        { id: 2, label: "Email", content: <EmailInfo form={companyList} setForm={setCompanyList} saveData={saveData} /> },
        { id: 3, label: "Booking Link", content: <QrCodePage store={companyList?.store || ''} inModal={true} /> },
        { id: 4, label: "Help Centre", content: <ContactUs /> },
    ];

    const currentContent = steps.find(item => item.id === step)?.content;

    const handleClick = (id) => {
        setStep(id);
        setOpen(true);
    }

    return (
        <>
            <header className="sticky top-0 z-[90] w-full border-b bg-white  shadow-md">
                <div className="h-16 px-4 md:px-6 flex items-center justify-between">

                    {/* LEFT - Logo */}
                    <div className="flex items-center gap-3 min-w-0">

                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100">
                            <Image
                                src={companyList?.logo || null}
                                name={companyList?.name || 'iSchedule'}
                                height="h-8"
                                width="w-8"
                                className="flex-shrink-0 rounded-lg"
                                offimage={false}
                            />
                        </div>

                        <div className="hidden sm:block">
                            <div className="text-lg font-semibold text-gray-800 leading-tight">
                                {companyList?.name || "iSchedule"}
                            </div>

                            <div className="text-[11px] text-gray-400">
                                {companyList?.category || ''}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex items-center gap-1">

                        {/* Credits */}
                        <Tooltip title='Text Message Credit' placement="bottom" children={
                            <Button variant="noborder" className="!px-3 !py-2 relative" icon={MessageSquareDot} label={
                                <>
                                <div className="text-left">
                                    <div className="text-[10px] text-gray-400 leading-none">
                                        Credits
                                    </div>

                                    <div className="text-xs font-semibold text-gray-700 leading-tight">
                                        ${companyList?.credit || 0}
                                    </div>
                                </div>
                                <TopBadge color={companyList?.textreminder ? 'green' : 'red'}/>
                                </>
                            } onClick={() => handleClick(1)} />
                        } />

                        {/* Booking Link */}
                        <Tooltip title='E-Mail Notification' placement="bottom" children={
                            <Button variant="noborder" className="!px-3 !py-2 relative" icon={Mail}  label={
                                 <TopBadge color={companyList?.emailreminder ? 'green' : 'red'}/>
                            }
                                onClick={() => handleClick(2)} />
                        } />

                        {/* Booking Link */}
                        <Tooltip title='Booking Link' placement="bottom" children={
                            <Button variant="noborder" className="!px-3 !py-2 relative" icon={QrCode}
                                onClick={() => handleClick(3)} />
                        } />

                        {/* Notifications */}
                        <Tooltip title='Notification' placement="bottom" children={
                            <Button variant="noborder" className="!px-3 !py-2 relative" icon={Bell} label={
                                <TopBadge text={notificationBadge} isVisible={Number(notificationBadge) > 0}  color={'red'} className="!w-[18px] !h-[18px]"/>
                            } onClick={() => navigate("/Notification")} />
                        } />

                        {/* Help */}
                        <Tooltip title='Help Centre' placement="bottom" children={
                            <Button variant="noborder" className="!px-3 !py-2 relative" icon={HelpCircle}
                                onClick={() => handleClick(4)} />
                        } />

                        {/* Setting 
                        <ButtonPermission permission={"Setting.Open"} children={
                            <Tooltip title='Setting' placement="bottom" children={
                                <Button variant="noborder" className="!px-3 !py-2 relative" icon={Settings} onClick={() => navigate("/Setting")} />
                            } />
                        } />*/}

                        {/* Logout */}
                        <Tooltip title='Sign Out' placement="bottom" children={
                            <Button variant="danger" className="!px-3 !py-2 relative" icon={LogOutIcon} onClick={() => logout()} />
                        } />

                        {/* Divider */}
                        <div className="hidden sm:block h-8 w-px bg-gray-200 mx-1" />

                        <Button
                            variant="default"
                            className="!px-2 !py-2 !cursor-default"
                            label={
                                <div className="flex items-center gap-2">

                                    <Image
                                        src={user.image}
                                        name={user.name}
                                        height="h-9"
                                        width="w-9"
                                        rounded="rounded-full"
                                        className="flex-shrink-0 text-sm"
                                    />

                                    <div className="hidden md:block text-left">
                                        <div className="text-sm font-semibold text-gray-700 leading-tight">
                                            {user.name}
                                        </div>

                                        <div className="text-[11px] text-gray-400">
                                            {user.role}
                                        </div>
                                    </div>

                                </div>
                            }
                        />

                    </div>

                </div>

                {/* Optional profile dropdown example

            <div className="absolute right-4 top-[68px] w-44">
                <Button variant="danger" className="w-full" label="Logout"/>            
            </div> */}

            </header>
            <Modal open={open} message={[]} messageType="error" children={
                <>
                    <HeaderModal onClick={() => setOpen(false)} />
                    <div className="flex-1 overflow-y-auto px-8 py-4 mb-10 ">
                        {currentContent}
                    </div>
                </>
            } />
        </>
    );
};

export default Header;