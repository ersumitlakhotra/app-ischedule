/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Card from "./card.jsx";
import {  SearchInput, Badge, Select, TabsButton } from "../../controls/index.jsx";
import { NoResults,EmptyState, Header,IsLoading } from "../../common/index.jsx";
import { getByKey } from "../../common/general.jsx";

const Services = () => {
    const headingLabel = 'Services';
    const permissionText="Services";
    const navigate=useNavigate();
    const { refresh, getService,getCategory } = useOutletContext();
    const [isLoading, setIsLoading] = useState(false);
    const [List, setList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [sortStatus, setSortStatus] = useState('Both');

    const [selectedCT1, setSelectedCT1] = useState(1);
    const [category1Types, setCategory1Types] = useState([
        { id: 1, label: "All Types", value: "All Types", count:0 },
        { id: 2, label: "Men", value: "Men", count:0 },
        { id: 3, label: "Women", value: "Women", count:0},
        { id: 4, label: "Kids", value: "Kids" , count:0},
    ]);
    
    const [selectedCT2, setSelectedCT2] = useState(0);
    const [category2Types, setCategory2Types] = useState([
          { id: 0, label: "All Services", value: "All Services", count:0 },
          { id: 999, label: "None", value: "None", count:0 },
    ]);

    useEffect(() => {
        Init();
    }, [refresh])

    const Init = async () => {
        setIsLoading(true);
        const Response = await getService();
        const CategoryResponse = await getCategory();
        const category2List = CategoryResponse.filter((o) => o.category === 'services')
            .map((o, index) => ({
                id: o.id,
                label: o.name,
                value: o.id,
                count:0
            }));
        setCategoryList(category2List);
        setList(Response);
        setFilteredList(Response);
      //  updateCounts(Response);
        updateCategory2Count(category2List,Response)
        setIsLoading(false);
    }

    const updateCounts = (list) => {
        const counts = {
            "All Types": 0,
            "Men": 0,
            "Women": 0,
            "Kids": 0,
        };

        list.forEach((item) => {
            if (counts[item.category1] !== undefined) {
                counts[item.category1]++;
            } 
        });

        setCategory1Types([
            { id: 1, label: "All Types", value: "All Types", count: counts["All Types"] },
            { id: 2, label: "Men", value: "Men", count: counts["Men"] },
            { id: 3, label: "Women", value: "Women", count: counts["Women"] },
            { id: 4, label: "Kids", value: "Kids", count: counts["Kids"] },
        ])
    };

    const updateCategory2Count = (category2List, serviceList) => {
        const counts = serviceList.reduce((acc, item) => {
            const id = item.category2;

            if (id) {
                acc[id] = (acc[id] || 0) + 1;
            }

            return acc;
        }, {});

        setCategory2Types([
            {
                id: 0,
                label: "All Services",
                value: "All Services",
                count: serviceList.length
            },
            ...category2List
                .map(item => ({
                    ...item,
                    count: counts[item.id] || 0
                }))
                .filter(item => item.count > 0)
            ,    
            {
                id: 999,
                label: "None",
                value: "None",
                count: serviceList.filter(
                    item => !item.category2
                ).length
            },
        ]);
    };
    useEffect(() => {
        const category1 = getByKey(category1Types, "id", selectedCT1);
        const category1Name = category1?.value;

        const category2 = getByKey(category2Types, "id", selectedCT2);
        const category2Id = category2?.id;

        const searchedList = List.filter(item =>
        ((item.name || "").toLowerCase().includes(searchInput.toLowerCase()) &&
           // (item.category1 || "") === category1Name &&
            (
                selectedCT2 === 0 ||
                (
                    selectedCT2 === 999
                        ? !item.category2
                        : item.category2 === category2Id
                )
            ) &&
            (sortStatus !== 'Both' ? item.status.toLowerCase() === (sortStatus.toLowerCase()) : item.status.toLowerCase().includes('active')
            )));

            
        setFilteredList(searchedList);
    }, [List, searchInput, sortStatus,selectedCT1,selectedCT2])

    return (
        <div class="flex flex-col gap-4 md:px-7 py-4 mb-12">
            <Header Title={headingLabel} Permission={permissionText} AddButton={headingLabel} ExportList={filteredList} onClick={() =>navigate('/Services/Create')} />
  
            <div class='flex flex-row gap-2 items-center justify-between '>
                <SearchInput value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder='Filter and search . . . ' />
                <Select value={sortStatus} style={{ width: 150, height: 50, fontSize: 16 }} onChange={(e) => setSortStatus(e)} isSearch={false}
                    options={[
                        { id:'Both', value: 'Both',  search: 'Both',  label: <Badge color={'blue'} text={'Both'} /> },
                        { id:'Active', value: 'Active', search: 'Active', label: <Badge color={'green'} text={'Active'} /> },
                        { id:'Inactive', value: 'Inactive',search: 'Inactive', label: <Badge color={'red'} text={'Inactive'} /> }
                    ]}
                />
            </div>
           {/* <TabsButton tabs={category1Types} defaultActive={selectedCT1} onChange={(tab) =>setSelectedCT1(tab.id)} />*/}
            <TabsButton tabs={category2Types} defaultActive={selectedCT2} onChange={(tab) =>setSelectedCT2(tab.id)} />
            <div class="w-full flex flex-wrap justify-center md:justify-start gap-8">
                <IsLoading isLoading={isLoading} rows={10} input={
                    List.length === 0 ?
                        <EmptyState
                            title="No Services"
                            buttonText={headingLabel}
                            permission={permissionText}
                            onClick={() => navigate('/Services/Create')}
                            description="Get started by creating your first service. Once added, you'll be able to schedule, organize, and manage appointments with ease." /> :
                        filteredList.length > 0 ?
                            filteredList.map((item, index) =>
                                <Card key={index} item={item} categoryList={categoryList} />) :
                            <NoResults
                                buttonText={headingLabel}
                                permission={permissionText}
                                onClick={() => navigate('/Services/Create')} />
                } />
            </div>
        </div>
    )
}

export default Services;

