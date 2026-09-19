import { updateField } from "../../common/general.jsx";
import { Image, Rating, Tags, Textbox, Select, Badge } from "../../controls/index.jsx"
import { CellFormat } from "../../common/validate.jsx"
import { handleFileChange } from "../../common/upload_toS3.jsx";
import { useRef } from "react";
import { useAlert } from "../../controls/AlertProvider.jsx";

const CategoryInfo = ({ form, setForm}) => {
    return (
        <>
            <Textbox required label="Name" placeholder="Enter name " value={form.name} setValue={(e) => updateField("name", e, setForm)} />         
        </>
    )
}

export default CategoryInfo