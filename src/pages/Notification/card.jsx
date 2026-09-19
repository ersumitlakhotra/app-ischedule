import {
    MessageCircle,
    Plus,
    Heart,
    Box,
    Users,
    X,
    Minus,
} from "lucide-react";
import { Image } from "../../controls";
import { UTC_LocalDateTime_relative } from "../../common/localDate";

const badgeConfig = {
    New: {
        icon: Plus,
        className: "bg-green-500",
    },
    Reschedule: {
        icon: Minus,
        className: "bg-orange-400",
    },
    Cancel: {
        icon: X,
        className: "bg-red-500",
    },
    comment: {
        icon: MessageCircle,
        className: "bg-violet-500",
    },
    generated: {
        icon: Box,
        className: "bg-yellow-500",
    },
    like: {
        icon: Heart,
        className: "bg-red-500",
    },
};

function NotificationBadge({ type }) {
    const config = badgeConfig[type];

    if (!config) return null;

    const Icon = config.icon;

    return (
        <div className={`absolute -bottom-0.5 -right-1
                flex h-5 w-5 items-center justify-center
                rounded-full border-2 border-white
                ${config.className}`}>
            <Icon className="h-3 w-3 text-white"  strokeWidth={2.5} />
        </div>
    );
}

export default function Card({ notification,userList }) {  

   const user = userList.find((o) => o.id.toString() === notification.uid.toString());
    const title = notification.option === "New" ? "New appointment booked" :
                    notification.option === "Reschedule" ? "Appointment rescheduled" :
                        notification.option === "Cancel" ? "Appointment cancelled" : "";

    return (
        <div className={`relative border-b border-gray-200 px-6 py-5 transition-colors duration-200 hover:bg-gray-50`}>
            <div className="flex gap-5">

                {/* Avatar */}
                <div className="relative shrink-0">
                    <Image
                        src={user?.profilepic || null}
                        name={user?.name || ''}
                        height="h-12"
                        width="w-12"
                        rounded="rounded-full"
                        className="flex-shrink-0 text-sm"
                    />

                    <NotificationBadge type={notification.option} />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 pr-3">
                    {/* Name + Time */}
                    <div className="flex items-center gap-2">
                        <span className="text-[16px] font-semibold text-gray-900">
                            {title}
                        </span>

                        <span className="text-xs text-gray-400">
                            {UTC_LocalDateTime_relative(notification.createdat, "MMM, DD YYYY - hh:mm A ")}
                        </span>
                    </div>

                    {/* Main text 
                    <div className="mt-2 text-[16px] leading-6 text-gray-900">
                        {notification.title}{" "}
                        {notification.project && (
                            <span className="font-semibold">
                                {notification.project}
                            </span>
                        )}
                    </div>*/}

                    {/* Description */}
                    {notification.message && (
                        <p className="mt-2  text-sm  text-gray-400">
                            {notification.message}
                        </p>
                    )}

                    {/* Accept / Decline */}
                    {notification.actions && (
                        <div className="mt-4 flex gap-2">
                            <button
                                type="button"
                                className="
                                    min-w-[118px]
                                    rounded-xl
                                    border border-gray-300
                                    bg-gray-100
                                    px-5 py-2.5
                                    text-[16px] font-medium
                                    text-gray-900
                                    shadow-sm
                                    transition
                                    hover:bg-gray-200
                                    active:scale-[0.98]
                                "
                            >
                                Decline
                            </button>

                            <button
                                type="button"
                                className="
                                    min-w-[118px]
                                    rounded-xl
                                    bg-gray-900
                                    px-5 py-2.5
                                    text-[16px] font-medium
                                    text-white
                                    shadow-md
                                    transition
                                    hover:bg-black
                                    active:scale-[0.98]
                                "
                            >
                                Accept
                            </button>
                        </div>
                    )}
                </div>

                {/* Unread dot */}
                {notification.unread && (
                    <div className="absolute right-6 top-8 h-2.5 w-2.5 rounded-full bg-gray-500" />
                )}
            </div>
        </div>
    );
}