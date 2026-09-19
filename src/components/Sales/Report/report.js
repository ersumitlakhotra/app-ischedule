/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Image, Tag } from "antd";
import { useEffect, useState } from "react";
import {  UserOutlined } from '@ant-design/icons';
import { getTableItem } from "../../../common/items";
import { get_Date } from "../../../common/localDate.js";

const Report = ({ orderList, expensesList, userList, fromDate, toDate, setExportList }) => {
    const [filteredList, setFilteredList] = useState([]);

    useEffect(() => {
        const order = orderList.filter(a => get_Date(a.trndate,'YYYY-MM-DD') >= fromDate && get_Date(a.trndate,'YYYY-MM-DD') <= toDate);
       // const expense = expensesList.filter(a => get_Date(a.trndate,'YYYY-MM-DD') >= fromDate && get_Date(a.trndate,'YYYY-MM-DD') <= toDate && a.etype === 'Expense');
        //const payment = expensesList.filter(a => get_Date(a.trndate,'YYYY-MM-DD') >= fromDate && get_Date(a.trndate,'YYYY-MM-DD') <= toDate && a.etype === 'Payment');
        setFilteredList([]); 
        setExportList([]);
        let sales_total = 0; 
        let tip_total = 0; 
        let tax_total = 0; 
        let result_total = 0;
        userList.map(user => {
            const userSales = order.filter(a => a.assignedto === user.id);
            //const userPayments = payment.filter(a => a.assignedto === user.id);
            let totalSale = 0; let totalTip = 0;let totalTax = 0; let result = 0;
            userSales.map(s => {
                totalSale += parseFloat(s.total);
                totalTip += parseFloat(s.tip);
                totalTax += parseFloat(s.taxamount);
            })
            //userPayments.map(p => {totalPayment += p.ptype === 'Payroll' ? parseFloat(p.netamount) : parseFloat(p.grossamount);})
            result = (totalSale + totalTip+totalTax).toFixed(2);

            handleFilteredList({
                key: user.id,
                assignedto: user.id,
                profilepic: user.profilepic,
                fullname: user.fullname,
                sale: totalSale,
                tip: totalTip,
                tax: totalTax,
                result: result
            });
            sales_total += parseFloat(totalSale);
            tip_total += parseFloat(totalTip);
            tax_total += parseFloat(totalTax);
           // expense_total += parseFloat(totalPayment);
        })

       {/* let otherExpense = 0;
        expense.map(exp => { otherExpense += parseFloat(exp.grossamount);})
        handleFilteredList({
            key: 0,
            assignedto: 0,
            profilepic: null,
            fullname: "Other Expenses",
            sale: 0,
            expense: otherExpense,
            result: -otherExpense
        });
        expense_total += parseFloat(otherExpense);
        */}
        result_total = sales_total + tip_total+tax_total;

        handleFilteredList({
            key: -1,
            assignedto: -1,
            profilepic: null,
            fullname: "Total",
            sale: sales_total.toFixed(2),
            tip: tip_total.toFixed(2),
            tax: tax_total.toFixed(2),
            result: result_total.toFixed(2)
        });

    }, [orderList, fromDate, toDate])

    const handleFilteredList = (newElement) => {
        setFilteredList(prevArray => [...prevArray, newElement]);
        setExportList(prevArray => [...prevArray, newElement]);
    };
    const headerItems = [
        getTableItem('1', 'User'),
        getTableItem('2', 'Sales'),
        getTableItem('3', 'Tip'),
        getTableItem('4', 'Tax'),
        getTableItem('5', 'Amount')
    ];

    return (
        {/*
        <DataTable headerItems={headerItems} list={filteredList} isFooter={false}
            body={(
                filteredList.map(item => (
                    parseInt(item.key) >= 0 ?
                        <tr key={item.assignedto} class="bg-white border-b text-xs  whitespace-nowrap border-gray-200 hover:bg-zinc-50 ">
                            <td class="p-3">
                                <div key={item.assignedto} class='flex flex-row gap-2 items-center'>
                                    {item.profilepic !== null ?
                                        <Image width={31} height={31} src={item.profilepic} style={{ borderRadius: 15 }} /> :
                                        <Avatar size={30} style={{ backgroundColor: 'whitesmoke' }} icon={<UserOutlined style={{ color: 'black' }} />} />
                                    }
                                    <p>{item.fullname}</p>
                                </div>
                            </td>
                            <td class="p-3 font-semibold">$ {item.sale}</td>
                            <td class="p-3 font-semibold">$ {item.tip}</td>
                            <td class="p-3 font-semibold">$ {item.tax}</td>
                            <td class="p-3 ">
                                <Tag key={item.assignedto}
                                    color={parseFloat(item.result) === 0 ? "" : parseFloat(item.result) > 0 ? "green" : 'red'}
                                    bordered={false}>$ {item.result}</Tag></td>
                        </tr>
                        :
                        <tr key={item.assignedto} class="bg-white border-b-2 border-t-2 text-xs  whitespace-nowrap border-black">
                            <td class="p-3 font-bold">{item.fullname}</td>
                            <td class="p-3 font-semibold">$ {item.sale}</td>
                            <td class="p-3 font-semibold">$ {item.tip}</td>
                            <td class="p-3 font-semibold">$ {item.tax}</td>
                            <td class="p-3 ">
                                <Tag key={item.assignedto}
                                    color={parseFloat(item.result) === 0 ? "" : parseFloat(item.result) > 0 ? "green" : 'red'}
                                    bordered={false}>$ {item.result}</Tag></td>
                        </tr>
                ))
            )} />
             */}
    )
}
export default Report