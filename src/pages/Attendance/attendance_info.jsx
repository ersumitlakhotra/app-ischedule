import { getTimeDifference, updateField } from "../../common/general.jsx";
import { Rating, Tags, Textbox, Select, Badge, DateTime, Checkbox, Textarea } from "../../controls/index.jsx"
import { CellFormat } from "../../common/validate.jsx"
import { useEffect, useRef, useState } from "react";
import { useAlert } from "../../controls/AlertProvider.jsx";

const AttendanceInfo = ({ form, setForm, userList }) => {

    const employee = userList.map((item) => ({
        id: item.id,
        label: item.fullname,
        value: item.id
    }));

    const workingTypes = [
        { id: true, label: <Badge color={'green'} text={'Working'} />, value: true },
        { id: false, label: <Badge color={'red'} text={'Day Off'} />, value: false },
    ];
    const statusTypes = [
        { id: 1, value: 'Present', search: 'Present', label: <Badge color={'green'} text={'Present'} /> },
        { id: 2, value: 'Half Day', search: 'Half Day', label: <Badge color={'yellow'} text={'Half Day'} /> },
        { id: 3, value: 'Absent', search: 'Absent', label: <Badge color={'red'} text={'Absent'} /> },
        { id: 4, value: 'Leave', search: 'Leave', label: <Badge color={'violet'} text={'Leave'} /> },
        { id: 5, value: 'Holiday', search: 'Holiday', label: <Badge color={'gray'} text={'Holiday'} /> },
    ];
    const check_In_Out_Required = form.status === "Present" || form.status === "Half Day";

    const [lateArrivalError, setLateArrivalError] = useState("")
    useEffect(() => {
        handleWorkTime();
        if (!form.starttime || !form.checkin) return;
        const diff = getTimeDifference(form.starttime, form.checkin);
        updateField("islate", diff.minutes > 0, setForm);
        setLateArrivalError(diff.minutes > 0 ? `⚠️ ${diff.text} late` : "");

    }, [form.starttime, form.checkin])

    const [earlyDepartError, setEarlyDepartError] = useState("")
    useEffect(() => {
        handleWorkTime();
        if (!form.endtime || !form.checkout) return;
        const diff = getTimeDifference(form.checkout, form.endtime);
        updateField("isearly", diff.minutes > 0, setForm);
        setEarlyDepartError(diff.minutes > 0 ? `⚠️ ${diff.text} early` : "");
    }, [form.endtime, form.checkout])

    const handleWorkTime = () => {
        if (!form.checkin || !form.checkout) return;
        const diff = getTimeDifference(form.checkin, form.checkout);

        updateField("worktime", diff.short, setForm);
        updateField("minutes", diff.minutes, setForm);
    }

    return (
        <>
        {/*
            <div class='flex flex-col gap-4  md:flex-row'>
                <Select required label="Employee" value={form.uid} onChange={(e) => updateField("uid", e, setForm)} options={employee} isSearch={false} />
                <DateTime label={"Date"} type={'date'} value={form.trndate} setValue={(e) => updateField("trndate", e, setForm)}/>
            </div>
            */}
            <div class='flex flex-col gap-4  md:flex-row'>
                <Select required label="Working" value={form.isworking} onChange={(e) => {updateField("isworking", e, setForm);updateField("status", e ? "Present":"Holiday", setForm)}} isSearch={false} options={workingTypes} />
                <DateTime label={"Shift Start"} value={form.starttime} setValue={(e) => updateField("starttime", e, setForm)} required={form.isworking} disabled={!form.isworking} />
                <DateTime label={"Shift End"} value={form.endtime} setValue={(e) => updateField("endtime", e, setForm)} required={form.isworking} disabled={!form.isworking} />
            </div>
            {form.isworking &&
                <>
                    <div class='flex flex-col gap-4  md:flex-row'>
                        <Select label="Status" value={form.status} onChange={(e) => updateField("status", e, setForm)} isSearch={false} options={statusTypes} />
                        <DateTime label={"Check In"} value={form.checkin} setValue={(e) => updateField("checkin", e, setForm)} required={check_In_Out_Required} disabled={!check_In_Out_Required} helperText={check_In_Out_Required && lateArrivalError} />
                        <DateTime label={"Check Out"} value={form.checkout} setValue={(e) => updateField("checkout", e, setForm)} required={check_In_Out_Required} disabled={!check_In_Out_Required} helperText={check_In_Out_Required && earlyDepartError} />
                    </div>

                    {form.islate && check_In_Out_Required && <Textbox label="Late Arrival"  placeholder="Please provide a reason (Optional)" value={form.latereason} setValue={(e) => updateField("latereason", e, setForm)} helperText={"⚠️ Your check-in is past the scheduled shift start time. Please provide a reason for the late arrival."} />}
                    {form.isearly && check_In_Out_Required &&  <Textbox label="Early Depart" placeholder="Please provide a reason (Optional)" value={form.earlyreason} setValue={(e) => updateField("earlyreason", e, setForm)} helperText={"⚠️ Your check-out is earlier than the scheduled shift end time. Please provide a reason for the early departure."} />}
                    {form.status !== "Holiday" && !check_In_Out_Required && <Textbox label="Reason for absent/leave" placeholder="Please provide a reason (Optional)" value={form.leavereason} setValue={(e) => updateField("leavereason", e, setForm)} helperText={"It helps to maintain accurate attendance and absent/leave records.."} />}
                </>
            }
            <Textarea label="Additional Notes" value={form.notes} setValue={(e) => updateField("notes", e, setForm)} placeholder="(Optional)"/>
        </>
    )
}

export default AttendanceInfo