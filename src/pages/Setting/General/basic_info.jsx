import { Textbox, Select, Image } from "../../../controls/index.jsx";
import { updateField, canadaRegions, usStates } from "../../../common/general.jsx";
import { CellFormat } from "../../../common/validate.jsx";
import { Header } from "../rightside.jsx";
import { useRef } from "react";
import { handleFileChange } from "../../../common/upload_toS3.jsx";
import { useAlert } from "../../../controls/AlertProvider.jsx";

export default function BasicInfo({ form, setForm, image, setImage ,saveData, saveButton=true}) {
    const { showAlert } = useAlert();
    const address = form.addressinfo?.[0] ?? {
        street: "",
        country: "",
        province: "",
        postal: "",
        city: "",
    };
    const countryOption = [
        { id: 1, label: "Canada", value: "Canada" },
        { id: 2, label: "USA", value: "USA" },
    ];
    const provinceOption = (address.country === 'USA' ? usStates : canadaRegions).map((o) => ({
        id: o.code,
        label: o.name,
        name: o.name,
        value: o.code,
    }));

    const updateAddressInfoField = (field, value) => {

        const addressInfo = form.addressinfo ?? [];


        addressInfo[0] = {
            ...address,
            ...(addressInfo[0] ?? {}),
            [field]: value
        };
        updateField(
            'addressinfo',
            addressInfo,
            setForm
        );
    };

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

        <div className="space-y-5  mb-4 ">
            <Header title={'Basic Information'} description={'Provide the essential information about your business.'}
                formBody={JSON.stringify({
                    name: form.name,
                    cell: form.cell,
                    addressinfo: form.addressinfo,
                    logo: form.logo
                })}
                saveData={saveData}
                image={image} saveButton={saveButton} />

            <div class='flex flex-col gap-2 w-40'>
                <Image src={image.profilepic} preview={false} rounded="rounded-md" height="h-40" width="w-40" name={form.name} onClick={openFilePicker} />
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                />
                <p class='text-gray-400 text-xs'>Allowed *.jpeg, *.jpg, *.png</p>
            </div>

            <div class='flex flex-col gap-4  md:flex-row'>
                <Textbox required label="Business Name" placeholder="Enter business name" value={form.name} setValue={(e) => updateField("name", e, setForm)} />
                <Textbox required label="Phone Number" placeholder="(e.g., 416-555-1234)" value={form.cell} setValue={(e) => updateField("cell", CellFormat(e), setForm)} />
            </div>
            <Textbox required label="Address" placeholder="Enter street" value={address.street} setValue={(e) => updateAddressInfoField('street', e)} />
            <div class='flex flex-col gap-4  md:flex-row'>
                <Textbox required label="City" placeholder="Enter city" value={address.city} setValue={(e) => updateAddressInfoField('city', e)} />
                <Select required label="Province" value={address.province} onChange={(e) => updateAddressInfoField('province', e)} options={provinceOption} isSearch={false} />
                <Select required label="Country" value={address.country} onChange={(e) => updateAddressInfoField('country', e)} options={countryOption} isSearch={false} />
                <Textbox label="Postal" placeholder="Enter postal code" value={address.postal} setValue={(e) => updateAddressInfoField('postal', e)} />

            </div>
        </div>
    )
}