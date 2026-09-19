import { pdf } from "@react-pdf/renderer";
import FetchData from "../../../hook/fetchData.js";
import Invoice from "./invoice_format.jsx";

export const print_invoice = async (id) => {
  const response = await FetchData({
    endPoint: "billing",
    id,
  }); 
  
const form = response.data;

  const blob = await pdf(
    <Invoice form={form} />
  ).toBlob();

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${form.invoice}.pdf`;
  a.click();

  URL.revokeObjectURL(url);
};