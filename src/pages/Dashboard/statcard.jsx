import { IsLoading } from "../../common";

export const StatCard=({
  index,
  title,
  value,
  sign,
  color,
  chart,
  icon: Icon,
  isLoading,
  onClick
})=> {

  return (
    <div onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl py-2 border border-gray-200 bg-white cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
    >

      {/* Animated Background */}
      <div className={`absolute inset-0 z-0 origin-top-left transition-transform duration-700 ease-in-out`}/>
 
      <IsLoading isLoading={isLoading} rows={5} input={
        <>
          <div className="flex items-center justify-between px-4 mt-2 text-gray-500">

            <div className="flex flex-row items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-2xl
                    transition-all duration-500 text-white
                    ${color}`}>
                {Icon && <Icon size={16}  />}
              </div>
              <p className={`text-sm font-medium `}>{title}</p>
            </div>

            <span className={`text-sm font-semibold `}>
              {sign} {value}
            </span>

          </div>

          {chart}
        </>
      } />
    </div>
  );
}