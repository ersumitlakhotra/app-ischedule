import { useEffect, useImperativeHandle } from "react";
import { useState } from "react";
import { getTax } from "../../common/taxes";
import FetchData from "../../hook/fetchData";
import useAlert from "../../common/alert";

const Checkout = ({ref, amount,discount, title, urls,companyList , id}) => {
    const [province, setProvince] = useState('');
    const [country, setCountry] = useState('');
    const{ contextHolder, warning} = useAlert()

    const processingFee = ((amount-discount) * 0.03) + (amount > 0 && 0.30);
    const subtotal = (Number(amount || 0) - Number(discount || 0) + Number(processingFee || 0)).toFixed(2);
    const tax= country === 'Canada' ? getTax(province) : 0;
    const taxamount= country === 'Canada' ?  subtotal * (tax/100) : 0;
    const totalAmount = (Number(subtotal || 0) + Number(taxamount || 0)).toFixed(2);
    const currency= country === 'Canada' ?  "cad" : "usd";

    useEffect(() => {
        if (companyList.length !== 0) {
            if (companyList.addressinfo !== null) {
                setProvince(companyList.addressinfo[0].province);
                setCountry(companyList.addressinfo[0].country);
            }
        }
    }, [companyList])

    const checkoutHandle = async () => {
        if(amount >=1 && amount <=2000)
        {
        const Body = JSON.stringify({
            title: title,
            urls: `${process.env.REACT_APP_DOMAIN}${urls}`,
            sub_total:Number(subtotal).toFixed(2),
            processing_fee:Number(processingFee).toFixed(2),
            tax:tax,
            tax_amount:Number(taxamount).toFixed(2),
            amount: Number(amount).toFixed(2),
            total_amount: Number(totalAmount).toFixed(2),
            currency:currency,
            invoiceid:id

        });
        const response = await FetchData({
            method: 'POST',
            endPoint: 'checkout',
            body: Body
        })
        window.location.href = response.data.url;
    }
    else
        warning('The amount must be in the range of $1 to $2000.')
    };

    useImperativeHandle(ref, () => {
        return {
            checkoutHandle,
        };
    })
    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Overview</h3>

            <div className="flex justify-between mb-2">
                <span className="text-gray-600">Payment amount:</span>
                <span className="font-medium">
                    ${Number(amount || 0).toFixed(2)}
                </span>
            </div>
            {discount > 0 && <div className="flex justify-between mb-2">
                <span className="text-gray-600">Discount:</span>
                <span className="font-medium text-red-400">
                    -${Number(discount || 0).toFixed(2)}
                </span>
            </div>}
            <div className="flex justify-between mb-2">
                <span className="text-gray-600">Processing Fee:</span>
                <span className="font-medium">
                    ${Number(processingFee || 0).toFixed(2)}
                </span>
            </div>
            <div className="flex justify-between mb-2">
                <span className="text-gray-600">{`Tax (${tax}%):`}</span>
                <span className="font-medium">
                    ${Number(taxamount || 0).toFixed(2)}
                </span>
            </div>

            <hr className="my-3" />

            <div className="flex justify-between">
                <span className="text-gray-700 font-medium">Total Amount:</span>
                <span className="font-semibold">${totalAmount}</span>
            </div>
            {contextHolder}
        </div>
    )
}

export default Checkout