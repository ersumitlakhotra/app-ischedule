import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import {  getExcelItem } from './items';
import dayjs from 'dayjs';
import { get_Date, UTC_LocalDateTime } from './localDate';
import { Button } from '../controls/index.jsx';
import { Download } from "lucide-react";

const ExportToExcel = ({ data, fileName, servicesList, userList }) => {
  const exportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(fileName);

    switch (fileName.toUpperCase()) {
      case 'APPOINTMENT': {
        worksheet.columns = [
          getExcelItem('Order', 10),
          getExcelItem('Customer_Name', 30),
          getExcelItem('Customer_Cell', 30),
          getExcelItem('Customer_Email', 30),
          getExcelItem('Date', 20),
          getExcelItem('Services', 50),
          getExcelItem('Rate', 20),
          getExcelItem('Status', 20),
          getExcelItem('Booked', 20),
          getExcelItem('Last_Modified', 30)
        ];
        data.forEach(item => {
          worksheet.addRow({
            Order: item.order_no,
            Customer_Name: item.name,
            Customer_Cell: item.cell,
            Customer_Email: item.email,
            Date: dayjs(item.trndate).format('DD MMM YYYY'),
            Services: item.services.map((o) => o.name).join(" | ").toString() ,
            Rate: `$ ${item.total}`,
            Status: item.status,
            Booked: userList.filter(user => user.id.toString() === item.uid.toString()).map(a => a.fullname).toString(),
            Last_Modified: UTC_LocalDateTime(item.modifiedat, 'DD MMM YYYY h:mm A'),
          });
        });
        break;
      }
      case 'DISCOUNT': {
        worksheet.columns = [
          getExcelItem('Name', 20),
          getExcelItem('Description', 50),
          getExcelItem('Services', 50),
          getExcelItem('Coupon', 20),
          getExcelItem('Discount', 20),
          getExcelItem('Start', 20),
          getExcelItem('End', 20),
          getExcelItem('Last_Modified', 30)
        ];
        data.forEach(item => {
          worksheet.addRow({
            Name: item.name,
            Description: item.description,
            Services: item.services.map((o) => o.name).join(" | ").toString(),
            Coupon: item.coupon,
            Discount: `${item.discounttype} ${item.discount}`,
            Start: dayjs(item.startdate).format('DD MMM YYYY'),
            End: dayjs(item.enddate).format('DD MMM YYYY'),
            Last_Modified: UTC_LocalDateTime(item.modifiedat, 'DD MMM YYYY h:mm A'),
          });
        });
        break;
      }
      case 'EXPENSE': {
        worksheet.columns = [
          getExcelItem('Date', 20),
          getExcelItem('Name', 20),
          getExcelItem('Quantity', 10),
          getExcelItem('Price', 20),
          getExcelItem('Tax', 20),
          getExcelItem('Amount', 20),
          getExcelItem('Notes', 50),
          getExcelItem('Last_Modified', 30)
        ];
        data.forEach(item => {
          worksheet.addRow({
            Date: UTC_LocalDateTime(item.trndate, "MMM DD,YYYY"),
            Name: item.name,
            Quantity: item.quantity,
            Price: `$ ${item.netamount}`,
            Tax: `$ ${item.taxamount}`,
            Amount: `$ ${item.grossamount}`,
            Notes: item.notes,
            Last_Modified: UTC_LocalDateTime(item.modifiedat, 'DD MMM YYYY h:mm A'),
          });
        });
        break;
      }
      case 'PAYMENT': {
        worksheet.columns = [
          getExcelItem('Date', 20),
          getExcelItem('User', 20),
          getExcelItem('Type', 10),
          getExcelItem('Net_Pay', 20),
          getExcelItem('Tax', 20),
          getExcelItem('Gross_Pay', 20),
          getExcelItem('Notes', 50),
          getExcelItem('Last_Modified', 30)
        ];
        data.forEach(item => {
          worksheet.addRow({
            Date: UTC_LocalDateTime(item.trndate, "MMM DD,YYYY"),
            User: userList.filter(user => user.id === item.assignedto).map(a => a.fullname).toString(),
            Type: item.ptype,
            Net_Pay: `$ ${item.netamount}`,
            Tax: `$ ${item.taxamount}`,
            Gross_Pay: `$ ${item.grossamount}`,
            Notes: item.notes,
            Last_Modified: UTC_LocalDateTime(item.modifiedat, 'DD MMM YYYY h:mm A'),
          });
        });
        break;
      }

      case 'CUSTOMERS': {
        worksheet.columns = [
          getExcelItem('Name', 30),
          getExcelItem('Email', 50),
          getExcelItem('Cell', 20),
          getExcelItem('Badge', 20),
          getExcelItem('Points', 20),
          getExcelItem('Last_Modified', 30)
        ];
        data.forEach(item => {
          worksheet.addRow({
            Name: item.name,
            Email: item.email,
            Cell: item.cell,
            Badge: item.badge,
            Points: item.points,
            Last_Modified: UTC_LocalDateTime(item.modifiedat, 'DD MMM YYYY h:mm A'),
          });
        });
        break;
      }
      case 'ERRORSLIST': {
        worksheet.columns = [
          getExcelItem('Name', 30),
          getExcelItem('Email', 50),
          getExcelItem('Cell', 20),
          getExcelItem('Status', 20),
          getExcelItem('Message', 100),
        ];
        data.forEach(item => {
          worksheet.addRow({
            Name: item.name,
            Email: item.email,
            Cell: item.cell,
            Status: item.error,
            Message: item.message,
          });
        });
        break;
      }
      case 'SERVICES': {
        worksheet.columns = [
          getExcelItem('Name', 30),
          getExcelItem('Category', 20),
          getExcelItem('Price', 20),
          getExcelItem('Time', 10),
          getExcelItem('Status', 20),
          getExcelItem('Last_Modified', 30)
        ];
        data.forEach(item => {
          worksheet.addRow({
            Name: item.name,
            Category:item.category1,
            Price: `$ ${item.price}`,
            Time: item.timing,
            Status: item.status,
            Last_Modified: UTC_LocalDateTime(item.modifiedat, 'DD MMM YYYY h:mm A'),
          });
        });
        break;
      }
      case 'EMPLOYEES': {
        worksheet.columns = [
          getExcelItem('Name', 30),
          getExcelItem('Cell', 20),
          getExcelItem('Email', 50),
          getExcelItem('Address', 50),
          getExcelItem('Gender', 10),
          getExcelItem('Username', 20),
          getExcelItem('Role', 10),
          getExcelItem('Account', 10),
          getExcelItem('Status', 10),
          getExcelItem('Last_Modified', 30)
        ];
        data.forEach(item => {
          worksheet.addRow({
            Name: item.fullname,
            Cell: item.cell,
            Email: item.email,
            Address: item.address,
            Gender: item.gender,
            Username: item.username,
            Role: item.role,
            Account: item.accounttype,
            Status: item.status,
            Last_Modified: UTC_LocalDateTime(item.modifiedat, 'DD MMM YYYY h:mm A'),
          });
        });
        break;
      }
       case 'INVENTORY': {
        worksheet.columns = [
          getExcelItem('Name', 30),
          getExcelItem('Description', 50),
          getExcelItem('Stock', 20),
          getExcelItem('Minimum', 20),
          getExcelItem('Maximum', 20),
          getExcelItem('SKU', 20),
          getExcelItem('Barcode', 20),
          getExcelItem('SellPrice', 20),
          getExcelItem('Last_Modified', 30)
        ];
        data.forEach(item => {
          worksheet.addRow({
            Name: item.name,
            Description: item.description,
            Stock: item.stock,
            Minimum: item.minstock,
            Maximum: item.maxstock,
            SKU: item.sku,
            Barcode: item.barcode,
            SellPrice: item.sellprice,
            Last_Modified: UTC_LocalDateTime(item.modifiedat, 'DD MMM YYYY h:mm A'),
          });
        });
        break;
      }       
      
      case 'SALES': { 
        worksheet.columns = [
          getExcelItem('User', 30),
          getExcelItem('Sales', 20),
          getExcelItem('Tip', 20),
          getExcelItem('Tax', 20),
          getExcelItem('Amount', 20),
        ];
        data.forEach(item => {
          worksheet.addRow({
            User: item.fullname,
            Sales: `$ ${item.sale}`,
            Tip: `$ ${item.tip}`,
            Tax: `$ ${item.tax}`,
            Amount: `$ ${item.result}`,
          });
        });
        break;
      
      }
      
      case 'MESSAGING': { 
        worksheet.columns = [
          getExcelItem('Date', 30),
          getExcelItem('To', 20),
          getExcelItem('Order_no', 20),
          getExcelItem('Message', 100),
          getExcelItem('Status', 20),
          getExcelItem('Remaining_Credit', 20),
        ];
        data.forEach(item => {
          worksheet.addRow({
            Date: UTC_LocalDateTime(item.createdat, 'DD MMM YYYY h:mm A'),
            To: item.to,
            Order_no: item.order_no,
            Message: item.message,
            Status: item.status,
            Remaining_Credit: `$ ${item.credit}`,
          });
        });
        break;
      
      }   
      case 'PAYMENTS': { 
        worksheet.columns = [
          getExcelItem('Invoice_no', 30),
          getExcelItem('Date', 20),
          getExcelItem('Amount', 20),
          getExcelItem('Processing_Fee', 20),
          getExcelItem('Sub_Amount', 20),
          getExcelItem('Tax', 20),
          getExcelItem('Tax_Amount', 20),
          getExcelItem('Total', 20),
          getExcelItem('Status', 20),
        ];
        data.forEach(item => {
          worksheet.addRow({
            Invoice_no: item.invoice,
            Date: UTC_LocalDateTime(item.trndate, 'DD MMM YYYY'),
            Amount: item.pricing,
            Processing_Fee: item.processingfee,
            Sub_Amount: item.subtotal,
            Tax: item.tax,
            Tax_Amount: item.taxamount,
            Total: item.totalamount,
            Status: item.status,
          });
        });
        break;
      
      }
      case 'COLLECTION': { 
        worksheet.columns = [
          getExcelItem('Order', 30),
          getExcelItem('Date', 30),
          getExcelItem('Price', 20),
          getExcelItem('Discount', 20),
          getExcelItem('Tax', 20),
          getExcelItem('Total', 20),
          getExcelItem('Received', 20),
          getExcelItem('Tip', 20),
          getExcelItem('Mode', 20),
          getExcelItem('Status', 20),
        ];
        let _price = 0;
        let _tax = 0;
        let _received = 0;
        let _discount = 0;
        let _tip = 0;
        let _total = 0;
        
           
        data.forEach(item => {
            _price += parseFloat(item.price);
            _tax += parseFloat(item.taxamount);
            _received += parseFloat(item.received);
            _discount += parseFloat(item.discount);
            _tip += parseFloat(item.tip);
            _total += parseFloat(item.total);

          worksheet.addRow({
            Order:`# ${item.order_no}`,
            Date: get_Date(item.trndate, 'DD MMM YYYY'),
            Price: item.price,
            Discount: item.discount,
            Tax: item.taxamount,
            Total: item.total,
            Received: item.received,
            Tip: item.tip,
            Mode: item.mode,
            Status: item.status
          });
        });

        const row = worksheet.addRow({
            Order:'Total',
            Date: '',
            Price: _price,
            Discount: _discount,
            Tax: _tax,
            Total: _total,
            Received: _received,
            Tip: _tip,
            Mode:'',
            Status: ''
          });

        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thick" },
            bottom: { style: "thick" },
          };
          cell.font = {
            bold:true
          }
}); 
        break;
      
      }
      default: { break; }
    }

    try {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, `${fileName}.xlsx`);
    } catch (error) {
      console.error('Error exporting Excel:', error);
    }
  };

  return (
     <Button variant="secondary" icon={Download} label={'Export'} onClick={exportExcel} />
  );
};

export default ExportToExcel;