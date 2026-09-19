/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { data, useNavigate, useOutletContext } from "react-router-dom";
import { SearchInput, Badge, Select, Button } from "../../controls/index.jsx";
import { NoResults, EmptyState, Header, IsLoading } from "../../common/index.jsx";
import Aside from "./aside.jsx";
import { ChevronLeftCircle } from "lucide-react";
import Card from "./card.jsx";

const Discount = () => {
    const headingLabel = 'Discount';
    const permissionText = "Discount";
    const navigate = useNavigate();
    const { refresh, getDiscount, getService } = useOutletContext();
    const [isLoading, setIsLoading] = useState(false);
    const [List, setList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [servicesList, setServicesList] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [sortStatus, setSortStatus] = useState('Live');

    const [selected, setSelected] = useState(null);
    const [showSidebar, setShowSidebar] = useState(true);

    useEffect(() => {
        Init();
    }, [refresh])

    const Init = async () => {
        setIsLoading(true);
        const [
            Response,
            ServicesResponse,
           
        ] = await Promise.all([
           getDiscount(),
            getService(),    
        ]);
        
        setServicesList(ServicesResponse);
        setList(Response);
        setFilteredList(Response);
        setIsLoading(false);
    }

    useEffect(() => {
        setSelected(null);
        const searchedList = List.filter(item =>
        (
            (item.name || "").toLowerCase().includes(searchInput.toLowerCase()) &&
            (sortStatus === "All" || item.status === sortStatus)
        ));
        setFilteredList(searchedList);
    }, [List, searchInput, sortStatus])

    const handleSelect = (event) => {
        setSelected(event);

        // Hide sidebar on mobile
        if (window.innerWidth < 1024) {
            setShowSidebar(false);
        }
    };

    return (
        <div class="flex flex-col gap-4 md:px-7 py-4 mb-12">
            <Header Title={headingLabel} Permission={permissionText} AddButton={headingLabel} ExportList={filteredList} onClick={() => navigate('/Discount/Create')} />

            <div class='flex flex-row gap-2 items-center justify-between '>
                <SearchInput value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder='Filter and search . . . ' />
                <Select value={sortStatus} style={{ width: 150, height: 50, fontSize: 16 }} onChange={(e) => setSortStatus(e)} isSearch={false}
                    options={[
                        { id: 'All', value: 'All', search: 'All', label: <Badge color={'blue'} text={'All'} /> },
                        { id: 'Past', value: 'Past', search: 'Past', label: <Badge color={'red'} text={'Past'} /> },
                        { id: 'Live', value: 'Live', search: 'Live', label: <Badge color={'green'} text={'Live'} /> },
                        { id: 'Upcoming', value: 'Upcoming', search: 'Upcoming', label: <Badge color={'yellow'} text={'Upcoming'} /> }
                    ]}
                />
            </div>

            <IsLoading isLoading={isLoading} rows={10} input={
                List.length === 0 ?
                    <EmptyState
                        title="No Discount"
                        buttonText={headingLabel}
                        permission={permissionText}
                        onClick={() => navigate('/Discount/Create')}
                        description="You haven't created any service discounts yet. Add your first discount to start offering promotions to your customers." /> :

                    <div className="flex gap-2 h-[90vh] max-h-screen w-full ">

                        {/* Sidebar */}
                        <div className={`${showSidebar ? "block" : "hidden"} lg:block w-full lg:w-1/2`}>
                            {filteredList.length > 0 ?
                                <Aside item={filteredList} selected={selected} onSelect={handleSelect} /> :
                                <NoResults
                                    buttonText={headingLabel}
                                    permission={permissionText}
                                    onClick={() => navigate('/Discount/Create')} />}
                        </div>

                        {/* Details */}
                        <div className={`flex-1 ${showSidebar ? "hidden lg:block" : "block"} `} >
                            <main className={`h-screen overflow-y-auto  `}>

                                {/* Mobile Header */}
                                <div className="sticky top-0 z-20 flex items-center gap-3 border-b bg-white p-3 lg:hidden">
                                    <Button variant="secondary" icon={ChevronLeftCircle} label={'List'} onClick={() => setShowSidebar(true)} />
                                </div>
                                {selected && <Card item={selected} />}
                            </main>
                        </div>

                    </div>

            } />
        </div>
    )
}

export default Discount;

