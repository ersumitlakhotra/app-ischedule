/* eslint-disable react-hooks/exhaustive-deps */
import { Badge, Button, Collapse, Dropdown,  Space } from "antd";
import { useEffect, useState } from "react";
import { DownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { LocalDate, UTC_LocalDateTime } from "../../../common/localDate";
import AssignedTo from "../../../common/assigned_to";
import EventLogs from "../../Logs/event_log";
import ServicesLogs from "../../Logs/services_log";
import UsersLogs from "../../Logs/users.log";
import ExpenseLogs from "../../Logs/expense_log";
import PaymentLogs from "../../Logs/payment_log";
import OrderLogs from "../../Logs/order_log";

const RecentActivities = ({ orderList, expensesList, servicesList, userList, eventList, logsList }) => {
    const [logsData, setLogsData] = useState([]);
    const [currentOption, setCurrentOption] = useState('Today');
    const items = [
        { key: 'Today', label: 'Today' },
        { key: 'Last 1 hour', label: 'Last 1 hour' },
        { key: 'Last 6 hours', label: 'Last 6 hours' },
        { key: 'Last 12 hours', label: 'Last 12 hours' },
    ];
    const onItemChanged = e => { setCurrentOption(e.key) };
    const menuProps = { items, onClick: onItemChanged, };

    useEffect(() => {
        let editList = [];
        if (currentOption === 'Today')
            editList = logsList.filter(item => UTC_LocalDateTime(item.createdat, 'YYYY-MM-DD') === LocalDate());
        else {
            let hours = currentOption === 'Last 1 hour' ? 1 : currentOption === 'Last 6 hours' ? 6 : 12;
            editList = logsList.filter(item => (new Date(item.createdat).getHours() - parseInt(hours)) && dayjs(item.createdat).format('YYYY-MM-DD') === LocalDate());
        }

        if (editList.length === 0)
            setLogsData([]);
        else
            setLogsData(editList);

    }, [currentOption, logsList])

    return (
        <div class='flex flex-col gap-4 w-full'>
            <div class='flex justify-between items-center'>
                <span class="text-lg font-semibold text-gray-800">Recent Activities</span>
                <Dropdown menu={menuProps}>
                    <Button>
                        <Space>
                            {currentOption}
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            </div>
            <div class='w-full bg-white border rounded p-5 text-gray-500 max-h-[460px] h-[460px]  overflow-y-auto'>
                <div class='flex flex-col gap-4 mb-4'>
                    {logsData.length === 0 ? <p class='text-left p-4 text-sm font-medium text-gray-500'> There aren't any history to show right now.</p> :
                        logsData.map(item =>                                                                                 
                                <Badge.Ribbon
                                    key={item.id}
                                    text={item.ltype +' ' + item.status}
                                    color={item.status.toUpperCase() === "CREATED" ? "yellow" : item.status.toUpperCase() === "MODIFIED" ? "blue" : "red"} >
                                    <Collapse
                                        items={[{
                                            key: item.id,
                                            label: (
                                                <div class='flex items-center justify-between pe-20 ' >
                                                    <AssignedTo userId={item.userid} userList={userList} class='text-xs font-semibold text-gray-500' />
                                                    <span class='text-xs  text-gray-500'>{UTC_LocalDateTime(item.createdat, 'MMM, DD YYYY - hh:mm A ')}</span>
                                                </div>),
                                            children:
                                                item.ltype.toUpperCase() === "ORDER" ? <OrderLogs key={item.id} id={item.lid} dataList={item.datainfo} orderList={orderList} userList={userList} servicesList={servicesList} /> :
                                                    item.ltype.toUpperCase() === "EVENT" ? <EventLogs key={item.id} dataList={item.datainfo} servicesList={servicesList} /> :
                                                        item.ltype.toUpperCase() === "SERVICES" ? <ServicesLogs key={item.id} dataList={item.datainfo} servicesList={servicesList} /> :
                                                            item.ltype.toUpperCase() === "USERS" ? <UsersLogs key={item.id} dataList={item.datainfo} servicesList={servicesList} /> :
                                                                item.ltype.toUpperCase() === "EXPENSE" ? <ExpenseLogs key={item.id} dataList={item.datainfo} servicesList={servicesList} /> :
                                                                    item.ltype.toUpperCase() === "PAYMENT" ? <PaymentLogs key={item.id} dataList={item.datainfo} userList={userList} servicesList={servicesList} /> : <></>
                                        }]}
                                    />

                                </Badge.Ribbon>)}
                </div>
            </div>
        </div>
    )
}
export default RecentActivities