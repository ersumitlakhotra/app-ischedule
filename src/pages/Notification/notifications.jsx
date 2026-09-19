import React, { useEffect, useState } from "react";
import { Button, Modal, Select } from "../../controls/index.jsx";
import { HeaderModal, IsLoading, NoResults } from "../../common/index.jsx";
import { useNavigate, useOutletContext } from "react-router-dom";
import Card from "./card.jsx";
import { Bell } from "lucide-react";

const notifications = [
    {
        id: 1,
        name: "Pixelwave",
        time: "1h ago",
        title: "Commented on",
        project: "Classic Car in Studio",
        description:
            "These draggable sliders look really cool. Maybe these could be displayed when you hold shift, t...",
        avatar:
            "https://i.pravatar.cc/100?img=47",
        option: "comment",
        uid:91,
        unread: true,
    },
    {
        id: 2,
        name: "Cute Turtle is generated",
        time: "1h ago",
        title: "Matte texture - UI8 Style",
        description:
            "Sandeep Kaur would like to book  an appointment on Monday, Feb 02, 2026 at 03:00 PM - 04:00 PM",
        avatar:
            "https://i.pravatar.cc/100?img=32",
        option: "Reschedule",
        uid:94,
        unread: true,
    },
    {
        id: 3,
        name: "3D object is generated",
        time: "1h ago",
        title: "Invited you to edit",
        project: "Minimalist Architecture Scene",
        avatar:
            "https://i.pravatar.cc/100?img=44",
        option: "New",
        unread: true,
        uid:91,
        actions: true,
    },
    {
        id: 4,
        name: "Luna",
        time: "1h ago",
        title: "Liked",
        project: "Classic Car in Studio",
        avatar:
            "https://i.pravatar.cc/100?img=5",
        option: "like",
        uid:91,
        unread: false,
    },
    {
        id: 5,
        name: "3D object is generated",
        time: "1h ago",
        title: "Commented on",
        project: "Classic Car in Studio",
        description:
            "These draggable sliders look really cool. Maybe these could be displayed when you hold shift, t...",
        avatar:
            "https://i.pravatar.cc/100?img=12",
        option: "Cancel",
        uid:91,
        unread: true,
    },
];

export default function Notifications() {
    const navigate = useNavigate();
    const { refresh,saveData, getNotification, getUser } = useOutletContext();
    const [activeTab, setActiveTab] = useState("unread");
    const [isLoading, setIsLoading] = useState(false);
    const [List, setList] = useState([]);
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        Init();
    }, [])

    const Init = async () => {
        setIsLoading(true);
        const [Response, UserResponse] = await Promise.all([getNotification(), getUser()]);
        setList(Response);
        setUserList(UserResponse);
        handleMarkRead(Response);
        setIsLoading(false);
    }

    const displayedNotifications =
        activeTab === "all"
            ? List
            : List.filter((item) => item.unread);

    const handleMarkRead = async (Response) => {      
    const ids = Response.filter((item) => item.unread).map((item) => item.id);  
       await saveData({
            label: "Notification",
            endPoint: "mark-read-notification",
            id: null,
            notify:false,
            body:  JSON.stringify({ ids: ids })
        });
    };

    const handleClose = async () => {
        getNotification();
        navigate(-1);
    };

    return (
        <Modal open={true} message={[]} messageType="error"
            className='!max-w-[525px] !pb-10'
            children={
                <>
                    <HeaderModal
                        Title={"Notifications"}
                        className="ps-6 pb-1"
                        onClick={() => handleClose()}
                    />
                    <IsLoading isLoading={isLoading} rows={10} input={
                        <div className="flex flex-col overflow-hidden ">

                            {/* Header */}
                            <div className=" flex shrink-0 items-center justify-between px-6 pb-3  border-b border-gray-200 ">
                                <div className="flex flex-row gap-2">
                                    <Button variant={activeTab === "all" ? "primary" : "noborder"} className="!px-3 !py-2" label="All" onClick={() => setActiveTab('all')} />
                                    <Button variant={activeTab === "unread" ? "primary" : "noborder"} className="!px-3 !py-2" label="Unread" onClick={() => setActiveTab('unread')} />
                                </div>
                            </div>

                            {/* Notifications onChange={(e) => updateField("role", e, setForm)} */}
                            <div className="min-h-0 flex-1 overflow-y-auto">
                                {
                                    displayedNotifications.length > 0 ?
                                        displayedNotifications.map((notification) => (
                                            <Card key={notification.id} notification={notification} userList={userList} />
                                        )) :
                                        <NoResults
                                            title={"No Notifications"}
                                            Icon={Bell}
                                            description={"We’ll keep you informed when there’s something new to share."} />
                                }                                                        
                            </div>
                        </div>
                    } />
                </>
            } />
    );
}