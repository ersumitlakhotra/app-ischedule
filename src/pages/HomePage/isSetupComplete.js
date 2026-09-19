import React, { useRef, useState } from 'react';
import { Button, Carousel } from 'antd';
//import BasicInfo from '../../components/Setting/Account/basicinfo';
//import Hours from '../../components/Setting/Account/hours';
//import BookingDays from "../../components/Setting/Account/bookingdays.js";
//import GmailSetup from "../../components/Setting/Account/gmailsetup.js";
//import Loyalty from "../../components/Setting/Account/loyalty.js";
//import ServiceCategories from '../../components/Setting/Account/category.js';
//import SocialLink from '../../components/Setting/Social/sociallink.js';

const IsSetupComplete = ({ companyList,loyaltyList, saveData, logoList, setIsLoading,setIsSetupComplete}) => {
    const carouselRef = useRef(null);
    const basicInfoRef = useRef(null);
    const hoursRef = useRef(null);
    const gmailRef = useRef(null);
    const loyaltyRef = useRef(null);
    const bookingRef = useRef(null);
    const socialRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [title, setTitle] = useState("Beauty & Wellness");

    const goNext = async () => {
        let res = true;
        if (currentIndex === 0) {
            await basicInfoRef.current?.handleSave();
        } else if (currentIndex === 1) {
            await hoursRef.current?.handleSave();
        } else if (currentIndex === 3) {
            res = await gmailRef.current?.handleSave();
        } else if (currentIndex === 4) {
             res =await loyaltyRef.current?.handleSave();
        }else if (currentIndex === 5) {
            await bookingRef.current?.handleSave();
        }else if (currentIndex === 6) {
            await socialRef.current?.handleSave();
        }

        if (res) {
            if (currentIndex < 6) {
                carouselRef.current.next();
                setCurrentIndex(prev => prev + 1);
            }
            else
                setupComplete();
        }
    };

    const goPrev = () => {
        carouselRef.current.prev();
        setCurrentIndex(prev => prev - 1);
    };
    const goSkip = () => {
        carouselRef.current.next();
        setCurrentIndex(prev => prev + 1);
    };

    const setupComplete = () => {
        const Body = JSON.stringify({
            title: title,
        });
        saveData({
            label: 'Setup Complete',
            method: "PUT",
            endPoint: "company/setupcomplete",
            body: Body,
            notify: false
        });
        setIsSetupComplete(true)
    }

    return (
        <div>
            <Carousel effect="fade" ref={carouselRef} style={{ height: 550, overflowY:'scroll' }}>
               {/* <BasicInfo companyList={companyList} saveData={saveData} logoList={logoList} popUp={true} refNext={basicInfoRef} />
                <Hours companyList={companyList} saveData={saveData}  popUp={true} refNext={hoursRef} />
                <ServiceCategories setTitle={setTitle} />
                <GmailSetup companyList={companyList} saveData={saveData} popUp={true} refNext={gmailRef} setIsLoading={setIsLoading} />
                <Loyalty loyaltyList={loyaltyList} saveData={saveData}  popUp={true} refNext={loyaltyRef}  />
                <BookingDays companyList={companyList} saveData={saveData} popUp={true} refNext={bookingRef}  />
                <SocialLink companyList={companyList} saveData={saveData}  popUp={true} refNext={socialRef}  />
                */}
            </Carousel>
            <div class='my-4 flex justify-end items-center gap-2'>
                {currentIndex > 2  && <Button size='large' type="default" onClick={() => goSkip()} >Skip</Button>}
                {currentIndex > 0 && <Button size='large' type="default" onClick={() => goPrev()} >Previous</Button>}
                {currentIndex === 6 ?
                    <Button size='large' color="cyan" variant="solid" onClick={() => goNext()}  >Complete</Button> :
                    <Button size='large' color="primary" variant="solid" onClick={() => goNext()}  >Next</Button>
                }
            </div>
        </div>
    )
};
export default IsSetupComplete;