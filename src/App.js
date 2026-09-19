/* eslint-disable new-cap */
import './css/App.css';
import './css/styles.css';
import {
  Routes,
  Route,
  BrowserRouter
} from "react-router-dom";

import logo from './Images/logo.png';
import Login from './pages/Authentication/login.jsx';
import Logout from './pages/Authentication/login.jsx';
import ForgotPassword from './pages/Authentication/forgot_password.jsx';
import Signup from './pages/Authentication/sign_up.jsx';
import ErrorPage from './pages/Extra/error.js';
import Support from './pages/Extra/support.js'
import Privacy from './pages/Extra/privacy.js'
import TermsCondition from './pages/Extra/terms.js';


import { AuthProvider } from './auth/authContext.js';
import { AlertProvider} from './controls/AlertProvider.jsx'
import ProtectedRoute from './auth/protectedRoute.js';
import ProtectedLayout from './auth/protectedLayout.js';

import Appointment from './pages/Appointment/appointment.jsx';
import { Appointment_Create_Edit } from './pages/Appointment/create_edit.jsx';
import { Appointment_View } from './pages/Appointment/view.jsx';

import Attendance from './pages/Attendance/attendance.jsx';
import { Attendance_Create_Edit } from './pages/Attendance/create_edit.jsx';

import Calender_Main from './pages/Calender/calender.jsx'

import Customer from './pages/Customer/customer.jsx';
import { Customer_Create_Edit } from './pages/Customer/create_edit.jsx';

import Dashboard from './pages/Dashboard/dashboard.jsx'

import Discount from './pages/Discount/discount.jsx';
import { Discount_Create_Edit } from './pages/Discount/create_edit.jsx';
import { Discount_View } from './pages/Discount/view.jsx';

import Employee from './pages/Employee/employee.jsx';
import { Employee_Create_Edit } from './pages/Employee/create_edit.jsx';

import { Gmail_Tutorial } from './pages/Setting/Notification/gmail_tutorial.jsx';

import Inventory from './pages/Inventory/inventory.jsx';
import { Inventory_Create_Edit } from './pages/Inventory/create_edit.jsx';
import { Inventory_Detail_Create_Edit } from './pages/Inventory/InventoryDetail/create_edit.jsx';
import { Inventory_View } from  './pages/Inventory/view.jsx';

import Payment from './pages/Payments/payment.jsx';

import Services from './pages/Services/services.jsx';
import { Services_Create_Edit } from './pages/Services/create_edit.jsx';
import { GiftCard_Create_Edit } from './pages/GiftCard/create_edit.jsx';

import Reports from './pages/Reports/reports.jsx';

import { Setting } from './pages/Setting/setting.jsx';
import Notifications from './pages/Notification/notifications.jsx';
import { FirstTimeLogin } from './components/Getstarted/first_time_login.jsx';
import { CustomerImport } from './pages/Customer/import.jsx';
import { Checkout } from './components/Checkout/checkout.jsx';

