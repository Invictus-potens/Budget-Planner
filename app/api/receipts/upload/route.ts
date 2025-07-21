import { NextRequest, NextResponse } from "next/server";
import Tesseract from "tesseract.js";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("file");
    const results = [];

    for (const file of files) {
      if (!(file instanceof Blob)) continue;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      // OCR com Tesseract
      const { data } = await Tesseract.recognize(buffer, "por");
      const text = data.text;
      // Regexes básicas para MVP
      const valorMatch = text.match(/(R\$|\d{1,3}(?:\.\d{3})*,\d{2})/);
      const dataMatch = text.match(/\d{2}\/\d{2}\/\d{4}/);
      const linhaDigitavelMatch = text.match(/\d{5}\.\d{5} \d{5}\.\d{6} \d{5}\.\d{6} \d{1,2}/);
      results.push({
        fileName: (file as any).name || "Arquivo",
        text,
        valor: valorMatch ? valorMatch[0] : null,
        dataVencimento: dataMatch ? dataMatch[0] : null,
        linhaDigitavel: linhaDigitavelMatch ? linhaDigitavelMatch[0] : null,
        nomeEmissor: null,
        categoriaSugerida: null,
      });
    }
    return NextResponse.json({ success: true, results });
  } catch (error) {
    let message = "Erro desconhecido";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
} 