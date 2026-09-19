/* eslint-disable react-hooks/exhaustive-deps */
import { ActionMenu, Button, SearchInput, Toggle, Tags, Tabs, CustomTable } from "../../../controls/index.jsx";
import { encryptId, updateField } from "../../../common/general.jsx";
import { Header } from "../rightside.jsx";
import { useEffect, useState } from "react";
import { ButtonPermission } from "../../../auth/protectedButton.js";
import { Download, Plus } from "lucide-react";
import { UTC_LocalDateTime } from "../../../common/localDate.js";
import { IsLoading } from "../../../common/isLoading.jsx";
import { print_invoice } from "../Invoice/print_invoice.jsx";
import { useNavigate } from "react-router-dom";

export default function TextMessage({ form, setForm, logsList,saveData }) {
    const navigate= useNavigate()
    const [searchInput, setSearchInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [filteredList, setFilteredList] = useState(logsList);

    useEffect(() => {
        handleSearch();
    }, [searchInput]);

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const search = searchInput.toLowerCase();

            const searchedList = logsList.filter((item) => {
                const phone = (item.to || "").replace(/\D/g, "");

                return (
                    (item.order_no || "").toString().toLowerCase().includes(search) ||
                    (item.message || "").toLowerCase().includes(search) ||
                    phone.includes(search)
                );
            });

            setFilteredList(searchedList);
            // set state here
        } finally {
            setIsLoading(false);
        }
    };

    const logsHeader = [
        { label: "Order", render: (row) => (<span className="font-semibold  whitespace-nowrap">{row.order_no}</span>), },
        { label: "To", render: (row) => (<span className="text-xs whitespace-nowrap">{row.sendto}</span>), },
        { label: "Message", render: (row) => (<span className="text-xs">{row.message}</span>), },
        { label: "Status", render: (row) => (<Tags title={row.status} size='xs' dot />), },
        { label: "Balance", render: (row) => (<span className="text-xs">{row.credit}</span>), },
        { label: "Date", render: (row) => <span className="text-xs whitespace-nowrap">{UTC_LocalDateTime(row.createdat, 'DD MMM YYYY h:mm A')}</span>, },
    ];
    const paymentheaders = [
        { label: "Invoice", render: (row) => (<span className="font-semibold">{row.order_no}</span>), },
        { label: "Date", render: (row) => <span className="text-xs">{UTC_LocalDateTime(row.createdat, 'DD MMM YYYY h:mm A')}</span>, },
        { label: "Service", render: (row) => <span className="text-xs">Text Messaging Credit</span>, },
        { label: "Total", render: (row) => <span class={`font-semibold`}>{`$ ${row.credit}`}</span>, },
        { label: "Status", render: (row) => <Tags title={row.status} dot size='xs' />, },
        {
            label: "Action", render: (row) =>
                <ActionMenu placement="left" width="w-40" actions={[
                    {
                        label: "Download",
                        permission: "Setting.Edit",
                        icon: Download,
                        shortcut: "⌘I",
                        onClick: async () => await print_invoice(row.oid),
                    },
                ]} />,
        },

    ];
    const tabs = [
        {
            id: 1,
            label: "Logs",
            content: (
                <IsLoading isLoading={isLoading} rows={10} input={
                    <CustomTable headers={logsHeader} data={filteredList} rowsPerPage={10} />} />
            ),
        },

        {
            id: 2,
            label: "Payments",
            content: (
                <IsLoading isLoading={isLoading} rows={10} input={
                    <CustomTable headers={paymentheaders} data={filteredList.filter((o) => o.type === "TwillioCredit")} rowsPerPage={10} />} />
            ),
        },
    ];


    return (
        <div className="space-y-5  mb-4 ">
            <Header title={'Text Message Notification'} description={<Toggle label="Send a reminder via text message one day prior to the appointment. $0.04 (4 cents) per text ?" variant="primary" value={form.textreminder} onChange={(e) => updateField("textreminder", e, setForm)} />}
                formBody={JSON.stringify({
                    textreminder: form.textreminder
                })}
                saveData={saveData}
            />


            <div className='flex flex-col gap-4  '>

                <div className=" flex flex-row items-center justify-between">
                    <div >
                        <p class="text-2xl font-bold text-gray-800 mb-2">{form.twilliocell}</p>
                        <Tags color={'green'} title={`Balance : $${form.credit}`} />
                    </div>
                    <ButtonPermission permission={`Setting.Edit`} children={
                        <Button
                            variant="orange"
                            icon={Plus}
                            label={"Buy Credit "}
                            onClick={() => navigate('/Checkout/' + encryptId("TextCredit"))}
                        />} />
                </div>

                <SearchInput value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder='Filter and search . . . ' />

                <Tabs tabs={tabs} />
            </div>
        </div>
    )
}