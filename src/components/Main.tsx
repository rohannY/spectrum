import { useState } from "react";
import tick from "../assets/tick.svg";
import copy from "../assets/copy.svg";
import data from "../data/data.json";

export default function Main() {
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
      console.log('Color copied to clipboard:', color);
      setShowCopiedMessage(true);
    } catch (err) {
      console.error('Unable to copy to clipboard:', err);
    }
  };

  return (
    <div className="x-auto w-full px-2.5 md:px-20 py-4 flex justify-between h-auto">
      <div className="flex flex-1">
        <div className="flex flex-wrap gap-5 place-content-evenly max-w-[1400px] mx-auto content-start">
          {data.images.map((image, index) => (
            <div
              key={index}
              className="w-56 px-4 pt-4 pb-6 cursor-pointer hover:border-[0.1px] border-[#343434] rounded-xl flex flex-col items-center"
            >
              <div className="h-56 flex flex-col items-center justify-center">
                <div
                  id="img"
                  className="flex px-4 py-2 relative justify-center align-middle"
                >
                  <img src={image.url} className="max-h-56 max-w-[192px]" />
                  {hoveredCard === index && (
                    <div className="flex flex-row items-center justify-center gap-2 absolute top-1/2 left-1/2 border border-[#e6e6e627] backdrop-blur-md min-w-28 min-h-12 transform -translate-x-1/2 -translate-y-1/2 rounded-xl text-sm">
                      <img src={showCopiedMessage ? tick : copy} className="max-w-5" />
                      <span className="font-medium text-m">{showCopiedMessage ? 'Copied' : hoveredColor}</span>
                    </div>
                  )}

                </div>
              </div>
              <div
                id="colors"
                className="flex gap-2 pt-2 justify-items-end mt-4"
              >
                {image.colors ? (
                  <>
                    <button
                      data-color={image.colors.primary}
                      className={`w-12 h-8 rounded-sm`}
                      style={{ backgroundColor: image.colors.primary }}
                      onMouseEnter={() => handleMouseEnter(index,image.colors.primary)}
                      onMouseOut={handleMouseLeave}
                      onClick={() => handleCopy(image.colors.primary)}
                    ></button>
                    <button
                      className={`w-8 h-8 rounded-sm`}
                      style={{ backgroundColor: image.colors.secondary }}
                      onMouseEnter={() => handleMouseEnter(index,image.colors.secondary)}
                      onMouseOut={handleMouseLeave}
                      onClick={() => handleCopy(image.colors.secondary)}
                    ></button>
                    <button
                      className={`w-4 h-8 rounded-sm`}
                      style={{ backgroundColor: image.colors.tertiary }}
                      onMouseEnter={() => handleMouseEnter(index,image.colors.tertiary)}
                      onMouseOut={handleMouseLeave}
                      onClick={() => handleCopy(image.colors.tertiary)}
                    ></button>
                  </>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
