/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Dropdown, Skeleton, Space } from "antd";
import { useEffect, useState } from "react";
import { DownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { firstDateOfMonth, get_Date, lastDateOfMonth, LocalDate } from "../../../common/localDate";
import {  PieChart, StackedBarChart } from "../Charts/charts";

const Task = ({ orderList, userList }) => {
    const [chart, setChart] = useState(null);
    const [stackedchart, setStackedChart] = useState(null);
    const [currentOption, setCurrentOption] = useState('Today');
    const items = [
        { key: 'Today', label: 'Today' },
        { key: 'This Month', label: 'This Month' },
        { key: 'This Year', label: 'This Year' },
    ];
    const onItemChanged = e => { setCurrentOption(e.key) };
    const menuProps = { items, onClick: onItemChanged, };

    useEffect(() => {
        setChart(null);
        setStackedChart(null);
        let frmMonth = dayjs(firstDateOfMonth(new Date())).format("YYYY-MM-DD");
        let toMonth = dayjs(lastDateOfMonth(new Date())).format("YYYY-MM-DD");
        let year = new Date().getFullYear();
        let jan = new Date(year, 0, 1);
        let dec = new Date(year, 11, 31);
        const total = (
            currentOption === 'Today' ? orderList.filter(a => LocalDate() === get_Date(a.trndate,'YYYY-MM-DD')) :
                currentOption === 'This Month' ? orderList.filter(a => get_Date(a.trndate,'YYYY-MM-DD') >= frmMonth && get_Date(a.trndate,'YYYY-MM-DD') <= toMonth) :
                    orderList.filter(a => orderList.filter(a => get_Date(a.trndate,'YYYY-MM-DD') >= jan && get_Date(a.trndate,'YYYY-MM-DD') <= dec )))

        const pending = total.filter(a => a.status.toUpperCase() === 'PENDING');
        const inprogress = total.filter(a => a.status.toUpperCase() === 'IN PROGRESS');
        const completed = total.filter(a => a.status.toUpperCase() === 'COMPLETED');
        const cancelled = total.filter(a => a.status.toUpperCase() === 'CANCELLED');  

        let categories = [], pendingStacked = [], inprocessStacked = [], completedStacked = [], cancelledStacked = [];
        userList.map(user => {
            categories.push(user.fullname);
            pendingStacked.push(pending.filter(a => a.assignedto === user.id).length)
            inprocessStacked.push(inprogress.filter(a => a.assignedto === user.id).length)
            completedStacked.push(completed.filter(a => a.assignedto === user.id).length)
            cancelledStacked.push(cancelled.filter(a => a.assignedto === user.id).length)
        })
        setChart(<PieChart series={[pending.length, inprogress.length, completed.length, cancelled.length]} />)
        setStackedChart(<StackedBarChart categories={categories} pending={pendingStacked} inprogress={inprocessStacked} completed={completedStacked} cancelled={cancelledStacked} />)
    }, [orderList, currentOption]) 

    return (
        <div class='flex flex-col gap-4 w-full'>
            <div class='flex justify-between items-center'>
                <span class="text-lg font-semibold text-gray-800">Tasks</span>
                <Dropdown menu={menuProps}>
                    <Button>
                        <Space>
                            {currentOption}
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            </div>
            <div class='w-full bg-white border rounded p-5 text-gray-500 flex flex-col gap-2 md:flex-row'>
                <div class='w-full md:w-1/2'>
                    {stackedchart === null ? <div class='h-[420px] flex items-center justify-center'>
                    <Skeleton active style={{ padding: '16px' }} paragraph={{ rows: 10 }} /></div>
                        : stackedchart}
                </div>  
                <div class='w-full md:w-1/2'>
                    {chart === null ? <div class='h-[420px] flex items-center justify-center'>
                        <Skeleton active style={{ padding: '16px' }} paragraph={{ rows: 10 }} /></div>
                        : chart}
                </div>
                
            </div>
        </div>
    )
}
export default Task