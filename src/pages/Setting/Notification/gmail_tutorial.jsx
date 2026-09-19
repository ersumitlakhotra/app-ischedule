
import React, { useRef } from "react";
import { BriefcaseBusiness } from "lucide-react";
import { useNavigate } from "react-router-dom";
import step2verification from '../../../Images/gif/2stepVerification.gif';
import apppassword from '../../../Images/gif/app_password.gif';
import apppasswordcreate from '../../../Images/gif/app_password_create.gif';
import { HeaderModal } from "../../../common/index.jsx";
import { Modal } from "../../../controls/index.jsx";

export const Gmail_Tutorial = () => {
    const navigate = useNavigate();
    const contentRef = useRef(null);

    const steps = [
        {
            id: 1, label: "Setup Tutorial", icon: BriefcaseBusiness, content:
                <ol className="list-decimal list-inside space-y-4">
                    <li dangerouslySetInnerHTML={{ __html: `Login into <b>Gmail Account -> Manage Account -> Security & sign-in </b>` }} />
                    <li>
                        <span>Turn on <b>2 Step Verification.</b></span>
                        <img
                            draggable={false}
                            alt="2stepVerification.gif"
                            src={step2verification}
                        />
                    </li>
                    <li>
                        <span>Type <b>App Passwords</b> in search,click, and navigate to that page.</span>
                        <img
                            draggable={false}
                            alt="app_password.gif"
                            src={apppassword}
                        />
                    </li>
                    <li >
                        <span dangerouslySetInnerHTML={{ __html: `Type <b>App Name -> </b>click <b>CREATE</b> then copy , paste password in <b>App Password field.</b>` }} />
                        <img
                            draggable={false}
                            alt="app_password_create.gif"
                            src={apppasswordcreate}
                        />
                    </li>
                    <li dangerouslySetInnerHTML={{ __html: `<b>Save Changes -> </b>Click on <b> Send Test Email</b> to verify that the setup is finished and functioning properly.` }} />

                </ol>
        },
    ];
    const currentContent = steps.find(item => item.id === 1)?.content;

    return (
        <Modal open={true} message={[]} messageType="error" children={
            <>
                <HeaderModal
                    Title={'Gmail setup tutorial'}
                    Description={'Follow the steps in the tutorial to create your Gmail App Password, then enter it here to connect your Gmail account.'}
                    className="border-b border-gray-200"
                    onClick={() => navigate(-1)}
                />

                {/* Scrollable Content */}
                <div ref={contentRef} className="flex-1 overflow-y-auto px-8 py-4">
                    <div className="space-y-6 px-8 ">
                        {currentContent}
                    </div>
                </div>

            </>
        } />
    );
};





