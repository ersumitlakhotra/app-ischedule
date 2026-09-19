import { Button, Textbox, Toggle } from "../../../controls/index.jsx";
import { updateField } from "../../../common/general.jsx";
import { Header } from "../rightside.jsx";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmailInfo({ form, setForm,saveData,saveButton=true }) {
    const navigate = useNavigate()
    const [visible, setVisible] = useState(false)
    return (
        <div className="space-y-5  mb-4 ">
            <Header title={'E-Mail Notification'} description={<Toggle label="Send an appointment confirmation and reminder one day prior to the scheduled appointment ?" variant="primary" value={form.emailreminder} onChange={(e) => updateField("emailreminder", e, setForm)} />}
                formBody={JSON.stringify({
                    emailreminder: form.emailreminder,
                    emailuser: form.emailuser,
                    emailpass: form.emailpass
                })}
                saveData={saveData}
                saveButton={saveButton}
            />

            <div class='flex flex-col gap-4  md:flex-row'>
                <Textbox required label="G Mail" placeholder="Enter your e-mail" value={form.emailuser} setValue={(e) => updateField("emailuser", e, setForm)} />
                <div className="flex flex-row w-full  gap-2">
                    <Textbox type={visible ? "text" : "password"} required label="App Password" placeholder="Enter your app Password" value={form.emailpass} setValue={(e) => updateField("emailpass", e, setForm)}
                        helperText={<p className="text-sky-500 italic hover:underline cursor-pointer" onClick={() => navigate('/gmailtutorial')}>Need help? Click here to view the step-by-step tutorial.</p>} />
                    <div className="mt-7"><Button variant="secondary" icon={visible ? Eye : EyeClosed} onClick={() => setVisible(!visible)} /></div>
                </div>

            </div>
        </div>
    )
}