import {  Textbox} from "../../../controls/index.jsx";
import { updateField } from "../../../common/general.jsx";
import { Header } from "../rightside.jsx";
import { GlobeIcon } from "lucide-react";
import { ImFacebook } from "react-icons/im";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";

export default function SocialLink({ form, setForm ,saveData}) {
     const links = form.socialinfo?.[0] ?? {
            website: "",
            facebook: "",
            instagram: "",
            twitter: "",
            linkedin: "",
        };
        const updateSocialInfoField = ( field, value) => {
    
            const socialInfo = form.socialinfo ?? [];
    
            socialInfo[0] = {
                ...socialInfo[0],
                [field]: value
            };
    
            updateField(
                'socialinfo',
                socialInfo,
                setForm
            );
        };
    return (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-md  px-6 py-2" >
            <div className="space-y-5  mb-4 ">
                <Header title={'Social Link'} description={'Add your social media links for customers to find you.'}
                saveData={saveData}
                  formBody={JSON.stringify({socialinfo:form.socialinfo})}  />
                 <Textbox  icon={GlobeIcon} placeholder="Enter website link" value={links.website} setValue={(e) => updateSocialInfoField('website', e)} />
                 <Textbox  icon={ImFacebook} placeholder="Enter facebook link" value={links.facebook} setValue={(e) => updateSocialInfoField('facebook', e)} />
                 <Textbox  icon={FaInstagram} placeholder="Enter instagram link" value={links.instagram} setValue={(e) => updateSocialInfoField('instagram', e)} />
                 <Textbox  icon={BsTwitterX} placeholder="Enter twitter link" value={links.twitter} setValue={(e) => updateSocialInfoField('twitter', e)} />
                 <Textbox  icon={FaLinkedinIn} placeholder="Enter linkedin link" value={links.linkedin} setValue={(e) => updateSocialInfoField('linkedin', e)} /> 
            </div>
        </div>
    )
}