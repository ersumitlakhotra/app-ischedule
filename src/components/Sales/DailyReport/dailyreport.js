/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Dropdown, Space, Spin } from "antd";
import { useEffect, useState } from "react";
import { DownOutlined, LoadingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { get_Date, lastDateOfMonth } from "../../../common/localDate";
import { AreaChart } from "../Chart/graph";

const DailyReport = ({ orderList, expensesList, yearList }) => {
    const [chart, setChart] = useState(null);

    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const onYearChanged = e => { setCurrentYear(e.key) };
    const menuProps = { items: yearList, onClick: onYearChanged, };

    const monthsList = [
        { key: '00', label: "Jan" },
        { key: '01', label: "Feb" },
        { key: '02', label: "Mar" },
        { key: '03', label: "Apr" },
        { key: '04', label: "May" },
        { key: '05', label: "June" },
        { key: '06', label: "July" },
        { key: '07', label: "Aug" },
        { key: '08', label: "Sept" },
        { key: '09', label: "Oct" },
        { key: '10', label: "Nov" },
        { key: '11', label: "Dec" },];

    const [currentMonth, setCurrentMonth] = useState(String(new Date().getMonth()).padStart(2, '0'));
    const onMonthChanged = e => { setCurrentMonth(e.key);  };
    const menuPropsMonth = { items: monthsList, onClick: onMonthChanged, };

    useEffect(() => {
        let categoryArray = [];        
        let salesSeries = [];
        let expensesSeries = [];
             
        let date = currentYear + '-' + String(parseInt(currentMonth) +1).padStart(2, '0')  + '-02T00:00:00';
        let to = dayjs(lastDateOfMonth(new Date(date))).format("DD");

        for (let day = 1; day <= to; day++) {
            categoryArray.push(dayjs(new Date(currentYear, currentMonth, day)).format("MMM DD"));
            let sales = 0;
            let expenses = 0;
            orderList.filter(a => get_Date(a.trndate,'YYYY-MM-DD') === dayjs(new Date(currentYear, currentMonth, day)).format("YYYY-MM-DD")).map(b => {
                sales += parseFloat(b.total);
            });
            expensesList.filter(a => get_Date(a.trndate,'YYYY-MM-DD') === dayjs(new Date(currentYear, currentMonth, day)).format("YYYY-MM-DD")).map(b => {
                expenses += parseFloat(b.grossamount);
            });
            salesSeries.push(sales);
            expensesSeries.push(expenses);
        }
        setChart(<AreaChart sales={salesSeries} expense={expensesSeries} categories={categoryArray} />)
    }, [orderList,currentMonth,currentYear])

    return (
        <div class='flex flex-col gap-4 w-full'>
            <div class='flex justify-between items-center'>
                <span class=" text-gray-800 italic ps-4">Daily report</span>  
                <div class='flex flex-row justify-end gap-2'>                 
                    <Dropdown menu={menuPropsMonth} style={{fontSize:16}} >
                        <Button>
                            <Space>
                                {monthsList.filter(a => a.key === currentMonth).map(b => b.label)}
                                <DownOutlined />
                            </Space>
                        </Button>
                    </Dropdown> 
                    <Dropdown menu={menuProps} style={{fontSize:16}} >
                        <Button>
                            <Space>
                                {currentYear}
                                <DownOutlined />
                            </Space>
                        </Button>
                    </Dropdown>
                </div>   
            </div>
            <div class='w-full bg-white border rounded p-5 text-gray-500 flex flex-col gap-2'>
                {chart === null ? <div class='h-[420px] flex items-center justify-center'><Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} /></div>
                    : chart}
            </div>
        </div>
    )
}
export default DailyReport