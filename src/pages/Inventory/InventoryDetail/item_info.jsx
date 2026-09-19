import { updateField, getByKey } from "../../../common/general.jsx";
import { Badge, Item, Select, Textbox, Calendar, DateTime } from "../../../controls/index.jsx"
import { NumberFormat, PriceFormat } from "../../../common/validate.jsx"
import { useEffect, useRef, useState } from "react";

const ItemInfo = ({ form, setForm }) => {

    useEffect(() => {
        const subtotal = parseFloat(form.subtotal) || 0;
        const tax = parseFloat(form.tax) || 0;
        const unit = parseFloat(form.unit) || 1;

        const total = (subtotal + tax).toFixed(2);
        const costprice = form.unit > 0 ? (subtotal / unit).toFixed(2) : "0.00";
        updateField("total", total, setForm);
        updateField("costprice", costprice, setForm);
    }, [form.subtotal, form.tax, form.unit]);

    return (
        <>
            <div class='flex flex-col gap-4  md:flex-row'>
                <Textbox required label="Unit" placeholder="(e.g) 10" value={form.unit} setValue={(e) => updateField("unit", NumberFormat(e), setForm)} />
                <Select label={"Transaction"} value={form.transaction} onChange={(e) => updateField("transaction", e, setForm)} isSearch={false}
                    options={[
                        { id: 'Purchase', value: 'Purchase', label: <Badge color={'green'} text={'Purchase'} /> },
                        { id: 'Usage', value: 'Usage',  label: <Badge color={'yellow'} text={'Usage'} /> },
                        { id: 'Sell', value: 'Sell',  label: <Badge color={'red'} text={'Sell'} /> },
                    ]}
                />
                <DateTime label={"Date"} type={'date'} value={form.trndate} setValue={(e) => updateField("trndate", e, setForm)}/>
            </div>
            <div class='flex flex-col gap-4  md:flex-row'>
                <Textbox label="Sub Total" placeholder="Enter receipt subtotal" value={form.subtotal} setValue={(e) => updateField("subtotal", PriceFormat(e), setForm)} />
                <Textbox label="Tax $" placeholder="Enter tax amount in $" value={form.tax} setValue={(e) => updateField("tax", PriceFormat(e), setForm)} />
                <Textbox label="Total" value={form.total} disabled />
            </div>
        </>
    )
}

export default ItemInfo