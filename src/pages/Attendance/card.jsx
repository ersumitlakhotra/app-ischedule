import React from "react";
import {
  Clock3,
  CheckCircle2,
  CalendarDays,
  XCircle,
  Plus,
} from "lucide-react";
import { encryptId, getWeekLabel } from "../../common/general.jsx";
import { Image } from "../../controls/image.jsx";
import { Tags } from "../../controls/tags.jsx";
import { ModalPortal } from "../../controls/modalportal.jsx";
import { ButtonPermission } from "../../auth/protectedButton.js";
import { useNavigate } from "react-router-dom";

const badgeStyles = {
  present: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    icon: <CheckCircle2 size={14} />,
  },
  partial: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: <Clock3 size={14} />,
  },
  leave: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    icon: <CalendarDays size={14} />,
  },
  absent: {
    bg: "bg-red-50",
    text: "text-red-700",
    icon: <XCircle size={14} />,
  },
  active: {
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    icon: <CheckCircle2 size={14} />,
  },
};

export const EmployeeAttendance = ({
  days = [],
  date = new Date().toISOString().split("T")[0],
  userList = [],
  attendanceList = []
}) => {
  const todayDate = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();
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
  const getTotalHours = (employeeId) => {
    const totalMinutes = attendanceList
      .filter(
        (o) =>
          o.uid === employeeId &&
          o.isworking === true &&
          (o.status === "Present" || o.status === "Half Day")
      ).reduce((total, o) => total + (Number(o.minutes) || 0), 0);

    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hours}h ${String(mins).padStart(2, "0")}m`;
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Employee Attendance
          </h2>
          <p className="text-sm text-slate-500">
            Weekly attendance overview
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
          {getWeekLabel(date)}
        </div>
      </div>

      <div className="overflow-auto">
        <div
          className="grid min-w-[1300px]"
          style={{
            gridTemplateColumns:
              "280px repeat(7, minmax(140px,1fr)) 140px",
          }}
        >
          <div className="sticky left-0 z-30 border-b bg-white px-5 py-4 font-semibold text-slate-700">
            Employee
          </div>

          {days.map((day) => (
            <div
              key={day.date}
              className={`
                border-b border-l p-4 text-center
                ${day.date === todayDate
                  ? "bg-sky-500 text-white border-x-2 border-sky-500"
                  : "bg-slate-50"
                }
              `}
            >
              <p className="text-sm font-semibold">{day.weekday_short}</p>
              <p className="mt-1 text-xs opacity-90">{day.date}</p>
            </div>
          ))}

          <div className="border-b border-l bg-slate-50 p-4 text-center text-sm font-semibold text-slate-700">
            Total
          </div>

          {userList.map((employee) => (
            <React.Fragment key={employee.id}>
              <div className="sticky left-0 z-20 flex items-center gap-3 border-b bg-white px-5 py-4" >
                <Image src={employee.profilepic} name={employee.fullname} height="h-11" width="w-11" className="flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-slate-900">
                    {employee.fullname}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {employee.role}
                  </p>
                </div>
              </div>

              {days.map((day, index) => {
                const timing = employee.timinginfo?.[0]?.[day.weekday_long];
                const isAttendance = attendanceList.find((o) => o.trndate?.split("T")[0] === day.date.toString() && o.uid === employee.id);
                const isWorking = isAttendance ? isAttendance.isworking : timing[2];
                return (
                  <div
                    key={day.date}
                    onClick={() => (<ButtonPermission permission={`Attendance.Edit`}
                      children={isAttendance && navigate('/Attendance/Edit/' + encryptId(isAttendance.id))} />
                    )}
                    className={`group relative border-b  transition-all ${isAttendance && "cursor-pointer"}  ${index === 0 ? "border-l border-slate-200 " : "border-l"} ${day.date === todayDate ? " border-l border-r border-sky-500" : isAttendance ? "bg-slate-50" : "bg-white"}`}>
                    <div className="flex flex-col gap-4 p-2">
                      <div className="flex justify-end">
                        <Tags title={isWorking ? "Working" : "DayOff"} dot size="xs" />
                      </div>

                      {
                        isAttendance ? (
                          (() => {
                            const { title, color } = getAttendanceDisplay(isAttendance.status,isAttendance.worktime,isAttendance.islate,isAttendance.isearly);
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
                              className="h-12 w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400 cursor-pointer transition-all duration-200 hover:border-sky-500 hover:text-sky-500 hover:bg-sky-50">
                              <Plus size={18} strokeWidth={2.5} />
                            </div>
                          } />
                      }
                    </div>
                  </div>
                );
              })}

              <div className="flex items-center justify-center border-b border-l bg-slate-50 p-4">
                <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                  {getTotalHours(employee.id)}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}


{/*
   <ModalPortal trigger={({ ref, onClick }) => (
                            <div ref={ref} onClick={onClick} className="h-12 w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400 cursor-pointer transition-all duration-200 hover:border-sky-500 hover:text-sky-500 hover:bg-sky-50">
                              <Plus size={18} strokeWidth={2.5} />
                            </div>
                          )}
                            placement="left"
                            width="w-40"
                            children={<div> test</div>}
                          />
  */}