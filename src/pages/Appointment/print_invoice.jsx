import { pdf } from "@react-pdf/renderer";
import FetchData from "../../hook/fetchData";
import Invoice from "./invoice_format";
import { getStorage } from "../../common/localStorage";

export const print_invoice = async (id) => {
  const response = await FetchData({
    endPoint: "appointment",
    id,
  }); 
  
  const companyresponse = await FetchData({
    endPoint: "company",
    id:(await getStorage())?.cid
  });

  const form = response.data;
  const company = companyresponse.data;

  const blob = await pdf(
    <Invoice form={form} company={company} />
  ).toBlob();

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${form.order_no}.pdf`;
  a.click();

  URL.revokeObjectURL(url);
};