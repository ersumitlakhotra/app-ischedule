import { updateField } from "../../common/general.jsx";
import { Image, Rating, Tags, Textbox, Select, Badge } from "../../controls/index.jsx"
import { CellFormat } from "../../common/validate.jsx"
import { handleFileChange } from "../../common/upload_toS3.jsx";
import { useRef } from "react";
import { useAlert } from "../../controls/AlertProvider.jsx";

const PersonalInfo = ({ form, setForm,image,setImage }) => {
    const { showAlert}=useAlert();
    
    const roleTypes = [
        //{ id: 1, label: "Administrator", value: "Administrator" },
        { id: 1, label: "Manager", value: "Manager" },
        { id: 2, label: "User", value: "User" },
        { id: 3, label: "Employee", value: "Employee" },
    ];
    const genderTypes = [
        { id: 1, label: "Male", value: "Male" },
        { id: 2, label: "Female", value: "Female" },
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
                    <Image src={image.profilepic} preview={false} rounded="rounded-md" height="h-24" width="w-24" name={form.fullname} onClick={openFilePicker} />
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
                    <p class='text-xl font-semibold text-gray-600'>{form.fullname}</p>
                    <Rating disabled value={form.rating} size={20} />
                    <div className="flex flex-row items-center gap-3 mt-4">
                        <Tags title={form.role} color="yellow" />
                        <Tags title={form.status} dot />
                    </div>
                </div>
            </div>
            <div class='flex flex-col gap-4  md:flex-row'>
                <Textbox required label="Full Name" placeholder="Enter full name" value={form.fullname} setValue={(e) => updateField("fullname", e, setForm)} />
                <Textbox label="E-Mail" placeholder="Enter e-mail" value={form.email} setValue={(e) => updateField("email", e, setForm)} />
                <Select label="Role" value={form.role} onChange={(e) => updateField("role", e, setForm)} options={roleTypes} isSearch={false}  />

            </div>
            <div class='flex flex-col gap-4  md:flex-row'><Textbox required label="Phone Number" placeholder="(e.g., 416-555-1234)" value={form.cell} setValue={(e) => { updateField("cell", CellFormat(e), setForm); updateField("username", e.replace(/\D/g, ""), setForm) }} helperText={"This phone number will be used as your username to sign in."} />
               
                 <Textbox required label="Password" placeholder="*****" type="password" value={form.password} setValue={(e) => updateField("password", e, setForm)} />
            </div>
            <Textbox label="Address" placeholder="Enter the employee's full address, including city and province" value={form.address} setValue={(e) => updateField("address", e, setForm)} />
            <div class='flex flex-col gap-4  md:flex-row'>
                <Select label="Gender" value={form.gender} onChange={(e) => updateField("gender", e, setForm)} options={genderTypes} isSearch={false}  placement="top" />
                <Select label="Status" value={form.status} onChange={(e) => updateField("status", e, setForm)} isSearch={false} options={statusTypes}  placement="top"/>
            </div>

        </>
    )
}

export default PersonalInfo