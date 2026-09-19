import { useEffect, useState } from "react";
import { updateField } from "../../common";

const columns = ["Open", "Create", "Edit","View",  "Import", "Export"];

const moduleTemplate = [
    { module: "Dashboard", permissions: ["Open"] },
    { module: "Appointment", permissions: ["Open", "Create", "Edit", "View","Export"] },
    { module: "Attendance", permissions: ["Open", "Create", "Edit", "View","Export"] },
    { module: "Calender", permissions: ["Open"] },
    { module: "Category", permissions: ["Create"] },
    { module: "Customers", permissions: ["Open", "Create", "Edit", "View", "Export"] }, 
    { module: "Discount", permissions: ["Open", "Create", "Edit", "View" , "Export"] },
    { module: "Employees", permissions: ["Open", "Create", "Edit", "Import"] },
    { module: "Inventory", permissions: ["Open", "Create", "Edit", "View", "Export"] }, 
    { module: "Item", permissions: ["Create", "Edit"] }, 
    { module: "Payment", permissions: ["Open", "Create", "Edit"] },  
    { module: "Services", permissions: ["Open", "Create", "Edit", "Export"] },
    { module: "Reports", permissions: ["Open", "Export"] },
    { module: "Setting", permissions: ["Open", "Edit"] },
];

const buildModules = (selectedPermissions = []) => {
    return moduleTemplate.map((module) => ({
        module: module.module,
        permissions: Object.fromEntries(
            module.permissions.map((permission) => [
                permission,
                selectedPermissions.includes(`${module.module}.${permission}`),
            ])
        ),
    }));
};

const PermissionInfo=({form,setForm})=> {

    const [modules, setModules] = useState(() =>
        buildModules(form.permissioninfo || [])
    );

    useEffect(() => {
        setModules(buildModules(form.permissioninfo || []));
    }, [form.permissioninfo]);

    const totalPermissions = modules.reduce(
        (count, m) => count + Object.keys(m.permissions).length,
        0
    );

    const selectedPermissions = modules.reduce(
        (count, m) =>
            count +
            Object.values(m.permissions).filter(Boolean).length,
        0
    );

    const togglePermission = (rowIndex, permission) => {
        const copy = [...modules];

        copy[rowIndex].permissions[permission] =
            !copy[rowIndex].permissions[permission];

        updatePermissionInfo(copy);
    };

    const toggleRow = (rowIndex) => {
        const copy = [...modules];

        const enabled = Object.values(copy[rowIndex].permissions).every(Boolean);

        Object.keys(copy[rowIndex].permissions).forEach((key) => {
            copy[rowIndex].permissions[key] = !enabled;
        });

        updatePermissionInfo(copy);
    };

  const toggleAll = (checked) => {
    const updated = modules.map((module) => ({
        ...module,
        permissions: Object.fromEntries(
            Object.keys(module.permissions).map((key) => [key, checked])
        ),
    }));

    updatePermissionInfo(updated);
};

    const updatePermissionInfo = (modules) => {
         setModules(modules);
        const permissionInfo = modules.flatMap((module) =>
            Object.entries(module.permissions)
                .filter(([_, checked]) => checked)
                .map(([permission]) => `${module.module}.${permission}`)
        );

        updateField("permissioninfo", permissionInfo, setForm)
    }

    return (

            <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex justify-between items-center mb-2">

                <div className="inline-flex gap-2 p-2">
                    <input type="checkbox" defaultChecked={false} className="h-5 w-5 accent-cyan-600" onChange={(e)=>toggleAll(e.target.checked)} />

                    {/* Day */}
                    <div className="w-32">
                        <p className="font-medium text-gray-700">Select All</p>
                    </div>
                </div>

                <div className="text-sm font-medium text-slate-600">
                    {selectedPermissions} / {totalPermissions} Permissions Selected
                </div>
            </div>

                {/* Table */}

                <div className="bg-white rounded-2xl border shadow-sm overflow-auto">

                    <table className="min-w-full">

                        <thead className="sticky top-0 bg-slate-50 border-b">

                            <tr>

                                <th className="sticky left-0 bg-slate-50 text-left px-6 py-4 font-bold border-r">
                                    Module
                                </th>

                                {columns.map((col) => (
                                    <th
                                        key={col}
                                        className="text-center px-6 py-4 font-semibold text-slate-600"
                                    >
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>

                            {modules.map((row, rowIndex) => (

                                <tr
                                    key={row.module}
                                    className="border-b hover:bg-slate-50 transition"
                                >

                                    <td
                                        className="sticky left-0 bg-white border-r px-6 py-4 font-semibold cursor-pointer"
                                        onClick={() =>
                                            toggleRow(rowIndex)
                                        }
                                    >
                                        {row.module}
                                    </td>

                                    {columns.map((permission) => (

                                        <td
                                            key={permission}
                                            className="text-center py-4"
                                        >
                                            {permission in row.permissions ? (

                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        row.permissions[
                                                            permission
                                                        ]
                                                    }
                                                    onChange={() =>
                                                        togglePermission(
                                                            rowIndex,
                                                            permission
                                                        )
                                                    }
                                                    className="h-5 w-5 accent-cyan-600 cursor-pointer"
                                                />

                                            ) : (

                                                <span className="text-slate-300">
                                                    —
                                                </span>

                                            )}
                                        </td>

                                    ))}

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>
            </div>

    );
}

export default PermissionInfo