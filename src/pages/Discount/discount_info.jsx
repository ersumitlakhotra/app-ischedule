
import { updateField } from "../../common/general.jsx";
import { Image, Rating, Tags, Textbox, Select, Badge, DateTime, Checkbox } from "../../controls/index.jsx"
import { CellFormat } from "../../common/validate.jsx"
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const DiscountInfo = ({ form, setForm,servicesList}) => {
    const navigate=useNavigate();
    const discountTypes = [
        { id: 1, label: "$", value: "$" },
        { id: 2, label: "%", value: "%" },
    ]; 

    const serviceOptions = servicesList.map((service) => ({
        id: service.id,
        label: `${service.name} ($${service.price})`,
        name: service.name,
        value: service.id,
        price: service.price
    }));

    return (
        <>           
            <div class='flex flex-col gap-4  md:flex-row'>
                <Textbox required label="Title" placeholder="Enter title" value={form.name} setValue={(e) => updateField("name", e, setForm)} />
                <DateTime required type={'date'}  className="mt-2" classLabel='text-sm font-semibold text-gray-700' label={"Start (MM/DD/YYYY)"} value={form.startdate} setValue={(e) => updateField("startdate", e, setForm)} />
                <DateTime required type={'date'}  className="mt-2" classLabel='text-sm font-semibold text-gray-700' label={"End (MM/DD/YYYY)"} value={form.enddate} setValue={(e) => updateField("enddate", e, setForm)} />
            </div>
            <div class='flex flex-col gap-4  md:flex-row'>
                <Select label="Discount Type" value={form.discounttype} onChange={(e) => updateField("discounttype", e, setForm)} options={discountTypes} isSearch={false} placement="top" />
                <Textbox required label="Discount" placeholder="(e.g., 10.00)" value={form.discount} setValue={(e) => updateField("discount", e, setForm)} />
                <Textbox label="Coupon" disabled  value={form.coupon} setValue={(e) => updateField("coupon", e, setForm)} />
             </div>
             {/* <Select label="Services" value={form.services} onChange={(e) => updateField("services", e, setForm)} options={[]} isAdd={true} onAddClick={()=>setOpenCategory(true)}/>*/}
            <div class='flex flex-col gap-4  md:flex-row'>
                <div class='flex gap-2 flex-col w-1/2'>
                    <Checkbox label="For New Customer Only" checked={form.newcustomer} setChecked={(e) => updateField("newcustomer", e, setForm)} />
                    <Checkbox label="One time use only" checked={form.onetime} setChecked={(e) => updateField("onetime", e, setForm)} />
                </div>
                <Textbox label={`Limited offer`} value={form.upto} setValue={(e) =>  updateField("upto", e, setForm)} helperText={`Only the first ${form.upto} eligible customers can redeem this discount.`} />
            </div>
             <Select isMulti label="Services" value={form.services} placeholder="All Services" onChange={(e) => updateField("services", e, setForm)} options={serviceOptions} isAdd={true}
             helperText="Select specific services, or leave blank to apply this discount to all services." Permission="Services" onAddClick={() => navigate('/Services/Create')} /> {/**/}
               
            <Textbox label="Description" placeholder="Provide a brief description (optional)" value={form.description} setValue={(e) => updateField("description", e, setForm)} />
           
        </>
    )
}

export default DiscountInfo