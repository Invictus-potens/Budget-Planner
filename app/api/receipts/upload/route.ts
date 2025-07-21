import { NextRequest, NextResponse } from "next/server";
import { IncomingForm, Files } from "formidable";
import * as fs from "fs";
import Tesseract from "tesseract.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function parseForm(req: NextRequest): Promise<{ files: Files }> {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ keepExtensions: true });
    form.parse(req as any, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ files });
    });
  });
}

export async function POST(req: NextRequest) {
  try {
    // Parse form data
    const { files } = await parseForm(req);
    const fileArray = Array.isArray(files.file) ? files.file : [files.file];
    const results = [];

    for (const file of fileArray) {
      if (!file || !file.filepath) continue;
      const buffer = fs.readFileSync(file.filepath);
      // OCR com Tesseract
      const { data } = await Tesseract.recognize(buffer, "por");
      // Extração simplificada (ajustar para produção)
      const text = data.text;
      // Regexes básicas para MVP
      const valorMatch = text.match(/(R\$|\d{1,3}(?:\.\d{3})*,\d{2})/);
      const dataMatch = text.match(/\d{2}\/\d{2}\/\d{4}/);
      const linhaDigitavelMatch = text.match(/\d{5}\.\d{5} \d{5}\.\d{6} \d{5}\.\d{6} \d{1,2}/);
      results.push({
        fileName: file.originalFilename,
        text,
        valor: valorMatch ? valorMatch[0] : null,
        dataVencimento: dataMatch ? dataMatch[0] : null,
        linhaDigitavel: linhaDigitavelMatch ? linhaDigitavelMatch[0] : null,
        // Nome do emissor e categoria sugerida podem ser melhorados depois
        nomeEmissor: null,
        categoriaSugerida: null,
      });
    }
    return NextResponse.json({ success: true, results });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 