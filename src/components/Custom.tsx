import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { extractColors } from "extract-colors";
import placeholder from "../assets/img.svg";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const colorCardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  return (
    <motion.div
      className="min-h-screen py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 gradient-text">
          Custom Palette Generator
        </h1>
        <p className="text-lg text-white/70 max-w-2xl mx-auto">
          Upload an image and extract beautiful color palettes automatically
        </p>
      </motion.div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Image Upload Section */}
          <motion.div
            variants={sectionVariants}
            className="space-y-6"
          >
            <motion.div
              className={`relative h-80 lg:h-96 rounded-2xl glass border-2 border-dashed transition-all duration-300 ${
                isDragOver 
                  ? 'border-purple-400 bg-purple-400/10' 
                  : 'border-white/20 hover:border-white/40'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {filePreview ? (
                <div className="w-full h-full flex justify-center items-center p-6">
                  <motion.img
                    src={filePreview}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain rounded-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.img 
                      src={placeholder} 
                      className="h-24 w-24 mx-auto mb-6 opacity-60"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <p className="text-lg font-medium mb-2">
                      Drop your image here
                    </p>
                    <p className="text-sm text-white/60 mb-4">
                      or click to browse files
                    </p>
                    <motion.button
                      onClick={handleSpanClick}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-medium transition-colors"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Choose File
                    </motion.button>
                  </motion.div>
                </div>
              )}
              
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="image/*"
              />
            </motion.div>

            {/* Processing indicator */}
            <AnimatePresence>
              {isProcessing && (
                <motion.div
                  className="flex items-center justify-center gap-3 p-4 glass rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <motion.div
                    className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="text-white/90">Processing image...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Color Palette Section */}
          <motion.div
            variants={sectionVariants}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Generated Palette</h2>
              <p className="text-white/60">
                {generatedColors.length > 0 
                  ? `${generatedColors.length} colors extracted` 
                  : 'Upload an image to generate colors'
                }
              </p>
            </div>

            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 gap-4"
              variants={containerVariants}
            >
              {generatedColors.map((color, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center"
                  variants={colorCardVariants}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="w-20 h-24 md:w-24 md:h-32 rounded-2xl shadow-lg border-2 border-white/20 cursor-pointer"
                    style={{ backgroundColor: color.hex }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigator.clipboard.writeText(color.hex)}
                  />
                  <motion.span 
                    className="px-2 pt-3 text-center text-white font-medium text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {color.hex}
                  </motion.span>
                </motion.div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="flex justify-center pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                onClick={() => window.location.reload()}
                className="px-8 py-4 rounded-xl glass border border-white/20 hover:border-purple-400 hover:text-purple-400 transition-all duration-300 font-medium"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Start Over
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
