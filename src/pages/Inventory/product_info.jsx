import { updateField,getByKey } from "../../common/general.jsx";
import { Image, Rating, Tags, Textbox, Select, Badge } from "../../controls/index.jsx"
import { NumberFormat, PriceFormat } from "../../common/validate.jsx"
import { handleFileChange } from "../../common/upload_toS3.jsx";
import { useRef, useState } from "react";
import { useAlert } from "../../controls/AlertProvider.jsx";
import { Category_Create_Edit } from "../Category/create_edit.jsx";

const ProductInfo = ({ form, setForm,image,setImage,categoryList }) => {
    const { showAlert }=useAlert();
    const [openCategory, setOpenCategory] = useState(false);
    const category = getByKey(categoryList, "id", form.categoryid);

    const inputRef = useRef(null);

    const openFilePicker = () => {
        inputRef.current?.click();
    };

    const handleImageChange = async (event) => {
        const result = await handleFileChange(event);

        if (!result.status) {
          showAlert({
                type: "error",
                message: result.error,
                duration: 5000,
            });
            return;
        }
        setImage({
            isNew: true,
            profilepic: result.base64,
            file: result.file,
            fileType: result.fileType,
        });
    };
    return (
        <>
            <div class='w-full flex flex-row '>
                <div class='flex flex-col gap-2 w-40'>
                    <Image src={image.profilepic} preview={false} rounded="rounded-md" height="h-24" width="w-24" name={form.name} onClick={openFilePicker} />
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                    />
                    <p class='text-gray-400 text-xs'>Allowed *.jpeg, *.jpg, *.png</p>
                </div>
                <div class='flex flex-col'>
                    <p class='text-xl font-semibold text-gray-600'>{form.name}</p>
                    <p className="text-xs text-gray-500 ">
                        stock : {form.stock} • {category?.label}
                    </p>
                    <div className="flex flex-row items-center gap-3 mt-4">
                        <Tags title={Number(form.stock) > 0 ?"InStock":"OutStock"} dot />
                    </div>
                </div>
            </div>
            <div class='flex flex-col gap-4  md:flex-row'>
                <Textbox required label="Name" placeholder="Enter product name" value={form.name} setValue={(e) => updateField("name", e, setForm)} />
                <Select label="Category" value={form.categoryid} onChange={(e) => updateField("categoryid", e, setForm)} options={categoryList} isAdd={true} Permission="Category" onAddClick={() => setOpenCategory(true)} />
                <Textbox label="Stock" disabled  value={form.stock}  />   
            </div>   
            <div class='flex flex-col gap-4  md:flex-row'>
                <Textbox label="Min Stock" placeholder="(e.g) 10" value={form.minstock} setValue={(e) => updateField("minstock", NumberFormat(e), setForm)}  helperText={"Set the minimum stock level. You'll receive a low-stock alert when inventory reaches or falls below this quantity."} />
                <Textbox label="Max Stock" placeholder="(e.g) 50" value={form.maxstock} setValue={(e) => updateField("maxstock", NumberFormat(e), setForm)}  />
                <Textbox label="Sell Price" placeholder="Enter Price" value={form.sellprice} setValue={(e) => updateField("sellprice", PriceFormat(e), setForm)}  />              
            </div>
            <div class='flex flex-col gap-4  md:flex-row'>
                <Textbox label="SKU" placeholder="(e.g) ITEM-BLK-M " value={form.sku} setValue={(e) => updateField("sku", e, setForm)}   />
                <Textbox label="Barcode" placeholder="Enter Barcode " value={form.barcode} setValue={(e) => updateField("barcode", e, setForm)}  />           
            </div>
            <Textbox label="Description" placeholder="Provide a brief product description (optional)" value={form.description} setValue={(e) => updateField("description", e, setForm)} />
           
            {openCategory && (
                <Category_Create_Edit category={'inventory'} createOnly={true}  onClose={() => setOpenCategory(false)}
                />
            )}

        </>
    )
}

export default ProductInfo