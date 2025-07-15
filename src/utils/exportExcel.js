import FileSaver from "file-saver";
import excel from "exceljs";

const FILENAME_DEFAULT = "file1.xlsx";

const SHEETS_DEFAULT = [
  {
    name: "Sheet1",
    columns: [],
    data: [],
  },
];

export default async function exportExcel(
  fileName = FILENAME_DEFAULT,
  sheets = SHEETS_DEFAULT,
  returnCallback = false,
) {
  let workbook = new excel.Workbook(); // Creating workbook

  sheets.forEach((sheet, index) => {
    let properties = {};

    if (sheet.views) {
      properties.views = sheet.views;
    }

    let worksheet = workbook.addWorksheet(sheet.name, properties);
    worksheet.columns = sheet.columns;
    worksheet.addRows(sheet.data);

    if (sheet.callback && typeof sheet.callback == "function") sheet.callback({ worksheet });

    if (!sheet.state) worksheet.state = "visible";
    else worksheet.state = sheet.state;
  });

  const buffer = await workbook.xlsx.writeBuffer();

  if (returnCallback) {
    return { buffer, fileName };
  } else {
    FileSaver.saveAs(new Blob([buffer]), fileName);
  }
}
