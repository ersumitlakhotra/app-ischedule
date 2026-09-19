import { useNavigate } from "react-router-dom";
import { AppIconsMini } from "../../common/custom/appIcons"
import { IsLoading, PageHeader } from "../../common/index.jsx";
import AppIconsPermission from "../../common/custom/appIconsPermission";

const Footer = () => {
     const navigate = useNavigate();
     const { apps} = AppIconsPermission('20px',20);
    return ( 
        <div class="sticky z-40 bottom-0 w-full flex flex-row justify-center items-center pb-3  ">
            <div class='px-8 p-3 w-full md:w-auto bg-gray-500/50 inline-flex gap-6 shadow-md rounded-xl overflow-auto md:overflow-x-visible'>
            <IsLoading isLoading={false} input={
                apps.filter(active => active.isVisible).map((items, index) => {
                    return (
                        <AppIconsMini size={56} key={index} icon={items.icon} label={items.label} backgroundColor={items.color} onClick={() => navigate(items.navigate)} />
                    )
                })}
            />
            </div>
        </div>
    )
}

export default Footer