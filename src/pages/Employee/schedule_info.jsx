import { updateField } from "../../common";
import { DateTime, Tags } from "../../controls/index.jsx";


const ScheduleInfo = ({form,setForm}) => {
    const days = Object.entries(form.timinginfo?.[0] || {}).map(([day, value]) => ({
        key:day,
        day: day.charAt(0).toUpperCase() + day.slice(1),
        start: value[0],
        end: value[1],
        working: value[2],
        breakon: value[3],
        breakoff: value[4],
    }));
    return (
        <div className="space-y-4">
            {days.map((item,index) => (
                <div key={index} className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
                    {/* Enable */}
                    <input type="checkbox" checked={item.working} className="h-5 w-5 accent-cyan-600"
                        onChange={(e) => updateField("timinginfo", [
                            {
                                ...form.timinginfo[0],
                                [item.key]: [
                                    form.timinginfo[0][item.key][0],
                                    form.timinginfo[0][item.key][1],
                                    e.target.checked,
                                    form.timinginfo[0][item.key][3],
                                    form.timinginfo[0][item.key][4],
                                ],
                            },
                        ], setForm)} />

                    {/* Day */}
                    <div className="w-32">
                        <p className="font-medium text-gray-700">{item.day}</p>
                    </div>

                      {/* Start */}
                    <div>
                        <DateTime label={"Start"} value={item.start} setValue={(e) => updateField("timinginfo", [{
                            ...form.timinginfo[0],
                            [item.key]: [
                                e,
                                form.timinginfo[0][item.key][1],
                                form.timinginfo[0][item.key][2],
                                form.timinginfo[0][item.key][3],
                                form.timinginfo[0][item.key][4],
                            ],
                        }], setForm)}
                        classLabel="mb-1  text-xs text-gray-500" />
                    </div> 

                    {/* End */}
                    <div>
                        <DateTime label={"End"} value={item.end} setValue={(e) => updateField("timinginfo", [{
                            ...form.timinginfo[0],
                            [item.key]: [
                                form.timinginfo[0][item.key][0],
                                e,
                                form.timinginfo[0][item.key][2],
                                form.timinginfo[0][item.key][3],
                                form.timinginfo[0][item.key][4],
                            ],
                        }], setForm)} 
                        classLabel="mb-1  text-xs text-gray-500" />
                    </div>

                    {/* Break */}
                    <div>
                        <DateTime label={"Break Start"} value={item.breakon} setValue={(e) => updateField("timinginfo", [{
                            ...form.timinginfo[0],
                            [item.key]: [
                                form.timinginfo[0][item.key][0],
                                form.timinginfo[0][item.key][1],
                                form.timinginfo[0][item.key][2],
                                e,
                                form.timinginfo[0][item.key][4],
                            ],
                        }], setForm)} 
                        classLabel="mb-1  text-xs text-gray-500" />
                    </div>

                    {/* Break off */}
                    <div>
                        <DateTime label={"Break End"} value={item.breakoff} setValue={(e) => updateField("timinginfo", [{
                            ...form.timinginfo[0],
                            [item.key]: [
                                form.timinginfo[0][item.key][0],
                                form.timinginfo[0][item.key][1],
                                form.timinginfo[0][item.key][2],
                                form.timinginfo[0][item.key][3],
                                e,
                            ],
                        }], setForm)}
                        classLabel="mb-1 text-xs text-gray-500"  />
                    </div>

                    <div className="ml-auto mt-2">
                         <Tags title={item.working?"Working" : "Day Off"}  color={item.working?"green":"red"} />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ScheduleInfo