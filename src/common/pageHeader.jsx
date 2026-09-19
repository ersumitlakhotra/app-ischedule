import ExportToExcel from "./export.js"
import { ChevronLeft, Pencil, Plus } from "lucide-react";
import { Button } from "../controls/index.jsx";
import { ButtonPermission} from "./../auth/protectedButton.js"
import { useNavigate } from "react-router-dom";

export const PageHeader = ({ label, isCreate, exportName, exportList, isExport, servicesList, userList, onClick,customButton = null,btnLabel=null }) => {
    return (
        <div class='flex items-center justify-between'>
             <h1 className="text-3xl font-bold">{label}</h1>
            <div class="flex gap-2 ">
                {customButton !== null && customButton}
                {isExport && <ExportToExcel data={exportList} fileName={exportName} servicesList={servicesList} userList={userList} />}
                {isCreate && <Button variant="primary" icon={Plus} label={'Create '+label} onClick={onClick} />
               /* <Button type="primary" icon={<PlusOutlined />} size="large" onClick={onClick}>{btnLabel === null ?`Create ${label}` : btnLabel} </Button>*/
                }
            </div>
        </div>
    )
}

export const Header = ({
    Title,
    Permission,
    AddButton,
    IsExport=true,
    ExportList,
    onClick,
    Extra,
    servicesList=[],
    userList=[]
}) => {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold">{Title}</h1>
            <div className="flex items-center gap-3">
                {Extra}
                {
                    IsExport &&
                    <ButtonPermission permission={`${Permission}.Export`} children={
                        <ExportToExcel
                            data={ExportList}
                            fileName={Title}
                            servicesList={servicesList} userList={userList} />} />
                } 
                {
                    AddButton && 
                    <ButtonPermission permission={`${Permission}.Create`} children={
                        <Button
                            variant="primary"
                            icon={Plus}
                            label={"Create "+AddButton}
                            onClick={onClick}
                        />} />
                   
                }
            </div>
        </div>
    );
};


export const ViewHeader = ({
    Title,
    Description,
    Permission,
    EditButton,
    AddButton,
    onClick,
    Extra,
    className=''
}) => {
    const navigate=useNavigate();
    return (
        <div className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-5 border-b border-gray-200 ${className}`}>
            <div className="flex items-center gap-4">
                <Button variant="secondary" shape="circle" icon={ChevronLeft} label="Back" onClick={() => navigate(-1)}/>
                <div className="flex flex-col items-start ">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {Title}
                    </h2>
                    {Description && (<span className="text-xs font-medium text-gray-400">{Description}</span>)}
                </div>
            </div>
            <div className="flex items-center gap-3">
                {Extra}              
                {
                    EditButton && 
                    <ButtonPermission permission={`${Permission}.Edit`} children={
                        <Button
                            variant="secondary"
                            icon={Pencil}
                            label={"Edit "+EditButton}
                            onClick={onClick}
                        />} />
                   
                }
                {AddButton}  
                
            </div>
        </div>
    );
};