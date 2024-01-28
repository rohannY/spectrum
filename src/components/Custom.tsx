import placeholder from "../assets/img.svg";
import { useRef, useState } from "react";
import { extractColors } from "extract-colors";

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

  const handleSpanClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const previewURL = URL.createObjectURL(file);
      setFilePreview(previewURL);

      try {
        const colors = await extractColors(previewURL);
        setGeneratedColors(colors);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="x-auto w-full px-2.5 md:px-20 py-4 flex justify-between h-auto mx-auto max-w-[1600px]">
      <div className="flex flex-wrap w-full">
        <div
          id="image"
          className="px-10 h-[30vh] md:h-[70vh] border rounded-2xl border-[#3b3b3b] shadow-sm shadow-gray-600 w-full md:w-1/2 flex justify-center items-center"
        >
        
          {filePreview !== undefined ? (
            <div className="w-full h-full flex justify-center">
              <img
                src={filePreview}
                alt="Preview"
                className="p-10 h-auto max-h-full max-w-full object-contain"
              />
            </div>
          ) : (
            <div className="py-10 md:px-10 h-full w-full max-w-lg align-middle text-center justify-center flex flex-col">
              <div className="flex flex-col items-center">
                <img src={placeholder} className="h-32 w-32" />
                <p className="px-5 text-sm md:px-10">
                  Drag and drop files here or{" "}
                  <span
                    className="text-blue-400 hover:underline underline-offset-4 cursor-pointer"
                    onClick={handleSpanClick}
                  >
                    select a file{" "}
                  </span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  from your computer
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2 px-5 md:px-20">
          <div className="">
            <p className="text-center py-10">Generated Palatte</p>

            <div className="flex flex-row flex-wrap md:p-10 place-content-evenly max-w-[600px] gap-2 md:gap-4">
              {generatedColors.map((color, index) => (
                <div className="flex flex-col" id="card">
                  <div
                    className="w-20 h-28 md:w-24 md:h-32 rounded-2xl"
                    key={index}
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  <span className="px-2 pt-3 text-center text-white font-medium text-md">
                    {color.hex}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center py-10">
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-4 rounded-xl border bg-[#1e1e1e] hover:border-emerald-400 hover:text-emerald-400"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
