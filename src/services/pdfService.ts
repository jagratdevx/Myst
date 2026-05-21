import * as DocumentPicker from 'expo-document-picker';
import { pdfStorage } from './pdfStorage';
import { PDFDocument } from '../types/pdf';

export const pdfService = {
  importPDF: async (subject: string = 'General'): Promise<PDFDocument | null> => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return null;

      const asset = result.assets[0];
      const newPDF: PDFDocument = {
        id: Math.random().toString(36).substring(7),
        uri: asset.uri,
        name: asset.name,
        size: asset.size,
        mimeType: asset.mimeType,
        subject: subject,
        category: 'Study Material',
        dateImported: Date.now(),
        isFavorite: false,
      };

      const pdfs = await pdfStorage.getPDFs();
      await pdfStorage.savePDFs([newPDF, ...pdfs]);
      return newPDF;
    } catch (error) {
      console.error('Error importing PDF:', error);
      return null;
    }
  },

  getPDFs: async (): Promise<PDFDocument[]> => {
    return await pdfStorage.getPDFs();
  },

  deletePDF: async (id: string): Promise<void> => {
    const pdfs = await pdfStorage.getPDFs();
    const updated = pdfs.filter(p => p.id !== id);
    await pdfStorage.savePDFs(updated);
  },

  toggleFavorite: async (id: string): Promise<void> => {
    const pdfs = await pdfStorage.getPDFs();
    const updated = pdfs.map(p => 
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    );
    await pdfStorage.savePDFs(updated);
  },

  updateLastOpened: async (id: string): Promise<void> => {
    const pdfs = await pdfStorage.getPDFs();
    const updated = pdfs.map(p => 
      p.id === id ? { ...p, lastOpened: Date.now() } : p
    );
    await pdfStorage.savePDFs(updated);
  }
};
