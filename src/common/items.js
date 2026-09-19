
import { Tag } from 'antd';
import dayjs from 'dayjs';

export function getItem(key, label, value) {
    return { key, label, value };
}
export function getTabItems  (key, label,icon, children)  {
    return { key, label, icon, children };
};

export function getTableItem(key, label, sort, setSort) {
    return { key, label, sort, setSort };
} 

export function getExcelItem(header, width) {
    return { key:header, header, width };
} 

export function getDate(dateTime) {
    return dayjs(dateTime).format('DD MMM YYYY h:mm A')
}
export function customLabelTab (label, tagColor, tagValue,isVisible=true) {
    return (
        <div class='flex flex-row gap-2 items-center'>
            <p>{label}</p>
            {isVisible && <Tag color={tagColor}>{tagValue}</Tag>}
        </div>
    )
}
export function getBorder (value) {
    switch (value.toUpperCase()) {
        case 'PENDING':
        case 'UPCOMING':
            return 'border-s-yellow-500 bg-yellow-100 text-yellow-600';
        case 'IN PROGRESS':
            return 'border-s-blue-500 bg-blue-100 text-blue-600 ';
        case 'COMPLETED':
        case 'LIVE':
            return 'border-s-green-500 bg-green-100  text-green-600';
        case 'CANCELLED':
        case 'PAST':
        case 'REJECTED':
            return 'border-s-red-500 bg-red-100 text-red-600';
        case 'AWAITING':
            return 'border-s-gray-400 bg-gray-300 text-black';
        default:
            return 'border-s-gray-400 bg-grey-300 text-gray-600';
    }
}
export function getTag  (value, name) {
    const index = Date.now().toString() + Math.floor(Math.random() * 1000);
    switch (value.toUpperCase()) {
        case 'PENDING':
        case 'UPCOMING':
            return <Tag key={index}  color='yellow' bordered={false}>{name}</Tag>;
        case 'IN PROGRESS':
        case 'WORKING':
            return <Tag key={index} color='blue' bordered={false}>{name}</Tag>;
        case 'COMPLETED':
        case 'LIVE':
            return <Tag key={index} color='green' bordered={false}>{name}</Tag>;
        case 'CANCELLED':
        case 'PAST':
        case 'OFF':
        case 'REJECTED':
            return <Tag key={index} color='red' bordered={false}>{name}</Tag>;
        default:
            return <Tag key={index} color='gray' bordered={false}>{name}</Tag>;
    }
}
