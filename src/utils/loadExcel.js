import * as XLSX from "xlsx";


export async function loadExcel(file) {
if (!file) return [];


return new Promise((resolve) => {
const reader = new FileReader();


reader.onload = (e) => {
try {
const buffer = new Uint8Array(e.target.result);
const workbook = XLSX.read(buffer, { type: "array" });


// Usamos siempre la primera hoja
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];


const json = XLSX.utils.sheet_to_json(worksheet, {
defval: null, // evita undefined
raw: false,
});


resolve(json);
} catch (err) {
console.error("Error leyendo Excel:", err);
resolve([]); // nunca romper la app
}
};


reader.onerror = () => resolve([]);
reader.readAsArrayBuffer(file);
});
}