/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import Card from "../../components/Dashboard/Header/card.js";
import Appointment from "../../components/Dashboard/Appointments/appointment.js";
import { YearsList } from "../../common/yearslist.js";
import AnnualReport from "../../components/Dashboard/AnnualReport/annual_report.js";
import Task from "../../components/Dashboard/Task/task.js";
import LiveEvent from "../../components/Dashboard/LiveEvent/live_event.js";
import RecentActivities from "../../components/Dashboard/RecentActivities/recent_activities.js";
import { useEffect, useState } from "react";
import { get_Date, lastDateOfMonth } from "../../common/localDate.js";
import dayjs from 'dayjs';
import { AreaChartCard } from "../../components/Dashboard/Charts/charts.js";
import Schedule from "../../components/Dashboard/Schedule/schedule.js";

const Dashboard = ({refresh, orderList, expensesList, servicesList, userList, eventList, logsList, companyList, scheduleList, saveData, onSelected ,setFromDate,setToDate }) => {  
    
    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const [orderChart, setOrderChart] = useState(null);
    const [totalOrders, setTotalOrders] = useState(0);
    const [salesChart, setSalesChart] = useState(null);
    const [totalSales, setTotalSales] = useState(0);
    const [expenseChart, setExpenseChart] = useState(null);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [revenueChart, setRevenueChart] = useState(null);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [yearList, setYearList] = useState(YearsList(new Date().getFullYear())); 

    useEffect(() => {
        setYearList(YearsList(new Date(companyList.createdat).getFullYear()));
    }, [companyList])

    useEffect(() => {
        setOrderChart(null);
        setSalesChart(null);
        setExpenseChart(null);
        setRevenueChart(null);
        let categoryArray = [];
        let orderSeries = [];
        let salesSeries = [];
        let expensesSeries = [];
        let revenueSeries = [];
        let totalOrder = 0;
        let totalSales = 0;
        let totalExpenses = 0;
        let totalRevenue = 0;
        const lastDayOfMonth = lastDateOfMonth(new Date());
        const year = dayjs().year();
        const month = dayjs().month();
        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            categoryArray.push(dayjs(new Date(year, month, day)).format("MMM DD"));
            let sales = 0;
            let expenses = 0;
            let revenue = 0;
            const order = orderList.filter(a => get_Date(a.trndate,'YYYY-MM-DD') === dayjs(new Date(year, month, day)).format("YYYY-MM-DD")).map(b => {
                sales += parseFloat(b.total);
            }); 
            expensesList.filter(a => get_Date(a.trndate,'YYYY-MM-DD') === dayjs(new Date(year, month, day)).format("YYYY-MM-DD")).map(b => {
                expenses += b.ptype === 'Payroll' ? parseFloat(b.netamount) : parseFloat(b.grossamount);
                        });

            orderSeries.push(order.length);
            totalOrder += order.length;

            salesSeries.push(sales);
            totalSales += sales;

            expensesSeries.push(expenses);
            totalExpenses += expenses;

            revenue = parseFloat(sales) - parseFloat(expenses);
            revenueSeries.push(revenue);
            totalRevenue += revenue;

        }
        setOrderChart(<AreaChartCard categoriesArray={categoryArray} color={'#99ddff'} series={orderSeries} name={'#'} />)
        setTotalOrders(totalOrder);
        setSalesChart(<AreaChartCard categoriesArray={categoryArray} color={'#a6f2a6'} series={salesSeries} name={'$'} />)
        setTotalSales(parseFloat(totalSales).toFixed(2));
        setExpenseChart(<AreaChartCard categoriesArray={categoryArray} color={'#ff9999'} series={expensesSeries} name={'$'} />)
        setTotalExpenses(parseFloat(totalExpenses).toFixed(2) );
        setRevenueChart(<AreaChartCard categoriesArray={categoryArray} color={'#fff899'} series={revenueSeries} name={'$'} />)
        setTotalRevenue(parseFloat(totalRevenue).toFixed(2));
    }, [orderList, refresh])

    return (
        <div class="flex flex-col gap-4 mb-12">

            {/* cards*/}
            <span class="text-lg font-semibold text-gray-800">Dashboard</span>         
            <div class='flex flex-col gap-2 xl:flex-row '>
                <div class='w-full flex flex-col gap-2 md:flex-row '>
                    <Card index={1} title={'Orders'} value={totalOrders} sign={'#'} chart={orderChart} />
                    <Card index={2} title={'Sales'} value={totalSales} sign={'$'} chart={salesChart} />
                </div>
                <div class='w-full flex flex-col gap-2 md:flex-row '>
                    <Card index={3} title={'Expenses'} value={totalExpenses} sign={'$'} chart={expenseChart} />
                    <Card index={4} title={'Profit/Loss'} value={totalRevenue} sign={'$'} chart={revenueChart} />
                </div>
            </div>

            <div class='flex flex-col gap-4 mt-4  w-full md:flex-row'>
                <div class='flex flex-col gap-4 w-full md:w-4/6'>
                    <Appointment orderList={orderList} yearList={yearList} months={months} onSelected={onSelected} setFromDate={setFromDate} setToDate={setToDate}  />
                    <AnnualReport orderList={orderList} expensesList={expensesList} yearList={yearList} months={months} />   
                    <Task orderList={orderList} userList={userList} />                   
                </div>
                <div class='flex flex-col gap-4 w-full md:w-2/6'>
                    <LiveEvent eventList={eventList} servicesList={servicesList} onSelected={onSelected} saveData={saveData} />
                    <RecentActivities orderList={orderList} userList={userList} eventList={eventList} servicesList={servicesList} expensesList={expensesList} logsList={logsList} />  
                    <Schedule scheduleList={scheduleList} userList={userList} saveData={saveData}  />                        
                </div>
            </div>   

        </div>
    )
}

export default Dashboard;