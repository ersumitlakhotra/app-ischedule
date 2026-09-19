import dayjs from 'dayjs';
import { get_Date, LocalDate } from './localDate';

 export function pointsToDollars(points, pointsPerDollar = 100) {
  const p = parseFloat(points) || 0;
  const rate = parseFloat(pointsPerDollar) || 1;
  return Math.floor(p / rate);
}

const getDay = (date) => {
    const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const dayNum = dayjs(get_Date(date, 'YYYY-MM-DD')).get('day');
    return weekdays[dayNum];
}

export const isOpenForWork = (date, info ) => {
    const _result = [];
    let inTimeString = '00:00:00';
    let outTimeString = '00:00:00';
    let isOpenString = false;
    switch (getDay(date).toLowerCase()) {
        case 'sunday':
            {
                inTimeString = info.sunday[0]; outTimeString = info.sunday[1]; isOpenString = info.sunday[2];
                break;
            }
        case 'monday':
            {
                inTimeString = info.monday[0];
                outTimeString = info.monday[1];
                isOpenString = info.monday[2];
                break;
            }
        case 'tuesday':
            {
                inTimeString = info.tuesday[0];
                outTimeString = info.tuesday[1];
                isOpenString = info.tuesday[2];
                break;
            }
        case 'wednesday':
            {
                inTimeString = info.wednesday[0];
                outTimeString = info.wednesday[1];
                isOpenString = info.wednesday[2];
                break;
            }
        case 'thursday':
            {
                inTimeString = info.thursday[0];
                outTimeString = info.thursday[1];
                isOpenString = info.thursday[2];
                break;
            }
        case 'friday':
            {
                inTimeString = info.friday[0];
                outTimeString = info.friday[1];
                isOpenString = info.friday[2];
                break;
            }
        case 'saturday':
            {
                inTimeString = info.saturday[0];
                outTimeString = info.saturday[1];
                isOpenString = info.saturday[2];
                break;
            }
        default:
            {
                inTimeString = '00:00:00'; outTimeString = '00:00:00'; isOpenString = false;
                break;
            }
    }

    _result.push({
        date,               // <-- date included here
        inTime: inTimeString,
        outTime: outTimeString,
        isOpen: isOpenString,
    });
    return _result;
} 

export const userSchedule = (date, info,id, scheduleList) => {
    const _result = [];
    let inTimeString = '00:00:00';
    let outTimeString = '00:00:00';
    let isOpenString = false;
    let breakStart = '00:00:00';
    let breakEnd = '00:00:00';
    let scheduleId= 0;
    switch (getDay(date).toLowerCase()) {
        case 'sunday':
            {
                inTimeString = info.sunday[0]; outTimeString = info.sunday[1]; isOpenString = info.sunday[2]; breakStart = info.sunday[3]; breakEnd = info.sunday[4];
                break;
            }
        case 'monday':
            {
                inTimeString = info.monday[0];
                outTimeString = info.monday[1];
                isOpenString = info.monday[2];
                breakStart = info.monday[3]; 
                breakEnd = info.monday[4];
                break;
            }
        case 'tuesday':
            {
                inTimeString = info.tuesday[0];
                outTimeString = info.tuesday[1];
                isOpenString = info.tuesday[2];
                breakStart = info.tuesday[3];
                breakEnd = info.tuesday[4];
                break;
            }
        case 'wednesday':
            {
                inTimeString = info.wednesday[0];
                outTimeString = info.wednesday[1];
                isOpenString = info.wednesday[2];
                breakStart = info.wednesday[3];
                breakEnd = info.wednesday[4];
                break;
            }
        case 'thursday':
            {
                inTimeString = info.thursday[0];
                outTimeString = info.thursday[1];
                isOpenString = info.thursday[2];
                breakStart = info.thursday[3];
                breakEnd = info.thursday[4];
                break;
            }
        case 'friday':
            {
                inTimeString = info.friday[0];
                outTimeString = info.friday[1];
                isOpenString = info.friday[2];
                breakStart = info.friday[3];
                breakEnd = info.friday[4];
                break;
            }
        case 'saturday':
            {
                inTimeString = info.saturday[0];
                outTimeString = info.saturday[1];
                isOpenString = info.saturday[2];
                breakStart = info.saturday[3];
                breakEnd = info.saturday[4];
                break;
            }
        default:
            {
                inTimeString = '00:00:00'; outTimeString = '00:00:00'; isOpenString = false;  breakStart = '00:00:00';
                 breakEnd = '00:00:00';
                break;
            }
    }
    const res = scheduleList.find(item => item.uid === id && get_Date(item.trndate, 'YYYY-MM-DD') === get_Date(date, 'YYYY-MM-DD'))
    if (res !== undefined) {
        scheduleId=res.id;
        inTimeString = res.startshift;
        outTimeString = res.endshift;
        isOpenString = Boolean(res.dayoff);
        breakStart = res.breakstart;
        breakEnd = res.breakend;
    }

    _result.push({
        date,               // <-- date included here
        inTime: inTimeString,
        outTime: outTimeString,
        isOpen: isOpenString,
        breakStart:breakStart,
        breakEnd:breakEnd,
        scheduleId: scheduleId
    });
    return _result;
}

