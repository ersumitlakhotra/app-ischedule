/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { apiCalls } from "../../hook/apiCall";
import CountdownTimer from "../../common/countTimer";
import { EmailFormat } from "../../common/validate";
import { Mail, SendHorizonal, LoaderCircle, Eye, EyeClosed } from "lucide-react";
import { FooterModal, HeaderModal, updateField } from "../../common";
import { Textbox, Button, Modal } from "../../controls/index.jsx";
import { useAlert } from "../../controls/AlertProvider.jsx";
import FetchData from "../../hook/fetchData";
import SaveData from "../../hook/saveData.js";

export const ForgotPassword = ({ logo }) => {

    const { showAlert } = useAlert();
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    
        const [message, setMessage] = useState([]);

    const [form, setForm] = useState({
        id:0,
        name: "",
        email: "",
        code: "",
        codeenter: "",
        password: "",
        confirm: "",
    }); 

    const handleRequestCode = async () => {
        try {
            setLoading(true);
            const response = await FetchData({
                method: "POST",
                endPoint: 'company-detail',
                body: { email: form.email }
            })
            const data = response.data
            if (data === null || Object.keys(data).length === 0) {
                showAlert({
                    type: "error",
                    message: response.message,
                    duration: 5000,
                });
            }
            else {
                const code = Math.floor(100000 + Math.random() * 900000);
                const name= data.name;
                const id=data.id;
                const Subject = `${process.env.REACT_APP_PROJECT_NAME} Verification Code`;

                let message = '<p>Hi ' + name + '</p>';
                message += '<p>Please enter the following verification code to reset your account password.</p><br/>';
                message += '<p><big><b>' + code + ' </b></big></p>';
                message += `<p>In case you were not trying to reset your account password & are seeing this email, please contact us at ${process.env.REACT_APP_SUPPORT_EMAIL}</p>`;

                const body = JSON.stringify({
                    to: form.email,
                    subject: Subject,
                    message: message,
                });
                await apiCalls('POST', 'sendverification', null, body);

                updateField("id", id, setForm);
                updateField("code", code, setForm);
                updateField("name", name, setForm);
                updateField("codeenter", "", setForm);
                updateField("password", "", setForm);
                updateField("confirm", "", setForm);
                setOpen(true);
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
            label: "Reset Password",
            endPoint: "reset-password",
            body: { id: form.id, password: form.password }
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

        if (form.codeenter.toString() !== form.code.toString())
            errors.push("The verification code is incorrect. Please check the code and try again.");

        if (form.password !== form.confirm || form.password.trim() === "" || form.confirm.trim() === "")
            errors.push("Password do not match. Please ensure both passwords are entered correctly.");

        setMessage(errors);
        return errors.length === 0;

    };
    return (
        <>
            <div class="bg-gray-50 h-screen py-4">
                <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <img class="w-20 h-20 mb-2" src={logo} alt="logo" />
                    <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Forgot your password
                            </h1>
                            <p class="block mb-2 text-sm font-small text-gray-700 dark:text-white">
                                Please enter the admin email address and we'll send you a verification code to reset your password.
                            </p>

                            <Textbox required label="Admin Email" icon={Mail} placeholder="name@company.com" value={form.email} setValue={(e) => updateField("email", e, setForm)} />
                            <Button variant="primary" className="w-full" icon={SendHorizonal} label="Request Code" onClick={() => handleRequestCode()} />

                            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                                Already have an account? <a href="/login" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign in</a>
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
                    <HeaderModal Title="Reset Your password" 
                    Description="Enter the verification code sent to your email, then create a new password to securely restore access to your account."
                    onClick={() => setOpen(false)} />
                    <div className="flex-1 overflow-y-auto px-8 py-4 mb-10 ">
                        <Textbox label="Verification Code" placeholder="1234565" value={form.codeenter} setValue={(e) => updateField("codeenter", e, setForm)} />
                        <Textbox type={visible ? "text" : "password"} icon={visible ? Eye : EyeClosed} iconClick={(e) => setVisible(!visible)} label="Password" placeholder="******" value={form.password} setValue={(e) => updateField("password", e, setForm)} />
                        <Textbox type={visible ? "text" : "password"} icon={visible ? Eye : EyeClosed} iconClick={(e) => setVisible(!visible)} label="Confirm" placeholder="******" value={form.confirm} setValue={(e) => updateField("confirm", e, setForm)} />
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


export default ForgotPassword;