import { Divider } from "antd";


const PrivacyPolicy = () => {
    return (
        <section  >
            <div class="w-full h-28 bg-gradient-to-r from-blue-300 to-cyan-500 flex justify-center items-center text-white text-4xl font-medium  ">
                Privacy Policy
            </div>

            <div class='py-8 px-16 text-sm'>
                <p> Effective <span class='italic'>November 01, 2025</span></p>
                <p> Our Privacy Policy has been updated </p>
                <h3 class='text-4xl mt-10 mb-4'>Your Privacy Matters</h3>
                <p>{process.env.REACT_APP_PROJECT_NAME} respects your privacy and is committed to protecting your personal information.
                    This Privacy Policy explains how we collect, use, and safeguard your data when you use our app.</p>
                <Divider />
                <h3 class='text-xl mt-10 mb-2 font-medium'>1. Information We Collect</h3>
                <div class='ml-4'>
                    <p class='mb-2'>We may collect the following information from you:</p>
                    <ul class="list-disc px-6">
                        <li>Personal Information: Name, email address, cell (if you provide it for account creation or booking).</li>
                        <li>Task & Appointment Data: Tasks, schedules, reminders, and appointments you create in the app.</li>
                        <li>Usage Data: Analytics on app usage to improve performance and features.</li>
                    </ul>
                </div>
                <Divider />
                <h3 class='text-xl mt-10 mb-2 font-medium'>2. How We Use Your Information</h3>
                <div class='ml-4'>
                    <p class='mb-2'>We use your information to:</p>
                    <ul class="list-disc px-6">
                        <li>Provide and manage app features.</li>
                        <li>Send reminders and notifications.</li>
                        <li>Improve app performance and functionality.</li>
                        <li>Respond to your support requests.</li>
                    </ul>
                </div>
                <Divider />
                <h3 class='text-xl mt-10 mb-2 font-medium'>3. Sharing Your Information</h3>
                <div class='ml-4'>
                    <p class='mb-2'>We do not sell your personal information. We may share data only with trusted third-party services that help us operate the app, such as cloud storage or analytics providers.</p>
                </div>
                <Divider />
                <h3 class='text-xl mt-10 mb-2 font-medium'>4. Data Security</h3>
                <div class='ml-4'>
                    <p class='mb-2'>We take reasonable measures to protect your data from unauthorized access, alteration, or disclosure.</p>
                </div>
                <Divider />
                <h3 class='text-xl mt-10 mb-2 font-medium'>5. Your Rights</h3>
                <div class='ml-4'>
                    <p class='mb-2'>You can:</p>
                    <ul class="list-disc px-6">
                        <li>Access, update, or delete your personal information.</li>
                        <li>Opt-out of communications or data collection where applicable.</li>
                    </ul>         
                    <p class='m-2'>To exercise your rights, please contact us at: {process.env.REACT_APP_SUPPORT_EMAIL}</p>
                </div>
                <Divider />
                <h3 class='text-xl mt-10 mb-2 font-medium'>6. Changes to This Policy</h3>
                <div class='ml-4'>
                    <p class='mb-2'> We may update this Privacy Policy from time to time. We will notify users of any significant changes via the app or email.</p>
                </div>
                <Divider />
                <h3 class='text-xl mt-10 mb-2 font-medium'>7. Contact Us</h3>
                <div class='ml-4'>
                    <p class='mb-2'>If you have questions about this Privacy Policy, please contact us at: </p>
                    <p class='mb-2'><span class='font-bold'>Email : </span>{process.env.REACT_APP_SUPPORT_EMAIL}</p>
                    <p class='mb-2'><span class='font-bold'>Website : </span><a href={`${process.env.REACT_APP_DOMAIN}/support`} class='italic text-blue-400 hover:underline'>{process.env.REACT_APP_DOMAIN}/support</a> </p>
                </div>
            </div>

        </section>
    );
};

export default PrivacyPolicy;