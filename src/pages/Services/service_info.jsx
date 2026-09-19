import { updateField,getByKey } from "../../common/general.jsx";
import { Image, Rating, Tags, Textbox, Select, Badge } from "../../controls/index.jsx"
import { PriceFormat } from "../../common/validate.jsx"
import { handleFileChange } from "../../common/upload_toS3.jsx";
import { useRef, useState } from "react";
import { useAlert } from "../../controls/AlertProvider.jsx";
import { Category_Create_Edit } from "../Category/create_edit.jsx";

const ServiceInfo = ({ form, setForm,image,setImage,categoryList }) => {
    const { showAlert}=useAlert();
    const [openCategory, setOpenCategory] = useState(false);
    const category2 = getByKey(categoryList, "id", form.category2);

    const timeTypes = [
        //{ id: 1, label: "Administrator", value: "Administrator" },
        { id: 1, label: "15 Minutes", value: 15 },
        { id: 2, label: "30 Minutes", value: 30 },
        { id: 3, label: "45 Minutes", value: 45 },
        { id: 4, label: "1 Hour", value: 60 },
        { id: 5, label: "2 Hour", value: 120 },
        { id: 6, label: "3 Hour", value: 180 },
        { id: 7, label: "4 Hour", value: 240 },
    ];
    const getTimeLabel = (value) => {
        const item = timeTypes.find((t) => t.value === value);
        return item ? item.label : null;
    };
    const category1Types = [
        { id: 1, label: "All Types", value: "All Types" },
        { id: 2, label: "Men", value: "Men" },
        { id: 3, label: "Women", value: "Women"},
        { id: 4, label: "Kids", value: "Kids" },
    ];
    const statusTypes = [
        { id: 1, value: 'Active', search: 'Active', label: <Badge color={'green'} text={'Active'} /> },
        { id: 2, value: 'Inactive', search: 'Inactive', label: <Badge color={'red'} text={'Inactive'} /> }
    ];
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
                        {form.category1} • {category2?.label}
                    </p>
                    <div className="flex flex-row items-center gap-3 mt-4">
                        <Tags title={form.status} dot />
                    </div>
                </div>
            </div>
            <div class='flex flex-col gap-4  md:flex-row'>
                <Textbox required label="Name" placeholder="Enter service name" value={form.name} setValue={(e) => updateField("name", e, setForm)} />
                <Textbox required label="Price $" placeholder="Enter price" value={form.price} setValue={(e) => updateField("price", PriceFormat(e), setForm)} />
                <Select label="Time" value={form.minutes} onChange={(e) => {
                    updateField("minutes", e, setForm)
                    updateField("timing", getTimeLabel(e), setForm)
                    }} options={timeTypes} isSearch={false} />

            </div>   
            <div class='flex flex-col gap-4  md:flex-row'>
                <Select label="Category 1" value={form.category1} onChange={(e) => updateField("category1", e, setForm)} options={category1Types} isSearch={false} />
                <Select label="Category 2" value={form.category2} onChange={(e) => updateField("category2", e, setForm)} options={categoryList} isAdd={true} Permission="Category" onAddClick={()=>setOpenCategory(true)}/>
                <Select label="Status" value={form.status} onChange={(e) => updateField("status", e, setForm)}  isSearch={false} options={statusTypes} />
               
            </div>
            <Textbox label="Description" placeholder="Provide a brief service description (optional)" value={form.description} setValue={(e) => updateField("description", e, setForm)} />
           
            {openCategory && (
                <Category_Create_Edit category={'services'} createOnly={true}  onClose={() => setOpenCategory(false)}
                />
            )}

        </>
    )
}

export default ServiceInfo