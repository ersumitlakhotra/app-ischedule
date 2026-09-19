import AssignedTo from "../../common/assigned_to"
import FlexBoxRow from "../../common/custom/flexboxRow";
import { convertTo12Hour, userSchedule } from "../../common/general"
import { Tags } from "../../common/tags"
import { FiClock } from "react-icons/fi";
import { GiHotMeal } from "react-icons/gi"; 

const ScheduleCard = ({ index, date, user, userList, scheduleList,onClick }) => {
    const timing = userSchedule(date, user.timinginfo[0], user.id, scheduleList);
    return (
        userList.length === 0 ? <p class='text-left p-4 text-sm font-medium text-gray-500'> There aren't any active users .</p> :
            <div key={index} onClick={() => onClick(timing[0].scheduleId, date, user.id,true)} class={`border p-4  text-xs bg-gray-50 rounded-lg  mb-2 cursor-pointer hover:bg-gray-100 hover:shadow`} >
                <div class='flex flex-row  items-center justify-between text-gray-800  font-medium font-sans mb-2'>
                    <AssignedTo key={user.id} userId={user.id} userList={userList} />
                    {Tags(timing[0].isOpen ? "Working" : "Day off")}
                </div>
                <FlexBoxRow icon={<FiClock size={12} />} label={`${convertTo12Hour(timing[0].inTime)} - ${convertTo12Hour(timing[0].outTime)}`} />
                <FlexBoxRow icon={<GiHotMeal size={12} />} label={`${convertTo12Hour(timing[0].breakStart)} - ${convertTo12Hour(timing[0].breakEnd)} [ Lunch Break ]`} />        
            </div>
    )
}

export default ScheduleCard