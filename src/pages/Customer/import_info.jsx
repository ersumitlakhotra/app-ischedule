import React, { useRef, useState } from "react";
import { CustomTable, Tags } from "../../controls";
import { Header } from "../../common";


const BulkImportModal = ({selectedFile, setSelectedFile,setError,errorList}) => {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const allowedExtensions = [".csv", ".xlsx", ".xls"];
    const maxFileSize = 100 * 1024 * 1024; // 100MB

    const headers = [
    {
        label: "Status",
        render: (row) => <Tags title={row.error} color="red"/>,
    },
    {
        label: "Name",
        render: (row) => (row.name === "" ? <Tags title="Missing" color="red" dot /> : <span>{row.name}</span>),
    },
    {
        label: "Cell",
        render: (row) => (row.cell === "" ? <Tags title="Missing" color="red" dot /> : <span>{row.cell}</span>),
    },
    {
        label: "Message",
        render: (row) => (
            <span className="text-red-400">{row.message}</span>
        ),
    },  
];

    const validateFile = (file) => {
        setError([]);

        if (!file) return;

        const extension = "." + file.name.split(".").pop().toLowerCase();

        if (!allowedExtensions.includes(extension)) {
            setError(["Please select a CSV, XLSX, or XLS file."]);
            return;
        }

        if (file.size > maxFileSize) {
            setError(["File size must not exceed 100MB."]);
            return;
        }

        setSelectedFile(file);
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        validateFile(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        validateFile(file);
    };

    const removeFile = () => {
        setSelectedFile(null);
        setError([]);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

 
    return (
        <div >
            <div className="mb-3 rounded-md bg-cyan-50 border border-cyan-200 p-3 text-sm text-gray-700">
                <p className="font-medium text-cyan-700 mb-1">
                    Required Excel Columns
                </p>
                <ul className="list-disc list-inside mt-1">
                    <li>Name</li>
                    <li>Cell</li>
                </ul>
            </div>

          
            {/* Drop Zone */}
            <div onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
            }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => {
                    if (!selectedFile) {
                        fileInputRef.current?.click();
                    }
                }}
                className={`
                        mt-4 flex min-h-[270px] cursor-pointer flex-col
                        items-center justify-center rounded-[16px]
                        border-2 border-dashed px-6 
                        transition
                        ${isDragging
                        ? "border-[#087f7f] bg-[#f0fbfb]"
                        : "border-[#087f7f] bg-white hover:bg-[#f8fcfc]"
                    }
                    `}
            >

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {selectedFile ? (
                    <>
                        {/* File icon */}
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e5f5f5] text-[#087878]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-7 w-7"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14 2v6h6M8 13h8M8 17h5"
                                />
                            </svg>
                        </div>

                        <p className="max-w-full truncate text-center text-lg font-semibold text-gray-700">
                            {selectedFile.name}
                        </p>

                        <p className="mt-1 text-sm text-gray-400">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeFile();
                            }}
                            className="mt-4 text-sm font-semibold text-red-500 hover:text-red-600"
                        >
                            Remove file
                        </button>
                    </>
                ) : (
                    <>
                        {/* Upload Icon */}
                        <div className="mb-5 text-[#087878]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 16V4"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8 8l4-4 4 4"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 12v6a2 2 0 002 2h10a2 2 0 002-2v-6"
                                />
                            </svg>
                        </div>

                        <p className="text-[20px] font-semibold text-[#263238]">
                            Drag CSV file to import
                        </p>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                            }}
                            className="mt-4 flex items-center gap-2 rounded-xl bg-[#087878] px-5 py-3 text-[17px] font-semibold text-white shadow-sm transition hover:bg-[#066969]"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 3v12m0 0l-4-4m4 4l4-4"
                                />
                            </svg>
                            Browse Files
                        </button>

                        <p className="mt-16 text-[15px] font-medium text-[#628696]">
                            Max file size: 100MB. Supported file types: .csv, .xlsx, .xls
                        </p>
                    </>
                )}
            </div>    
            {errorList.length > 0 &&
                <div className="space-y-2 mt-3">               
                     <Header Title={"ErrorsList"} ExportList={errorList} />
                    <CustomTable headers={headers} data={errorList} />
                </div>
            }
        </div>
    );
};

export default BulkImportModal;