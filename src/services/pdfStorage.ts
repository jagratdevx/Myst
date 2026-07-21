import AsyncStorage from '@react-native-async-storage/async-storage';
import { PDFDocument } from '../types/pdf';

const PDF_METADATA_KEY = '@myst_pdf_metadata';

export const pdfStorage = {
  getPDFs: async (): Promise<PDFDocument[]> => {
    try {
      const data = await AsyncStorage.getItem(PDF_METADATA_KEY);
      if (!data) return [];
      return JSON.parse(data) as PDFDocument[];
    } catch (error) {
      console.error('Failed to get PDFs from storage', error);
      return [];
    }
  },

  savePDFs: async (pdfs: PDFDocument[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(PDF_METADATA_KEY, JSON.stringify(pdfs));
    } catch (error) {
      console.error('Failed to save PDFs to storage', error);
    }
  },

  clearAll: async (): Promise<void> => {
    await AsyncStorage.removeItem(PDF_METADATA_KEY);
  }
};
