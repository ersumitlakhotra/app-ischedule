/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, DatePicker, Popover } from "antd";
import { useEffect, useState } from "react";
import { firstDateOfMonth, lastDateOfMonth } from "../../common/localDate.js";
import dayjs from 'dayjs';
import ExportToExcel from "../../common/export.js";
import { YearsList } from "../../common/yearslist.js";
import MonthlyReport from "../../components/Sales/MonthlyReport/monthlyreport.js";
import AnnualReport from "../../components/Sales/AnnualReport/annualreport.js";
import Report from "../../components/Sales/Report/report.js";
import DailyReport from "../../components/Sales/DailyReport/dailyreport.js";


const Sales = ({ orderList, userList,  companyList,setExportList,fromDate,toDate }) => {  
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const [yearList, setYearList] = useState(YearsList(new Date().getFullYear())); 

    useEffect(() => {
        setYearList(YearsList(new Date(companyList.createdat).getFullYear()));
    }, [companyList])

    return (
        <div class="flex flex-col gap-4 mb-12">

            <div class='flex flex-col gap-4 w-full md:flex-row'>
                <div class='flex flex-col gap-4 w-full md:w-1/2 '>
                    <DailyReport orderList={orderList} expensesList={[]} yearList={yearList}/>
                    <MonthlyReport orderList={orderList} expensesList={[]} yearList={yearList} months={months} />
                    <AnnualReport orderList={orderList} expensesList={[]} yearList={yearList} months={months} />                   
                </div>

                <div class='w-full bg-white md:w-1/2 '>
                    <Report orderList={orderList} expensesList={[]} userList={userList} fromDate={fromDate} toDate={toDate} setExportList={setExportList}/>               
                </div>
            </div>
        </div>
    )
}

export default Sales;