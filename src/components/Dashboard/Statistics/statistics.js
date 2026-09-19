import { useEffect, useState } from "react";
import Performance from "./performance";
import { get_Date, LocalDate } from "../../../common/localDate";

const Statistics = ({ orderList }) => {
    const [totalList, setTotalList] = useState([]);
    const [pendingList, setPendingList] = useState([]);
    const [inprogressList, setInprogressList] = useState([]);
    const [completedList, setCompletedList] = useState([]);
    const [cancelledList, setCancelledList] = useState([]);
    useEffect(() => {
        const total = orderList.filter(a => LocalDate() === get_Date(a.trndate,'YYYY-MM-DD'));
        const pending = total.filter(a => a.status.toUpperCase() === 'PENDING');
        const inprogress = total.filter(a => a.status.toUpperCase() === 'IN PROGRESS');
        const completed = total.filter(a => a.status.toUpperCase() === 'COMPLETED');
        const cancelled = total.filter(a => a.status.toUpperCase() === 'CANCELLED');
        const sortedTotal = [...total].sort((a, b) => new Date(b.modifiedat) - new Date(a.modifiedat));

        setTotalList(sortedTotal.length > 0 ? sortedTotal : [])
        setPendingList(pending.length > 0 ? pending : [])
        setInprogressList(inprogress.length > 0 ? inprogress : [])
        setCompletedList(completed.length > 0 ? completed : [])
        setCancelledList(cancelled.length > 0 ? cancelled : [])
    }, [orderList])

    const twoColors = {
        '0%': '#108ee9',
        '100%': '#87d068',
    };


    return (
        <div class='flex  flex-col gap-4 w-full'>
            <span class="text-lg font-semibold text-gray-800">Statistics</span>
            <div class='w-full bg-white border rounded p-5 flex flex-col gap-6  text-gray-500 max-h-[460px] h-[460px]  overflow-y-auto'>
                <Performance key={1} label={"Total"} value={completedList.length + cancelledList.length} total={totalList.length} strokeColor={twoColors} />
                <Performance key={2} label={"Pending"} value={pendingList.length} total={totalList.length} strokeColor='#ffff66' />
                <Performance key={3} label={"In process"} value={inprogressList.length} total={totalList.length} strokeColor='#66a3ff' />
                <Performance key={4} label={"Completed"} value={completedList.length} total={totalList.length} strokeColor='#66ff66' />
                <Performance key={5} label={"Cancelled"} value={cancelledList.length} total={totalList.length} strokeColor='#ff6666' />
            </div>
        </div>
    )
}
export default Statistics