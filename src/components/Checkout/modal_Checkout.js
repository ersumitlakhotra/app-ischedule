import { Modal } from "antd";
import { useRef, useState } from "react";
import dayjs from 'dayjs';
import Checkout from "./checkout";

const ModalCheckout = ({LeftSection,from, amount, setAmount, discount, isOpen, setIsOpen, title, urls, companyList , id=0}) => {
    const ref = useRef();
    const handleCancel = () => {
        setIsOpen(false);
    };

    const handleOk = async () => {
        await ref.current?.checkoutHandle();
    }
    
    return (
        <Modal
            open={isOpen}
            title=" "
            onOk={handleOk}
            onCancel={handleCancel}
            okText={`Confirm Payment`}
            cancelText="Cancel"
            maskClosable={false}
            keyboard={false}
            width={'50%'}
        >
            <div className="mt-8 flex flex-col md:flex-row  justify-between">

                {/* LEFT SECTION */}
                {from === 'twillio' ?
                    <div className="w-full ">
                        <h2 className="text-lg font-semibold mb-4">
                            How much would you like to add to your account balance today?
                        </h2>

                        <label className="block text-sm font-medium mb-2">Amount</label>
                        <div className="relative w-40 mb-2">
                            <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className={`w-full pl-7 pr-3 py-2 border rounded-md ${(amount < 1 || amount > 2000) && 'border-red-400'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                        </div>

                        <p className="text-sm text-gray-500 mb-6">
                            Enter an amount between $1 and $2000
                        </p>

                    </div>
                    : <LeftSection />
                    }

                {/* RIGHT SECTION */}
                <div className="w-full  bg-gray-50 rounded-lg p-6 border">
                    <Checkout ref={ref} amount={amount} discount={discount} title={title} urls={urls} companyList={companyList} id={id} />
                </div>
            </div>

        </Modal>

    )
}

export default ModalCheckout