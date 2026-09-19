/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Dropdown, Skeleton, Space } from "antd";
import { useEffect, useState } from "react";
import { DownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { firstDateOfMonth, get_Date, lastDateOfMonth } from "../../../common/localDate";
import { BarChart } from "../Charts/charts";

const Appointment = ({ orderList, yearList, months, onSelected, setFromDate , setToDate }) => {
    const [chart, setChart] = useState(null);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const onYearChanged = e => { setCurrentYear(e.key) };
    const menuProps = { items: yearList, onClick: onYearChanged, };

    useEffect(() => {
        setChart(null);
        let dataArray = [];
        months.map((a, index) => {
            let date = currentYear + '-' + String(index + 1).padStart(2, '0') + '-02T00:00:00';
            let frm = dayjs(firstDateOfMonth(new Date(date))).format("YYYY-MM-DD");
            let to = dayjs(lastDateOfMonth(new Date(date))).format("YYYY-MM-DD");

            const order = orderList.filter(a => get_Date(a.trndate,'YYYY-MM-DD') >= frm && get_Date(a.trndate,'YYYY-MM-DD') <= to);
            dataArray.push({ month: a, count: order.length,frm:frm , to:to });
        })
        setChart(<BarChart dataArray={dataArray} onSelected={onSelected} setFromDate={setFromDate} setToDate={setToDate} />)
    }, [orderList, currentYear])
    
    return (
        <div class='flex flex-col gap-4 w-full'>
            <div class='flex justify-between items-center'>
                <span class="text-lg font-semibold text-gray-800">Appointments</span>
                <Dropdown menu={menuProps}>
                    <Button>
                        <Space>
                            {currentYear}
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            </div>
            <div class='w-full bg-white border rounded p-5 text-gray-500 flex flex-col gap-2'>
                {chart === null ?
                    <div class='h-[420px] flex items-center justify-center'>
                        <Skeleton active style={{ padding: '16px' }} paragraph={{ rows: 10 }} />
                        </div>
                    : chart}

            </div>
        </div>
    )
}
export default Appointment