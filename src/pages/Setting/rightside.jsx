import { Tabs,  Button } from "../../controls/index.jsx";
import { ButtonPermission } from "../../auth/protectedButton.js";
import BasicInfo from "./General/basic_info.jsx";
import BusinessHours from "./General/business_hours.jsx";
import PasswordInfo from "./Security/password_info.jsx";
import QrCodePage from "./Security/Qr_code.jsx";
import SocialLink from "./Security/social_link.jsx";
import { PlanCard } from "./Billing/plan_card.jsx";
import { BillingHistory } from "./Billing/billing_history.jsx";
import EmailInfo from "./Notification/email_info.jsx";
import TextMessage from "./Notification/text_message.jsx";
import { getStorage } from "../../common/localStorage.js";
import AppointmentOptions from "./Options/appointment_options.jsx";
import LoyaltyOptions from "./Options/loyalty_option.jsx";
import { uploadToS3 } from "../../common/upload_toS3.jsx";

export const Header = ({ title, description,extra, formBody, image,saveData, saveButton=true }) => {
    const handleProfilePic = async () => {
        const path = await uploadToS3({
            Name: "logo",
            Folder: 'company',
            File: image.file,
            FileType: image.fileType
        });

        if (Boolean(path.status))
            return path.message;
        else
            return '';
    }

    const handleSubmit = async () => {
        const dp = image && Boolean(image.isNew) ? await handleProfilePic() : formBody.logo;

        const localStorage = await getStorage();   
         await saveData({
            label: "Company",
            endPoint: "company",
            id: localStorage.cid,
            body: image ? { ...JSON.parse(formBody),logo:dp} : formBody
        });
       
    };
    return (
        <div className="flex items-center justify-between border-b border-gray-100 py-3">
            <div>
                <p className="text-lg font-semibold">{title}</p>
                {description && <p className=" text-xs text-gray-500">{description}</p>}
            </div>
            {extra ? extra :
            saveButton && <ButtonPermission permission={`Setting.Edit`} children={
                <Button
                    variant="primary"
                    label={"Save"}
                    onClick={()=>handleSubmit()}
                />} />
            }
        </div>
    )
}

const Box = ({ id, children }) => {
    return (
        <div id={id} className="rounded-2xl border border-gray-200 bg-white shadow-md  px-6 py-2" >
            {children}
        </div>
    )
}
export default function RightSide({ form, setForm,saveData,billingList, logsList, image,setImage,activeSettingTab,setActiveSettingTab }) {
    const twillioLogs = logsList.filter(o => o.type ==='Twillio' ||  o.type ==="TwillioCredit")
   
    const tabs = [
        {
            id: 1,
            label: "General",
            content: (
                <div className="space-y-8 ">
                    <Box id="general-section" children={
                        <BasicInfo form={form} setForm={setForm} image={image} setImage={setImage} saveData={saveData} />
                    } />

                    <Box id="business-hours" children={
                        <BusinessHours form={form} setForm={setForm} saveData={saveData} />
                    } />
                </div>
            ),
        },

        {
            id: 2,
            label: "Billing",
            ...(billingList.filter((o) => o.category === "invoice" && o.status !== "Paid").length > 0 && {
                badge: billingList.filter((o) => o.category === "invoice" && o.status !== "Paid").length,
                varient: "danger",
            }),
            content: (
                <div className="space-y-8 ">
                    <PlanCard form={form} className={'flex-row justify-between items-center'} />
                    <BillingHistory billingList={billingList.filter((o) => o.category === 'invoice')} saveData={saveData} />
                </div>
            ),
        },
        {
            id: 3,
            label: "Notification",
            //badge: '10',
            content: (
                <div className="space-y-8 ">
                    <Box id="email-section" children={
                        <EmailInfo form={form} setForm={setForm} saveData={saveData}  />
                    } />
                    <Box id="text-message-section" children={
                        <TextMessage form={form} setForm={setForm} logsList={twillioLogs} saveData={saveData}  />
                    } />
                </div>
            ),
        },
        {
            id: 4,
            label: "Security",
            //varient: 'alert',
            content: (
                <div className="space-y-8 ">
                    <PasswordInfo form={form} setForm={setForm} saveData={saveData}/>
                    <QrCodePage store={form.store || ''} />
                    <SocialLink form={form} setForm={setForm} saveData={saveData}/>
                </div>
            ),
        },
        {
            id: 5,
            label: "Options",
            //varient: 'alert',
            content: (
                <div className="space-y-8 ">
                    <Box id="appointment-option-section" children={
                        <AppointmentOptions form={form} setForm={setForm} saveData={saveData}/>
                    } />
                    <Box id="appointment-option-section" children={                   
                      <LoyaltyOptions form={form} setForm={setForm} saveData={saveData}/>
                    } />
                     
                </div>
            ),
        },
    ];

   
    return (
        <div className="md:col-span-3  ">
            <Tabs tabs={tabs} activeTab={activeSettingTab} onTabChange={setActiveSettingTab} />          
        </div>
    )
}