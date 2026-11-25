import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface ImageSelectionContextValue {
  selectedImageId: string | null;
  selectImage: (id: string | null) => void;
  toggleImage: (id: string) => void;
}

const ImageSelectionContext = createContext<ImageSelectionContextValue | null>(null);

export function ImageSelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const selectImage = useCallback((id: string | null) => {
    setSelectedImageId(id);
  }, []);

  const toggleImage = useCallback((id: string) => {
    setSelectedImageId((prev) => (prev === id ? null : id));
  }, []);

  useEffect(() => {
    if (!selectedImageId) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('[data-selectable-image="true"]')) {
        return;
      }
      setSelectedImageId(null);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImageId(null);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImageId]);

  return (
    <ImageSelectionContext.Provider value={{ selectedImageId, selectImage, toggleImage }}>
      {children}
    </ImageSelectionContext.Provider>
  );
}

export function useImageSelection() {
  const ctx = useContext(ImageSelectionContext);
  if (!ctx) {
    throw new Error('useImageSelection must be used within ImageSelectionProvider');
  }
  return ctx;
}
