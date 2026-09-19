import { Button, Textbox} from "../../../controls/index.jsx";
import { updateField } from "../../../common/general.jsx";
import { Header } from "../rightside.jsx";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

export default function PasswordInfo({ form, setForm ,saveData}) {
    const [visible, setVisible] = useState(false)
    return (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-md  px-6 py-2" >
            <div className="space-y-5  mb-4 ">
                <Header title={'Password'} description={'Update your account password to keep it secure.'} saveData={saveData}
                formBody={JSON.stringify({password:form.password})} />

                <div className="flex flex-row items-center  gap-2">
                    <Textbox type={visible ? "text" :"password"} label="Current Password" placeholder="Enter password" value={form.password} setValue={(e) => updateField('password', e,setForm)} />
                    <div className="mt-6"><Button variant="secondary" icon={visible ? Eye : EyeClosed} onClick={() => setVisible(!visible)} /></div>                 
                </div>
            </div>
        </div>
    )
}