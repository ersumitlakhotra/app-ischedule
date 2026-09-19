import { useNavigate } from "react-router-dom";
import { EmptyState, IsLoading } from "../../common"
import { Button, Tooltip, TopBadge, Image, } from "../../controls";
import { ButtonPermission } from "../../auth/protectedButton";
import { get_Date } from "../../common/localDate.js";
import { encryptId, getWeekday } from "../../common/general.jsx";
import { ListCheck, NotebookPen, ChevronRight, CircleCheckBig, X } from "lucide-react";
import { accept_reject } from "../Appointment/accept_reject.jsx";

export const Awaiting = ({
    isLoading,
    awaitingList = [],
    userList,
    hasPermission,
    saveData
}) => {
    const navigate = useNavigate();
    return (
        <IsLoading isLoading={isLoading} rows={10} input={
            awaitingList.length === 0 ?
                <EmptyState
                    title="No Awaiting Request"
                    buttonText={"Appointment"}
                    permission={"Appointment"}
                    onClick={() => navigate('/Appointment/Create')}
                    description="Book an appointment by choosing the customer, services, preferred date and time, and completing any required payment information." /> :

                <div className="rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden mb-4" >

                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-3 shadow-sm">
                        <div className="relative">
                            <h2 className=" text-lg font-semibold text-gray-900">
                                <span className="text-3xl">⚠️</span>Awaiting Request
                            </h2>
                            <p className="mt-1 text-xs text-gray-500">
                                Requests that are pending for response.
                            </p>
                            {awaitingList.length > 0 && <TopBadge text={awaitingList.length} color={'red'} className="!w-[22px] !h-[22px]" />}
                        </div>
                        <ButtonPermission permission={`Appointment.Open`} children={
                            <Button variant="secondary" icon={ChevronRight} shape="circle" onClick={() => navigate('/Appointment')} />
                        } />

                    </div>

                    {/* Body */}
                    <div className="space-y-3 overflow-y-scroll h-[1100px] p-4 mb-4">
                        {awaitingList.map((form) =>
                            <Card form={form} userList={userList} hasPermission={hasPermission} navigate={navigate} saveData={saveData} />
                        )}
                    </div>
                </div >
        } />
    )
}

const Card = ({
    form,
    userList,
    hasPermission,
    navigate,
    saveData
}) => {

    const employee =
        userList?.length && Number(form.uid)
            ? userList.find((o) => o.id === form.uid)
            : null;

    return (
        <div className={`rounded-2xl border border-gray-200 bg-gray-50  overflow-hidden mb-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
            onClick={() => hasPermission("Appointment.View") && navigate('/Appointment/View/' + encryptId(form.id))}  >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-4 ">
                <h2 className=" font-semibold text-gray-900">
                    # {form.order_no}
                </h2>

                <div className="space-x-3">
                    <Tooltip title="Accept" placement="bottom" children={
                        <Button variant="primary" icon={CircleCheckBig} shape="circle" onClick={async () => await accept_reject(form.id, true, saveData)} />}
                    />
                    <Tooltip title="Reject" placement="bottom" children={
                        <Button variant="danger" icon={X} shape="circle" onClick={async () => await accept_reject(form.id, false, saveData)} />}
                    />
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-col md:flex-row items-start md:items-center">
                {/* Left Section */}
                <div className="w-full md:w-auto md:min-w-[140px] border-b md:border-b-0 md:border-r border-gray-200 px-4 py-3">
                    <p className="text-xs font-medium text-sky-600">{getWeekday(get_Date(form.trndate, 'YYYY-MM-DD'))}</p>

                    <h2 className="mt-1 text-sm font-semibold text-gray-900">
                        {get_Date(form.trndate, 'MMM DD, YYYY')}
                    </h2>

                    <span class="mt-4 text-xs font-medium text-gray-400">{form.slot}</span>

                    <div className="mt-4 flex items-center gap-2 ">
                        <Image src={employee?.profilepic || null} name={employee?.fullname || ""} width="w-8" height="h-8" className="" avatar={false} />
                        <span className="font-semibold text-xs">{employee?.fullname || ""}</span>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex-1 px-6 py-5">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-3">
                            <CustomerLineItem index={1} title={form.name} icon={<span className="h-3 w-3 rounded-full bg-lime-500"></span>} description={form.cell + (form.email && ` | ${form.email}`)} />
                            <CustomerLineItem index={2} title={"Services"} icon={<ListCheck size={16} color="black" />} description={form.services.map((o) => o.name).join(" | ")} />
                            <CustomerLineItem index={3} title={"Notes"} icon={<NotebookPen size={16} color="black" />} description={form.notes || "Empty"} />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

const CustomerLineItem = ({ index, icon, title, description }) => {
    return (
        <div key={index} className="flex items-center gap-3">
            {icon}
            <div className="flex flex-col items-start">
                <span className="text-sm font-semibold"> {title} </span>
                <span className="text-[11px] font-medium text-gray-400"> {description}</span>
            </div>
        </div>
    )
}


