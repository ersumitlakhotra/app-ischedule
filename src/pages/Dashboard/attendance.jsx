import { useNavigate } from "react-router-dom";
import { EmptyState, IsLoading } from "../../common"
import { Button, Image, Tags } from "../../controls";
import { encryptId, getWeekDates } from "../../common/general.jsx";
import { get_Date, LocalDate } from "../../common/localDate";
import { ButtonPermission } from "../../auth/protectedButton";
import { Plus, ChevronRight } from "lucide-react";

export const Attendance = ({
    isLoading,
    userList,
    attendanceList
}) => {
    const navigate = useNavigate();
    const todayDate = LocalDate();
    const days = getWeekDates(todayDate);

    const getAttendanceDisplay = (status, worktime, isLate, isEarly) => {
        switch (status) {
            case "Present":
            case "Half Day":
                return {
                    title: worktime,
                    color: isLate || isEarly ? "yellow" : "green",
                };

            case "Absent":
                return {
                    title: "Absent",
                    color: "red",
                };

            case "Leave":
                return {
                    title: "Leave",
                    color: "violet",
                };

            case "Holiday":
                return {
                    title: "Holiday",
                    color: "gray",
                };

            default:
                return {
                    title: "",
                    color: "gray",
                };
        }
    };
    return (
        <IsLoading isLoading={isLoading} rows={10} input={
            userList.length === 0 ?
                <EmptyState
                    title="No Employees"
                    buttonText={"Employees"}
                    permission={"Employees"}
                    onClick={() => navigate('/Employee/Create')}
                    description="You haven't added any employees yet. Create your first employee to start managing your team." /> :

                <div className="rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden mb-4" >

                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 shadow-sm">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Employees Attendance
                            </h2>
                            <p className="mt-1 text-xs text-gray-500">
                                {get_Date(todayDate, 'dddd, MMMM D, YYYY')} ( Today )
                            </p>
                        </div>

                        <ButtonPermission permission={`Attendance.Open`} children={
                            <Button variant="secondary" icon={ChevronRight} shape="circle" onClick={() => navigate('/Attendance')} />
                        } />
                    </div>

                    {/* Body */}
                    <div className="space-y-6 p-6 h-[500px] overflow-y-auto">

                        {userList.map((employee) => (
                            <div key={employee.id} className="flex items-center justify-between" >

                                <div className="flex flex-row items-center gap-2">
                                    <Image
                                        src={employee.profilepic || null}
                                        name={employee.fullname || ''}
                                        height="h-9"
                                        width="w-9"
                                        className="flex-shrink-0 text-xs"
                                    />

                                    <div className="min-w-0">
                                        <h4 className="text-sm font-medium text-slate-900">
                                            {employee.fullname || ''}
                                        </h4>

                                        <p className="text-xs text-slate-500">
                                            {employee.role}
                                        </p>
                                    </div>
                                </div>

                                {/* Attendance */}
                                {days.filter((o) => o.date.toString() === todayDate).map((day, index) => {
                                    const timing = employee.timinginfo?.[0]?.[day.weekday_long];
                                    const isAttendance = attendanceList.find((o) => o.trndate?.split("T")[0] === day.date.toString() && o.uid === employee.id);
                                    const isWorking = isAttendance ? isAttendance.isworking : timing[2];
                                    return (
                                        <div key={day.date}
                                            onClick={() => (<ButtonPermission permission={`Attendance.Edit`}
                                                children={isAttendance && navigate('/Attendance/Edit/' + encryptId(isAttendance.id))} />
                                            )}
                                            className={`group relative transition-all ${isAttendance && "cursor-pointer"}`}>
                                            <div className="flex flex-row gap-2 ">
                                                <Tags title={isWorking ? "Working" : "DayOff"} dot />
                                                {
                                                    isAttendance ? (
                                                        (() => {
                                                            const { title, color } = getAttendanceDisplay(isAttendance.status, isAttendance.worktime, isAttendance.islate, isAttendance.isearly);
                                                            return (
                                                                <Tags
                                                                    dot
                                                                    size="sm"
                                                                    className="w-full flex justify-center"
                                                                    title={title}
                                                                    color={color}
                                                                />
                                                            );
                                                        })()
                                                    ) :
                                                        <ButtonPermission permission={`Attendance.Create`} children={
                                                            <div onClick={(e) => {
                                                                e.stopPropagation(); navigate('/Attendance/Create', {
                                                                    state: {
                                                                        uid: employee.id,
                                                                        trndate: day.date.toString(),
                                                                        isworking: isWorking,
                                                                        start: timing[0],
                                                                        end: timing[1],
                                                                    },
                                                                });
                                                            }}
                                                                className="h-8 w-8 flex flex-row items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 cursor-pointer transition-all duration-200 hover:border-sky-500 hover:text-sky-500 hover:bg-sky-50">
                                                                <Plus size={10} strokeWidth={2.5} />
                                                            </div>
                                                        } />
                                                }
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}

                    </div>

                </div>
        } />
    )
}