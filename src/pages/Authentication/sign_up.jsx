/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { apiCalls } from "../../hook/apiCall";
import { Mail, SendHorizonal, LoaderCircle, Eye, EyeClosed, House, Phone, MonitorUp } from "lucide-react";
import { FooterModal, HeaderModal } from "../../common/index.jsx";
import { Textbox, Button, Modal, Select } from "../../controls/index.jsx";
import { useAlert } from "../../controls/AlertProvider.jsx";
import FetchData from "../../hook/fetchData";
import SaveData from "../../hook/saveData.js";
import { CellFormat } from "../../common/validate.jsx";
import { usStates, canadaRegions, updateField } from "../../common/general.jsx";


export const Signup = ({ logo }) => {

    const { showAlert } = useAlert();
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState([]);
    const [code,setCode] = useState(null);
    const [codeEnter,setCodeEnter] = useState(null);

    const generateCode = () => {
        const length = 10;
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let code = "";

        for (let i = 0; i < length; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    const [form, setForm] = useState({
        name: "",
        email: "",
        cell: "",
        addressinfo: [{
            street: "",
            country: "Canada",
            province: "ON",
            postal: "",
            city: "",
        }],
        timinginfo: [{
            monday: ["09:00:00", "21:00:00", true],
            tuesday: ["09:00:00", "21:00:00", true],
            wednesday: ["09:00:00", "21:00:00", true],
            thursday: ["09:00:00", "21:00:00", true],
            friday: ["09:00:00", "21:00:00", true],
            saturday: ["09:00:00", "21:00:00", true],
            sunday: ["09:00:00", "21:00:00", true],
        }],

        pricing: "0.00",
        plan: "FREE TRIAL",
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
        store: generateCode(),
        discount: 0,
        issetupcomplete: false,
        billinginfo: [],
        active: true,
        category: "",
        twilliocell: "775-403-5598",

        createdat: null,
        modifiedat: null,
    });

    const handleValidate = () => {
        if (!form.name?.trim()) {
            showAlert({
                type: "error",
                message: "Please enter your business name.",
                duration: 5000,
            });
            return false;
        }


        if (!form.cell?.trim()) {
            showAlert({
                type: "error",
                message: "Please enter your phone number.",
                duration: 5000,
            });
            return false;
        }

        if (form.cell.length !== 12) {
            showAlert({
                type: "error",
                message: "Please enter a valid phone number.",
                duration: 5000,
            });
            return false;
        }

        if (!form.email?.trim()) {
            showAlert({
                type: "error",
                message: "Please enter your email address.",
                duration: 5000,
            });
            return false;
        }

        if (!form.password?.trim()) {
            showAlert({
                type: "error",
                message: "Please enter a password.",
                duration: 5000,
            });
            return false;
        }

        return true;
    };
    const handleRequestCode = async () => {
        if (!handleValidate()) {
            return;
        }

        try {
            setLoading(true);
            const response = await FetchData({
                method: "POST",
                endPoint: 'company-detail',
                body: { email: form.email }
            })
            const data = response.data
            if (data === null) {
                showAlert({
                    type: "error",
                    message: response.message,
                    duration: 5000,
                });
            }
            else if (Object.keys(data).length === 0) {
                const code = Math.floor(100000 + Math.random() * 900000);
                const Subject = `${process.env.REACT_APP_PROJECT_NAME} Verification Code`;

                let message = '<p>Hi ' + form.name + '</p>';
                message += '<p>Please enter the following verification code to create you account.</p><br/>';
                message += '<p><big><b>' + code + ' </b></big></p>';
                message += `<p>In case you were not trying to create your account & are seeing this email, please contact us at ${process.env.REACT_APP_SUPPORT_EMAIL}</p>`;

                const body = JSON.stringify({
                    to: form.email,
                    subject: Subject,
                    message: message,
                });
                await apiCalls('POST', 'sendverification', null, body);
                setCode(code);
                setCodeEnter("");
                setOpen(true);
            }
            else {
              showAlert({
                    type: "error",
                    message: "An account with these details already exists. Please verify your information and try again, or use different details to create a new account.",
                    duration: 5000,
                });
            }
        }
        catch (err) {
            showAlert({
                type: "error",
                message: err.message,
                duration: 5000,
            });

        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async () => {
        {/* Save data  */ }
        setLoading(true);
        const res = await SaveData({
            method: 'POST',
            label: "Sign Up",
            endPoint: "signup",
            body: form
        });

        if (res.isSuccess) {
            showAlert({
                type: "success",
                message: res.message,
                duration: 5000,
            });
            setOpen(false);
        }
        else
            showAlert({
                type: "error",
                message: res.message,
                duration: 5000,
            });
        setLoading(false);

    };

    const Validate = () => {
        const errors = [];

        if (codeEnter.toString() !== code.toString())
            errors.push("The verification code is incorrect. Please check the code and try again.");

        setMessage(errors);
        return errors.length === 0;

    };
    return (
        <>
            <div class="bg-gray-50  p-4">
                <div class="flex flex-col items-center justify-center px-6 py-8 h-full ">
                    <img class="w-20 h-20 mb-2 mt-4" src={logo} alt="logo" />
                    <div class="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0 ">
                        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 class="text-xl font-bold font-sans leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Sign up
                            </h1>
                            <p class="block mb-2 text-sm font-small text-gray-700 dark:text-white">
                                Create an account to start managing your appointments and build your remote team.
                            </p>
                            <Textbox required label="Business Name" icon={House} placeholder="Enter business name" value={form.name} setValue={(e) => updateField("name", e, setForm)} />
                            <Textbox required label="Phone Number" icon={Phone} placeholder="(e.g., 416-555-1234)" value={form.cell} setValue={(e) => updateField("cell", CellFormat(e), setForm)} />
                            <Textbox required label="Email" icon={Mail} placeholder="Enter email " value={form.email} setValue={(e) => updateField("email", e, setForm)} />
                            <Textbox required type={visible ? "text" : "password"} icon={visible ? Eye : EyeClosed} iconClick={(e) => setVisible(!visible)} label="Password" placeholder="******" value={form.password} setValue={(e) => updateField("password", e, setForm)} />
                            <div class='flex flex-col gap-4  md:flex-row'>
                                <Textbox label="Owner Name" placeholder="Enter full name" value={form.owner} setValue={(e) => updateField("owner", e, setForm)} />
                                <Textbox label="Owner Mobile Number" placeholder="(e.g., 416-555-1234)" value={form.ownercell} setValue={(e) => updateField("ownercell", CellFormat(e), setForm)} />
                            </div>

                            <div class="flex items-center justify-between">
                                <div class="flex items-start">
                                    <div class="flex items-center h-5">
                                        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                                            Already have an account? <a href="/login" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign in</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Button variant="primary" className="w-full" icon={MonitorUp} label="Submit" onClick={() => handleRequestCode()} />

                            <p class="block mb-2 text-center text-xs font-small text-gray-500 dark:text-white">
                                By signing up to create an account, you are accepting
                                <a href="/terms-conditions" target="_blank" class="font-medium text-primary-600 hover:underline dark:text-primary-500"> our terms of service </a>and
                                <a href="/privacy-policy" target="_blank" class="font-medium text-primary-600 hover:underline dark:text-primary-500"> privacy policy</a>
                            </p>
                        </div>
                    </div>
                </div>

                {loading && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 9999, // Ensure it's on top
                        }}
                    >
                        <LoaderCircle className="h-12 w-12 animate-spin " />
                    </div>
                )}


            </div>
            <Modal open={open} message={message} messageType="error" children={
                <>
                    <HeaderModal Title="Create Your Business Account"
                        Description="Enter the verification code sent to your email, then create your account and get started with iSchedule.."
                        onClick={() => setOpen(false)} />
                    <div className="flex-1 overflow-y-auto px-8 py-4 mb-10 ">
                        <Textbox label="Verification Code" placeholder="123456" value={codeEnter} setValue={(e) => setCodeEnter(e)} />
                          </div>
                    <FooterModal
                        step={1}
                        totalSteps={1}
                        completeLabel="Save"
                        onComplete={() => Validate() && handleSubmit()}
                    />
                </>
            } />
        </>
    );
};


export default Signup;