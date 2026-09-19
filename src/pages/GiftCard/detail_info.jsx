
import { updateField } from "../../common/general.jsx";
import { Image, Rating, Tags, Textbox, Select, Badge, DateTime, Checkbox } from "../../controls/index.jsx"
import { CellFormat, PriceFormat } from "../../common/validate.jsx"
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const DetailInfo = ({ form, setForm}) => {
    const navigate=useNavigate();
    const cardTypes = [
        { id: 1, label: "Basic", value: "Basic" },
        { id: 2, label: "Premium", value: "Premium" },
        { id: 3, label: "Vip", value: "Vip" },
        { id: 4, label: "Signature", value: "Signature" },
    ]; 

    const handleAmount = (e) => {
        const amount = Number(e);
        const used = Number(form.used);
        const balance = Number(amount - used).toFixed(2);
        updateField("amount", e, setForm);
        updateField("balance", balance.toString(), setForm);
    }

    return (
        <>           
            <div class='flex flex-col gap-4  md:flex-row'>
                <Textbox required label="Title" placeholder="Enter title" value={form.name} setValue={(e) => updateField("name", e, setForm)} />
                <Select label="Card Type" value={form.cardtype} onChange={(e) => updateField("cardtype", e, setForm)} options={cardTypes} isSearch={false}  />
                <Textbox label="Gift Code" disabled value={form.id} setValue={(e) => updateField("id", e, setForm)} />
            </div>
            <div class='flex flex-col gap-4  md:flex-row'>
                <DateTime required type={'date'}  classLabel='text-sm font-semibold text-gray-700' label={"Start (MM/DD/YYYY)"} value={form.startdate} setValue={(e) => updateField("startdate", e, setForm)} />
                <DateTime required type={'date'}  classLabel='text-sm font-semibold text-gray-700' label={"End (MM/DD/YYYY)"} value={form.enddate} setValue={(e) => updateField("enddate", e, setForm)} />
                <Textbox required label="Amount" placeholder="(e.g., 10.00)" value={form.amount} setValue={(e) => handleAmount(PriceFormat(e))} />
            </div>          
        </>
    )
}

export default DetailInfo