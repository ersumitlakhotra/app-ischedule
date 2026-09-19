/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";

import { IsLoading, PageHeader } from "../../common/index.jsx";
import { SortUpcomingAppointments } from '../../common/general';
import AppointmentCards from "./appointmentCard";
import { IoMdWarning } from "react-icons/io";
import { useOutletContext } from "react-router-dom";
import { Badge } from "antd";

const WaitingApproval = () => {
    const {
        saveData, refresh, viewOrder,
        getOrder,
        servicesList, getService,
        userList, getUser
    } = useOutletContext();
    const [isLoading, setIsLoading] = useState(false);
    const [awaiting, setAwaiting] = useState([]);

    useEffect(() => {
        Init();
    }, [refresh])

    const Init = async () => {
        setIsLoading(true);
        const orderResponse = await getOrder();
        await getService();
        await getUser();
        let order = orderResponse.filter(a => a.status.toUpperCase() === 'AWAITING');
        setAwaiting(SortUpcomingAppointments(order))
        setIsLoading(false);
    }

    return (
        <div class='w-full bg-white border rounded-3xl p-4 text-gray-500 flex gap-2  shadow-md hover:shadow-xl ' style={{height:'440px'}}>
            <IsLoading isLoading={isLoading} rows={9} input={
                <>
                    <div class=' flex-1 overflow-auto w-full scroll-auto '>
                        <div class='flex flex-row gap-2 bg-white items-center text-gray-800  font-medium font-sans pb-4 sticky top-0 z-40'>
                            <IoMdWarning  style={{ fontSize: '28px',color:'orange' }} />
                            <span>Awaiting Request</span>
                            <Badge count={awaiting.length}/>
                        </div>

                        {awaiting.length === 0 ? <p class='text-left p-4 text-sm font-medium text-gray-500'> There aren't any pending requests .</p> :
                            awaiting.map(item => {
                            return (           
                                <AppointmentCards key={item.id} index={item.id} data={item} userList={userList} servicesList={servicesList} onClick={viewOrder} saveData={saveData} />
                            )
                        })}
                        
                    </div>
                </>
            } />
        </div>
    )
}

export default WaitingApproval