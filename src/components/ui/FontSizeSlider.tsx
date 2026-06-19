"use client";

import React from "react";

import { useHtmlFontSize } from "@/context/HtmlFontSizeContext";

const BASE_FONT_SIZE = 16;
const MAX_LEVELS = 3;
const MIN_SIZE = BASE_FONT_SIZE - MAX_LEVELS;
const MAX_SIZE = BASE_FONT_SIZE + MAX_LEVELS;

const FontSizeSlider: React.FC = () => {
  const { htmlFontSize, setHtmlFontSize } = useHtmlFontSize();

  const increaseFontSize = () => {
    setHtmlFontSize((prev) => (prev < MAX_SIZE ? prev + 1 : prev));
  };

  const decreaseFontSize = () => {
    setHtmlFontSize((prev) => (prev > MIN_SIZE ? prev - 1 : prev));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setHtmlFontSize(Math.min(MAX_SIZE, Math.max(MIN_SIZE, value)));
  };

  return (
    <div className="flex gap-2 items-center justify-center">
      <button
        type="button"
        onClick={decreaseFontSize}
        aria-label="Diminuir tamanho da fonte"
        disabled={htmlFontSize <= MIN_SIZE}
        className="font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 transition-opacity"
      >
        A
      </button>
      <div className="relative w-full max-w-24 sm:max-w-md flex items-center">
        <input
          type="range"
          min={MIN_SIZE}
          max={MAX_SIZE}
          step="1"
          value={htmlFontSize}
          onChange={handleSliderChange}
          onInput={handleSliderChange}
          className="font-size-slider w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ outline: "none" }}
          aria-label="Controle de Tamanho da Fonte"
        />
      </div>
      <button
        type="button"
        onClick={increaseFontSize}
        aria-label="Aumentar tamanho da fonte"
        disabled={htmlFontSize >= MAX_SIZE}
        className="font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 transition-opacity"
      >
        A
      </button>
    </div>
  );
};

export default FontSizeSlider;
