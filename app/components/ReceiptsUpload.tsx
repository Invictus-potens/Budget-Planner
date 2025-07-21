'use client';

import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { saveTransaction } from "../lib/supabase";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, ACCOUNTS } from "../lib/constants";
import { v4 as uuidv4 } from "uuid";

interface UploadedFile {
  file: File;
  previewUrl: string;
  error?: string;
}

interface ExtractedData {
  fileName: string;
  valor: string | null;
  dataVencimento: string | null;
  linhaDigitavel: string | null;
  nomeEmissor: string | null;
  categoriaSugerida: string | null;
  text: string;
  conta?: string; // Adicionado para armazenar a conta
}

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

export default function ReceiptsUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ExtractedData[]>([]);
  const [editData, setEditData] = useState<Record<string, ExtractedData>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saveResult, setSaveResult] = useState<Record<string, string>>({});

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
    if (newFiles.length > 0) {
      processFiles([...files, ...newFiles]);
    }
  };

  const processFiles = async (fileObjs: UploadedFile[]) => {
    setLoading(true);
    setResults([]);
    setEditData({});
    const formData = new FormData();
    fileObjs.forEach((f) => formData.append("file", f.file));
    try {
      const res = await fetch("/api/receipts/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.results) {
        setResults(data.results);
        // Inicializa edição
        const editObj: Record<string, ExtractedData> = {};
        data.results.forEach((r: ExtractedData) => {
          editObj[r.fileName] = { ...r };
        });
        setEditData(editObj);
      }
    } catch (e) {
      // TODO: tratar erro
    } finally {
      setLoading(false);
    }
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

  const handleEditChange = (fileName: string, field: keyof ExtractedData, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [fileName]: {
        ...prev[fileName],
        [field]: value,
      },
    }));
  };

  const handleCategoryChange = (fileName: string, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [fileName]: {
        ...prev[fileName],
        categoriaSugerida: value,
      },
    }));
  };

  const handleAccountChange = (fileName: string, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [fileName]: {
        ...prev[fileName],
        conta: value,
      },
    }));
  };

  const handleSaveTransaction = async (fileName: string) => {
    if (!user) {
      setSaveResult((prev) => ({ ...prev, [fileName]: "Usuário não autenticado." }));
      return;
    }
    setSaving((prev) => ({ ...prev, [fileName]: true }));
    setSaveResult((prev) => ({ ...prev, [fileName]: "" }));
    const data = editData[fileName];
    // Verificação de duplicidade (valor, data, linha digitável)
    // Busca transações do usuário (ideal: endpoint, aqui: getTransactions)
    // Para MVP, salva direto, mas pode ser melhorado
    try {
      const amount = parseFloat((data.valor || "0").replace(/[^\d,\.]/g, "").replace(",", "."));
      if (!amount || !data.dataVencimento || !data.categoriaSugerida) {
        setSaveResult((prev) => ({ ...prev, [fileName]: "Preencha valor, data e categoria." }));
        setSaving((prev) => ({ ...prev, [fileName]: false }));
        return;
      }
      const transaction = {
        id: uuidv4(),
        type: "expense",
        amount,
        category: data.categoriaSugerida,
        description: data.nomeEmissor || "Recibo/Boleto importado",
        date: data.dataVencimento.split("/").reverse().join("-"),
        account: data.conta || ACCOUNTS[0].id,
        linhaDigitavel: data.linhaDigitavel || undefined,
      };
      const { error } = await saveTransaction(transaction, user.id);
      if (!error) {
        setSaveResult((prev) => ({ ...prev, [fileName]: "Transação salva com sucesso!" }));
      } else {
        setSaveResult((prev) => ({ ...prev, [fileName]: "Erro ao salvar: " + error.message }));
      }
    } catch (e: any) {
      setSaveResult((prev) => ({ ...prev, [fileName]: "Erro ao salvar: " + e.message }));
    } finally {
      setSaving((prev) => ({ ...prev, [fileName]: false }));
    }
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
      {loading && (
        <div className="flex justify-center items-center mt-6">
          <span className="text-purple-600 animate-pulse">Processando OCR...</span>
        </div>
      )}
      {results.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((result) => (
            <div key={result.fileName} className="bg-gray-50 rounded-lg p-4 shadow">
              <div className="font-semibold text-purple-700 mb-2">{result.fileName}</div>
              <div className="space-y-2">
                <label className="block text-xs text-gray-500">Valor</label>
                <input
                  className="w-full border rounded px-2 py-1"
                  value={editData[result.fileName]?.valor || ""}
                  onChange={e => handleEditChange(result.fileName, "valor", e.target.value)}
                  placeholder="Ex: R$ 123,45"
                  title="Valor do recibo ou boleto"
                />
                <label className="block text-xs text-gray-500">Data de Vencimento</label>
                <input
                  className="w-full border rounded px-2 py-1"
                  value={editData[result.fileName]?.dataVencimento || ""}
                  onChange={e => handleEditChange(result.fileName, "dataVencimento", e.target.value)}
                  placeholder="Ex: 31/12/2024"
                  title="Data de vencimento"
                />
                <label className="block text-xs text-gray-500">Linha Digitável</label>
                <input
                  className="w-full border rounded px-2 py-1"
                  value={editData[result.fileName]?.linhaDigitavel || ""}
                  onChange={e => handleEditChange(result.fileName, "linhaDigitavel", e.target.value)}
                  placeholder="Linha digitável do boleto"
                  title="Linha digitável"
                />
                <label className="block text-xs text-gray-500">Nome do Emissor</label>
                <input
                  className="w-full border rounded px-2 py-1"
                  value={editData[result.fileName]?.nomeEmissor || ""}
                  onChange={e => handleEditChange(result.fileName, "nomeEmissor", e.target.value)}
                  placeholder="Nome do emissor"
                  title="Nome do emissor"
                />
                <label className="block text-xs text-gray-500">Categoria Sugerida</label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={editData[result.fileName]?.categoriaSugerida || ""}
                  onChange={e => handleCategoryChange(result.fileName, e.target.value)}
                  title="Categoria sugerida"
                >
                  <option value="">Selecione a categoria</option>
                  {EXPENSE_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <label className="block text-xs text-gray-500">Conta</label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={editData[result.fileName]?.conta || ACCOUNTS[0].id}
                  onChange={e => handleAccountChange(result.fileName, e.target.value)}
                  title="Conta"
                >
                  {ACCOUNTS.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
                <button
                  className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50"
                  onClick={() => handleSaveTransaction(result.fileName)}
                  disabled={saving[result.fileName]}
                  type="button"
                >
                  {saving[result.fileName] ? "Salvando..." : "Salvar como transação"}
                </button>
                {saveResult[result.fileName] && (
                  <div className={`mt-2 text-sm ${saveResult[result.fileName].includes("sucesso") ? "text-green-600" : "text-red-600"}`}>{saveResult[result.fileName]}</div>
                )}
                <label className="block text-xs text-gray-500">Texto Extraído</label>
                <textarea
                  className="w-full border rounded px-2 py-1 text-xs"
                  rows={3}
                  value={editData[result.fileName]?.text || ""}
                  onChange={e => handleEditChange(result.fileName, "text", e.target.value)}
                  placeholder="Texto extraído do documento"
                  title="Texto extraído"
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {files.length > 0 && results.length === 0 && (
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