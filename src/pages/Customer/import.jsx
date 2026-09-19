
import  { useEffect, useRef, useState } from "react";
import { BriefcaseBusiness } from "lucide-react";
import {  Modal } from "../../controls/index.jsx";
import { HeaderModal, FooterModal, IsLoading } from "../../common/index.jsx";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { decryptId } from "../../common/general.jsx";
import BulkImportModal from "./import_info.jsx";
import ExcelJS from "exceljs";
import { getStorage } from "../../common/localStorage.js";

export const CustomerImport = () => {
    const navigate = useNavigate();
    const { refresh,saveData,getCustomer} = useOutletContext();
    const [isLoading, setIsLoading] = useState(false);
    const [list, setList] = useState([]);
    const [message, setMessage] = useState([]);
    const { Id } = useParams();
    const id = decryptId(Id);
    const contentRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const [errorList, setErrorList] = useState([]);

    useEffect(() => {
        Init();
    }, [refresh])

    const Init = async () => {
        setIsLoading(true);
        const Response = await getCustomer();
        setList(Response);
        setIsLoading(false);
    }

    const formatPhoneNumber = (value) => {
        // Remove everything except numbers
        const digits = String(value ?? "").replace(/\D/g, "");

        // Must have at least 10 digits
        if (digits.length < 10) {
            return {
                valid: false,
                value: "",
                error: "Phone number must contain at least 10 digits."
            };
        }

        // Take last 10 digits
        const phone = digits.slice(-10);

        return {
            valid: true,
            value: `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`,
            error: null
        };
    };

    const getFirstEmail = (value) => {
        if (!value) return "";

        let text = "";

        if (typeof value === "string" || typeof value === "number") {
            text = String(value);
        } else if (Array.isArray(value)) {
            text = value
                .map(item => item?.text || item?.value || item || "")
                .join(" ");
        } else if (typeof value === "object") {
            text =
                value.text ||
                value.hyperlink?.replace(/^mailto:/i, "") ||
                value.value ||
                "";
        }

        // Get the first email if multiple emails exist
        const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);

        return match ? match[0].trim() : text.trim();
    };

    const handleExcelUpload = async () => {
        if (!selectedFile) {
            setMessage(["Please select a file to import."]);
            return;
        }
        let values = [];
        let errors = []; 
        const localstorage = await getStorage(); 
        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(arrayBuffer);

            // Get first worksheet
            const worksheet = workbook.worksheets[0];

            const requiredColumns = ["name", "cell"];
            const optionalColumns = ["email"];

            const columnNumbers = {};

            worksheet.getRow(1).eachCell((cell, columnNumber) => {
                const value = String(cell.value ?? "").trim().toLowerCase();

                if ([...requiredColumns, ...optionalColumns].includes(value)) {
                    columnNumbers[value] = columnNumber;
                }
            });

            const missingColumns = requiredColumns.filter(
                (column) => !columnNumbers[column]
            );

            if (missingColumns.length > 0) {
                setMessage([`Excel file must contain: ${missingColumns.join(", ")} column(s).`]);
            } else {        
                // console.log("Sheet Name:", worksheet.name);
                worksheet.eachRow((row, rowNumber) => {
                    if (rowNumber === 1) return;

                    const nameData = (row.getCell(columnNumbers.name).value || "").trim();
                    const cellData = formatPhoneNumber(row.getCell(columnNumbers.cell).value);
                    const emailData = getFirstEmail(
                        columnNumbers.email
                            ? row.getCell(columnNumbers.email).value
                            : ""
                    );

                    if (nameData === '' || !cellData?.valid) {
                        errors.push({
                            name: nameData,
                            cell: cellData?.value,
                            email: emailData,
                            error: "Failed",
                            message: `Row ${rowNumber}: ${nameData === '' ? "Name is required." : cellData?.error}`
                        })
                    }
                    else {
                        const duplicate = list.find(o => o.cell === cellData?.value)
                        if (duplicate) {
                            errors.push({
                                name: nameData,
                                cell: cellData?.value,
                                email: emailData,
                                error: "Duplicate",
                                message: `Row ${rowNumber}: Duplicate entry. This value already exists in the list.`
                            })
                        }
                        else {
                            values.push({
                                cid: localstorage?.cid,
                                name: nameData,
                                email: emailData,
                                cell: cellData?.value,      
                            })
                        }
                    }
                });
                return { values, errors }
            }
        } catch (error) {
             setMessage([`Error reading Excel: ${error}`]);
        }
       return { values, errors }
    };
   
    const handleSubmit = async () => {
        setIsLoading(true)
        const result = await handleExcelUpload();
        setErrorList(result?.errors);

        {/* Save data */ }
        const res = result?.values.length > 0 &&
            await saveData({
                label: "Customers",
                endPoint: "import/customers",
                id: null,
                body: JSON.stringify({ customers: result?.values })
            });
                   
        setIsLoading(false)                           
        if (res && res.isSuccess && result?.errors.length === 0) {
            navigate(-1);
        }
        else
            setMessage([`${result?.values.length} customers imported successfully. ${result?.errors.length} customers could not be imported due to errors. Please see the list below.`])
    };
    

    const [step, setStep] = useState(1);
    const steps = [
        { id: 1, label: "Bulk Import", icon: BriefcaseBusiness, content: <BulkImportModal selectedFile={selectedFile} setSelectedFile={setSelectedFile} setError={setMessage} errorList={errorList}  /> }];

    const currentContent = steps.find(item => item.id === step)?.content;

    useEffect(() => {
        contentRef.current?.scrollTo({
            top: 0,
            behavior: "smooth", // optional
        });
    }, [step]);

    return (
        <Modal open={true} message={message} messageType="error" children={
            <>
                <HeaderModal
                    Title={`Bulk Import Customers`}
                    Description={`Upload file to import information to your infobase.`}
                    className="border-b border-gray-200"
                    onClick={() => navigate(-1)}
                />
                <IsLoading isLoading={isLoading} rows={10} input={
                    <>     
                        {/* Scrollable Content */}
                        <div ref={contentRef} className="flex-1 overflow-y-auto px-8 py-4">
                            <div className="space-y-6 px-8 ">
                                {currentContent}
                            </div>
                        </div>

                        <FooterModal
                            step={step}
                            totalSteps={steps.length}
                            completeLabel="Import"
                            onComplete={() => handleSubmit()}
                        />
                    </>
                } />
            </>
        } />
    );
};





