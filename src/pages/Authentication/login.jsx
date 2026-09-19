/* eslint-disable jsx-a11y/anchor-is-valid */
import {  useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/authContext.js";
import { Textbox,Button } from "../../controls/index.jsx";
import { useAlert } from "../../controls/AlertProvider.jsx";
import { Eye,EyeClosed, LoaderCircle,  LogIn, UserIcon } from "lucide-react";

export const Login = ({ logo }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const { showAlert } = useAlert();
  const { login , permissions, isAuthenticated } = useAuth();

  const getFirstAllowedRoute = () => {
    const openPermission = permissions.find(
        permission => permission.endsWith(".Open")
    );

    return openPermission
        ? `/${openPermission.replace(".Open", "")}`
        : "/404";
};

  useEffect(() => {
    if (isAuthenticated)
      navigate(getFirstAllowedRoute()); // ✅ SAFE

  }, [isAuthenticated]);

  const onSubmit = async () => {
    setLoading(true);
    const res = await login(username, password);
    if (res.status)
      navigate(getFirstAllowedRoute());
    else
      showAlert({
        type: "error",
        message: res.message,
        duration: 5000,
      });

    setLoading(false);
  }


  return (
    <div class="bg-gray-50 h-screen py-4">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <img class="w-20 h-20 mb-2" src={logo} alt="logo" />
        <div class="w-full bg-white  rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>

            <Textbox required label="Admin Email or Phone" icon={UserIcon} placeholder="Enter admin email or 10-digit phone number" value={username} setValue={(e) => setUsername(e)} />
            <Textbox type={visible ? "text" : "password"} icon={visible ? Eye : EyeClosed} iconClick={(e) => setVisible(!visible)} label="Password" placeholder="******" value={password} setValue={(e) => setPassword(e)} />

            <div class="flex items-center justify-end">
              <a href="/forgot-password" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
            </div>
            <Button variant="primary" className="w-full" icon={LogIn} label="Sign In" onClick={() => onSubmit()} />
            <div>
             
              <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet? <a href="/signup" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
              </p>
             
            </div>
          </div>
        </div>
      </div>
      {loading && (
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
            <LoaderCircle className="h-12 w-12 animate-spin " />
        </div>
      )}
    </div>
  );
};


export default Login;