/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from "react";
import Header from "../../components/Main/Header/header.js";
import Sidebar from "../../components/Main/Sidebar/sidebar.js";
import Dashboard from '../Dashboard/dashboard.js'
import Order from '../Order/order.js'
import Users from "../Users/users.js";
import {  useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import Services from "../Services/services.js";
import Event from "../Event/event.js";
import Tasks from "../Tasks/tasks.js";
import Setting from "../Setting/setting.js";
import { apiCalls } from "../../hook/apiCall.js";
import useAlert from "../../common/alert.js";
import { get_Date, LocalDate } from "../../common/localDate.js";
import Sales from "../Sales/sales.js";
import Payment from "../Payment/payment.js";
import Customer from "../Customer/customer.js";
import Schedule from "../Schedule/schedule.js";
import Collection from "../Collection/collection.js";

const MasterPage = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('Default');
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [open, setOpen] = useState(true);
  const { contextHolder, success, error } = useAlert();
  const [uid, setUid] = useState('0');

  const [settingActiveTab, setSettingActiveTab] = useState('1');
  const [paymentActiveTab, setPaymentActiveTab] = useState('1');

  const [fromDate, setFromDate] = useState(LocalDate());
  const [toDate, setToDate] = useState(LocalDate());

  const [orderList, setOrderList] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [logoList, setLogoList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [logsList, setLogsList] = useState([]);
  const [billingList, setBillingList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [scheduleList, setScheduleList] = useState([]);
  const [userPermissionList, setUserPermissionList] = useState([]);

  const [storeName, setStoreName] = useState('');
  const [storeCell, setStoreCell] = useState('');
  const [storeId, setStoreId] = useState('');
  const [emailUser, setEmailUser] = useState('');
  const [emailPass, setEmailPass] = useState('');


  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
   
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); 
  


  useEffect(() => {
    if (companyList.length !== 0) {
      setStoreName(companyList.name);
      setStoreCell(companyList.cell);
      setStoreId(companyList.store);
      setEmailUser(companyList.emailuser);
      setEmailPass(companyList.emailpass);
    }

  }, [companyList])

  useEffect(
    () => {
      // Update myValue based on screenWidth
      if (screenWidth < 768) {
        setOpen(false)
      } else if (screenWidth >= 768 && screenWidth < 1200) {
        setOpen(false)
      } else {
        setOpen(true)
      }
    },
    [screenWidth]
  );


  useEffect(() => {
    const intervalId = setInterval(() => {
        handleAuth();
    }, 3600000); // 7200000  2 hours 3600000 1 Hour
    return () => clearInterval(intervalId);
  }, []);


  useEffect(() => {
    handleAuth();
    setUid(localStorage.getItem('uid'));
  }, []);

  const handleAuth = async() => {
   // const res=await isAuthenticated()
    //if (!res) 
     // navigate("/");
  }

  const onSetSignout = () => {
    navigate("/");
  }
 

  const getData = async (setList, endPoint, eventDate = false, isLoadingShow = true) => {
    if (localStorage.getItem('cid') !== null && localStorage.getItem('cid')) {
      isLoadingShow && setIsLoading(true);
      try {
        const companyId = localStorage.getItem('cid');
        const res = await apiCalls("GET", endPoint, companyId, null, null, eventDate);
        const role = localStorage.getItem('role');
        if (endPoint === 'user' && role === 'Employee' )
        {
          const userId = localStorage.getItem('uid');
          const list = res.data.data.filter(item => item.id === userId)
          setList(list);
        }
       else
        setList(res.data.data);
      }
      catch (e) {
        setList([])
        //error(error.message)
      }
      isLoadingShow && setIsLoading(false);
    }
  }

  const saveData = async (label, method, endPoint, id = null, body = null, notify = true, logs = true,email=false) => {
    setIsLoading(true);
    try {

      const companyId = localStorage.getItem('cid');
      const result = await apiCalls(method, endPoint, companyId, id, body);

      if (result.status === 500 || result.status === 404) {
        notify && error(result.message);      
      }
      else {
        let status = result.status === 201 ? 'Created' : result.status === 200 ? 'Modified' : 'Deleted/Cancelled';
        if (logs)
          saveLogs(label,result.data.data.id,'',status,body,companyId)
        if (email)
           sendEmail(companyId, id,result);
    
        notify && success(`The ${label} has been ${status} successfully.`);
        setRefresh(refresh + 1)
      }
    }
    catch (e) {
      notify && error(e.message)
    }
    setIsLoading(false);
  }

  const saveLogs = async (label, id, lname, status, body,companyId) => {
    try {
      const Log = JSON.stringify({
        ltype: label,
        lid: id,
        lname: lname,
        userid: localStorage.getItem('uid'),
        status: status,
        datainfo: [body]
      });
      await apiCalls('POST', 'logs', companyId, null, Log);
    }
    catch{   
    }
  }
 const sendEmail = async (cid, id,result) => {
    let isEmailSend = false;
   let order_no = result.data.data.order_no;
   let customerName = result.data.data.name;
   let customerEmail = result.data.data.email;
   let servicesItem = result.data.data.serviceinfo;
   let employeeName = '';
   userList.filter(a => a.id === result.data.data.assignedto).map(b =>
     employeeName = b.fullname
   )

   let trndate = result.data.data.trndate;
   let slot = result.data.data.slot;
   let isCancelled = result.data.data.status === 'Cancelled' ? true : false;

    const Subject = isCancelled ? 'Booking Cancellation' : id === null ? "Booking Confirmation" : "Re-Schedule Confirmation";
    const link = `${process.env.REACT_APP_DOMAIN}/book-appointment?store=` + storeId;
    let serviceNames = '';
    servicesList.filter(a => servicesItem.some(b => b === a.id)).map(item =>
      serviceNames += item.name + ', '
    )

    let message = '<p>Hi ' + customerName + '</p>';
    message += `<p>This is a ${isCancelled ? 'cancellation' : 'confirmation'} of your <b>` + serviceNames + ' </b> booking on ' + get_Date(trndate, 'DD MMM YYYY') + ' at ' + slot + '.</p>';
    message += '<p>Your <b>Booking# :</b> ' + order_no + ' and <b>Booked With : </b>' + employeeName + '</p>';
    message += '<p>If you have any questions, please contact the business at ( ' + storeCell + ' )</p>';
    message += '<p>In case for New booking/Rescheduling/Cancellation, please click on this link:</p><a href="' + link + '">' + link + '</a>';

    const Body = JSON.stringify({
      emailUser: emailUser,
      emailPass: emailPass,
      storeName: storeName,
      to: customerEmail,
      subject: Subject,
      message: message,
    });
    try {
      const result = await apiCalls("POST", "sendmail", cid, null, Body);
      if (result.status === 200)
        isEmailSend = true;
    }
    catch (e) {
      isEmailSend = false;
    }

    return isEmailSend;
  }
  const onSelected = (newContent) => {
    setIsLoading(true);
    setContent(newContent);
    setRefresh(refresh + 1)
    setIsLoading(false);
  };

  useEffect(() => {
    switch (content) {
      case "Dashboard":
        {
          getData(setCompanyList, "company");
          getData(setServicesList, "services");
          getData(setUserList, "user");
          getData(setExpenseList, "payment");
          getData(setEventList, "event", true);
          getData(setLogsList, "logs");
          getData(setScheduleList, "schedule");
          getData(setOrderList, "order");
          break;
        }
      case "Appointment":
        {
          getData(setServicesList, "services");
          getData(setUserList, "user");
          getData(setCompanyList, "company");
          getData(setEventList, "event", true);
          getData(setCustomerList, "customer");
          getData(setLogsList, "logs");
          getData(setOrderList, "order");
          break;
        }
      case 'Calender':
        {
          getData(setCustomerList, "customer");
          getData(setEventList, "event", true);
          getData(setUserList, "user");
          getData(setServicesList, "services");
          getData(setOrderList, "order");
          getData(setCompanyList, "company");
          break;
        }
      case 'Event':
        {
          getData(setUserList, "user");
          getData(setLogsList, "logs");
          getData(setEventList, "event", true);
          getData(setServicesList, "services");
          break;
        }
      case 'Payment':
        {
          getData(setLogsList, "logs");
          getData(setUserList, "user");
          getData(setExpenseList, "payment");
          break;
        }
      case 'Customers':
        {
          getData(setCustomerList, "customer");
          break;
        }
      case 'Services':
        {
          getData(setUserList, "user");
          getData(setLogsList, "logs");
          getData(setServicesList, "services");
          break;
        }
      case 'Sales':
        {
          getData(setCompanyList, "company");
          getData(setUserList, "user");
          getData(setExpenseList, "payment");
          getData(setOrderList, "order");
          break;
        }
      case 'Collection':
        {
          getData(setUserList, "user");
          getData(setServicesList, "services");
          getData(setOrderList, "order");
          break;
        }
      case 'Users':
        {
          getData(setLogsList, "logs");
          getData(setScheduleList, "schedule");
          getData(setUserPermissionList, "userpermission");
          getData(setUserList, "user");
          break;
        }
      case 'TimeSheet':
        {
          getData(setLogsList, "logs");
          getData(setScheduleList, "schedule");
          getData(setUserPermissionList, "userpermission");
          getData(setUserList, "user");
          break;
        }
      case 'Setting':
        {
          getData(setCompanyList, "company");
          getData(setLogoList, "logo");
          getData(setBillingList, "billing");
          break;
        }
      default: { break }
    }
  }, [refresh]);

  let displayedContent;
  if (content === 'Dashboard') {
    displayedContent =
      <Dashboard
        orderList={orderList}
        servicesList={servicesList}
        userList={userList}
        expensesList={expenseList}
        eventList={eventList}
        logsList={logsList}
        companyList={companyList}
        scheduleList={scheduleList}
        saveData={saveData}
        onSelected={onSelected}
        refresh={refresh} 
        setFromDate={setFromDate}    
        setToDate={setToDate}
      />;
  } else if (content === 'Calender') {
    displayedContent =
      <Tasks
        orderList={orderList}
        userList={userList}
        servicesList={servicesList}
        companyList={companyList}
        customerList={customerList}
        eventList={eventList}
        saveData={saveData}
        reload={refresh}
        setReload={setRefresh}
      />;
  } else if (content === 'Appointment') {
    displayedContent =
      <Order
        orderList={orderList}
        servicesList={servicesList}
        userList={userList}
        companyList={companyList}
        eventList={eventList}
        logsList={logsList}
        customerList={customerList}
        saveData={saveData}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
      />;
  } else if (content === 'Event') {
    displayedContent =
      <Event
        eventList={eventList}
        servicesList={servicesList}
        logsList={logsList}
        userList={userList}
        saveData={saveData}
      />;
  } else if (content === 'Payment') {
    displayedContent =
      <Payment
        expensesList={expenseList}
        userList={userList}
        logsList={logsList}
        saveData={saveData}
        tabActiveKey={paymentActiveTab}
        setTabActiveKey={setPaymentActiveTab}
      />;
  } else if (content === 'Customers') {
    displayedContent =
      <Customer
        customerList={customerList}
        setCustomerList={setCustomerList}
        saveData={saveData}
      />;
  } else if (content === 'Services') {
    displayedContent =
      <Services
        servicesList={servicesList}
        logsList={logsList}
        userList={userList}
        setServicesList={setServicesList}
        saveData={saveData}
      />;
  } else if (content === 'Users') {
    displayedContent =
      <Users
        userList={userList}
        userPermissionList={userPermissionList}
        logsList={logsList}
        scheduleList={scheduleList}
        saveData={saveData}
      />;
  } else if (content === 'TimeSheet') {
    displayedContent =
      <Schedule
        userList={userList}
        scheduleList={scheduleList}
        saveData={saveData}
      />;
  } else if (content === 'Sales') {
    displayedContent =
      <Sales
        orderList={orderList}
        userList={userList}
        expensesList={expenseList}
        companyList={companyList}
      />;
  } else if (content === 'Collection') {
    displayedContent =
      <Collection
      orderList={orderList}  
      servicesList={servicesList}
      userList={userList} 
      saveData={saveData}
      />;
  } else if (content === 'Setting') {
    displayedContent =
      <Setting
        companyList={companyList}
        billingList={billingList}
        saveData={saveData}
        setRefresh={setRefresh}
        logoList={logoList}
        tabActiveKey={settingActiveTab}
        setTabActiveKey={setSettingActiveTab}
        onSetSignout={onSetSignout}
      />;
  }

  return (
    <div class='h-screen w-full flex flex-row '>
      <Sidebar key={1} onSelected={onSelected} content={content} setContent={setContent} open={open} uid={uid} getData={getData} />
      <div class='flex flex-col w-full bg-gray-50 '>
        <div class='h-16 border-b bg-white '>
          <Header onSignout={onSetSignout} open={open} setOpen={setOpen} getData={getData} saveData={saveData} refresh={refresh} uid={uid}  />
        </div>
        <div class='overflow-y-scroll p-8 w-full'>
          {isLoading || content === 'Default' ? (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999, // Ensure it's on top
              }}
            >
              <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
            </div>
          ) :
            displayedContent
          }
        </div>
      </div>
      {contextHolder}
    </div>
  )
}

export default MasterPage