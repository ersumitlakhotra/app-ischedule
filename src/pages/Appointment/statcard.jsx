import { ChevronRight } from "lucide-react";

export const StatCard=({
  title,
  value,
  subValue,
  percentage,
  progress,
  isprogress=true,
  active,
  onClick
})=> {
  return (
    <div
      className={`rounded-2xl p-5 transition-all duration-700 shadow-lg hover:shadow-2xl cursor-pointer ${active
        ? "bg-sky-600 text-white"
        : "bg-white text-gray-900 border border-gray-100"
        }`}
         onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <p
          className={`text-sm font-medium ${
            active ? "text-white/90" : "text-gray-500"
          }`}
        >
          {title}
        </p>

        <button
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            active
              ? "bg-white/15 hover:bg-white/25"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <ChevronRight
            size={16}
            className={active ? "text-white" : "text-gray-600"}
          />
        </button>
      </div>

      <div className="mt-2 flex items-end justify-between">
        <div className="flex items-end gap-2">
          <h2 className="text-4xl font-bold">{value}</h2>

          <span
            className={`pb-1 text-sm ${
              active ? "text-white/80" : "text-gray-500"
            }`}
          >
            {subValue}
          </span>
        </div>

        {percentage && (
          <span
            className={`text-sm font-semibold ${
              active ? "text-white" : "text-sky-600"
            }`}
          >
            {percentage}
          </span>
        )}
      </div>
      
      {isprogress &&
        <div
          className={`mt-5 h-2 overflow-hidden rounded-full ${active ? "bg-white/20" : "bg-gray-200"
            }`}
        >
          <div
            className={`h-full rounded-full ${active ? "bg-white" : "bg-sky-600"
              }`}
            style={{ width: `${progress}%` }}
          />
        </div>}
    </div>
  );
}