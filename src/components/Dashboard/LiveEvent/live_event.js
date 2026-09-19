import { Badge, Button, Drawer, Skeleton, Space } from "antd";
import { useEffect, useRef, useState } from "react";
import Services from "../../../common/services";
import { get_Date } from "../../../common/localDate";
import {  SaveOutlined } from '@ant-design/icons';
import EventDetail from "../../Event/event_detail";

const LiveEvent = ({ eventList, servicesList, onSelected, saveData }) => {
 const ref = useRef();
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('New');
    const [id, setId] = useState(0);
    const [refresh, setRefresh] = useState(0);

    const [liveList, setLiveList] = useState(null);
    useEffect(() => {
        let list = eventList.filter(a => a.case.toUpperCase() === 'LIVE');
        setLiveList(list)
    }, [eventList])

    const btn_Click = (id) => {
        setTitle(id === 0 ? "New Event" : "Edit Event");
        setRefresh(refresh + 1);
        setId(id);
        setOpen(true);
    }

    const btnSave = async () => {
        await ref.current?.save();
    }
    return (
        <div class='flex flex-col gap-4 w-full'>
            <div class='flex justify-between items-center'>
                <Badge count={liveList === null ? 0 : liveList.length} color="#52c41a" offset={[15, 10]}>{/*liveList.length*/}
                    <span class="text-lg font-semibold text-gray-800">Live Events</span>
                </Badge>
                <Button color="primary" variant="outlined" onClick={() => onSelected('Event')} >
                    View all
                </Button>
            </div>
            <div class='w-full bg-white border rounded p-5 text-gray-500 max-h-[460px] h-[460px]  overflow-y-auto'>
                <div class=' flex flex-col gap-4 mb-4 '>               
                    {liveList === null ? <Skeleton active style={{ padding: '16px' }} paragraph={{ rows: 10 }} />:
                        liveList.length === 0 ? <p class='text-left p-4 text-sm font-medium text-gray-500'> There aren't any live events going on right now.</p> :
                        liveList.map(item =>
                            <div key={item.id} onClick={() => btn_Click(item.id)} class={` text-xs flex flex-col gap-1 border-s-4 p-2 border-s-green-300 bg-green-50  text-green-500 cursor-pointer hover:shadow-md`}>
                                <div class='flex items-center justify-between font-medium'>
                                    <p class='text-sm' > {item.title}</p>
                                    <p>$ {item.total}</p>
                                </div>
                                <div class='flex items-center justify-between font-medium'>
                                    <span class="text-gray-500">{get_Date(item.startdate,'ddd, MMM DD')} - {get_Date(item.enddate,'ddd, MMM DD')}</span>
                                    <p>{item.coupon}</p>
                                </div>
                                <div class='flex flex-col overflow-hidden whitespace-nowrap'>
                                    <Services servicesItem={item.serviceinfo} servicesList={servicesList}/>
                                </div>
                            </div>
                        )}

                </div>
            </div>

            {/* Drawer on right*/}
            <Drawer title={title} placement='right' width={500} onClose={() => setOpen(false)} open={open}
                extra={<Space><Button type="primary" icon={<SaveOutlined />} onClick={btnSave}  >Save</Button></Space>}>
                <EventDetail id={id} refresh={refresh} ref={ref} eventList={eventList} servicesList={servicesList} saveData={saveData} setOpen={setOpen} />
            </Drawer>
        </div>
    )
}
export default LiveEvent