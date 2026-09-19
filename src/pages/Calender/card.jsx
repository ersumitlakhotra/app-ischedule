import { DollarSign, Download, Eye, Pencil } from "lucide-react";
import { toMinutes } from "../../common/generateTimeSlots.js";
import { Tooltip } from "../../controls/index.jsx";
import { print_invoice } from "../Appointment/print_invoice.jsx";
import { encryptId } from "../../common/general.jsx";
import { useNavigate } from "react-router-dom";
import { Appointment_Action_Menu } from "../Appointment/table_header.jsx";
import { ButtonPermission, usePermission } from "../../auth/protectedButton.js";

function getHeight(start, end) {
    let startMinutes = toMinutes(start);
    let endMinutes = toMinutes(end);
    let heightInt = (endMinutes - startMinutes) / 15;
    let setHeight = `${(heightInt * 48) - 4}px`
    return setHeight;
};
function getBorder (value) {
    switch (value.toUpperCase()) {
        case 'AWAITING':    
            return 'border-s-gray-500 bg-gray-50 hover:bg-gray-100';
        case 'PENDING':    
            return 'border-s-yellow-500 bg-yellow-50 hover:bg-yellow-100';
        case 'COMPLETED':
            return 'border-s-green-500 bg-green-50 hover:bg-green-100';
        case 'CANCELLED':
        case 'NOSHOW':
        case 'REJECTED':
            return 'border-s-red-500 bg-red-50 hover:bg-red-100';
        default:
            return 'border-s-sky-500 bg-sky-50 hover:bg-sky-100';
    }
}

export default function Card({
    id,
    startTime,
    appointments
}) {
    const navigate = useNavigate();
    const hasPermission = usePermission();
    const isView = hasPermission("Appointment.View");
    return (
        appointments.map(row =>
            <div key={row.id}
                style={{ height: getHeight(row.starttime, row.endtime), cursor: isView ? "pointer" : "" }}
                className={`relative mt-5 mx-2 max-w-40 min-w-40 flex flex-col overflow-hidden rounded-md border border-gray-200 border-s-4 px-2 py-1.5 text-xs shadow-sm transition-all duration-150  hover:shadow-md  ${getBorder(row.status)}`}
                onClick={() => {isView && navigate('/Appointment/View/' + encryptId(row.id))}}
            >
                <div className="flex items-center justify-between">
                    <p className="font-semibold text-sky-700">#{row.order_no}</p>
                     <Appointment_Action_Menu row={row} navigate={navigate}/>
                </div>

                {row.services.map((o) => (
                    <p className="truncate text-xs text-gray-500">{o.name}</p>
                ))}
            </div>
        ))
}