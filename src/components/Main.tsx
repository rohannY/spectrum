import { useState } from "react";
import { motion } from "framer-motion";
import tick from "../assets/tick.svg";
import copy from "../assets/copy.svg";
import data from "../data/data.json";

export default function Main({ selectedColor }: { selectedColor: string | null }) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  const handleMouseEnter = (index: number, color: string) => {
    setHoveredCard(index);
    setShowCopiedMessage(false);
    setHoveredColor(color);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

  const handleCopy = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setShowCopiedMessage(true);
    } catch (err) {
      console.error("Unable to copy to clipboard:", err);
    }
  };

  // Filter palettes by selectedColor (primary)
  const filteredImages = selectedColor
    ? data.images.filter(img => img.colors.primary.toLowerCase() === selectedColor.toLowerCase())
    : data.images;

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
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  const colorVariants = {
    hover: { scale: 1.1, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  };

  return (
    <motion.div
      className="min-h-screen py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Mobile warning */}
      <motion.p 
        className="block lg:hidden text-sm text-center text-white/60 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        For Better Experience, Use this site on Laptop/Desktop
      </motion.p>

      {/* Header */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 gradient-text">
          Color Spectrum
        </h1>
        <p className="text-lg text-white/70 max-w-2xl mx-auto">
          Discover beautiful color palettes from curated images. Click on colors to copy their hex codes.
        </p>
      </motion.div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {filteredImages.map((image, index) => (
            <motion.div
              key={index}
              className="group relative"
              variants={cardVariants}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="relative overflow-hidden rounded-2xl glass border border-white/10 hover:border-white/30 transition-all duration-300"
                whileHover={{ 
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
                }}
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <motion.img 
                    src={image.url} 
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {hoveredCard === index && (
                    <div className="flex flex-row items-center justify-center gap-2 absolute top-1/2 left-1/2 border border-[#e6e6e627] backdrop-blur-2xl min-w-28 min-h-12 transform -translate-x-1/2 -translate-y-1/2 rounded-xl text-sm bg-black/50">
                      <img
                        src={showCopiedMessage ? tick : copy}
                        className="max-w-5"
                      />
                      <span className="font-medium text-m text-white">
                        {showCopiedMessage ? "Copied" : hoveredColor}
                      </span>
                    </div>
                  )}
                </div>

                {/* Color Palette */}
                <div className="p-4">
                  <div className="flex gap-2 justify-center">
                {image.colors ? (
                  <>
                        <motion.button
                      data-color={image.colors.primary}
                          className="w-12 h-10 rounded-lg border-2 border-white/20 shadow-lg"
                      style={{ backgroundColor: image.colors.primary }}
                          onMouseEnter={() => handleMouseEnter(index, image.colors.primary)}
                          onMouseLeave={handleMouseLeave}
                      onClick={() => handleCopy(image.colors.primary)}
                          variants={colorVariants}
                          whileHover="hover"
                          whileTap="tap"
                        />
                        <motion.button
                          className="w-8 h-10 rounded-lg border-2 border-white/20 shadow-lg"
                      style={{ backgroundColor: image.colors.secondary }}
                          onMouseEnter={() => handleMouseEnter(index, image.colors.secondary)}
                          onMouseLeave={handleMouseLeave}
                      onClick={() => handleCopy(image.colors.secondary)}
                          variants={colorVariants}
                          whileHover="hover"
                          whileTap="tap"
                        />
                        <motion.button
                          className="w-6 h-10 rounded-lg border-2 border-white/20 shadow-lg"
                      style={{ backgroundColor: image.colors.tertiary }}
                          onMouseEnter={() => handleMouseEnter(index, image.colors.tertiary)}
                          onMouseLeave={handleMouseLeave}
                      onClick={() => handleCopy(image.colors.tertiary)}
                          variants={colorVariants}
                          whileHover="hover"
                          whileTap="tap"
                        />
                  </>
                ) : null}
              </div>
            </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}