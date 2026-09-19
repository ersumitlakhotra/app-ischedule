import { useMemo, useState } from "react";
import { StarBadge } from "../../common";

const alphabet = ["All", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

export default function AsideList({
    filteredCustomers=[],
    activeLetter,
    setActiveLetter,
    selectedCustomer,
    onSelect,
    setSelectedCustomer
}) {

    return (
        <div className="flex h-full w-full overflow-hidden border-r bg-white lg:w-96">
            {/* Alphabet */}
            <div className="flex w-10 flex-col items-center overflow-y-auto border-r bg-gray-50 py-2">
                {alphabet.map((letter) => (
                    <button
                        key={letter}
                        onClick={() => {setActiveLetter(letter);setSelectedCustomer(null)}}
                        className={`mb-1 flex items-center justify-center rounded-full text-[10px] font-semibold transition ${
                            activeLetter === letter
                                ? "bg-sky-600 text-white"
                                : "text-gray-500 hover:bg-blue-100"
                        } ${
                            letter === "All"
                                ? "h-7 w-7 text-[9px]"
                                : "h-6 w-6"
                        }`}
                    >
                        {letter}
                    </button>
                ))}
            </div>

            {/* Customer List */}
            <div className="flex flex-1 flex-col">
                {/* Header */}
                <div className="sticky top-0 z-10 border-b bg-gray-100 px-4 py-3">
                    <h2 className="text-sm font-semibold text-gray-700">
                        {activeLetter === "All"
                            ? "All Customers"
                            : `Customers - ${activeLetter}`}
                    </h2>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => {
                            const selected =
                                selectedCustomer?.id === customer.id;

                            return (
                                <button
                                    key={customer.id}
                                    onClick={() => onSelect?.(customer)}
                                    className={`flex w-full items-center gap-3 border-b px-4 py-3 text-left transition ${
                                        selected
                                            ? "bg-blue-50"
                                            : "hover:bg-gray-50"
                                    }`}
                                >
                                    {/* Avatar */}

                                    {customer.badge?.trim() ? (
                                        <StarBadge name={customer.badge.trim()} size="sm" />
                                    ) : (<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
                                        {(customer.name || "?")
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>)}

                                    {/* Info */}
                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate font-medium text-gray-900">
                                            {customer.name}
                                        </h3>

                                        <p className="truncate text-sm text-gray-500">
                                            {customer.email ||
                                                customer.phone ||
                                                ""}
                                        </p>
                                    </div>

                                    {/* Optional status indicator */}
                                    <div
                                        className={`h-3 w-3 rounded-full ${
                                            customer.active
                                                ? "bg-green-500"
                                                : "bg-gray-300"
                                        }`}
                                    />
                                </button>
                            );
                        })
                    ) : (
                        <div className="flex h-full items-center justify-center p-8 text-center">
                            <div>
                                <div className="mb-2 text-lg font-medium text-gray-700">
                                    No Customers
                                </div>

                                    <p className="text-sm text-gray-500">
                                        No customers found
                                        {activeLetter !== "All" && (
                                            <>
                                                {" "}starting with{" "}
                                                <span className="font-semibold">{activeLetter}</span>.
                                            </>
                                        )}
                                    </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}