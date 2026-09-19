/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Space, Dropdown, Drawer,  Badge, Button } from 'antd';
import { MenuUnfoldOutlined, LogoutOutlined, BellFilled, DownOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import AssignedTo from '../../../common/assigned_to.js';
import NotificationDetail from '../Notification/notification_detail.js';
import { SlEarphonesAlt } from "react-icons/sl";

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
const Header = ({ onSignout, open, setOpen, getData, saveData, refresh, uid }) => {
  const [userList, setUserList] = useState([]);
  const [notificationList, setNotificationList] = useState([]);
 
  //const [fullname, setFullname] = useState('');
  //const [profilepic, setProfile] = useState(null);
  const [openNotification, setOpenNotification] = useState(false);
  const [unread, setUnread] = useState([]);
  const [unreadUpdate, setUnreadUpdate] = useState(false);
  const [tabActiveKey, setTabActiveKey] = useState("1");


  const [items, setItems] = useState([]);

  useEffect(() => {
    getData(setUserList, "users");
    getData(setNotificationList, "notification");

    const intervalId = setInterval(() => {
      getData(setNotificationList, "notification",false,false);
    }, 120000); // 120000 milliseconds = 2 minutes
    return () => clearInterval(intervalId);

  }, []);

  useEffect(() => {
    const unread = notificationList.filter(a => a.read === '1');
    setUnread(unread.length > 0 ? unread : [])
  }, [notificationList]);

  const openExtendedLink = (address) => {
    // window.open(address);
    window.open(address, '_blank', 'noopener noreferrer');
  };

  useEffect(() => {
    if (userList.length > 0) {
      userList.filter(a => a.id === uid).map(b => {
       // setFullname(b.fullname);
        //setProfile(b.profilepic);
        setItems([
          getItem('1',
            <div class='flex flex-row gap-4'>
              <AssignedTo userId={uid} userList={userList} imageWidth={40} imageHeight={40} AvatarSize={40} allowText={false} preview={false} />
              <div class='flex flex-col'>
                <p>{b.fullname} </p>
                <p>{b.cell} </p>
              </div>
            </div>, null, null, true),
          { type: 'divider', },
          getItem('2', 'Help Center', <SlEarphonesAlt />),
          { type: 'divider', },
          getItem('9', 'Sign Out', <LogoutOutlined />, null, null, true),
        ])
        {/*
        setItems([
          getItem('1', b.fullname, null, null, true),
          { type: 'divider', },
          getItem('2', 'Account', <UserOutlined />),
          getItem('3', 'Settings', <SettingOutlined />, '⌘S'),
          getItem('4', 'Privacy', <LockOutlined />, '⌘P'),
          getItem('5', 'Notifications', <BellOutlined />),
          { type: 'divider', },
          getItem('6', 'Help Guide', <BookOutlined />),
          getItem('7', 'Help Center', <QuestionCircleOutlined />),
          { type: 'divider', },
          getItem('8', 'Limited Access', <ClockCircleOutlined />),
          { type: 'divider', },
          getItem('9', 'Sign Out', <LogoutOutlined />, null, null, true),
        ])*/}
      })
    }
  }, [userList]);

  const handleMenuClick = e => {
    switch (e.key) {
      case '2': // Sign Out
        {
          openExtendedLink('https://appointstack.com/support')
          break;
        }
      case '9': // Sign Out
        {
          onSignout();
          break;
        }
      default: { break; }
    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick
  };

  const updateOnClose = () => {
    unreadUpdate && save();
    setOpenNotification(false);
  }

  const save = async () => {
    unread.map(item => {
      const Body = JSON.stringify({
        message: item.message,
        read: 0,
      });
      saveData("Notification", 'PUT', "notification", item.id, Body, false,false);
    })
    getData(setNotificationList, "notification", false, false);
  }
 

  const [currentOption, setCurrentOption] = useState('Today');
  const itemsNotification = [
    { key: 'Today', label: 'Today' },
    { key: 'Last 7 Days', label: 'Last 7 Days' },
    { key: 'This Month', label: 'This Month' },
    { key: 'This Year', label: 'This Year' },
  ];
  const onItemChanged = e => { setCurrentOption(e.key) };
  const menuPropsNotification = { items:itemsNotification, onClick: onItemChanged };

  return (
    <div class='flex items-center justify-between p-3 pe-8 overflow-x-hidden '>
      <MenuUnfoldOutlined className='cursor-pointer' onClick={() => setOpen(!open)} />
      <div class='flex flex-row gap-6 mt-1 cursor-pointer'>
        <Badge count={unread.length}>
          <BellFilled style={{ fontSize: '22px', marginTop: 6, color: 'gray' }} onClick={() => { setOpenNotification(true); setUnreadUpdate(false); setTabActiveKey('1'); }} />
        </Badge>
        <Dropdown menu={menuProps} overlayStyle={{ width: '250px', gap: 5 }}>
          <Space>
            <AssignedTo userId={90} userList={userList} imageWidth={30} imageHeight={30} AvatarSize={30} allowText={false} preview={false} />
          </Space>
        </Dropdown>

      </div>

      <Drawer title={"Notification"} placement='right' width={500} onClose={() => updateOnClose()} open={openNotification}
        extra={<Dropdown menu={menuPropsNotification}>
          <Button>
            <Space>
              {currentOption}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>}>

        <NotificationDetail refresh={refresh} currentOption={currentOption} notificationList={notificationList} setUnreadUpdate={setUnreadUpdate} tabActiveKey={tabActiveKey} setTabActiveKey={setTabActiveKey} />
      </Drawer>

      
    </div>
  )
}
export default Header;