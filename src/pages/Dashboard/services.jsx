import { useNavigate } from "react-router-dom";
import { EmptyState, IsLoading } from "../../common"
import { Button, Tooltip,  Badge } from "../../controls";
import { ButtonPermission } from "../../auth/protectedButton";
import {  ChevronRight } from "lucide-react";
import {  PieChartServices } from "./graph.jsx";

export const Services = ({
    isLoading,
    appointmentList,
    servicesList
}) => {
    const navigate = useNavigate();
  const serviceUsage = {};

appointmentList.forEach((appointment) => {
    let services = appointment.services || [];

    // PostgreSQL json[] can sometimes arrive as JSON strings
    services = services
        .map((service) => {
            if (typeof service === "string") {
                try {
                    return JSON.parse(service);
                } catch {
                    return null;
                }
            }

            return service;
        })
        .filter(Boolean);

    services.forEach((service) => {
        const id = service.id;

        if (!serviceUsage[id]) {
            serviceUsage[id] = {
                id: service.id,
                name: service.name,
                label: service.label,
                price: Number(service.price || 0),
                minutes: Number(service.minutes || 0),
                bookings: 0,
                revenue: 0,
                totalMinutes: 0
            };
        }

        serviceUsage[id].bookings += 1;
        serviceUsage[id].revenue += Number(service.price || 0);
        serviceUsage[id].totalMinutes += Number(service.minutes || 0);
    });
});

const allServices = Object.values(serviceUsage);

const sortedServices = [...allServices]
    .sort((a, b) => b.bookings - a.bookings);

    // Most used
const topServices = [
    ...sortedServices.slice(0, 5),
    ...(sortedServices.length > 5
        ? [{
            id: "other",
            name: "Other",
            label: "Other",
            bookings: sortedServices
                .slice(5)
                .reduce((sum, service) => sum + service.bookings, 0),
            revenue: sortedServices
                .slice(5)
                .reduce((sum, service) => sum + service.revenue, 0),
            totalMinutes: sortedServices
                .slice(5)
                .reduce((sum, service) => sum + service.totalMinutes, 0)
        }]
        : [])
];

// Least used
const totalBookings = allServices.reduce(
    (sum, service) => sum + service.bookings,
    0
);

const otherServicesWithPercentage = sortedServices.sort((a, b) => a.bookings - b.bookings).map((service) => ({
    ...service,
    percentage: totalBookings > 0
        ? Number(((service.bookings / totalBookings) * 100).toFixed(1))
        : 0
}));
// const topServiceLabels = topServices.map((service) => service.name);
// const topServiceSeries = topServices.map((service) => service.bookings);

    return (
        <IsLoading isLoading={isLoading} rows={10} input={
            servicesList.length === 0 ?
                <EmptyState
                    title="No Services"
                    buttonText={"Services"}
                    permission={"Services"}
                    onClick={() => navigate('/Services/Create')}
                    description="Get started by creating your first service. Once added, you'll be able to schedule, organize, and manage appointments with ease." /> :

                <div className="rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden mb-4" >

                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 shadow-sm">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Segmentation
                            </h2>
                            <p className="mt-1 text-xs text-gray-500">
                                Top and Least services from last 30 days
                            </p>
                        </div>

                        <ButtonPermission permission={`Services.Open`} children={
                            <Button variant="secondary" icon={ChevronRight} shape="circle" onClick={() => navigate('/Services')} />
                        } />
                    </div>

                    {/* Body */}
                    <div className="space-y-2 h-[500px]  ">
                     
                        <PieChartServices
                            services={topServices}
                            colors={[
                                "#0891b2",
                                "#6366f1",
                                "#8b5cf6",
                                "#ec4899",
                                "#f59e0b",
                                "#6b7280"
                            ]}
                        />
                         <div className="space-y-2 p-4 h-[180px] w-full flex flex-col overflow-y-scroll ">
                            {otherServicesWithPercentage.map((o) => {
                                return (
                                    <Tooltip key={o.id} placement="bottom"
                                        title={
                                            <div className="px-3 py-2 text-white">
                                                <div className="mt-1 text-xs ">
                                                    Bookings:
                                                    <span className="ml-2 font-semibold ">
                                                        {o?.bookings || 0}
                                                    </span>
                                                </div>

                                                <div className="text-xs ">
                                                    Revenue:
                                                    <span className=" ml-2 font-semibold text-green-600">
                                                        ${Number(o?.revenue || 0).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        }
                                        children={
                                            <div className="w-full flex  justify-between text-xs " >
                                                <Badge color={"sky"} text={o.name} className="text-xs font-normal w-4/12 items-start" />

                                                <div className="w-6/12 flex flex-row items-center  gap-2">
                                                    <div className="h-1 w-4/5  overflow-hidden rounded-full bg-gray-200">
                                                        <div className={`h-full rounded-full bg-sky-400`}
                                                            style={{
                                                                width: `${o.percentage ?? 0}%`,
                                                            }}
                                                        />
                                                    </div>

                                                    <span className="w-1/5 text-right text-gray-500">
                                                        {o.percentage ?? 0}%
                                                    </span>
                                                </div>

                                            </div>} />
                                )
                            })}
                     </div>

                    </div>

                </div>
        } />
    )
}