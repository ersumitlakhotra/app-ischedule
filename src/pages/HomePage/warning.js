
import { RiErrorWarningLine } from "react-icons/ri";
import { GoStop } from "react-icons/go";
const Warning = ({type,description,onClick}) => {  
    return (
        <div className={`w-full p-3 mb-2 ${type === 'error' ?'bg-red-300 text-red-800' :'bg-orange-200 text-orange-800' }  rounded-xl text-sm  flex gap-2 items-center cursor-pointer hover:shadow  transition`}
            onClick={() => { onClick(); }}
        >
            {type === 'error' ?<GoStop size={24} /> :<RiErrorWarningLine size={24} />}
            <span dangerouslySetInnerHTML={{ __html: description }} />

        </div>
    )
}


export default Warning