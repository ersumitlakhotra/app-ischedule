/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Card from "./card.jsx";
import {  SearchInput, Badge, Select } from "../../controls/index.jsx";
import { NoResults,EmptyState, Header,IsLoading } from "../../common/index.jsx";

const Employee = () => {
    const headingLabel = 'Employees';
    const permissionText="Employees";
    const navigate=useNavigate();
    const { refresh, getUser} = useOutletContext();
    const [isLoading, setIsLoading] = useState(false);
    const [List, setList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [sortStatus, setSortStatus] = useState('Both');

    useEffect(() => {
        Init();
    }, [refresh])

    const Init = async () => {
        setIsLoading(true);
        const Response = await getUser(false); // false means all Users
        setList(Response);
        setFilteredList(Response);
        setIsLoading(false);
    }

    useEffect(() => {
        const searchedList = List.filter(item =>
        (
            (item.fullname || "").toLowerCase().includes(searchInput.toLowerCase()) &&
            (sortStatus !== 'Both' ? item.status.toLowerCase() === (sortStatus.toLowerCase()) : item.status.toLowerCase().includes('active')
            )));
        setFilteredList(searchedList);
    }, [List, searchInput, sortStatus])

    return (
        <div class="flex flex-col gap-4 md:px-7 py-4 mb-12">
            <Header Title={headingLabel} Permission={permissionText} AddButton={headingLabel} ExportList={filteredList} onClick={() =>navigate('/Employee/Create')} />
  
            <div class='flex flex-row gap-2 items-center justify-between '>
                <SearchInput value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder='Filter and search. . . ' />
                <Select value={sortStatus} style={{ width: 150, height: 50, fontSize: 16 }} onChange={(e) => setSortStatus(e)} isSearch={false}
                    options={[
                        { id:'Both', value: 'Both',  search: 'Both',  label: <Badge color={'blue'} text={'Both'} /> },
                        { id:'Active', value: 'Active', search: 'Active', label: <Badge color={'green'} text={'Active'} /> },
                        { id:'Inactive', value: 'Inactive',search: 'Inactive', label: <Badge color={'red'} text={'Inactive'} /> }
                    ]}
                />
            </div>

            <div class="w-full flex flex-wrap justify-center md:justify-start gap-8">
                <IsLoading isLoading={isLoading} rows={10} input={
                    List.length === 0 ?
                        <EmptyState
                            title="No Employees"
                            buttonText={headingLabel}
                            permission={permissionText}
                            onClick={() => navigate('/Employee/Create')}
                            description="You haven't added any employees yet. Create your first employee to start managing your team." /> :
                        filteredList.length > 0 ?
                            filteredList.map((item, index) =>
                                <Card key={index} item={item} />) :
                            <NoResults
                                buttonText={headingLabel}
                                permission={permissionText}
                                onClick={() => navigate('/Employee/Create')} />
                } />
            </div>
        </div>
    )
}

export default Employee;

