import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { extractColors } from "extract-colors";
import placeholder from "../assets/img.svg";
import copyIcon from "../assets/copy.svg";
import tick from "../assets/tick.svg";

interface ColorData {
  hex: string;
  red: number;
  green: number;
  blue: number;
  hue: number;
  intensity: number;
  lightness: number;
  saturation: number;
  area: number;
}

export default function Custom() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filePreview, setFilePreview] = useState<string | undefined>(undefined);
  const [generatedColors, setGeneratedColors] = useState<ColorData[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleSpanClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setGeneratedColors([]);
    setCopiedIdx(null);
    const previewURL = URL.createObjectURL(file);
    setFilePreview(previewURL);
    try {
      const colors = await extractColors(previewURL);
      setGeneratedColors(colors);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveImage = () => {
    setFilePreview(undefined);
    setGeneratedColors([]);
    setCopiedIdx(null);
  };

  const handleCopy = async (hex: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1200);
    } catch {}
  };

  return (
    <motion.div className="min-h-screen py-8 relative flex flex-col items-center">
      {/* Animated Accent */}
      <motion.div
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-purple-500/30 via-blue-400/20 to-pink-400/20 rounded-full blur-3xl z-0"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Header */}
      <div className="relative z-10 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 gradient-text">
            Extract Colors from Image
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Upload or drag an image to generate a beautiful color palette instantly.
          </p>
        </div>
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-10 items-stretch">
          {/* Upload/Preview Section */}
          <div className="space-y-6">
            <div
              className={`relative h-80 rounded-2xl glass border-2 border-dashed transition-all duration-300 flex items-center justify-center ${
                isDragOver ? 'border-purple-400 bg-purple-400/10' : 'border-white/20 hover:border-white/40'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {filePreview ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 relative">
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="max-h-64 max-w-full object-contain rounded-xl shadow-lg border border-white/10"
                  />
                  <button
                    className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-black/60 text-white text-xs hover:bg-black/80 transition"
                    onClick={handleRemoveImage}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                  <img src={placeholder} className="h-24 w-24 mx-auto mb-6 opacity-60" />
                  <p className="text-lg font-medium mb-2">
                    Drag & drop or click to upload
                  </p>
                  <p className="text-sm text-white/60 mb-4">
                    PNG, JPG, JPEG, WEBP supported
                  </p>
                  <button
                    onClick={handleSpanClick}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-medium transition-colors text-white"
                  >
                    Choose File
                  </button>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="image/*"
              />
              {/* Processing spinner overlay */}
              <AnimatePresence>
                {isProcessing && (
                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center glass z-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full mb-4"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="text-white/90 font-medium">Extracting colors…</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          {/* Palette Section */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Generated Palette</h2>
              <p className="text-white/60">
                {generatedColors.length > 0
                  ? `${generatedColors.length} colors extracted`
                  : 'Upload an image to generate colors'}
              </p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              {generatedColors.map((color, idx) => (
                <motion.div
                  key={idx}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.07 }}
                >
                  <div className="relative group">
                    <button
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full shadow-lg border-2 border-white/20 cursor-pointer transition-transform group-hover:scale-105 bg-white/10"
                      style={{ backgroundColor: color.hex }}
                      onClick={() => handleCopy(color.hex, idx)}
                    >
                      <span className="sr-only">Copy {color.hex}</span>
                      <span className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <img src={copiedIdx === idx ? tick : copyIcon} className="w-5 h-5" alt="copy" />
                      </span>
                    </button>
                    {copiedIdx === idx && (
                      <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1 rounded-lg shadow-lg">
                        Copied!
                      </span>
                    )}
                  </div>
                  <span className="pt-3 text-center text-white font-medium text-sm select-all">
                    {color.hex}
                  </span>
                </motion.div>
              ))}
            </div>
            {/* Action Button */}
            {filePreview && (
              <div className="flex justify-center pt-6">
                <button
                  onClick={handleRemoveImage}
                  className="px-8 py-4 rounded-xl glass border border-white/20 hover:border-purple-400 hover:text-purple-400 transition-all duration-300 font-medium text-white"
                >
                  Start Over
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
