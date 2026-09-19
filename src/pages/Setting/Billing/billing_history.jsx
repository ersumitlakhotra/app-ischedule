/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { ActionMenu, CustomTable, Tags, SearchInput } from "../../../controls/index.jsx";
import { Header } from "../rightside.jsx"
import { get_Date } from "../../../common/localDate.js";
import { DollarSign, Download } from "lucide-react";
import { IsLoading } from "../../../common/isLoading.jsx";
import { print_invoice } from "../Invoice/print_invoice.jsx";
import { encryptId } from "../../../common/general.jsx";
import { useNavigate } from "react-router-dom";

export const BillingHistory = ({ billingList,saveData}) => {
    const navigate= useNavigate();
    const [searchInput, setSearchInput] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [filteredList, setFilteredList] = useState(billingList)

    useEffect(() => {
        handleSearch();
    }, [searchInput]);

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const search = searchInput.toLowerCase();

            const searchedList = billingList.filter((item) => {
                return (
                    (item.plan || "").toString().toLowerCase().includes(search) ||
                    (item.invoice || "").toString().toLowerCase().includes(search)
                );
            });

            setFilteredList(searchedList);
            // set state here
        } finally {
            setIsLoading(false);
        }
    };


    const headers = [
        { label: "Invoice", render: (row) => (<span className="font-semibold">{row.invoice}</span>), },
        {
            label: "Billing Date",
            render: (row) => (<span class="font-semibold">{get_Date(row.duedate, 'DD MMM YYYY')}</span>),
        },
        {
            label: "Plan",
            render: (row) => `${row.plan}`,
        },
        {
            label: "Total",
            render: (row) => <span class={`font-semibold`}>{`$ ${row.totalamount}`}</span>,
        },
        {
            label: "Status",
            render: (row) => <Tags title={row.status} dot />,
        },
        {
            label: "Action",
            render: (row) =>
                <ActionMenu
                    placement="left"
                    width="w-40"
                    actions={[
                        ...(row.status !== "Paid"
                            ? [{
                                label: "Pay Now",
                                permission: "Setting.Edit",
                                icon: DollarSign,
                                shortcut: "⌘P",
                                onClick:() => navigate('/Checkout/' + encryptId(row.id))
                            }]
                            : []),
                        {
                            label: "Download",
                            permission: "Setting.Edit",
                            icon: Download,
                            shortcut: "⌘I",
                            onClick: async () => await print_invoice(row.id),
                        },
                    ]}
                />
        },

    ];
    return (

        <div id="invoice-section" className="space-y-5  mb-4 ">
            <Header title={'Billing History'} description={'Keep track of your subscription payments and invoices.'}
            saveData={saveData}
                extra={
                    <div className="w-96"><SearchInput value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder='Filter and search . . . ' /></div>
                } />
            <IsLoading isLoading={isLoading} rows={10} input={
                <CustomTable headers={headers} data={filteredList} rowsPerPage={10} />} />
        </div>

    )

}