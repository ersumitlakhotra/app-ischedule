import axios from 'axios';
import { LocalDate } from '../common/localDate';
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";
import { HttpRequest } from "@aws-sdk/protocol-http";

//const PRODUCTION =true 
const API_ENDPOINT = true ? process.env.REACT_APP_ENDPOINT : process.env.REACT_APP_ENDPOINT_LOCAL;
//const AWS_ACCESS_KEY= process.env.REACT_APP_AWS_ACCESS_KEY
//const AWS_SECRET_KEY= process.env.REACT_APP_AWS_SECRET_KEY
//const AWS_REGION=process.env.REACT_APP_AWS_REGION
//const AWS_SERVICE=process.env.REACT_APP_AWS_SERVICE
{/*
const signer = new SignatureV4({
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey:AWS_SECRET_KEY,
    },
    region:AWS_REGION, // change if needed
    service: AWS_SERVICE, 
    sha256: Sha256,
});

const aws_auth_headers = async (url, method, body) => {
    const endpoint = new URL(url);

    const request = new HttpRequest({
        method: method,
        protocol: endpoint.protocol,
        hostname: endpoint.hostname,
        path: endpoint.pathname + endpoint.search,
        headers: {
            "Content-Type": "application/json",
            host: endpoint.hostname,
        },
        body: body || undefined ,
    });
    const signedRequest = await signer.sign(request);
    delete signedRequest.headers.host;

    return signedRequest.headers;
}

*/}
export const apiCalls = async (method, endPoint,id = null, body = null,query='') => {
    const url = API_ENDPOINT + `${endPoint}`  + (id != null ? `/${id}` : '');
    const token = localStorage.getItem("token");
    const options = {
        method: method,
        url: url,
        headers: //PRODUCTION ? await aws_auth_headers(url, method, body) : 
        {
            "Content-Type": "application/json",
            ...(token && {
                Authorization: `Bearer ${token}`
            })
        },
        data: body,
        params: query,
    };
    try {  
        return await axios.request(options);
    } catch (error) {
        if (error.response?.status === 401) {
           

            // Tell AuthProvider to logout
            window.dispatchEvent(
                new Event("unauthorized")
            );
            return error.response;
        }

        return error;
    }
};

export const loginAuth = async (username,password) => {
    const url = API_ENDPOINT + 'auth'  ;
    const options = {
        method: "POST",
        url: url,
        data: { username: username, password: password }
    };
    try {
        return await axios.request(options);
    } catch (error) {
        return error;
    }
    // api calls
};

{/*
export const connectToGoogle = async () => {
    const url = API_ENDPOINT + `google/auth`;
    const options = {
        method: "GET",
        url: url,
        headers: PRODUCTION ? await aws_auth_headers(url, "GET", '') : {},
        //{ 'content-Type': 'application/json' },
        data: null

    };
    try {
        return await axios.request(options);
    } catch (error) {
        return error;
    }
    // api calls
};


     const refreshToken = localStorage.getItem("refreshToken");

            if (!refreshToken) {
                window.dispatchEvent(new Event("unauthorized"));
                return error.response;
            }

            try {

                const refreshResponse = await axios.post(
                    `${API_ENDPOINT}/auth/refresh`,
                    {
                        refreshToken
                    }
                );

                const newToken = refreshResponse.data.token;

                localStorage.setItem("token", newToken);

                // Update original request
                options.headers.Authorization = `Bearer ${newToken}`;

                // Retry original request
                return await axios.request(options);

            } catch (refreshError) {

                // Refresh token is also invalid/expired
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");

                window.dispatchEvent(
                    new Event("unauthorized")
                );

                return refreshError;
            }
    */}