function App() {
 const routes = [
    { path: "/Appointment", element: <Appointment />, permission: "Appointment.Open" },
    { path: "/Appointment/Create", element: <Appointment_Create_Edit />, permission: "Appointment.Create" },
    { path: "/Appointment/Edit/:Id", element: <Appointment_Create_Edit />, permission: "Appointment.Edit" },
    { path: "/Appointment/View/:Id", element: <Appointment_View />, permission: "Appointment.View" },
   

    { path: "/Attendance", element: <Attendance />, permission: "Attendance.Open" },
    { path: "/Attendance/Create", element: <Attendance_Create_Edit />, permission: "Attendance.Create" },
    { path: "/Attendance/Edit/:Id", element: <Attendance_Create_Edit />, permission: "Attendance.Edit" },
    //{ path: "/users/view/:id", element: <Employee />, permission: "users" },
   
    { path: "/Calender", element: <Calender_Main />, permission: "Calender.Open" },

    { path: "/Customers", element: <Customer />, permission: "Customers.Open" },
    { path: "/Customers/Create", element: <Customer_Create_Edit />, permission: "Customers.Create" },
    { path: "/Customers/Edit/:Id", element: <Customer_Create_Edit />, permission: "Customers.Edit" },
    { path: "/Customers/Import", element: <CustomerImport />, permission: "Customers.Create" },
    //{ path: "/users/view/:id", element: <Employee />, permission: "users" },

    { path: "/Dashboard", element: <Dashboard />, permission: "Dashboard.Open" },

    { path: "/Discount", element: <Discount />, permission: "Discount.Open" },
    { path: "/Discount/Create", element: <Discount_Create_Edit />, permission: "Discount.Create" },
    { path: "/Discount/Edit/:Id", element: <Discount_Create_Edit />, permission: "Discount.Edit" },
    { path: "/Discount/View/:Id", element: <Discount_View />, permission:"Discount.View"},

     { path: "/Employee", element: <Employee />, permission: "Employees.Open" },
    { path: "/Employee/Create", element: <Employee_Create_Edit />, permission: "Employees.Create" },
    { path: "/Employee/Edit/:Id", element: <Employee_Create_Edit />, permission: "Employees.Edit" },
    //{ path: "/users/view/:id", element: <Employee />, permission: "users" },

    { path: "/Getstarted", element: <FirstTimeLogin />, permission: "Getstarted.Open" },

    { path: "/Gift/Create/:Custid", element: <GiftCard_Create_Edit />, permission: "Customers.Create" },
    { path: "/Gift/Edit/:Custid/:Id", element: <GiftCard_Create_Edit />, permission: "Customers.Edit" },

     { path: "/Inventory", element: <Inventory />, permission: "Inventory.Open" },
    { path: "/Inventory/Create", element: <Inventory_Create_Edit />, permission: "Inventory.Create" },
    { path: "/Inventory/Edit/:Id", element: <Inventory_Create_Edit />, permission: "Inventory.Edit" },
    { path: "/Inventory/View/:Id", element: <Inventory_View />, permission:"Inventory.View"},
   
    { path: "/Item/Create/:Pid", element: <Inventory_Detail_Create_Edit />, permission: "Item.Create" },
    { path: "/Item/Edit/:Pid/:Id", element: <Inventory_Detail_Create_Edit />, permission: "Item.Edit" },

     { path: "/Payment/:Id", element: <Payment />, permission: "Payment.Open" },
    { path: "/Reports", element: <Reports />, permission: "Reports.Open" },

    { path: "/Setting", element: <Setting />, permission: "Setting.Open" },

    { path: "/Services", element: <Services />, permission: "Services.Open" },
    { path: "/Services/Create", element: <Services_Create_Edit />, permission: "Services.Create" },
    { path: "/Services/Edit/:Id", element: <Services_Create_Edit />, permission: "Services.Edit" },
    //{ path: "/users/view/:id", element: <Employee />, permission: "users" },
  ];

  return (
    <AuthProvider>
      <BrowserRouter>
        <AlertProvider>
          <Routes>
            <Route path="/" element={<Login logo={logo} />} />
            <Route path="login" element={<Login logo={logo} />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="signup" element={<Signup logo={logo} />} />
            <Route path="forgot-password" element={<ForgotPassword logo={logo} />} />
            <Route path="support" element={<Support />} />
            <Route path="privacy-policy" element={<Privacy />} />
            <Route path="terms-conditions" element={<TermsCondition />} />
            <Route path="*" element={<ErrorPage />} />
            <Route path="/404" element={<ErrorPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<ProtectedLayout />}>
                <Route path="/gmailtutorial" element={<Gmail_Tutorial />} />
                <Route path="/Notification" element={<Notifications />} />
                <Route path="/Checkout/:Id" element={<Checkout />} />    
              </Route>
            </Route>

            {routes.map((route) => (
              <Route key={route.path} element={<ProtectedRoute permission={route.permission} />} >
                <Route element={<ProtectedLayout />}>
                  <Route path={route.path} element={route.element} />
                </Route>
              </Route>
            ))}
            
          </Routes>
        </AlertProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
