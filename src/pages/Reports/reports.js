/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Select,  Popover, DatePicker } from "antd";
import { useEffect, useState } from "react";
import { firstDateOfMonth,  lastDateOfMonth } from "../../common/localDate.js";
import dayjs from 'dayjs';
import { useOutletContext } from "react-router-dom";

import { IsLoading, PageHeader } from "../../common/index.jsx";
import Sales from "./sales.js";
import Collection from "./collection.js";


const Reports = () => {
    const headingLabel = 'Reports'
    const { saveData, refresh, orderList,getOrder, userList,  getUser, companyList,getCompany,servicesList,getService} = useOutletContext();
    const [isLoading, setIsLoading] = useState(false);  
    const [fromDate, setFromDate] = useState(dayjs(firstDateOfMonth(new Date())).format("YYYY-MM-DD"));
    const [toDate, setToDate] = useState(dayjs(lastDateOfMonth(new Date())).format("YYYY-MM-DD"));
    //const filteredOptionsServices = servicesList.filter(o => !selectedItems.includes(o));
   
    const [exportList, setExportList] = useState([]);
    const [reportType, setReportType] = useState('Sales');


    useEffect(() => {
        Init();
    }, [refresh])

    const Init = async () => {
        setIsLoading(true)
        await getOrder();
        await getService();
        await getUser();
        await getCompany();
        setIsLoading(false)
    }


    return (
        <div class="flex flex-col gap-4 md:px-7 py-4  mb-12">
{/*Sales is exportName fir sales*/}
            <PageHeader label={headingLabel} isExport={true} exportList={exportList} exportName={reportType} isCreate={false} servicesList={[]} userList={userList} />

            <div class='w-full bg-gray-100 border rounded-lg p-4 flex flex-col gap-4 '>
                <div class='flex flex-col md:flex-row gap-2 items-center justify-between'>
                    <div class='w-full flex flex-row gap-2 items-center md:w-1/3'>
                        <p class='text-sm text-gray-500 whitespace-nowrap'>Type</p>
                        <Select
                            value={reportType}
                            style={{ width: 300 , fontSize:16}}
                            size="large"
                            onChange={(value) => setReportType(value)}
                            options={[
                                { value: 'Sales', label: 'Sales Report' },
                                { value: 'Collection', label: 'Collection Report' }
                            ]}
                        />
                    </div>
                    <div class='w-full md:w-2/3'>
                        <div class='flex flex-col md:flex-row md:justify-end gap-4 '>
                            <Popover placement="bottom" title={"Filter by From Date"} content={
                                <div>
                                    <DatePicker
                                        style={{ width: '100%',fontSize:16 }}
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
                                        style={{ width: '100%',fontSize:16 }}
                                        allowClear={false}
                                        value={toDate === '' ? toDate : dayjs(toDate, 'YYYY-MM-DD')}
                                        onChange={(date, dateString) => setToDate(dateString)} />
                                </div>
                            }>
                                <Button className="text-xs"><span class='font-medium'>To Date :  </span><span class='text-blue-500'> {toDate}  </span></Button>
                            </Popover>
                        </div>
                        {/**/}
                    </div>
                </div>


            </div>

            <IsLoading isLoading={isLoading} rows={10} input={
               reportType === "Sales" ? 
               <Sales orderList={orderList} userList={userList}  companyList={companyList} fromDate={fromDate} toDate={toDate} setExportList={setExportList}  />
               : reportType === "Collection" ? 
               <Collection orderList={orderList} servicesList={servicesList}  userList={userList} saveData={saveData} fromDate={fromDate} toDate={toDate} setExportList={setExportList}  />
               :<></>
            } />


        </div>
    )
}

export default Reports;

