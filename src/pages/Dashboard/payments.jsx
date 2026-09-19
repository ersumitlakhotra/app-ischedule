import { useNavigate, useOutletContext } from "react-router-dom";
import {  IsLoading } from "../../common"
import { Calendar } from "../../controls";
import { AreaChart } from "./graph.jsx";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat";
import { LocalDate } from "../../common/localDate.js";

export const Payments = () => {
    const navigate = useNavigate();
    dayjs.extend(customParseFormat);
    const {refresh,getAppointment} = useOutletContext();
    const labels = ["12:00 AM", "01:00 AM", "02:00 AM", "03:00 AM", "04:00 AM", "05:00 AM", "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM", "12:00 AM"];
    const [isLoading, setIsLoading] = useState(false);
    const [date, setDate] = useState(LocalDate());
    const [online, setOnline] = useState([]);
    const [offline, setOffline] = useState([]);
   // const [appointmentList, setAppointmentList] = useState([]);

    useEffect(() => {
        Init();
    }, [refresh, date])

    const Init = async () => {
        setIsLoading(true);
        const [AppointmentResponse] = await Promise.all([getAppointment(date, date)]);
       // setAppointmentList(AppointmentResponse);
        getPaymentData(AppointmentResponse,date);
        setIsLoading(false);
    }

    const getPaymentData = (appointmentList, selectedDate) => {
        let online = Array(labels.length).fill(0);
        let offline = Array(labels.length).fill(0);

        appointmentList.forEach((appointment) => {
            let payments = appointment.payments || [];

            payments.forEach((payment) => {
                if (typeof payment === "string") {
                    try {
                        payment = JSON.parse(payment);
                    } catch {
                        return;
                    }
                }

                if (!payment?.createdat) return;

                const [date, time] = payment.createdat
                    .split(",")
                    .map(x => x.trim());

               // if (get_Date(date,"YYYY-MM-DD") !== get_Date(selectedDate,"YYYY-MM-DD")) return;

                // Get hour from "05:49 PM"
                const hour = dayjs(time, "hh:mm A").hour();
                
                // Find matching label index
                const index = labels.findIndex(
                    (label) => dayjs(label, "hh:00 A").hour() === hour
                );
                
                if (index === -1) return;

                if (payment.transaction === "InStore") {
                    offline[index] += Number(payment.amount || 0);
                } else if(payment.transaction === "Online") {
                    online[index] += Number(payment.amount || 0);
                } 
            });
        });
        setOnline(online);
        setOffline(offline);

       
        // return {online,offline};
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden mb-4" >

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4  shadow-sm">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Payment Overview
                    </h2>
                    <p className="mt-1 text-xs text-gray-500">
                        Track online and offline payments to monitor transaction activity
                    </p>
                </div>

                <div className="w-full md:w-[300px]"> <Calendar value={date} onChange={setDate} /></div>
            </div>
            <div className="space-y-2 h-[500px] p-4 ">
                <IsLoading isLoading={isLoading} rows={10} input={
                    <>
                        <AreaChart categoriesArray={labels} color={['#0ea5e9', "#8b5cf6"]}
                            series={[
                                {
                                    name: "Online",
                                    data:online
                                },
                                {
                                    name: "Offline",
                                    data: offline
                                }
                            ]} />
                    </>
                } />
            </div>
        </div>
    )
}