export const compareTimes=(time1, time2)=> {
    const [h1, m1] = time1.split(":").map(Number);
    const [h2, m2] = time2.split(":").map(Number);

    if (h1 > h2 || (h1 === h2 && m1 > m2)) return 1;   // time1 is later
    if (h1 < h2 || (h1 === h2 && m1 < m2)) return -1;  // time1 is earlier
    return 0;                                          // times are equal
}

export const getFutureDates=(numberOfDays)=> {
    const dates = [];
    const weekdays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    for (let i = 1; i <= numberOfDays; i++) {
        let today = new Date(LocalDate());
        const futureDate = new Date(today); // Create a new Date object to avoid modifying 'today'
        futureDate.setDate(today.getDate() + i);
        const dayName = weekdays[futureDate.getDay()];
        
        
        const date = new Date(futureDate);

        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");


        dates.push({ key: `${yyyy}-${mm}-${dd}`, label: futureDate.getDate(), weekday: dayName });
    }
    return dates;
}

export function convertTo12Hour(time24) {
    let [hour, minute] = time24.split(":");
    hour = parseInt(hour);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // convert 0 → 12
    return `${hour.toString().padStart(2, "0")}:${minute} ${ampm}`;
}
export function calculateTime(startTime, endTime) {
    const [sh, sm, ss] = startTime.split(':').map(Number);
    const [eh, em, es] = endTime.split(':').map(Number);

    const startMinutes = sh * 60 + sm + ss / 60;
    const endMinutes = eh * 60 + em + es / 60;

    let diffMinutes = endMinutes - startMinutes;

    // Handle overnight time (e.g. 22:00:00 → 06:00:00)
    if (diffMinutes < 0) {
        diffMinutes += 24 * 60;
    }

    const hours = Math.floor(diffMinutes / 60);
    const minutes = Math.floor(diffMinutes % 60);

    return { hours, minutes };
}
export function getMinutes(start, end) {
    const [sh, sm, ss] = start.split(':').map(Number);
    const [eh, em, es] = end.split(':').map(Number);

    // Convert start and end times to total minutes
    const startTotalMinutes = sh * 60 + sm + ss / 60;
    const endTotalMinutes = eh * 60 + em + es / 60;

    // Calculate difference in minutes
    let diffMinutes = endTotalMinutes - startTotalMinutes;

    return Math.floor(diffMinutes);
}
export function convertMinutesIntoHours(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
}

export function createDateSeries(startDate, endDate) {
    const dates = [];
    let current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
    }
    return dates;
}
export function isoToLocalTime(isoString) {
    const date = new Date(isoString); // convert ISO to Date
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}
export function isTimeGreater(time1, time2) {
    const [h1, m1, s1] = time1.split(':').map(Number);
    const [h2, m2, s2] = time2.split(':').map(Number);

    // Convert both times to total seconds
    const totalSeconds1 = h1 * 3600 + m1 * 60 + s1;
    const totalSeconds2 = h2 * 3600 + m2 * 60 + s2;

    // Compare
    return totalSeconds1 > totalSeconds2;
}

export function SortUpcomingAppointments(data) {
    let sortedArray = [...data]; // Create a copy to avoid mutating original data

    sortedArray.sort((a, b) => {
        const dateDiff = new Date(a.trndate) - new Date(b.trndate);
        if (dateDiff !== 0) return dateDiff;

        const [ah, am] = a.start.split(":").map(Number);
        const [bh, bm] = b.start.split(":").map(Number);
        return ah * 60 + am - (bh * 60 + bm);
    });
    return sortedArray;
};

export const getExtension = (file) => {
  if (!file) return "";

  const parts = file.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
};

export const checkIfPastOrToday = (dateString) => {
  const inputDate = new Date(dateString);
  const today = new Date();

  // remove time part (important!)
  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  if (inputDate > today) {
    return "future";   // e.g. 2026-04-08 when today is 2026-04-07
  } else if (inputDate.getTime() === today.getTime()) {
    return "today";
  } else {
    return "past";
  }
};
