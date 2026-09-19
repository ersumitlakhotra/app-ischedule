/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAlert } from "../../controls/AlertProvider.jsx";
import Aside from "./aside.jsx";
import RightSide from "./rightside.jsx";
import { Header, IsLoading } from "../../common/index.jsx";

export const Setting = () => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const { refresh,saveData, getBilling, getLogs,getCompany, activeSettingTab, setActiveSettingTab } = useOutletContext();
    const [isLoading, setIsLoading] = useState(false);
    const [billingList, setBillingList] = useState([]);
    const [logsList, setLogsList] = useState([]);

    const [form, setForm] = useState({
        id: 0,
        cid: 0,

        name: "",
        email: "",
        cell: "",
        addressinfo: [],
        timinginfo: [],

        pricing: "",
        plan: "",
        socialinfo: [],
        loyaltyinfo: [],
        password: "",
        bookingdays: 7,
        emailuser: "",
        emailpass: "",
        emailservice: "gmail",
        autoaccept: false,
        emailreminder: false,
        textreminder: false,
        credit: 0,
        logo: null,

        
        owner: "",
        ownercell: "",
        slot: 30,
        store: "",
        discount: 0,
        issetupcomplete: false,
        billinginfo: [],
        active: true,
        category: "",
        twilliocell: "",

        createdat: null,
        modifiedat: null,
    });
    const [image, setImage] = useState({
        isNew: false,
        profilepic: null,
        file: null,
        fileType: null,
    })

    useEffect(() => {
        Init();
    }, [refresh])

    const Init = async () => {
        try {
            setIsLoading(true);

            const billingResponse = await getBilling();
            setBillingList(billingResponse);

            const logsResponse = await getLogs();
            setLogsList(logsResponse);

            const Response = await getCompany();
            if (Response) {
                setForm(Response);
                setImage({
                    ...image,
                    profilepic: Response.logo
                })
            }
            else {
                showAlert({
                    type: "error",
                    message: "Not Found",
                    duration: 5000,
                });
                navigate(-1);
            }
            // set state here
        } catch (error) {
            showAlert({
                type: "error",
                message: error,
                duration: 5000,
            });
            navigate(-1);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div class="flex flex-col gap-4 md:px-7 py-4 mb-12">
            <Header Title={"Setting"} Permission={"Setting"} IsExport={false} />

            <IsLoading isLoading={isLoading} rows={20} input={
                <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
                    <Aside form={form} setForm={setForm} saveData={saveData} billingList={billingList.filter((o) => o.category === "invoice" && o.status !== "Paid")} setActiveSettingTab={setActiveSettingTab} />
                    <RightSide form={form} saveData={saveData} billingList={billingList} logsList={logsList} setForm={setForm} image={image} setImage={setImage} activeSettingTab={activeSettingTab} setActiveSettingTab={setActiveSettingTab} />
                </div>
            } />

        </div>
    );
};





