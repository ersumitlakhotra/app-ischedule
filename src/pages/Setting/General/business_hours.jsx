import { Button, Textbox, Select, DateTime, Tags } from "../../../controls/index.jsx";
import { updateField, canadaRegions, usStates } from "../../../common/general.jsx";
import { CellFormat } from "../../../common/validate.jsx";
import { Header } from "../rightside.jsx";

export default function BusinessHours({ form, setForm ,saveData,saveButton=true}) {
    const days = Object.entries(form.timinginfo?.[0] || {}).map(([day, value]) => ({
        key: day,
        day: day.charAt(0).toUpperCase() + day.slice(1),
        start: value[0],
        end: value[1],
        working: value[2]
    }));

    return (
       
            <div className="space-y-1  mb-4 ">
                <Header title={'Business Hours'} description={'Set your regular business operating hours.'} saveData={saveData}
                 formBody={JSON.stringify({timinginfo:form.timinginfo})} saveButton={saveButton}  />
                {days.map((item, index) => (
                    <div key={index} className="flex flex-wrap items-center gap-4  border-b border-gray-100  px-4 py-2">
                        {/* Enable */}
                        <input type="checkbox" checked={item.working} className="h-5 w-5 accent-cyan-600"
                            onChange={(e) => updateField("timinginfo", [
                                {
                                    ...form.timinginfo[0],
                                    [item.key]: [
                                        form.timinginfo[0][item.key][0],
                                        form.timinginfo[0][item.key][1],
                                        e.target.checked,
                                    ],
                                },
                            ], setForm)} />

                        {/* Day */}
                        <div className="w-32">
                            <p className="font-medium text-gray-700">{item.day}</p>
                        </div>

                        {/* Start */}
                        <div>
                            <DateTime label={""} value={item.start} setValue={(e) => updateField("timinginfo", [{
                                ...form.timinginfo[0],
                                [item.key]: [
                                    e,
                                    form.timinginfo[0][item.key][1],
                                    form.timinginfo[0][item.key][2],
                                ],
                            }], setForm)}
                                classLabel="mb-1  text-xs text-gray-500" />
                        </div>

                        {/* End */}
                        <div>
                            <DateTime label={""} value={item.end} setValue={(e) => updateField("timinginfo", [{
                                ...form.timinginfo[0],
                                [item.key]: [
                                    form.timinginfo[0][item.key][0],
                                    e,
                                    form.timinginfo[0][item.key][2],
                                ],
                            }], setForm)}
                                classLabel="mb-1  text-xs text-gray-500" />
                        </div>
                   
                        <div className="ml-auto mt-2">
                            <Tags title={item.working ? "Open" : "Closed"} color={item.working ? "green" : "red"} />
                        </div>
                    </div>
                ))}
            </div>
    )
}