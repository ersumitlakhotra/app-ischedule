/* eslint-disable react-hooks/exhaustive-deps */

import { Tag } from "antd";
import { get_Date, LocalDate } from "../../common/localDate"
import { IoMdClose } from "react-icons/io";
import { IoHourglassOutline } from "react-icons/io5";
import {  MdDownloadDone, MdPendingActions } from "react-icons/md";
import { useEffect, useState } from "react";

import { IsLoading, PageHeader } from "../../common/index.jsx";
import CalenderIcon from "../../common/custom/calenderIcon"; 
import { IoMdWarning } from "react-icons/io"; 
import { AiOutlineStop } from "react-icons/ai";
import { useNavigate, useOutletContext } from "react-router-dom";
import AnalogClock from "../../common/clock";

const CalenderCard = ({ref}) => {
    const navigate = useNavigate();
    const { refresh, getOrder } = useOutletContext();
    const [ordersList, setOrdersList] = useState([]);
    const [awaitingList, setAwaitingList] = useState([]);
    const [pendingList, setPendingList] = useState([]);
    const [inprogressList, setInprogressList] = useState([]);
    const [completedList, setCompletedList] = useState([]);
    const [cancelledList, setCancelledList] = useState([]); 
    const [rejectedList, setRejectedList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        Init();
    }, [refresh])

    const Init = async () => {
        setIsLoading(true);
        const orderResponse = await getOrder();
        let order = orderResponse.filter(a => get_Date(a.trndate, 'YYYY-MM-DD') === LocalDate());

        const pending = order.filter(a => a.status.toUpperCase() === 'PENDING');
        const awaiting = order.filter(a => a.status.toUpperCase() === 'AWAITING');
        const inprogress = order.filter(a => a.status.toUpperCase() === 'IN PROGRESS');
        const completed = order.filter(a => a.status.toUpperCase() === 'COMPLETED');
        const cancelled = order.filter(a => a.status.toUpperCase() === 'CANCELLED');
        const rejected = order.filter(a => a.status.toUpperCase() === 'REJECTED');

        setOrdersList(order.length > 0 ? order : [])
        setPendingList(pending.length > 0 ? pending : [])
        setAwaitingList(awaiting.length > 0 ? awaiting : [])
        setInprogressList(inprogress.length > 0 ? inprogress : [])
        setCompletedList(completed.length > 0 ? completed : [])
        setCancelledList(cancelled.length > 0 ? cancelled : [])
        setRejectedList(rejected.length > 0 ? rejected : [])

        setIsLoading(false);
    }

    const listItems = ({ icon, label, value,filterBy }) => {
        return (
            <div class='flex flex-row items-center justify-between text-white  p-1 rounded-lg cursor-pointer hover:bg-white hover:text-blue-900 duration-150  hover:shadow-md'
                onClick={() => navigate('/calender', {
                    state: { searchParams: filterBy }
                })}>
                <div class={`flex flex-row items-center gap-2 text-xs`}  >
                    {icon}
                    {label}
                </div>
                <Tag >{value}</Tag>
            </div>
        )
    }
    return (
        <div ref={ref} class='w-full bg-blue-900 border rounded-3xl p-4 text-gray-800 flex gap-6  shadow-md   hover:shadow-lg '>
            <IsLoading isLoading={isLoading} input={
                <>
                    <div class='w-1/3 flex flex-col gap-4 justify-between text-xs font-semibold font-sans  text-white ' onClick={() => navigate('/calender') }>
                        <div class='flex flex-col gap-0 hover:font-bold hover:underline duration-150 cursor-pointer'>
                            <CalenderIcon size={40}/>
                            <span>{get_Date(LocalDate(), 'MMMM DD, YYYY')}</span>
                        </div>
                        <AnalogClock/>
                        <span class='hover:font-bold hover:underline duration-150 cursor-pointer'>{ordersList.length} Calender events</span>
                    </div>

                    <div class='w-2/3 flex flex-col justify-center text-xs font-semibold font-sans  '>
                        {listItems({ icon: <IoMdWarning size={12} />, label: 'Awaiting Request', filterBy:'Awaiting', value: awaitingList.length })}
                        {listItems({ icon: <MdPendingActions size={12} />, label: 'Pending', filterBy: 'Pending' ,value: pendingList.length})}
                        {listItems({ icon: <IoHourglassOutline size={12} />, label: 'In Progress', filterBy: 'In progress', value: inprogressList.length })}
                        {listItems({ icon: <MdDownloadDone size={12} />, label: 'Completed', filterBy: 'Completed', value: completedList.length })}
                        {listItems({ icon: <IoMdClose size={12} />, label: 'Cancelled', filterBy: 'Cancelled', value: cancelledList.length })}
                        {listItems({ icon: <AiOutlineStop size={12} />, label: 'Rejected', filterBy: 'Rejected', value: rejectedList.length })}
                    </div>
                </>} />
        </div>
    )
}

export default CalenderCard