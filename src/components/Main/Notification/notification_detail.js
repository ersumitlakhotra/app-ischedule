/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import {  Tabs } from "antd";
import { customLabelTab, getTabItems } from "../../../common/items";
import NotificationTabs from "./notification_tabs";

const NotificationDetail = ({ refresh,   notification, tabActiveKey, setTabActiveKey, userList,servicesList,saveData,viewOrder }) => {

    const [allNotification, setAllNotification] = useState([]);
    const [allUnread, setAllUnread] = useState([]);
    const [newNotification, setNewNotification] = useState([]);
    const [rescheduleNotification, setRescheduleNotification] = useState([]);
    const [cancelNotification, setCancelNotification] = useState([]);

    const [newUnread, setNewUnread] = useState(0);
    const [rescheduleUnread, setRescheduleUnread] = useState(0);
    const [cancelUnread, setCancelUnread] = useState(0);
   

    useEffect(() => {
        
        setAllUnread(notification.filter(a => a.read === '0'))

        const newNotify = notification.filter(a => a.option === 'New');
        const rescheduleNotify = notification.filter(a => a.option === 'Reschedule');
        const cancelNotify = notification.filter(a => a.option === 'Cancel');
        setAllNotification(notification.length > 0 ? notification : [])
        setNewNotification(newNotify.length > 0 ? newNotify : [])
        setRescheduleNotification(rescheduleNotify.length > 0 ? rescheduleNotify : [])
        setCancelNotification(cancelNotify.length > 0 ? cancelNotify : [])

        setNewUnread(newNotify.filter(a => a.read === '0').length);
        setRescheduleUnread(rescheduleNotify.filter(a => a.read === '0').length);
        setCancelUnread(cancelNotify.filter(a => a.read === '0').length);
    }, [refresh,  notification])

    const tabItems = [
        getTabItems('1', customLabelTab("All", "cyan", 0,false), null, <NotificationTabs notificationList={allNotification} unread={[]} userList={userList} servicesList={servicesList} saveData={saveData} viewOrder={viewOrder} activeKey={tabActiveKey} />),
        getTabItems('2', customLabelTab("New", "green", newUnread,newUnread > 0 ), null, <NotificationTabs notificationList={newNotification}  unread={allUnread} userList={userList} servicesList={servicesList} saveData={saveData}  viewOrder={viewOrder} activeKey={tabActiveKey} />),
        getTabItems('3', customLabelTab("Reschedule", "blue", rescheduleUnread,rescheduleUnread > 0 ), null, <NotificationTabs notificationList={rescheduleNotification}  unread={allUnread}  userList={userList} servicesList={servicesList} saveData={saveData}  viewOrder={viewOrder} activeKey={tabActiveKey} />),
        getTabItems('4', customLabelTab("Cancel", "red",  cancelUnread,cancelUnread > 0 ), null, <NotificationTabs notificationList={cancelNotification}  unread={allUnread}  userList={userList} servicesList={servicesList} saveData={saveData}  viewOrder={viewOrder} activeKey={tabActiveKey} />),
        ];
 
    return (
        <div class='flex flex-col font-normal'>           
            <Tabs items={tabItems} activeKey={tabActiveKey} onChange={(e) => { setTabActiveKey(e); //if(e ==='2'){setUnreadUpdate(true)};
             }} />           
        </div>
    )
}

export default NotificationDetail;