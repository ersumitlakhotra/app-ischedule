
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../pages/Setting/rightside.jsx";
import { Toggle } from "../../controls/toggle.jsx";
import { updateField } from "../../common/index.jsx";

export default function Options({ form, setForm }) {
    const navigate = useNavigate()
    return (
        <div className="space-y-5  mb-4 ">
             <Header title={'E-Mail Notification'} description={<Toggle label="Send an appointment confirmation and reminder one day prior to the scheduled appointment ?" variant="primary" value={form.emailreminder} onChange={(e) => updateField("emailreminder", e, setForm)} />} saveButton={false} />
            <Header title={'Text Message Notification'} description={<Toggle label="Send an appointment reminders and notifications by text message. $0.04 (4 cents) per text ?" variant="primary" value={form.textreminder} onChange={(e) => updateField("textreminder", e, setForm)} />} saveButton={false} />

            <Header title={'Appointment AutoAccept'} description={<Toggle label="Would you like to automatically accept new appointment requests without requiring manual approval?" variant="primary" value={form.autoaccept} onChange={(e) => updateField("autoaccept", e, setForm)} />} saveButton={false} />
        </div>
    )
}