import FetchData from "../hook/fetchData"
import { apiCalls } from "../hook/apiCall"
import ReactDOMServer from "react-dom/server";
import Template from './template.js'
import { get_Date } from "../common/localDate";
import { getStorage } from "../common/localStorage.js";

export const useEmail = () => {
    const AppointmentStatus = {
        CONFIRMED: "Confirmed",
        CANCELLED: "Cancelled",
        RESCHEDULED: "Rescheduled",
        REJECTED: "Rejected",
        AWAITING: "Awaiting",
    } 
    const getDetail = async (id,cid, userList, servicesList) => {
        const orderResponse = await FetchData({
            method: 'GET',
            endPoint: 'order', //
            id: id,
            cid: cid
        })
        const companyResponse = await FetchData({
            method: 'GET',
            endPoint: 'company',
            cid: cid
        })

        const bookedWith = userList.find(items => items.id === orderResponse.data.assignedto).fullname;
        let serviceNames = '';
        servicesList.filter(a => orderResponse.data.serviceinfo.some(b => b === a.id)).map(item =>
            serviceNames += item.name + ', '
        )
        let address = companyResponse.data.addressinfo !== null ? companyResponse.data.addressinfo[0].street + ', ' + companyResponse.data.addressinfo[0].city : '';
        return {
            order_no: orderResponse.data.order_no,
            date: orderResponse.data.trndate,
            slot: orderResponse.data.slot,
            name: orderResponse.data.name,
            sendTo: orderResponse.data.email,
            sendFrom: companyResponse.data.emailuser,
            pass: companyResponse.data.emailpass,
            storeName: companyResponse.data.name,
            storeId: companyResponse.data.store,
            cid: companyResponse.data.id,
            address: address,
            employee: bookedWith,
            services: serviceNames,
            reason: orderResponse.data.reason,
            ref: orderResponse.data.uuid
        }
    }

    const sendEmail = async ({ id,status,userList,servicesList,cid=null }) => {
        const order = await getDetail(id,cid, userList, servicesList);
   
        const Body = JSON.stringify({
            emailUser: order.sendFrom,
            emailPass: order.pass,
            storeName: order.storeName,
            to: order.sendTo,
            subject: "Appointment " + status,
            message: ReactDOMServer.renderToStaticMarkup(
                <Template 
                heading={status}
                 name={order.name} 
                 order_no={order.order_no} 
                 professional={order.employee} 
                 date={get_Date(order.date,'MMM DD,YYYY')}
                 slot={order.slot}
                 services={order.services}
                 store={order.storeName}
                 address={order.address}
                 storeId={order.storeId}
                 reason={order.reason}
                 ref={order.ref}
                 />
            ),
        });
        try {
           const res= await apiCalls("POST", "sendmail", order.cid, null, Body); 
            return {status:res.status,message:res.message}        
        }
        catch (e) {
            return { status: 500, message: e.message }   
        }
    }
    const sendBulkEmail = async ({ emails,subject,message }) => {
        const localStorage = await getStorage();
        const companyResponse = await FetchData({
            method: 'GET',
            endPoint: 'company',
            cid: localStorage.cid
        })
        const Body = JSON.stringify({
            emailUser: companyResponse.data.emailuser,
            emailPass: companyResponse.data.emailpass,
            storeName: companyResponse.data.name,
            emails,
            subject,
            message
        });
        try {
           const res= await apiCalls("POST", "sendbulkmail", localStorage.cid, null, Body); 
            return {status:res.status,message:res.message}        
        }
        catch (e) {
            return { status: 500, message: e.message }   
        }
    }

    return { sendEmail,sendBulkEmail, AppointmentStatus }
}



