import { Button, Select, Toggle } from "../../../controls/index.jsx";
import { updateField } from "../../../common/general.jsx";
import { Header } from "../rightside.jsx";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";

export default function AppointmentOptions({ form, setForm,saveData,saveButton=true }) {

    const horizonType = [
        { id: 1, value: 1, label: '1 day' },
        { id: 2, value: 2, label: '2 days' },
        { id: 3, value: 3, label: '3 days' },
        { id: 4, value: 4, label: '4 days' },
        { id: 5, value: 5, label: '5 days' },
        { id: 7, value: 7, label: '1 Week' },
        { id: 14, value: 14, label: '2 Weeks' },
        { id: 21, value: 21, label: '3 Weeks' },
        { id: 28, value: 28, label: '4 Weeks' },
    ];

    return (
        <div className="space-y-5  mb-4 ">
            <Header title={'Appointment AutoAccept'} description={<Toggle label="Would you like to automatically accept new appointment requests without requiring manual approval?" variant="primary" value={form.autoaccept} onChange={(e) => updateField("autoaccept", e, setForm)} />}
                formBody={JSON.stringify({
                    bookingdays: form.bookingdays,
                    autoaccept: form.autoaccept
                })}
                saveData={saveData}
                saveButton={saveButton}
            />

            <Select label={`Appointment can be booked up to ${form.bookingdays} days in advance.`} value={form.bookingdays} onChange={(e) => updateField("bookingdays", e, setForm)} isSearch={false} options={horizonType} />
        </div>
    )
}