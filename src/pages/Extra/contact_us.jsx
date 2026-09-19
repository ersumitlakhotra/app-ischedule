import React from "react";
import {
    Phone,
    Mail,
    Clock3,
    Building2,
} from "lucide-react";

const ContactUs = () => {
    const contactItems = [
        {
            icon: Building2,
            title: "Head Office",
            description: "Unit 1000, 10 Four Season PI, Etobicoke ON M9B 0A6 CA",
        },
        {
            icon: Phone,
            title: "Call Center",
            description: process.env.REACT_APP_SUPPORT_PHONE,
        },
        {
            icon: Mail,
            title: "Email",
            description: process.env.REACT_APP_SUPPORT_EMAIL,
        },
        {
            icon: Clock3,
            title: "Working Hours",
            description: "Monday - Friday (09:00 AM - 05:00 PM)",
        },
    ];

    return (
        <section className="w-full bg-white">
            <div className="mx-auto  px-6  sm:px-8 lg:px-12">

                {/* Header */}
                <div>
                    {/* Badge */}
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600">
                        <Phone className="h-3.5 w-3.5" />
                        CONTACT US
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-medium leading-[1.05] tracking-[-0.04em] text-blue-600 sm:text-6xl">
                        Get In Touch
                    </h1>

                    <h2 className="mt-2 text-2xl font-medium leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-6xl">
                        With Our Team
                    </h2>

                    {/* Description */}
                    <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
                         Want to get in touch? We'd like to hear from you, Here's how you can reach us ...
                    </p>
                </div>

                {/* Contact Cards */}
                <div className="mt-8 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
                    {contactItems.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={index}
                                className="group rounded-2xl border border-slate-200 bg-white px-5 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                                        <Icon className="h-[17px] w-[17px] stroke-[2] text-blue-500" />
                                    </div>

                                    <h3 className="text-base font-medium text-slate-900">
                                        {item.title}
                                    </h3>
                                </div>

                                <p className="mt-5 text-sm text-slate-500">
                                    {item.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ContactUs;