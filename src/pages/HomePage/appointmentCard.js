
import AssignedTo from "../../common/assigned_to"
import { RiUserReceived2Line } from "react-icons/ri";
import { FiClock } from "react-icons/fi";
import { IoIosPhonePortrait } from "react-icons/io";
import Services from "../../common/services";
import FlexBoxRow from "../../common/custom/flexboxRow";
import { get_Date, getDay } from "../../common/localDate";
import { UnorderedListOutlined } from '@ant-design/icons';
import { useResponseButtons } from "../../components/Order/responseButton";

const AppointmentCards = ({ index, data, userList, servicesList, onClick, saveData }) => {
    const { Accept, Reject } = useResponseButtons(saveData);
    return (
        <div key={index} class={`border text-xs bg-gray-50 rounded-lg  mb-2 cursor-pointer hover:bg-gray-100 hover:shadow`}
            onClick={() => onClick(index)}>

            <div class="flex px-3 gap-3 items-center ">

                <div class="text-center">
                    <p class="text-sm text-gray-400">{get_Date(data.trndate, 'MMM')}</p>
                    <p class="text-2xl font-semibold text-gray-800">{get_Date(data.trndate, 'DD')}</p>
                    <p class="text-sm text-gray-400">{getDay(data.trndate, true)}</p>
                </div>

                <div class="h-16 w-px bg-gray-200"></div>

                <div className="flex-1">

                    <div className="flex justify-between items-center mt-3 ">
                        <FlexBoxRow icon={<RiUserReceived2Line size={16} />} label={<p class="text-xs font-medium text-gray-600 uppercase">{data.name}</p>} />
                        <FlexBoxRow icon={<FiClock size={16} />} label={data.slot} />

                    </div>
                    <div className="flex justify-between items-center ">
                        <div className="flex flex-col ">
                            <FlexBoxRow icon={<IoIosPhonePortrait size={16} />} label={data.cell} />
                            <FlexBoxRow icon={<UnorderedListOutlined size={16} />} label={<Services servicesItem={data.serviceinfo} servicesList={servicesList} />} />

                        </div>
                        <div class='flex flex-row gap-2 items-center justify-end sticky z-30'>
                            <Accept id={index}/>
                            <Reject id={index} />
                        </div>

                    </div>
                    <div className="flex justify-end items-center">
                        <AssignedTo key={data.id} userId={data.assignedto} userList={userList} imageHeight={20} imageWidth={20} AvatarSize={22} style="text-xs font-medium " isReverse={true} />
                    </div>

                </div>
            </div>



            {/*
            <div class='flex flex-row justify-between items-center mb-2'>
                <AssignedTo key={data.id} userId={data.assignedto} userList={userList} />
                <div class='flex flex-row gap-2 items-center justify-end sticky z-30'>
                    <Accept id={index} userList={userList} servicesList={servicesList} />
                    <Reject id={index} userList={userList} servicesList={servicesList} />
                </div>   
            </div>
            <FlexBoxRow icon={<FiClock size={12} />} label={`${getDay(data.trndate)} ${get_Date(data.trndate, 'MMMM DD, YYYY')} [ ${data.slot} ]`} />
            <FlexBoxRow icon={<ContactsOutlined size={12} />} label={`${data.name} : ${data.cell}`} />
            <FlexBoxRow icon={<UnorderedListOutlined size={12} />} label={<Services servicesItem={data.serviceinfo} servicesList={servicesList} />} />
*/}
        </div>
    )
}

export default AppointmentCards