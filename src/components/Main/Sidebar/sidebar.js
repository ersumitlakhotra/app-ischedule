/* eslint-disable react-hooks/exhaustive-deps */
import {
  PieChartOutlined,
  CheckSquareOutlined,
  ProductOutlined,
  NotificationOutlined,
  UnorderedListOutlined,
  UserOutlined,
  SettingOutlined,
  CustomerServiceOutlined,
  FallOutlined,
  FundOutlined, DollarOutlined,
  SolutionOutlined,
  ContactsOutlined
} from '@ant-design/icons';
import { FaHandHoldingUsd } from "react-icons/fa";
import SideBarButton from '../sidebar_button';
import { useEffect, useRef, useState } from 'react';
import logo from '../../../Images/logo.png';


function getItem(label, key, icon, isVisible, badge, btn, children, dropdown) {
  return {
    key,
    icon,
    children,
    label,
    dropdown,
    badge,
    btn,
    isVisible
  };
}

const Sidebar = ({ onSelected, content, open, uid, getData, setContent }) => {

  const [permissionList, setPermissionList] = useState([]);
  const [dashboard, setDashboard] = useState(false);
  const [tasks, setTasks] = useState(false);
  const [order, setOrder] = useState(false);
  const [event, setEvent] = useState(false);
  const [payment, setPayment] = useState(false);
  const [customer, setCustomer] = useState(false);
  const [services, setServices] = useState(false);
  const [users, setUsers] = useState(false);
  const [schedule, setSchedule] = useState(false);
  const [sales, setSales] = useState(false);
  const [collection, setCollection] = useState(false);
  const [setting, setSetting] = useState(false);

  const hasSet = useRef(false);
  useEffect(() => {
    if (uid > 0)
      getData(setPermissionList, "userpermission")
  }, [uid]);

  useEffect(() => {
    let hasSet = false;
    if (permissionList.length > 0) {
      permissionList.filter(a => a.uid === uid).map(b => {
        Init("Dashboard", setDashboard, b.dashboard);
        Init("Calender", setTasks, b.tasks);
        Init("Appointment", setOrder, b.order);
        Init("Event", setEvent, b.event);
        Init("Payment", setPayment, b.payment);

        Init("Customers", setCustomer, b.customer);
        Init("Services", setServices, b.services);
        Init("Users", setUsers, b.users);
        Init("TimeSheet", setSchedule, b.schedule);

        Init("Sales", setSales, b.sales);
        Init("Collection", setCollection, b.collection);
        Init("Setting", setSetting, b.setting);



       // setDashboard(b.dashboard);
       // setTasks(b.tasks);
       // setOrder(b.order);
        //setEvent(b.event);
        //setPayment(b.payment);

       // setCustomer(b.customer);
       // setServices(b.services);
       // setUsers(b.users);
       // setSchedule(b.schedule);

       // setSales(b.sales);
        //setCollection(b.collection);
       // setSetting(b.setting);
      })
    }
  }, [permissionList]);

  const Init = (name, setItem, value) => {
    setItem(value)
    if (Boolean(value) === true && content === 'Default' && !hasSet.current)
    {
      onSelected(name)
      hasSet.current = true;
    }
  }


  const overview = ([
    getItem('Dashboard', 11, <PieChartOutlined />, dashboard),
    getItem('Calender', 12, <CheckSquareOutlined />, tasks),
    getItem('Appointment', 13, <ProductOutlined />, order),
    getItem('Event', 14, <NotificationOutlined />, event),
    getItem('Payment', 15, <DollarOutlined />, payment),
  ]);


  const management = ([
    //getItem ('Inbox', 5, <MailFilled />,5),
    //  getItem ('Report', 6, <FileTextFilled />,null,<DownOutlined/>,[
    // getItem('Sales',61),
    // getItem('Purchase',62),
    // getItem('Accounting',63),
    //], false),
    getItem('Customers', 21, <ContactsOutlined />, customer),
    getItem('Services', 22, <UnorderedListOutlined />, services),
    getItem('Users', 23, <UserOutlined />, users),
    getItem('TimeSheet', 24, <SolutionOutlined />, schedule),
  ]);

  const report = ([
    getItem('Sales', 31, <FundOutlined />, sales),
    getItem('Collection', 32, <FaHandHoldingUsd />, collection),
    getItem('Expenses', 33, <FallOutlined />),
  ]);

  const misc = ([
    getItem('Help', 41, <CustomerServiceOutlined />),
    getItem('Setting', 42, <SettingOutlined />, setting),
  ]);

  return (
    <div class={` h-screen duration-300 ${open ? 'w-72' : 'w-20'}`}>
      <div class='w-full h-full flex flex-col mb-4'>

        <div class={`h-16 px-3 flex items-center  cursor-pointer`} onClick={() => window.location.reload()} >
          <img class="w-10 h-10 rounded-full bg-white" src={logo} alt="Rounded avatar" />
          <span class={`font-medium font-sans text-primary-500  whitespace-nowrap duration-150 ${!open && ' scale-0'}`}>{process.env.REACT_APP_PROJECT_NAME}</span>
        </div>

        <div class='w-full h-full overflow-auto flex flex-col '>
          <span class={` text-sm px-5 mt-6 duration-150 font-medium  ${!open && 'scale-0'}  ${overview.filter(item => item.isVisible === true).length === 0 && 'hidden'} whitespace-nowrap`}>Overview</span>
          {overview.map(item => item.isVisible && <SideBarButton key={item.key} index={item.key} isOpen={open} icon={item.icon} label={item.label} badge={item.badge} content={content} onSelected={(e) => onSelected(e)} />)}

          <span class={` text-sm  px-5 mt-6 duration-150 font-medium  ${!open && 'scale-0'} ${management.filter(item => item.isVisible === true).length === 0 && 'hidden'} whitespace-nowrap`}>Management</span>
          {management.map(item => item.isVisible && <SideBarButton key={item.key} index={item.key} isOpen={open} icon={item.icon} label={item.label} badge={item.badge} content={content} onSelected={(e) => onSelected(e)} />)}

          <span class={` text-sm  px-5 mt-6 duration-150 font-medium  ${!open && 'scale-0'} ${report.filter(item => item.isVisible === true).length === 0 && 'hidden'} whitespace-nowrap`}>Report</span>
          {report.map(item => item.isVisible && <SideBarButton key={item.key} index={item.key} isOpen={open} icon={item.icon} label={item.label} badge={item.badge} content={content} onSelected={(e) => onSelected(e)} />)}

          <span class={` text-sm  px-5 mt-6 duration-150 font-medium  ${!open && 'scale-0'} ${misc.filter(item => item.isVisible === true).length === 0 && 'hidden'} whitespace-nowrap`}>Misc</span>
          {misc.map(item => item.isVisible && <SideBarButton key={item.key} index={item.key} isOpen={open} icon={item.icon} label={item.label} badge={item.badge} content={content} onSelected={(e) => onSelected(e)} />)}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;