import { Progress } from "antd";
const Performance = ({ key, label, value, total, strokeColor }) => {
    return (
        <div key={key} class='flex flex-col text-gray-500'>
            <div class='flex flex-row justify-between items-center'>
                <span class="text-sm font-medium ">{label}</span>
                <span class="text-sm ">{value} / {total}</span>

            </div>
            <Progress percent={value * 100 / total} showInfo={false} strokeColor={strokeColor} />
        </div>
    )
}
export default Performance;