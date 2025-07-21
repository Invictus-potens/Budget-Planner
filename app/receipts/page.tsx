import React from "react";
import ReceiptsUpload from "../components/ReceiptsUpload";

export default function ReceiptsPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">Recibos & Boletos</h1>
      <div className="bg-white rounded-lg shadow p-6">
        {/* Componente de upload será adicionado aqui */}
        <ReceiptsUpload />
      </div>
    </div>
  );
} 