
import { updateField } from "../../common/general.jsx";
import { Tags,  Select,Calendar, Item, Button} from "../../controls/index.jsx"
import { useNavigate } from "react-router-dom";

const ServicesInfo = ({ form, setForm,servicesList,userList,options=[],isOpen,workingHours}) => {
    const navigate=useNavigate();  

    const serviceOptions = servicesList.map((service) => ({
        id: service.id,
        label: `${service.name} ($${service.price})`,
        name: service.name,
        value: service.id,
        price: service.price,
        minutes: service.minutes
    }));

    const employeeOptions = userList.map((employee) => ({
        id: employee.id,
        label: employee.fullname,
        value: employee.id
    }));

    
 
    return (
        <div className="h-[500px]">
            <div class='flex flex-col gap-4  md:flex-row'>
                <Item required label="Date" input={<Calendar value={form.trndate} onChange={(e) => updateField("trndate", e, setForm)} />} />
                <Select required label="Employee" value={form.uid} onChange={(e) => updateField("uid", e, setForm)} options={employeeOptions} isAdd={true} Permission="Employees" onAddClick={() => navigate('/Employee/Create')} />
            </div>
            <Select required isMulti label="Services" value={form.services} placeholder="All Services" onChange={(e) => updateField("services", e, setForm)} options={serviceOptions} isAdd={true} Permission="Services" onAddClick={() => navigate('/Services/Create')} />
            <div class='w-full flex flex-row gap-2 text-xs'>
                {isOpen === false ? <Tags dot title={"Business Closed"} color={"red"} /> :
                    workingHours.open === false ? <Tags dot title={"The Employee not available."} color={"red"} /> :
                       isOpen=== true && workingHours.open=== true  && options.map(opt =>
                            <div key={opt.key} class='flex flex-col gap-2'>
                                <p class='flex-row flex justify-center items-center '>{opt.label}</p>
                                {opt.slotList.length === 0 ? <p class='text-xs text-gray-500'>Empty</p> :
                                    opt.slotList.map(item => (
                                        <Button variant={form.slot === item.slot ? 'default':'secondary'} key={item.slot} className={form.slot === item.slot && 'border-cyan-500 text-cyan-500 border'}
                                            label={item.slot}
                                            // disabled={item.disabled}
                                            onClick={() => {
                                                 updateField("slot", item.slot, setForm);
                                                 updateField("starttime", item.start, setForm);
                                                 updateField("endtime", item.end, setForm);
                                            }}/>
                                    ))}
                            </div>
                        )
                }
            </div>
        </div>
    )
}

export default ServicesInfo