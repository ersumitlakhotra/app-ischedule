/* eslint-disable react-hooks/exhaustive-deps */
import { get_Date, LocalDate } from "../../../common/localDate";
import { Avatar, Button, Drawer, Dropdown, Image, Skeleton, Space } from "antd";
import { DownOutlined, UserOutlined, SaveOutlined } from '@ant-design/icons';
import { Tags } from "../../../common/tags";
import { convertTo12Hour } from "../../../common/general";
import { useEffect, useRef, useState } from "react";
import dayjs from 'dayjs';
import ScheduleDetail from "../../Schedule/schedule_detail";

const Schedule = ({ scheduleList, userList, saveData }) => {
    const ref= useRef();
    const [currentOption, setCurrentOption] = useState('Today');
    const [filteredList,setFilteredList]= useState([]);
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('New')
    const [id, setId] = useState(0);
    const [refresh, setRefresh] = useState(0);
    const [uid, setUid] = useState(null);
    const [trnDate, setTrnDate] = useState(LocalDate());


    const items = [
        { key: 'Today', label: 'Today' },
        { key: 'Tomorrow', label: 'Tomorrow' },
        { key: 'The Next Day', label: 'The Next Day' },
    ];
    const onItemChanged = e => { setCurrentOption(e.key) };
    const menuProps = { items, onClick: onItemChanged, };

    useEffect(() => {
        filterSchedule();
    }, [currentOption, scheduleList])

    const filterSchedule = () => {
        let editList = [];
        if (currentOption === 'Today') {
            editList = scheduleList.filter(item => get_Date(item.trndate, 'YYYY-MM-DD') === LocalDate())
            setTrnDate(LocalDate())
        }
        else if (currentOption === 'Tomorrow') {
            editList = scheduleList.filter(item => get_Date(item.trndate, 'YYYY-MM-DD') === dayjs(LocalDate()).add(1, 'day').format('YYYY-MM-DD'))
            setTrnDate(dayjs(LocalDate()).add(1, 'day').format('YYYY-MM-DD'))
        }
        else {
            editList = scheduleList.filter(item => get_Date(item.trndate, 'YYYY-MM-DD') === dayjs(LocalDate()).add(2, 'day').format('YYYY-MM-DD'))
            setTrnDate(dayjs(LocalDate()).add(2, 'day').format('YYYY-MM-DD'))
        }

        if (editList.length === 0)
            setFilteredList([]);
        else
            setFilteredList(editList);
    }

    const btn_Click = (id) => {
        setTitle(id === 0 ? "New Schedule" : "Edit Schedule");
        setRefresh(refresh + 1);
        setId(id);
        setOpen(true);
    }
    const btnSave = async () => {
        await ref.current?.save();
    }

    return (
        <div class='flex  flex-col gap-4 w-full'>
            <div class='flex justify-between items-center'>
                <span class="text-lg font-semibold text-gray-800">TimeSheet</span>
                <Dropdown menu={menuProps}>
                    <Button>
                        <Space>
                            {currentOption}
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            </div>
            <div class='w-full bg-white border rounded p-3 flex flex-col gap-2  text-gray-500 max-h-[460px] h-[460px]  overflow-y-auto'>
                {userList === null ? <Skeleton active style={{ padding: '16px' }} paragraph={{ rows: 10 }} /> :
                    userList.length === 0 ? <p class='text-left p-4 text-sm font-medium text-gray-500'> There aren't any active users .</p> :      
                    userList.map(user => {
                    let id = 0;
                    let start = '00:00:00';
                    let end = '00:00:00';
                    let isWorking = false;
                    let isFound = false;
                    filteredList.filter(item => String(item.uid) === String(user.id)).map(
                        sch => {
                            id = sch.id;
                            start = sch.startshift;
                            end = sch.endshift;
                            isWorking = sch.dayoff;
                            isFound = true;
                        }
                    )
                    return (
                        <div key={user.id} class='flex flex-row justify-between  items-center cursor-pointer p-2 hover:bg-gray-50 hover:shadow-md ' onClick={() => { setUid(String(user.id)); btn_Click(id);}}>
                            <div class='flex flex-row gap-3  items-center text-gray-800  font-medium font-sans'>
                                {user.profilepic !== null ?
                                    <Image width={30} height={30} src={user.profilepic} style={{ borderRadius: 15 }} /> :
                                    <Avatar size={30} style={{ backgroundColor: 'whitesmoke' }} icon={<UserOutlined style={{ color: 'black' }} />} />
                                }
                                <div class='flex flex-col'>
                                    {user.fullname}
                                    <p class='text-gray-400 text-xs font-normal'>{`${convertTo12Hour(start)} - ${convertTo12Hour(end)}`}</p>
                                </div>
                            </div>
                            <p>{Tags(isFound ? isWorking ? "Working" : "Day off" : "Add Schedule")}</p>
                        </div>
                    )
                }
                )}
            </div>
            {/* Drawer on right*/}
            <Drawer title={title} placement='right' width={500} onClose={() => setOpen(false)} open={open}
                extra={<Space><Button type="primary" icon={<SaveOutlined />} onClick={btnSave} >Save</Button></Space>}>

                <ScheduleDetail id={id} refresh={refresh} ref={ref} scheduleList={scheduleList} userList={userList} saveData={saveData} setOpen={setOpen} userId={uid} frmDate={trnDate} />
            </Drawer>
        </div>
    )
}
export default Schedule