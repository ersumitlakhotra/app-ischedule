import { Button, CustomTable, Tabs } from "../../controls/index.jsx"
import { useNavigate } from "react-router-dom";
import { EmptyState, IsLoading, StarBadge } from "../../common/index.jsx";
import {
    Award,
    Gift,
    Users,
    CalendarDays,
    Pencil,
    Plus,
} from "lucide-react";
import { UTC_LocalDateTime } from "../../common/localDate.js";
import { encryptId } from "../../common/general.jsx";
import { ButtonPermission } from "../../auth/protectedButton.js";
import {GiftCard} from "../GiftCard/giftcard.jsx";

export default function Card({
    id,
    form,
    isLoading,
    headers,
    rewardHeader,
    appointments,
    userList,
}) {

    const navigate = useNavigate();

    const appointmentList = appointments.filter((o) => o.custid === id || 0)
    const referralList = appointments.filter((o) => o.referral === id || 0)
    const pointsList = appointments.filter(
        (o) =>
            (
                String(o.custid) === String(id) ||
                (
                    Number(o.referralpoints || 0) > 0 &&
                    String(o.referral) === String(id)
                )
            )
    ).sort((a, b) => new Date(a.trndate) - new Date(b.trndate))
        .reduce((acc, o) => {

            let transactionPoints = 0;

            // Customer's own appointment
            if (String(o.custid) === String(id)) {
                transactionPoints =
                    Number(o.points || 0) +
                    Number(o.badgepoints || 0) +
                    Number(o.punchpoints || 0) +
                    Number(o.pointsused || 0);
            }

            // Referral reward
            else if (
                Number(o.referralpoints || 0) > 0 &&
                String(o.referral) === String(id)
            ) {
                transactionPoints =
                    Number(o.referralpoints || 0);
            }

            // Don't include transactions with zero points
            if (transactionPoints === 0) {
                return acc;
            }

            const previousTotal =
                acc.length > 0
                    ? acc[acc.length - 1].totalpoints
                    : 0;

            acc.push({
                ...o,
                totalpoints: previousTotal + transactionPoints,
                isReferral: String(o.referral) === String(id),
            });

            return acc;
        }, [])
        .reverse();

    const tabs = [
        {
            id: 1,
            label: "Appointments",
            badge: appointmentList.length,
            content: (
                <IsLoading isLoading={isLoading} rows={10} input={
                    appointmentList.length === 0 ?
                        <EmptyState
                            title="No Appointment"
                            buttonText={"Appointment"}
                            permission={"Appointment"}
                            onClick={() => navigate('/Appointment/Create')}
                            description="Book an appointment by choosing the customer, services, preferred date and time, and completing any required payment information." />
                        : <CustomTable headers={headers} data={appointmentList} rowsPerPage={10} />
                } />
            ),
        },
        {
            id: 2,
            label: "Gift Cards",
            badge:(form.giftcard || []).length,
            varient: 'alert',
            content: (
                <div class="w-full flex flex-wrap justify-center md:justify-start gap-8">
                    <IsLoading isLoading={isLoading} rows={10} input={
                        (form.giftcard || []).length === 0 ?
                            <EmptyState
                                title="No Gift Card"
                                buttonText={"Gift Card"}
                                permission={"Customers"}
                                onClick={() => navigate('/Gift/Create/' + encryptId(id))}
                                description="Create gift cards with custom values and validity periods to offer customers a flexible gifting option." /> :
                                form.giftcard.map((item, index) => <GiftCard key={index} item={item} custid={form.id} navigate={navigate} userList={userList} />
                            )} />
                </div>
            ),
        },
        
        {
            id: 3,
            label: "Rewards",
            content: (
                <IsLoading isLoading={isLoading} rows={10} input={
                    pointsList.length === 0 ?
                        <EmptyState
                            title="No Rewards points"
                            description="Customers can earn reward points through purchases, referrals, and other eligible activities."
                             />
                        : <CustomTable headers={rewardHeader} data={pointsList} rowsPerPage={10} />
                } />
            ),
        },

        {
            id: 4,
            label: "Referral",
            badge: referralList.length,
            content: (
                 <IsLoading isLoading={isLoading} rows={10} input={
                    referralList.length === 0 ?
                        <EmptyState
                            title="No Referral"
                            description="Your referral activity will appear here once someone joins using your referral."
                             />
                        : <CustomTable headers={headers} data={referralList} rowsPerPage={10} />
                } />
            ),
        },
    ];

    return (
        <div className="p-6">
            <IsLoading isLoading={isLoading} rows={20} input={
                <>
                    <div class='flex flex-col md:flex-row gap-4 md:items-center md:justify-between '>
                        <div class='flex flex-row gap-4 items-center '>
                            <StarBadge name={form.badge} size="sm" />
                            <div >
                                <span class="text-2xl font-bold text-gray-800">{form.name}</span>
                                <span class="flex text-xs text-gray-500">{form.cell} / {form.email}</span>
                            </div>
                        </div>
                         <div class='flex flex-row gap-4 items-center '>
                            <ButtonPermission permission={`Customers.Edit`} children={
                                <Button
                                    variant="secondary"
                                    icon={Pencil}
                                    label={"Edit"}
                                    onClick={() => navigate('/Customers/Edit/' + encryptId(id))}
                                />} />

                            <ButtonPermission permission={`Customers.Create`} children={
                                <Button
                                    variant="primary"
                                    icon={Plus}
                                    label={"Gift Card"}
                                    onClick={() => navigate('/Gift/Create/' + encryptId(id))}
                                />} />
                        </div>
                    </div>               
                                               
                    <div className="my-6 flex flex-col gap-2 border border-s-4 border-s-sky-600 bg-white p-4">
                        <span className="text-xs text-gray-400">Current Status</span>

                        <div className="flex items-center gap-2">
                            <Award size={18} className="text-amber-500" />
                            <span className="text-xs text-gray-800 capitalize">
                                {form.badge?.trim() ? `${form.badge} Badge` : "None"}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Gift size={18} className="text-green-500" />
                            <span className="text-xs text-gray-800">
                                {form.points} Rewards Points
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Users size={18} className="text-blue-500" />
                            <span className="text-xs text-gray-800">
                                {referralList.length} Referral{referralList.length !== 1 ? "s" : ""}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <CalendarDays size={18} className="text-gray-500" />
                            <span className="text-xs text-gray-800">
                                Joined - {UTC_LocalDateTime(form.createdat, "MMMM, DD YYYY")}
                            </span>
                        </div>
                    </div>
                    <Tabs tabs={tabs} className={"overflow-y-auto h-[56vh]  "} />

                </>} />
        </div>
    )
}
