import { Button, Checkbox, Select, Textbox, Toggle } from "../../../controls/index.jsx";
import { updateField } from "../../../common/general.jsx";
import { Header } from "../rightside.jsx";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { StarBadge } from "../../../common/starbadge.jsx";
const Row = ({
    left,
    middle,
    right,
    input1,
    input2,
    loyalty,
    updateLoyaltyInfoField
}) => {
    return (
        <div className="flex flex-row items-center gap-2 text-xs font-semibold text-gray-600 whitespace-nowrap">
            {left}

            {input1 && (
                <div className="w-16 max-w-16">
                    <Textbox
                        className="!py-1 !px-2 !text-xs"
                        value={loyalty?.[input1] ?? ""}
                        setValue={(e) =>
                            updateLoyaltyInfoField(input1, e)
                        }
                    />
                </div>
            )}

            {middle}

            {input2 && (
                <div className="w-16 max-w-16">
                    <Textbox
                        className="!py-1 !px-2 !text-xs"
                        value={loyalty?.[input2] ?? ""}
                        setValue={(e) =>
                            updateLoyaltyInfoField(input2, e)
                        }
                    />
                </div>
            )}

            {right}
        </div>
    );
};

export default function LoyaltyOptions({ form, setForm,saveData,saveButton=true }) {
    const loyalty = form.loyaltyinfo?.[0] ?? {
        active: false,
        redeem: 100,

        ispoint: false,
        pointreward: 10,

        ispunch: false,
        punchcomplete: 10,
        punchreward: 2000,

        isreferral: false,
        referralreward: 2000,

        istier: false,
        bronzetier: 10,
        bronzereward: 2000,
        silvertier: 20,
        silverreward: 2000,
        goldtier: 30,
        goldreward: 2000,
        platinumtier: 40,
        platinumreward: 2000
    };

    const updateLoyaltyInfoField = (field, value) => {

        const loyaltyInfo = form.loyaltyinfo ?? [];


        loyaltyInfo[0] = {
            ...loyalty,
            ...(loyaltyInfo[0] ?? {}),
            [field]: value
        };
        updateField('loyaltyinfo', loyaltyInfo, setForm);
    };


    return (
        <div className="space-y-5  mb-4 ">
            <Header title={'Loyalty Program'} description={<Toggle label="Would you like to activate that loyalty program?" variant="primary" value={loyalty.active} onChange={(e) => updateLoyaltyInfoField("active", e)} />}
                formBody={JSON.stringify({
                    loyaltyinfo: form.loyaltyinfo
                })}
                saveData={saveData}
                saveButton={saveButton}
            />


            <Row
                left="Redeem "
                input1="redeem"
                middle=" points = $1 reward"
                loyalty={loyalty}
                updateLoyaltyInfoField={updateLoyaltyInfoField}
            />

            <div>
                <Checkbox label={"Points-Based Program"} size="sm" checked={loyalty.ispoint} setChecked={(e) => updateLoyaltyInfoField("ispoint", e)} />
                <div className="ml-7 ">
                    <p className={`text-gray-400 text-xs mb-2`}>Customers earn points for each purchase and redeem them later.</p>
                    <Row
                        left="Spend $1 , get "
                        input1="pointreward"
                        middle=" points."
                        loyalty={loyalty}
                        updateLoyaltyInfoField={updateLoyaltyInfoField}
                    />
                </div>
            </div>

            <div>
                <Checkbox label={"Punch Card Program"} size="sm" checked={loyalty.ispunch} setChecked={(e) => updateLoyaltyInfoField("ispunch", e)} />
                <div className="ml-7 ">
                    <p className='text-gray-400 text-xs mb-2'>This scheme entails receiving rewards for fulfilling particular appointments.</p>
                    <Row
                        left="Complete "
                        input1="punchcomplete"
                        middle=" appointments, get "
                        input2="punchreward"
                        right=" points."
                        loyalty={loyalty}
                        updateLoyaltyInfoField={updateLoyaltyInfoField}
                    />
                </div>
            </div>

            <div>
                <Checkbox label={"Referral Program"} size="sm" checked={loyalty.isreferral} setChecked={(e) => updateLoyaltyInfoField("isreferral", e)} />
                <div className="ml-7 ">
                    <p className={`text-gray-400 text-xs mb-2`}>Customers get benefits for bringing in new customers.</p>
                    <Row
                        left="Bring 1 referral client, get "
                        input1="referralreward"
                        middle=" points."
                        loyalty={loyalty}
                        updateLoyaltyInfoField={updateLoyaltyInfoField}
                    />
                </div>
            </div>

            <div>
                <Checkbox label={"Tier-Based Program"} size="sm" checked={loyalty.istier} setChecked={(e) => updateLoyaltyInfoField("istier", e)} />
                <div className="ml-7">
                    <p className='text-gray-400 text-xs mb-2'>Customers will be rewarded if you reach that level.</p>
                    <div className="space-y-2 ">
                        <Row
                            left={<><StarBadge name={"bronze"} size="xs" /> <span className="w-24">Bronze badge at</span></>}
                            input1="bronzetier"
                            middle=" appointments, get "
                            input2="bronzereward"
                            right=" points."
                            loyalty={loyalty}
                            updateLoyaltyInfoField={updateLoyaltyInfoField}
                        />
                        <Row
                            left={<> <StarBadge name={"silver"} size="xs" /> <span className="w-24">Silver badge at</span></>}
                            input1="silvertier"
                            middle=" appointments, get "
                            input2="silverreward"
                            right=" points."
                            loyalty={loyalty}
                            updateLoyaltyInfoField={updateLoyaltyInfoField}
                        />
                        <Row
                            left={<> <StarBadge name={"gold"} size="xs" /> <span className="w-24">Gold badge at</span></>}
                            input1="goldtier"
                            middle=" appointments, get "
                            input2="goldreward"
                            right=" points."
                            loyalty={loyalty}
                            updateLoyaltyInfoField={updateLoyaltyInfoField}
                        />
                        <Row
                            left={<> <StarBadge name={"platinum"} size="xs" /> <span className="w-24">Platinum badge at</span></>}
                            input1="platinumtier"
                            middle=" appointments, get "
                            input2="platinumreward"
                            right=" points."
                            loyalty={loyalty}
                            updateLoyaltyInfoField={updateLoyaltyInfoField}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}