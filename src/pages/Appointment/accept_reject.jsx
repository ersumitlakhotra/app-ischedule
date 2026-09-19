import { EMAIL_STATUS } from "../../common/enum";
import FetchData from "../../hook/fetchData";

export const accept_reject = async (id,accept,saveData) => {
     await saveData({
        label: "Appointment",
        endPoint: "appointment",
        id: id,
        body: JSON.stringify({
            id: id,
            cid: null,
            status: accept ? "Pending":"Rejected",
            createdat: null,
            modifiedat: null,
        })
    });

     await FetchData({
         method: "POST",
         endPoint: 'appointment-mail',
         id: null,
         body: JSON.stringify({
             id: id,
             status: accept ? EMAIL_STATUS.CONFIRMED : EMAIL_STATUS.REJECTED,
         })
    });
};