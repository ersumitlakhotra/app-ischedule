import { notification, Modal } from 'antd';
import logo from '../Images/logo.png'
import { Tags } from './tags';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const useAlert = () => {
  const [api, contextHolder] = notification.useNotification();
  const [modal, contextHolderModal] = Modal.useModal();

  const info = (header, description) => {
    api.info({
      message: header,
      description: description,
      placement: 'bottomRight',
      showProgress: true,
      pauseOnHover: 'true',
    });
  };

  const success = (description) => {
    api.success({
      message: 'Success',
      description: description,
      placement: 'bottomRight',
      showProgress: true,
      pauseOnHover: 'true',
    });
  };

  const error = (description) => {
    api.error({
      message: 'Error',
      description: description,
      placement: 'bottomRight',
      showProgress: true,
      pauseOnHover: 'true',
    });
  };

  const warning = (description) => {
    api.warning({
      message: 'Warning',
      description: description,
      placement: 'bottomRight',
      showProgress: true,
      pauseOnHover: 'true',
    });
  };

  const notifications = ({ title, description, cancel = false }) => {
    api.info({
      icon: <img class="w-10 h-10 rounded-full bg-white " style={{ width: 24, height: 24 }} src={logo} alt="Rounded avatar" />,
      message: title,
      description: description,
      placement: "top",
      showProgress: true,
      pauseOnHover: 'true',
      duration: 12,
      style: { backgroundColor: cancel ? '#fecdd3' : '#fdba74' }
    });
  };

  const confirmEmail = (status, customerEmail) => {
    return new Promise((resolve) => {
      modal.confirm({
        title: "E-Mail Confirmation ?",
        icon: <ExclamationCircleOutlined />,
        content:
          <span>Would you like to send an {Tags(status)} e-mail to {customerEmail} ?</span>,
        okText: "Yes",
        cancelText: "No",
        onOk() {
          resolve(true);   // Yes clicked
        },
        onCancel() {
          resolve(false);  // No clicked
        },
      });
    });
  };

  
  const allowAdminOnly = () => {
    modal.warning({
      title: "Access Denied",
      icon: <ExclamationCircleOutlined />,
      content:
        <span>Only Admin is allow to access this option !</span>,
      maskClosable: true,
    });
  };
  return { contextHolder, contextHolderModal, info, success, error, warning, notifications, confirmEmail, allowAdminOnly }
};

export default useAlert;