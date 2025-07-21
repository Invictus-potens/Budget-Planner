import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    console.log("[UPLOAD] Receipt upload endpoint called");
    const formData = await req.formData();
    const files = formData.getAll("file");
    console.log(`[UPLOAD] Number of files received: ${files.length}`);
    const results = [];

    for (const file of files) {
      if (!(file instanceof Blob)) continue;
      const fileName = (file as any).name || "Arquivo";
      console.log(`[UPLOAD] Processing file: ${fileName}`);
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Send file to external Tesseract OCR service
      const ocrForm = new FormData();
      ocrForm.append('file', new Blob([buffer]), fileName);
      const ocrRes = await fetch('https://tesseract-production-6d57.up.railway.app/ocr', {
        method: 'POST',
        body: ocrForm,
      });
      if (!ocrRes.ok) throw new Error('OCR service failed');
      const ocrData = await ocrRes.json();
      const text = ocrData.text;
      console.log(`[UPLOAD] OCR complete for file: ${fileName}`);
      // Regexes básicas para MVP
      const valorMatch = text.match(/(R\$|\d{1,3}(?:\.\d{3})*,\d{2})/);
      const dataMatch = text.match(/\d{2}\/\d{2}\/\d{4}/);
      const linhaDigitavelMatch = text.match(/\d{5}\.\d{5} \d{5}\.\d{6} \d{5}\.\d{6} \d{1,2}/);
      results.push({
        fileName,
        text,
        valor: valorMatch ? valorMatch[0] : null,
        dataVencimento: dataMatch ? dataMatch[0] : null,
        linhaDigitavel: linhaDigitavelMatch ? linhaDigitavelMatch[0] : null,
        nomeEmissor: null,
        categoriaSugerida: null,
      });
    }
    console.log("[UPLOAD] All files processed. Returning results.");
    return NextResponse.json({ success: true, results });
  } catch (error) {
    let message = "Erro desconhecido";
    if (error instanceof Error) message = error.message;
    console.error("[UPLOAD] Error processing receipt:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
} 