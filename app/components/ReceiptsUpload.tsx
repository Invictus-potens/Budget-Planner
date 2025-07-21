import React, { useRef, useState } from "react";

interface UploadedFile {
  file: File;
  previewUrl: string;
  error?: string;
}

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

export default function ReceiptsUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles: UploadedFile[] = [];
    Array.from(fileList).forEach((file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        newFiles.push({ file, previewUrl: "", error: "Tipo de arquivo não suportado." });
        return;
      }
      let previewUrl = "";
      if (file.type.startsWith("image/")) {
        previewUrl = URL.createObjectURL(file);
      }
      newFiles.push({ file, previewUrl });
    });
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          dragActive ? "border-pink-400 bg-pink-50" : "border-purple-300 bg-white"
        }`}
        onClick={openFileDialog}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={0}
      >
        <input
          type="file"
          multiple
          accept=".pdf,image/jpeg,image/png"
          className="hidden"
          ref={inputRef}
          onChange={handleInputChange}
          title="Selecione arquivos PDF, JPG ou PNG para upload"
        />
        <span className="text-gray-500">
          Arraste e solte arquivos PDF, JPG ou PNG aqui, ou <span className="text-pink-500 underline">clique para selecionar</span>.
        </span>
      </div>
      {files.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {files.map((fileObj, idx) => (
            <div key={idx} className="flex items-center gap-4 bg-gray-50 rounded p-3 shadow-sm">
              {fileObj.previewUrl ? (
                <img
                  src={fileObj.previewUrl}
                  alt={fileObj.file.name}
                  className="w-16 h-16 object-contain rounded border"
                />
              ) : (
                <span className="w-16 h-16 flex items-center justify-center bg-purple-100 rounded border text-purple-700 font-bold">
                  PDF
                </span>
              )}
              <div className="flex-1">
                <div className="font-medium text-gray-800">{fileObj.file.name}</div>
                <div className="text-xs text-gray-500">{(fileObj.file.size / 1024).toFixed(1)} KB</div>
                {fileObj.error && <div className="text-xs text-red-500 mt-1">{fileObj.error}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 