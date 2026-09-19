import { Divider } from "antd";


const TermsCondition = () => {
    return (
        <section  >
            <div class="w-full h-28 bg-gradient-to-r from-blue-300 to-cyan-500 flex justify-center items-center text-white text-4xl font-medium  ">
                Terms and Conditions
            </div>

            <div class='py-8 px-16 text-sm'>
                <p> Last Updated: <span class='italic'>November 01, 2025</span></p>
                <p class='mt-2'> These Terms and Services ("Terms") govern the use of the {process.env.REACT_APP_PROJECT_NAME} platform, 
                    including the website, mobile application, and any related services (collectively, the "Service"). 
                    By accessing or using the Service, you agree to be bound by these Terms. 
                    If you do not agree, please do not use the Service.</p>
                <Divider />

                <h3 class='text-xl mt-10 mb-2 font-medium'>1. Definitions</h3>
                <div class='ml-4'>
                    <ul class="list-disc px-6">
                        <li>"Platform" refers to the booking system operated by {process.env.REACT_APP_PROJECT_NAME}.</li>
                        <li>"User", "You" refers to any person who accesses or uses the Service.</li>
                        <li>"Service Provider" refers to individuals or businesses offering services available for booking on the Platform.</li>
                       <li>"Booking" means a reservation made through the Platform.</li>
                    </ul>
                </div>
                <Divider />

                <h3 class='text-xl mt-10 mb-2 font-medium'>2. Eligibility</h3>
                <div class='ml-4'>
                    <p class='mb-2'>You must be at least 18 years old and have the legal capacity to enter into a binding agreement to use this Service. By using the Platform, you represent and warrant that you meet these requirements.</p>
                </div>
                <Divider />

                <h3 class='text-xl mt-10 mb-2 font-medium'>3. Account Registration</h3>
                 <div class='ml-4'>
                    <ul class="list-disc px-6">
                        <li>"Users may be required to create an account to make a booking.</li>
                        <li>You agree to provide accurate, current, and complete information.</li>
                        <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                       <li>We reserve the right to suspend or terminate accounts that provide false or misleading information.</li>
                    </ul>
                </div>
                <Divider />

                <h3 class='text-xl mt-10 mb-2 font-medium'>4. Bookings and Payments</h3>
                <div class='ml-4'>
                    <ul class="list-disc px-6">
                        <li>All bookings made through the Platform are subject to availability and confirmation.</li>
                        <li>Prices, fees, and taxes (if applicable) will be clearly displayed before confirmation.</li>
                        <li>Payments must be made using the payment methods supported by the Platform.</li>
                       <li>We are not responsible for pricing errors but reserve the right to correct them.</li>
                    </ul>
                </div>
                <Divider />

                <h3 class='text-xl mt-10 mb-2 font-medium'>5. Cancellations and Refunds</h3>
                <div class='ml-4'>
                    <ul class="list-disc px-6">
                        <li>Cancellation and refund policies may vary depending on the Service Provider.</li>
                        <li>Applicable cancellation terms will be shown at the time of booking.</li>
                        <li>Refunds, if eligible, will be processed to the original payment method within a reasonable timeframe.</li>
                    </ul>         
                </div>
                <Divider />

                <h3 class='text-xl mt-10 mb-2 font-medium'>6. Service Provider Responsibilities</h3>
                <div class='ml-4'>
                    <ul class="list-disc px-6">
                        <li>Service Providers are responsible for the accuracy of their listings, availability, and service delivery.</li>
                        <li>The Platform acts as an intermediary and is not responsible for the quality, safety, or legality of services provided.</li>
                        </ul>         
                </div>
                <Divider />

                <h3 class='text-xl mt-10 mb-2 font-medium'>7. User Responsibilities</h3>
                <div class='ml-4'>
                    <p class='mb-2'>You agree:</p>
                    <ul class="list-disc px-6">
                        <li>To use the Platform only for lawful purposes.</li>
                        <li>Not to misuse, copy, or attempt to disrupt the Platform.</li>
                        <li>Not to submit false bookings or engage in fraudulent activity.</li>
                    </ul>
                </div>
                <Divider />


                <h3 class='text-xl mt-10 mb-2 font-medium'>8. Platform Role and Limitation of Liability</h3>
                <div class='ml-4'>
                    <ul class="list-disc px-6">
                        <li>The Platform facilitates bookings but does not provide the booked services itself (unless explicitly stated).</li>
                        <li>To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages.</li>
                        <li>Our total liability shall not exceed the amount paid by you for the booking giving rise to the claim.</li>
                        </ul>         
                </div>
                <Divider />


                <h3 class='text-xl mt-10 mb-2 font-medium'>9. Eligibility</h3>
                <div class='ml-4'>
                    <p class='mb-2'>All content, trademarks, logos, and software on the Platform are owned by or licensed to {process.env.REACT_APP_PROJECT_NAME}. You may not use them without prior written permission.</p>
                </div>
                <Divider />

                <h3 class='text-xl mt-10 mb-2 font-medium'>10. Privacy</h3>
                <div class='ml-4'>
                    <p class='mb-2'>Your use of the Platform is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal data.</p>
                </div>
                <Divider />

                <h3 class='text-xl mt-10 mb-2 font-medium'>11. Suspension and Termination</h3>
                <div class='ml-4'>
                    <p class='mb-2'>We reserve the right to suspend or terminate your access to the Platform at any time if you violate these Terms or applicable laws.</p>
                </div>
                <Divider />

                <h3 class='text-xl mt-10 mb-2 font-medium'>12. Force Majeure</h3>
                <div class='ml-4'>
                    <p class='mb-2'>We are not liable for failure or delay in performance due to events beyond our reasonable control, including natural disasters, strikes, or technical failures.</p>
                </div>
                <Divider />

                <h3 class='text-xl mt-10 mb-2 font-medium'>13. Governing Law and Dispute Resolution</h3>
                <div class='ml-4'>
                    <p class='mb-2'>These Terms shall be governed by and construed in accordance with the laws of Canada. Any disputes shall be subject to the exclusive jurisdiction of the courts of Canada/Ontario.</p>
                </div>
                <Divider />

                <h3 class='text-xl mt-10 mb-2 font-medium'>14. Changes to Terms</h3>
                <div class='ml-4'>
                    <p class='mb-2'>We may update these Terms from time to time. Continued use of the Platform after changes are posted constitutes acceptance of the revised Terms.</p>
                </div>
                <Divider />

                <h3 class='text-xl mt-10 mb-2 font-medium'>15. Contact Information</h3>
                <div class='ml-4'>
                    <p class='mb-2'>For questions or concerns about these Terms, please contact us: </p>
                    <p class='mb-2'><span class='font-bold'>Email : </span>{process.env.REACT_APP_SUPPORT_EMAIL}</p>
                    <p class='mb-2'><span class='font-bold'>Website : </span><a href={`${process.env.REACT_APP_DOMAIN}/support`} class='italic text-blue-400 hover:underline'>{process.env.REACT_APP_DOMAIN}/support</a> </p>
                </div>
            </div>

        </section>
    );
};

export default TermsCondition;