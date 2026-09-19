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


const Sales = ({ orderList, userList, expensesList, companyList }) => {  
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const [yearList, setYearList] = useState(YearsList(new Date().getFullYear())); 
    const [fromDate, setFromDate] = useState(dayjs(firstDateOfMonth(new Date())).format("YYYY-MM-DD"));
    const [toDate, setToDate] = useState(dayjs(lastDateOfMonth(new Date())).format("YYYY-MM-DD"));

    const [exportList, setExportList] = useState([]);
    useEffect(() => {
        setYearList(YearsList(new Date(companyList.createdat).getFullYear()));
    }, [companyList])

    return (
        <div class="flex flex-col gap-4 mb-12">

            <div class='flex items-center justify-between'>
                <span class="text-lg font-semibold text-gray-800">Sales Report</span>
                <ExportToExcel data={exportList} fileName="Sales" servicesList={[]} userList={userList} />
            </div>

            <div class='flex flex-col gap-4 w-full md:flex-row'>
                <div class='flex flex-col gap-4 w-full md:w-1/2 '>
                    <DailyReport orderList={orderList} expensesList={expensesList} yearList={yearList}/>
                    <MonthlyReport orderList={orderList} expensesList={expensesList} yearList={yearList} months={months} />
                    <AnnualReport orderList={orderList} expensesList={expensesList} yearList={yearList} months={months} />                   
                </div>

                <div class='flex flex-col gap-4 w-full bg-white border rounded p-5 text-gray-500 md:w-1/2 '>
                    <div class='flex flex-col md:flex-row md:justify-end gap-4 '>
                        <Popover placement="bottom" title={"Filter by From Date"} content={
                            <div>
                                <DatePicker
                                    style={{ width: '100%' }}
                                    allowClear={false}
                                    value={fromDate === '' ? fromDate : dayjs(fromDate, 'YYYY-MM-DD')}
                                    onChange={(date, dateString) => setFromDate(dateString)} />
                            </div>
                        }>
                            <Button className="text-xs"><span class='font-medium'>From Date :  </span><span class='text-blue-500'> {fromDate}  </span></Button>
                        </Popover>
                        <Popover placement="bottom" title={"Filter by To Date"} content={
                            <div>
                                <DatePicker
                                    style={{ width: '100%' }}
                                    allowClear={false}
                                    value={toDate === '' ? toDate : dayjs(toDate, 'YYYY-MM-DD')}
                                    onChange={(date, dateString) => setToDate(dateString)} />
                            </div>
                        }>
                            <Button className="text-xs"><span class='font-medium'>To Date :  </span><span class='text-blue-500'> {toDate}  </span></Button>
                        </Popover>
                    </div>
                    <Report orderList={orderList} expensesList={expensesList} userList={userList} fromDate={fromDate} toDate={toDate} setExportList={setExportList}/>               
                </div>
            </div>
        </div>
    )
}

export default Sales;