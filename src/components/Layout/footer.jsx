import { useNavigate } from "react-router-dom";
import { IsLoading } from "../../common/index.jsx";
import { FOOTER_ICONS } from "../../common/enum.jsx";
import { ButtonPermission } from "../../auth/protectedButton.js";

const AppIcon = ({ o }) => {
    const navigate = useNavigate();
    return (
        <ButtonPermission permission={o.permission} children={
            <div key={o.id} className="flex-1 min-w-[50px] max-w-[50px] " >
                <div className='flex flex-col items-center justify-center group relative '>
                    <div style={{ height: 58, width: 58 }}
                        className={`border  ${o.color} rounded-xl cursor-pointer flex justify-center items-center  hover:shadow group transition-all duration-300 ease-out hover:scale-125 hover:shadow-x `}
                        onClick={() => navigate(o.navigate)}>
                        <span className="group-hover:animate-spin"><o.icon color="white" size={20} /></span>
                    </div>
                    <span className='text-xs text-white font-medium absolute -top-2 opacity-0 group-hover:opacity-100 transition duration-300'>
                        {o.label}</span>
                </div>
            </div>
        } />
    )
}

const Footer = () => {
    return (
        <div className="sticky z-[90] bottom-0 w-full flex flex-row justify-center items-center pb-3  ">
            <div className='px-8 p-3 w-full md:w-auto bg-gray-500/50 inline-flex gap-6 shadow-md rounded-xl overflow-auto md:overflow-x-visible'>
                <IsLoading isLoading={false} input={FOOTER_ICONS.map((o) => <AppIcon o={o} />)} />
            </div>
        </div>
    )
}

export default Footer