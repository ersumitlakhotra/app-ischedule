import { updateField,getByKey } from "../../common/general.jsx";
import { CellFormat } from "../../common/validate.jsx";
import { Image, Rating, Tags, Textbox, Select, Badge,Textarea } from "../../controls/index.jsx"
import { useRef, useState } from "react";

const CustomerInfo = ({ form, setForm,customerList }) => {
    
    const [searchInput, setSearchInput] = useState('');
    const customerOptions = customerList.map((o) => ({
        id: o.id,
        label: `${o.cell} : ${o.name} `,
        name: o.name,
        cell:o.cell,
        email:o.email,
        value: o.id,
        search:`${o.name} ${(o.cell || '').replace(/\D/g, "")} ${o.cell} `
    }));

    const handleSelect = (Id) => {
        const selected = customerOptions.find((item) => item.id === Id);
        if (!selected) return;

        updateField("name", selected.name, setForm);
        updateField("cell", CellFormat(selected.cell), setForm);
        updateField("email", selected.email, setForm);

    }
    return (
        <>
            <Select label="Search by name or phone number" value={searchInput} onChange={(e) => { setSearchInput(e);handleSelect(e)}} options={customerOptions}  />
            
            <div class='flex flex-col gap-4  md:flex-row'>
                
                <Textbox required label="Customer Name" placeholder="Enter fullname " value={form.name} setValue={(e) => updateField("name", e, setForm)} />
                <Textbox required label="Phone Number" placeholder="(e.g., 416-555-1234)" value={form.cell} setValue={(e) => updateField("cell", CellFormat(e), setForm)} />
                <Textbox label="E-Mail" placeholder="Enter e-mail" value={form.email} setValue={(e) => updateField("email", e, setForm)} />
            </div>
             <Select label="Referred By" value={form.referral} onChange={(e) => updateField("referral", e, setForm)} options={customerOptions}  />
           
            <Textarea label="Notes" value={form.notes} setValue={(e) => updateField("notes", e, setForm)} placeholder="(Optional)" />
        </>
    )
}

export default CustomerInfo

{/*name: "",
        cell: "",
        email: "",
        reason: "",
        notes: "",
        additionalnotes: "",*/}