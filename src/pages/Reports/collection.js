/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {  get_Date } from "../../common/localDate.js";
import {  Skeleton, Select,Badge, Drawer } from "antd";
import { getTableItem } from "../../common/items.js";
import { Tags } from "../../common/tags.js";

const Collection = ({ orderList, servicesList, userList,saveData,setExportList,fromDate,toDate }) => {  
    const [price, setPrice] = useState(null);
    const [tax, setTax] = useState(null);
    const [received, setReceived] = useState(null);
    const [discount, setDiscount] = useState(null);
    const [tip, setTip] = useState(null);
    const [total, setTotal] = useState(null);
    const [filteredList, setFilteredList] = useState(null);
    
    const [status, setStatus] = useState('Completed');
    const [sortStatus, setSortStatus] = useState('');

    const [openView, setOpenView] = useState(false);
    const [id, setId] = useState(0);
    const [refresh, setRefresh] = useState(0);

    const btn_ViewClick = (id) => {
        setRefresh(refresh + 1);
        setId(id);
        setOpenView(true);
    }

    useEffect(() => {
        search();
    }, []) 
    
    useEffect(() => {
        search();
    }, [orderList,fromDate, toDate,sortStatus,status])

    const search = () => {
        setPrice(null);
        setTax(null);
        setReceived(null);
        setDiscount(null);
        setTip(null);
        setTotal(null);
        setFilteredList(null); 
        setExportList([]);
        let _price = 0;
        let _tax = 0;
        let _received = 0;
        let _discount = 0;
        let _tip = 0;
        let _total = 0;
        let list=orderList.filter(item => get_Date(item.trndate, 'YYYY-MM-DD') >= fromDate && get_Date(item.trndate, 'YYYY-MM-DD') <= toDate && item.status !== 'Cancelled' && item.status !== 'Rejected'  );   
        if(sortStatus !=='')
             list=list.filter(item => item.mode === sortStatus);
            
        if(status !=='')
             list=list.filter(item => item.status === status);

        list.map(b => {
            _price += parseFloat(b.price);
            _tax += parseFloat(b.taxamount);
            _received += parseFloat(b.received);
            _discount += parseFloat(b.discount);
            _tip += parseFloat(b.tip);
            _total += parseFloat(b.total);
            
        }); 
        setPrice(_price);
        setTax(_tax);
        setReceived(_received);
        setDiscount(_discount);
        setTip(_tip);
        setTotal(_total);     
        setFilteredList(list);
        setExportList(list);
    }

    const headerItems = [
        getTableItem('1', 'Order'),
        getTableItem('2', 'Date'),
        getTableItem('3', 'Price'),
        getTableItem('4', 'Discount'),
        getTableItem('5', 'Tax'),
        getTableItem('6', 'Total'),
        getTableItem('7', 'Received'),
        getTableItem('8', 'Tip'),
        getTableItem('9', 'Mode'),
        getTableItem('10', 'Status'),
    ];
    const calculate = (total,received) => {
        return parseFloat(total).toFixed(2) > parseFloat(received).toFixed(2);
        }

    return (
        <div class="flex flex-col gap-4 mb-12">

          {/*
            <div class='flex flex-col gap-4 xl:flex-row '>
                <div class='w-full flex flex-col gap-4 md:flex-row '>
                    <Card key={1} index={1} title={'Price'} value={price} backgroundColor={'#fde3cf'} color={'#f56a00'} />
                    <Card key={2} index={2} title={'Discount'} value={discount} backgroundColor={'#fde3cf'} color={'#f56a00'} />
                    <Card key={3} index={3} title={'Tax'} value={tax} backgroundColor={'#fde3cf'} color={'#f56a00'} />
                </div>
                <div class=' w-full flex flex-col gap-4 md:flex-row '>
                    <Card key={4} index={4} title={'Total'} value={total} backgroundColor={'#fde3cf'} color={'#f56a00'} />
                    <Card key={5} index={5} title={'Received'} value={received} backgroundColor={'#fde3cf'} color={'#f56a00'} />
                    <Card key={6} index={6} title={'Tip'} value={tip} backgroundColor={'#fde3cf'} color={'#f56a00'} />
                </div>
            </div>
            */}
            <div class='w-full overflow-auto bg-white border rounded-lg p-4 flex flex-col gap-4  ' style={{height:'100vh'}}>
                <div class='flex flex-col md:flex-row gap-2 items-center'>
                    <p class='w-full  md:w-auto text-sm text-gray-500 whitespace-nowrap'>Filter by</p>
                    <div class='w-full flex flex-row gap-2 items-center md:w-52'>
                        
                        <Select
                            value={sortStatus}
                            style={{ width: '100%' }}
                            onChange={(e) => setSortStatus(e)}
                            options={[
                                { value: '', label: <Badge color={'gray'} text={'All'} /> },
                                { value: 'Cash', label: <Badge color={'lime'} text={'Cash'} /> },
                                { value: 'Interac', label: <Badge color={'gold'} text={'Interac'} /> },
                                { value: 'Card', label: <Badge color={'hwb(205 6% 9%)'} text={'Card'} /> }
                            ]}
                        />
                    </div>  
                    <div class='w-full flex flex-row gap-2 items-center  md:w-52'>
                        <Select
                            value={status}
                            style={{ width: '100%' }}
                            onChange={(e) => setStatus(e)}
                            options={[
                                { value: '', label: <Badge color={'gray'} text={'All'} /> },
                                { value: 'Pending', label: <Badge color={'yellow'} text={'Pending'} /> },
                                { value: 'In progress', label: <Badge color={'blue'} text={'In progress'} /> },
                                { value: 'Completed', label: <Badge color={'green'} text={'Completed'} /> },
                                //{ value: 'Cancelled', label: <Badge color={'red'} text={'Cancelled'} /> },
                                //{ value: 'Rejected', label: <Badge color={'red'} text={'Rejected'} /> },
                            ]}
                        />
                    </div>
                    {/* <div class='w-full md:w-2/3'>
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
                       
                    </div>*/}
                </div>
                {/*filteredList === null ? <Skeleton active style={{ padding: '16px' }} /> :
                    <DataTable headerItems={headerItems} list={filteredList} isFooter={false}
                        body={(
                            filteredList.map(item => (
                                <tr key={item.id} class="bg-white border-b text-xs  whitespace-nowrap border-gray-200 hover:bg-zinc-50 ">
                                    <td class="p-3 text-blue-500 italic hover:underline cursor-pointer" onClick={() => btn_ViewClick(item.id)}  ># {item.order_no}</td>
                                    <td class="p-3 font-semibold">{get_Date(item.trndate, 'DD MMM YYYY')}</td>
                                    <td class="p-3">$ {item.price}</td>
                                    <td class="p-3">$ {item.discount}</td>
                                    <td class="p-3">$ {item.taxamount}</td>
                                    <td class="p-3">$ {item.total}</td>
                                    <td class={`p-3 ${calculate(item.total, item.received) && 'text-red-500'}`}>$ {item.received}</td>
                                    <td class="p-3">$ {item.tip}</td>

                                    <td class="p-3 font-semibold">{item.mode}</td>
                                    <td class="p-3">{Tags(item.status)}</td>
                                </tr>
                            ))
                        )} />
                */}
            </div>

           
        </div>
    )
}

export default Collection;