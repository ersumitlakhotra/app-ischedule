import { updateField } from "../../common/general.jsx";
import { Image, Rating, Tags, Textbox, Select, Badge } from "../../controls/index.jsx"
import { CellFormat } from "../../common/validate.jsx"
import { useRef } from "react";

const CustomerInfo = ({ form, setForm}) => {
    return (
        <>           
            <div class='flex flex-col gap-4  md:flex-row'>
                <Textbox required label="Full Name" placeholder="Enter full name" value={form.name} setValue={(e) => updateField("name", e, setForm)} />
                <Textbox label="E-Mail" placeholder="Enter e-mail" value={form.email} setValue={(e) => updateField("email", e, setForm)} />
               <Textbox required label="Phone Number" placeholder="(e.g., 416-555-1234)" value={form.cell} setValue={(e) => updateField("cell", CellFormat(e), setForm) } />
               
            </div>
        </>
    )
}

export default CustomerInfo