
import {  Tags, ActionMenu } from "../../controls/index.jsx";
import { encryptId } from "../../common/general.jsx";
import {  get_Date,  UTC_LocalDateTime } from "../../common/localDate.js";
import { DollarSign, Download, Eye,  Pencil,CircleCheckBig, X } from "lucide-react";
import { print_invoice } from "./print_invoice.jsx";
import { accept_reject } from "./accept_reject.jsx";
import { useOutletContext } from "react-router-dom";

function TableHeaders({userList,navigate}){

   return [
        { label: "Order No", render: (row) => (<span className="font-semibold">{row.order_no}</span>), },
        {
            label: "Customer",
            render: (row) => (
                <div className="flex flex-col items-start">
                    <span className="font-semibold"> {row.name} </span>
                    <span className="text-xs font-medium text-gray-400"> {row.cell} </span>

                </div>
            ),
        },
        {
            label: "Date",
            render: (row) => (
                <div className="flex flex-col items-start">
                    <span class="font-semibold">{get_Date(row.trndate, 'DD MMM YYYY')}</span>
                    <span class="text-xs font-medium text-gray-400">{row.slot}</span>
                </div>),
        },
        {
            label: "Services",
            render: (row) => (
                <div className="flex flex-col items-start">
                    {row.services.map((o) => (
                        <span class="text-xs font-medium ">{o.name}</span>
                    ))}
                </div>),
        },
        {
            label: "Total",
            render: (row) => <span class={`font-semibold`}>{`$ ${row.total}`}</span>,
        },
        {
            label: "Status",
            render: (row) =>
                <div className="flex flex-row items-center gap-2">
                    <Tags title={row.status} dot />
                    {row.paymentstatus === 'Paid' && <Tags title={"Paid"} color="green" dot />}
                </div>,
        },
        {
            label: "Employee",
            render: (row) => {
                const user = userList.find((item) => item.id === row.uid);
                return (<span class="font-semibold">{user?.fullname || ''}</span>)
            },
        },
        {
            label: "Modified",
            render: (row) => <span class="text-xs font-medium text-gray-400">{UTC_LocalDateTime(row.modifiedat, 'DD MMM YYYY h:mm A')}</span>,

        },
        {
            label: "Action",
            render: (row) =>
                <Appointment_Action_Menu row={row} navigate={navigate}/>,
        },
    ];
}

function Appointment_Action_Menu({ row, navigate }) {
    const { saveData } = useOutletContext();
    return (
        <ActionMenu placement="left" width="w-48" actions={[
            ...(row.status === "Awaiting"
                ? [
                    {
                        label: "Accept",
                        permission: "Appointment.View",
                        icon: CircleCheckBig,
                        shortcut: "⌘A",
                        onClick: async () => await accept_reject(row.id, true, saveData),
                    },
                    {
                        label: "Reject",
                        permission: "Appointment.View",
                        icon: X,
                        shortcut: "⌘R",
                        onClick: async () => await accept_reject(row.id, false, saveData),
                    }
                ]
                : []
            ),
            {
                label: "Edit",
                permission: "Appointment.Edit",
                icon: Pencil,
                shortcut: "⌘E",
                onClick: () => navigate('/Appointment/Edit/' + encryptId(row.id)),
            },
            {
                label: "View",
                permission: "Appointment.View",
                icon: Eye,
                shortcut: "⌘V",
                onClick: () => navigate('/Appointment/View/' + encryptId(row.id)),
            },
            {
                label: "Receive Payment",
                permission: "Payment.Open",
                icon: DollarSign,
                shortcut: "⌘P",
                onClick: () => navigate('/Payment/' + encryptId(row.id)),
            },
            {
                label: "Print Invoice",
                permission: "Appointment.View",
                icon: Download,
                shortcut: "⌘I",
                onClick: async () => await print_invoice(row.id),
            },
        ]} />)
}

export {
    TableHeaders,
    Appointment_Action_Menu
}