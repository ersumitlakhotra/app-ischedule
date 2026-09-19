import pic from '../../Images/supportImage.jpg'
import { MdOutlineSupportAgent } from "react-icons/md";
import { IoCall } from "react-icons/io5";

const Support = () => {
    return (
        <section class='px-7 py-4  mb-12'>
            <div class="relative w-full">

                <img class="w-full object-cover h-96 opacity-60" src={pic} alt="Description" />

                <div class="absolute inset-0 flex flex-col gap-4 items-center justify-center">
                    <p class="text-white text-5xl font-bold bg-black bg-opacity-50 p-4 rounded">
                        Get in touch
                    </p>

                    <p class="text-white font-medium  p-4 rounded">
                        Want to get in touch? We'd like to hear from you, Here's how you can reach us ...
                    </p>
                </div>
            </div>
            <div class='flex flex-col md:flex-row gap-4 justify-center items-center mt-2'>
                <div class='bg-gray-50 p-8 h-72 border-2 border-gray-200 rounded-md w-96 flex flex-col justify-center items-center '>
                    <MdOutlineSupportAgent size={48} />
                    <p class='font-semibold'>Customer Support</p>
                    <p class='text-xs mt-4 flex-1 justify-center items-center'>Sometimes you need a little help from your friends. Don't worry , we're here for you.</p>


                    <p class='font-medium text-sm text-blue-400 mt-4'>{process.env.REACT_APP_SUPPORT_PHONE}</p>
                    <p class='font-medium text-sm text-blue-400 mt-2'>{process.env.REACT_APP_SUPPORT_EMAIL}</p>
                </div>

                <div class='bg-gray-50 p-8 h-72 border-2 border-gray-200 rounded-md w-96 flex flex-col justify-center items-center '>
                    <IoCall size={44} />
                    <p class='font-semibold'>Talk to Sales Team</p>
                    <p class='text-xs mt-4 flex-1 justify-center items-center'>Interested in {process.env.REACT_APP_PROJECT_NAME} software? Pick-up the phone to chat with a member of our sales team.</p>


                    <p class='font-medium text-sm text-blue-400 mt-4'>{process.env.REACT_APP_SALES_PHONE}</p>
                </div>
            </div>
        </section>
    );
};

export default Support;