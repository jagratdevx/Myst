import { create } from 'zustand';
import { PDFDocument } from '../types/pdf';
import { pdfService } from '../services/pdfService';
import { awardPDFImportXP } from './useGamificationStore';

interface PDFState {
  pdfs: PDFDocument[];
  loading: boolean;
  fetchPDFs: () => Promise<void>;
  importPDF: (subject?: string) => Promise<void>;
  deletePDF: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  markAsOpened: (id: string) => Promise<void>;
}

export const usePDFStore = create<PDFState>((set, get) => ({
  pdfs: [],
  loading: false,

  fetchPDFs: async () => {
    set({ loading: true });
    const pdfs = await pdfService.getPDFs();
    set({ pdfs, loading: false });
  },

  importPDF: async (subject) => {
    const newPDF = await pdfService.importPDF(subject);
    if (newPDF) {
      set({ pdfs: [newPDF, ...get().pdfs] });
      awardPDFImportXP();
    }
  },

  deletePDF: async (id) => {
    await pdfService.deletePDF(id);
    set({ pdfs: get().pdfs.filter(p => p.id !== id) });
  },

  toggleFavorite: async (id) => {
    await pdfService.toggleFavorite(id);
    set({
      pdfs: get().pdfs.map(p => 
        p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
      )
    });
  },

  markAsOpened: async (id) => {
    await pdfService.updateLastOpened(id);
    set({
      pdfs: get().pdfs.map(p => 
        p.id === id ? { ...p, lastOpened: Date.now() } : p
      )
    });
  }
}));
