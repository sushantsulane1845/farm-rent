import React, { useEffect, useState } from 'react';
import { Check, Tractor } from 'lucide-react';
import { useImageSelection } from '../context/ImageSelectionContext';

interface SelectableImageFrameProps {
  selectionId: string;
  src?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  fallback?: React.ReactNode;
  stopPropagation?: boolean;
  isSelectedOverride?: boolean;
  compact?: boolean;
  onAfterClick?: (nextSelected: boolean) => void;
  ariaLabel?: string;
}

export function SelectableImageFrame({
  selectionId,
  src,
  alt,
  className = '',
  imgClassName = '',
  fallback,
  stopPropagation = true,
  isSelectedOverride,
  compact = false,
  onAfterClick,
  ariaLabel,
}: SelectableImageFrameProps) {
  const { selectedImageId, toggleImage } = useImageSelection();
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [src]);

  const isSelected =
    isSelectedOverride !== undefined ? isSelectedOverride : selectedImageId === selectionId;

  const hasExplicitWidth = /\bw-(?:\d+|\[|auto|fit|min|max|screen)/.test(className);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (stopPropagation) {
      e.stopPropagation();
    }
    const nextSelected = !isSelected;
    toggleImage(selectionId);
    onAfterClick?.(nextSelected);
  };

  return (
    <button
      type="button"
      data-selectable-image="true"
      aria-pressed={isSelected}
      aria-label={ariaLabel || alt}
      onClick={handleClick}
      className={`group/img relative block ${hasExplicitWidth ? '' : 'w-full'} overflow-hidden text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] focus-visible:ring-offset-2 transition-[box-shadow,border-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
        isSelected
          ? 'ring-2 ring-[#FBBF24] ring-offset-2 ring-offset-white shadow-[0_12px_28px_-8px_rgba(20,83,45,0.42)] z-10'
          : 'ring-0 hover:shadow-sm'
      } ${className}`}
    >
      {!imgFailed && src ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className={`w-full h-full object-cover transition-[transform,filter] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none ${
            isSelected
              ? 'scale-[1.05] brightness-[1.03] saturate-[1.08]'
              : 'scale-100 group-hover/img:scale-[1.03]'
          } ${imgClassName}`}
        />
      ) : (
        fallback || (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#14532D]/60 bg-gradient-to-br from-[#EFF4EC] to-[#E2EBDD] p-4 text-center">
            <Tractor className={compact ? 'w-6 h-6' : 'w-10 h-10'} aria-hidden="true" />
            {!compact && (
              <span className="text-xs font-medium text-[#14532D] line-clamp-1">{alt}</span>
            )}
          </div>
        )
      )}

      {/* Subtle Dual-Tone Color Overlay */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#14532D]/40 via-[#22C55E]/15 to-[#FBBF24]/30 transition-opacity duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover/img:opacity-35'
        }`}
      />

      {/* Crisp Inner Highlight Border Frame */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 rounded-[inherit] border-2 transition-opacity duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
          isSelected ? 'border-[#FBBF24] opacity-100' : 'border-white/0 opacity-0'
        }`}
      />

      {/* Minimal Selected Checkmark Indicator */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute ${
          compact ? 'top-1.5 right-1.5 w-5 h-5' : 'top-2.5 right-2.5 w-7 h-7'
        } rounded-full bg-[#14532D] text-[#FBBF24] border border-[#FBBF24]/85 shadow-md flex items-center justify-center transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
          isSelected ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
      >
        <Check className={compact ? 'w-3 h-3 stroke-[2.75]' : 'w-4 h-4 stroke-[2.75]'} />
      </span>
    </button>
  );
}
