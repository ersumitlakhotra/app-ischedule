/* eslint-disable react-hooks/exhaustive-deps */

import logo from '../../Images/logo.png'
import { SlEarphonesAlt } from "react-icons/sl";
import { Avatar, Badge, Button, Drawer, Dropdown, Space, Tooltip } from 'antd';
import { BellFilled, LogoutOutlined, DownOutlined, UserOutlined, BellOutlined, EditOutlined, EyeOutlined, PlusCircleFilled, PlusSquareFilled, ProductOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import AssignedTo from '../../common/assigned_to';
import NotificationDetail from '../../components/Main/Notification/notification_detail';
import { getStorage } from '../../common/localStorage';
import { useAuth } from '../../auth/authContext';
import { IsLoading, PageHeader } from "../../common/index.jsx";
import { get_Date, LocalDate, UTC_LocalDateTime, firstDateOfMonth,lastDateOfMonth } from '../../common/localDate';
import { Sort } from '../../common/sort';
import { Tags } from '../../common/tags';
import dayjs from 'dayjs';
import { BsPlusCircleFill } from "react-icons/bs";

function getItem(key, label, icon, extra, disabled, danger) {
    return {
        key,
        label,
        icon,
        extra,
        disabled,
        danger,
    };
}
const Header = ({ saveData, refresh, setRefresh, editOrder, viewOrder, getOrder,editEvent, editCustomer,editService, editUser,editSchedule, uid, orderList, notificationList, getNotification, getUserListWithAdmin, servicesList, 
    isDisabled
}) => {
    const navigate = useNavigate();
    const ranOnce = useRef(false);
    const { logout } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [userList, setUserList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [notificationFilteredList, setNotificationFilteredList] = useState([]);
    const [unread, setUnread] = useState(0)
    const [openNotification, setOpenNotification] = useState(false);
    const [tabActiveKey, setTabActiveKey] = useState(1)
    const [reload, setReload] = useState(0);
    const apps =[]
    const addItemsPermission = ["Appointment","Event","Customers","Services","Users","Schedule"]


    useEffect(() => {
        if (ranOnce.current) return;
        ranOnce.current = true;
        Init();
    }, [])

    useEffect(() => {
        refreshNotification();
    }, [refresh])

    const Init = async () => {
        const localStorage = await getStorage();
        const userListWithAdminResponse = await getUserListWithAdmin();
        setUserList(userListWithAdminResponse)
        const userFind = userListWithAdminResponse.find(item => item.id === localStorage.uid);
        setFullname(userFind.fullname)
        setUsername(userFind.username)
    }

    const refreshNotification = async () => {
        setIsLoading(true);
        const response = await getOrder();
        const responseNotification=await getNotification();
        oncurrentOptionChange(responseNotification);
        await onSearch(response);
        setIsLoading(false);
    }

    const handleMenuClick = e => {
        switch (e.key) {
            case '1':
            case '2': // Account
                {
                    editUser(uid, true)
                    break;
                }
            case '3': // Notifications
                {
                    setTabActiveKey('1');
                    setReload(reload + 1);
                    setOpenNotification(true);
                    break;
                }
            case '4': // Help
                {
                    navigate('/help');
                    break;
                }
            case '9': // Sign Out
                {
                    logout();
                    break;
                }
            default: { break; }
        }
    };

    const menuProps = {
        items: [
            getItem('1',
                <div class='flex flex-row gap-2 p-2 bg-blue-50 border rounded-lg overflow-auto'>
                    <AssignedTo userId={uid} userList={userList} imageWidth={34} imageHeight={34} AvatarSize={34} allowText={false} preview={false} />
                    <div class='flex flex-col text-xs px-3 text-blue-800 font-medium'>
                        <p>{fullname} </p>
                        <p>{username} </p>
                    </div>
                </div>, null, null, true),
            { type: 'divider', },
            getItem('2', 'Account', <UserOutlined />, '⌘A'),
            getItem('3', 'Notifications', <BellOutlined />,'',isDisabled),
            getItem('4', 'Help Center', <SlEarphonesAlt />),
            { type: 'divider', },
            getItem('9', 'Sign Out', <LogoutOutlined />, null, null, true),
        ],
        onClick: handleMenuClick
    };

    
    const handleAddClick = e => {
        switch (e.key) {
            case '2':{editOrder(0);break;}
            case '4':{editEvent(0);break;}
            case '5':{editCustomer(0);break;}
            case '6':{editService(0);break;}
            case '7':{editUser(0);break;}
            case '8':{editSchedule(0,LocalDate());break;}
            default: { break; }
        }
    };
    const addProps = {
        items: 
            apps.filter(app =>
                addItemsPermission.some(icon => app.label === icon && app.isVisible)).map(res =>
                    getItem(res.key, res.label, null, '⌘'+res.label.charAt(0)), { type: 'divider', }
                )
        ,
        onClick: handleAddClick
    };
    const [currentOption, setCurrentOption] = useState('Last 7 Days');
    const itemsNotification = [
        { key: 'Today', label: 'Today' },
        { key: 'Last 7 Days', label: 'Last 7 Days' },
        { key: 'This Month', label: 'This Month' },
        // { key: 'This Year', label: 'This Year' },
    ];

    const onItemChanged = e => { setCurrentOption(e.key); oncurrentOptionChange(notificationList) };
    const menuPropsNotification = { items: itemsNotification, onClick: onItemChanged };

    useEffect(() => {
        const handler = setTimeout(async () => {
            setIsLoading(true)
            await onSearch(orderList);
            setIsLoading(false)
        }, 500); // 500ms after user stops typing

        // Cleanup if user types again before timeout
        return () => {
            clearTimeout(handler);
        };
    }, [search]);

    const onSearch = async (list) => {
        const query = (search || "").toLowerCase();
        if (search !== '') {
            const res = await orderSearch(query, list);
            setFilteredList(res)
        }
        else
            setFilteredList([])
    }

    const orderSearch = async (query, list) => {
        let searchedList = await list.filter(item =>
            (item.name || "").toLowerCase().includes(query) ||
            (item.order_no || "").toString().includes(query) ||
            (item.cell || "").toString().replace(/-/g, "").includes(query)
        );
        return Sort("trndate", "desc", searchedList.slice(0, 10))
    }

    const oncurrentOptionChange=(list) => {

        let frmMonth = dayjs(firstDateOfMonth(new Date())).format("YYYY-MM-DD");
        let toMonth = dayjs(lastDateOfMonth(new Date())).format("YYYY-MM-DD");
        let year = new Date().getFullYear();
        let jan = new Date(year, 0, 1);
        let dec = new Date(year, 11, 31);

        const notification =
            (currentOption === 'Today' ? list.filter(a => LocalDate() === UTC_LocalDateTime(a.createdat, 'YYYY-MM-DD')) :
                currentOption === 'Last 7 Days' ? list.filter(a => UTC_LocalDateTime(a.createdat, 'YYYY-MM-DD') >= UTC_LocalDateTime(dayjs().subtract(7, 'day'), 'YYYY-MM-DD') && UTC_LocalDateTime(a.createdat, 'YYYY-MM-DD') <= LocalDate()) :
                    currentOption === 'This Month' ? list.filter(a => UTC_LocalDateTime(a.createdat, 'YYYY-MM-DD') >= frmMonth && UTC_LocalDateTime(a.createdat, 'YYYY-MM-DD') <= toMonth) :
                        list.filter(a => list.filter(a => UTC_LocalDateTime(a.createdat, 'YYYY-MM-DD') >= jan && UTC_LocalDateTime(a.createdat, 'YYYY-MM-DD') <= dec)))
setNotificationFilteredList(notification);
        setUnread(notification.filter(a => a.read === '0').length)
    }
    
    return (
        <header class="p-2 bg-blue-500 border-b shadow-sm flex flex-row gap-2 sticky  z-[100] top-0">

            {/* logo */}
            <div class={`w-1/12 md:w-3/12  flex items-center gap-2  cursor-pointer`} onClick={() => navigate("/home")} >
                <img class="w-10 h-10 rounded-full bg-white" src={logo} alt="Rounded avatar" />
                <span class={`font-medium font-sans text-white text-lg whitespace-nowrap duration-150 scale-0 md:scale-100`}>{process.env.REACT_APP_PROJECT_NAME}</span>
            </div>

            {/* Search */}
            <div class='w-8/12 md:w-6/12 flex flex-row items-center relative'>
              
                <div class={`w-full min-h-[350px] max-h-[350px] overflow-y-scroll border border-gray-400 z-50 bg-white rounded-lg shadow absolute top-10 ${search === '' && 'hidden'} `}>
                    <IsLoading isLoading={isLoading} rows={8} input=
                        {
                            filteredList.length === 0 ? <p class='text-left p-4 text-sm font-medium text-gray-400'> No match found </p> :
                                filteredList.map(item => (
                                    <div key={item.id} class={`w-full flex flex-row p-2 gap-2 border-b-2 cursor-pointer hover:bg-gray-100  hover:shadow `} onClick={() => viewOrder(item.id)}>
                                        <Avatar style={{ backgroundColor: '#60a5fa' }} size="large">
                                            {"Appointment".charAt(0)}
                                        </Avatar>
                                        <div class='flex flex-col gap-1 md:gap-0 w-11/12 '>
                                            <p class='text-xs text-gray-600 flex flex-col md:flex-row md:items-center gap-1'>
                                                <span class='text-blue-500  hover:underline cursor-pointer'>{item.order_no} {Tags(item.status)}</span>
                                                <span> {item.name} ( {item.cell} )</span>
                                            </p>
                                            <div class='flex flex-row text-xs text-gray-500 items-center justify-between'>
                                                <span> {`${get_Date(item.trndate, "dddd MMM, DD YYYY")} [${item.slot}] `}</span>
                                                {item.status !== 'Awaiting' ?
                                                    <div class='flex flex-row gap-2 items-center '>
                                                        <Tooltip placement="top" title={'Edit'} >
                                                            <Button type="link" icon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); editOrder(item.id); }} />
                                                        </Tooltip>
                                                        <Tooltip placement="top" title={'View'} >
                                                            <Button type="link" icon={<EyeOutlined />} onClick={(e) => { e.stopPropagation(); viewOrder(item.id) }} />
                                                        </Tooltip>
                                                    </div>
                                                    :
                                                    <div class='flex flex-row gap-2 items-center '>
                                                       
                                                    </div>
                                                }
                                            </div>
                                        </div>

                                    </div>
                                ))
                        }
                    />
                </div>
            </div>

            {/* notification and profile */}
            <div class='w-3/12 pr-4 flex flex-row gap-3 md:gap-4 justify-end items-center '>
                <Dropdown menu={addProps} disabled={isDisabled} trigger={['click']} overlayStyle={{ gap: 4, color: 'white', cursor: 'pointer' }}>
                    <Space style={{ cursor: 'pointer' }}>
                        <PlusCircleFilled style={{ fontSize: '30px', color: 'white', cursor: 'pointer' }} />
                    </Space>
                </Dropdown>

                <Badge count={unread} >
                    <BellFilled style={{ fontSize: '23px', color: 'white', cursor: 'pointer'}} onClick={() => { setOpenNotification( isDisabled ? false: true); setTabActiveKey('1'); }} />
                </Badge>

                <Dropdown menu={menuProps} trigger={['click']} overlayStyle={{ gap: 4, color: 'white', cursor: 'pointer' }}>
                    <Space style={{ cursor: 'pointer' }}>
                        <AssignedTo userId={uid} userList={userList} imageWidth={28} imageHeight={28} AvatarSize={24} allowText={false} preview={false} stopPropagation={false} />
                    </Space>
                </Dropdown>


            </div>

            <Drawer title={"Notification"} placement='right' width={500} open={openNotification} onClose={() => { setOpenNotification(false); setRefresh(refresh + 1) }}
                extra={<Dropdown menu={menuPropsNotification}>
                    <Button>
                        <Space>
                            {currentOption}
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>}>

                <NotificationDetail refresh={refresh} notification={notificationFilteredList} tabActiveKey={tabActiveKey} setTabActiveKey={setTabActiveKey} userList={userList} servicesList={servicesList} saveData={saveData} viewOrder={viewOrder} />
            </Drawer>

        </header>
    )
}

export default Header

// npx update-browserslist-db@latest