import { useRef } from "react";
import { loadExcel } from "../utils/loadExcel";
import { useData } from "../context/DataContext";

export default function UploadExcel() {
  const { setRawData } = useData();
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = await loadExcel(file);
    setRawData(data);

    console.log("DATA DESDE EXCEL (rawData):", data);
  };

  return (
    <div className="flex items-center gap-4">
      {/* INPUT OCULTO */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleUpload}
        className="hidden"
      />

      {/* BOTÓN VISIBLE */}
      <button
        onClick={() => fileInputRef.current.click()}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
      >
        📤 Subir Excel
      </button>
    </div>
  );
}