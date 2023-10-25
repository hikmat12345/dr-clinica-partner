import * as XLSX from "xlsx";

export const ExportToExcel = (data, fileName) => {
  const wb = XLSX.utils.book_new(),
    ws = XLSX.utils.json_to_sheet(data);

  XLSX.utils.book_append_sheet(wb, ws, fileName);

  XLSX.writeFile(wb, `${fileName}.xlsx`);
};
