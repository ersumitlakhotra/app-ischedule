/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect,  useState } from "react";
import { IsLoading, PageHeader } from "../../common/index.jsx";
import { AiFillSchedule } from "react-icons/ai";
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import { Button, DatePicker, } from "antd";
import dayjs from 'dayjs';
import { LocalDate } from "../../common/localDate";
import ScheduleCard from "./scheduleCard";
import { useOutletContext } from "react-router-dom";

const UserSchedule = () => {
    const { refresh, userList, getUser, scheduleList, getSchedule, editSchedule} = useOutletContext();
    const [date, setDate] = useState(LocalDate());
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        Init();
    }, [refresh])

    const Init = async () => {
        setIsLoading(true);
        await getUser();
        await getSchedule();
        setIsLoading(false);
    }
  
    return (
        <div class='w-full bg-white border rounded-3xl p-4 text-gray-500 flex gap-2  shadow-md hover:shadow-xl ' style={{height:'440px'}}>
            <IsLoading isLoading={isLoading} rows={9} input={
                <>
                    <div class=' flex-1 overflow-auto w-full scroll-auto '>
                        <div class='flex w-full flex-row justify-between pr-2 sticky top-0 z-40 bg-white pb-4 '>
                            <div class='flex flex-row gap-2 items-center  text-gray-800  font-medium font-sans  '>
                                <AiFillSchedule style={{ fontSize: '28px', color: '#008B8B' }} />
                                <span>Schedule</span>
                            </div>
                            <div class='flex flex-row items-start justify-end'>
                                <Button color="default" variant="outlined" icon={<LeftOutlined />} style={{ borderRadius: 0, borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }} onClick={() => setDate(dayjs(date).add(-1, 'day'))} />
                                <DatePicker
                                    style={{ width: '60%' }}
                                    allowClear={false}
                                    format={dayjs(date).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD') ? '[Today]' :'ddd, MMM DD, YYYY'}
                                    value={date === '' ? date : dayjs(date, 'YYYY-MM-DD')}
                                    onChange={(date, dateString) => setDate(date)} />

                                <Button color="default" variant="outlined" icon={<RightOutlined />} style={{ borderRadius: 0, borderTopRightRadius: 6, borderBottomRightRadius: 6 }} onClick={() => setDate(dayjs(date).add(1, 'day'))} />
                            </div>
                        </div>

                        {userList.length === 0 ? <p class='text-left p-4 text-sm font-medium text-gray-500'> There aren't any active users .</p> :
                         userList.map((item,index) => {
                            return (
                                <ScheduleCard key={index} date={date} index={index} user={item} userList={userList} scheduleList={scheduleList} onClick={editSchedule} />
                            )
                        })}
                        
                    </div>
                </>
            } />
        </div>
    )
}

export default UserSchedule