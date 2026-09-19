import { updateField,getByKey } from "../../common/general.jsx";
import { Image, Rating, Tags, Textbox, Select, Badge, Button } from "../../controls/index.jsx"
import { NumberFormat, PriceFormat } from "../../common/validate.jsx"
import { useRef, useState } from "react";
import { useAlert } from "../../controls/AlertProvider.jsx";
import { Category_Create_Edit } from "../Category/create_edit.jsx";
import { ButtonPermission } from "../../auth/protectedButton.js";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StockInfo = ({ form, setForm }) => {
     const navigate = useNavigate();
    const { showAlert }=useAlert();
    const [openCategory, setOpenCategory] = useState(false);

    return (
        <> 
            <div class='flex flex-row justify-end items-center '>
                <ButtonPermission permission={`Item.Create`} children={
                    <Button variant="primary" icon={Plus} label={"Add items in stock"} onClick={() => navigate('/Item/Create')} />}   />
            </div> 
            
            {openCategory && (
                <Category_Create_Edit category={'inventory'} createOnly={true}  onClose={() => setOpenCategory(false)}
                />
            )}

        </>
    )
}

export default StockInfo