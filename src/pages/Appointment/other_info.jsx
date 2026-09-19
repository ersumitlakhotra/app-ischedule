import { APPOINTMENT_STATUS_OPTIONS } from "../../common/enum.jsx";
import { updateField,getByKey } from "../../common/general.jsx";
import { CellFormat } from "../../common/validate.jsx";
import { Image, Rating, Tags, Textbox, Select, Badge,Textarea } from "../../controls/index.jsx"
import { useRef, useState } from "react";

const OtherInfo = ({ form, setForm }) => {
    const status = form.status === "Pending" || form.status === "Completed";
    const reasonText =
    form.status === "Rejected"
        ? "Please provide the reason for rejecting this appointment. This information may be shared with staff or kept for internal records."
        : form.status === "Cancelled"
        ? "Please provide the reason for cancelling this appointment. This helps maintain accurate appointment records."
        : form.status === "No Show"
        ? "Please explain why the customer was marked as a no-show. Include any relevant details if available."
        : "";
    return (
        <>
            <Select label={'Status'} value={form.status}  onChange={(e) => updateField("status", e, setForm)} isSearch={false} options={APPOINTMENT_STATUS_OPTIONS.filter(o => o.id !== 0)}/>
            {!status && <Textbox label="Reason" placeholder="Please provide a reason (Optional)" value={form.reason} setValue={(e) => updateField("reason", e, setForm)} helperText={"⚠️ " + reasonText} />}
            <Textarea label="Additional Notes" value={form.additionalnotes} setValue={(e) => updateField("additionalnotes", e, setForm)} placeholder="(Optional)" />
        </>
    )
}

export default OtherInfo