

import { getMonthName } from "../../common/localDate";

export const checkPlanStatus = (planType, createdAt) => {
    if (planType !== "FREE TRIAL") return { status: false, expired:false, message: "" };

    const created = new Date(createdAt);

    // add 30 days
    const expiry = new Date(created);
    expiry.setDate(expiry.getDate() + 30);

    const now = new Date();

    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffTime <= 0) {
        return {
            status: true,
            expired:true, 
            message: "Your free plan has expired."
        };
    }

    if (diffDays <= 5) {
        return {
            status: true,
            expired:false, 
            message: `Your free plan will expire in ${diffDays} day(s).`
        };
    }

    return {
        status: false,
        expired:false, 
        message: ""
    };
};


export const handleCardExpired = (month, year) => {
    if (!month || !year) {
        return { status: false, message: "Expiry date missing" };
    }

    const now = new Date();

    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear() % 100;

    const expMonth = parseInt(month);
    const expYear = parseInt(year);

    // expired
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        return {
            status: true,
            message: "Please add a new payment card number as your current one has expired."
        };
    }

    // warning before 1 month
    if (
        expYear === currentYear &&
        (expMonth === currentMonth + 1 || expMonth === currentMonth)
    ) {
        return {
            status: true,
            message: `Please update your payment card information as your current one is about to expire on ${getMonthName(expMonth)} 20${expYear}.`
        };
    }

    return {
        status: false,
        message: "Card is valid"
    };
};

export const checkGmail = (value) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(value);
};

export const checkEmailStatus = (companyList) => {
    if (companyList.emailuser === null || companyList.emailpass === null || companyList.emailpass.length !== 16 || !checkGmail(companyList.emailuser)) {
        return {
            status: true,
            message: "Your Gmail account is not configured yet ! Please go to <b>Setting -> Gmail Notification Setup</b> -> set your <b>E-Mail</b> and <b>App Password</b>."
          
        };
    }

    return {
        status: false,
        message: ""
    };
}

export const checkBillingDetails = (companyList) => {
    let text="Please provide fresh card information as the payment card details are missing.";
    if (companyList.billinginfo === null ) {
        return {
            status: true,
            message:text
        };
    }

        const billing = companyList.billinginfo[0];
        if (!billing.name || !billing.number || !billing.month || !billing.year || !billing.cvv)
            return {
                status: true,
                message: text
            };
        else {
            const result = handleCardExpired(billing.month, billing.year);
            if (result.status) {
                return {
                    status: true,
                    message: result.message
                };
            }
            else
                return {
                    status: false,
                    message: ''
                };
        }  
        
}
