import { Avatar, Image } from "antd";
import { UserOutlined } from '@ant-design/icons';

const AssignedTo = ({ userId, userList, style = 'font-bold', imageWidth = 31, imageHeight = 31, AvatarSize = 30, allowText = true, preview = true ,stopPropagation = true, isReverse=false}) => {
    if (userId === '0') {
        return '';
    }
    else if (userId === -1)
    {
        return (
        <div key={userId} class={`flex ${isReverse ? 'flex-row-reverse' : 'flex-row'} gap-2 items-center`}>
            <Avatar size={AvatarSize} style={{ backgroundColor: 'whitesmoke' }} icon={<UserOutlined style={{ color: 'black' }} />} />   
            {allowText && <span class={`text-sm  text-nowrap whitespace-nowrap ${style} `}>Any</span>}
        </div> 
        )
    }
    else {
        return (
            userList.filter(user => user.id === userId).map(a =>
                <div key={a.id} className={`flex ${isReverse ? 'flex-row-reverse' : 'flex-row'} gap-2 items-center`}>
                    {a.profilepic !== null ?
                     <div className="flex items-center" onClick={(e) => stopPropagation && e.stopPropagation()}>
                        <Image width={imageWidth} height={imageHeight} src={a.profilepic} style={{ borderRadius: 15 }} preview={preview}  />   </div>:
                        <Avatar size={AvatarSize} style={{ backgroundColor: 'whitesmoke' }} icon={<UserOutlined style={{ color: 'black' }} />} />
                    }
                    {allowText && <span class={`text-sm  text-nowrap whitespace-nowrap ${style} `}>{a.fullname}</span>}
                </div>
            ))
    }
}
export default AssignedTo;