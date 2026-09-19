import { Badge, Tooltip } from "antd"

const SideBarButton = ({ index, isOpen, icon, label, badge, content, onSelected }) => {

    return (
        <div key={index} onClick={() => onSelected(label)} class={` ${content === label ? 'bg-gray-50 text-blue-400' : ''} p-2 px-5 flex flex-row gap-4  items-center hover:bg-gray-50 hover:text-blue-400 cursor-pointer`}>
            <Tooltip placement="right" title={label} className="text-lg" >{icon}</Tooltip>
            <div class={`duration-150 ${!isOpen && 'scale-0'} whitespace-nowrap flex items-center justify-between w-full`}>
                <span class='text-sm'>{label}</span>
                {badge != null && <Badge count={badge} style={{ background: '#F5F5F5', color: 'black' }} />}
            </div>
        </div>
    )
}

export default SideBarButton