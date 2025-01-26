"use client";

import { useState } from "react";
import { FaGlobe, FaHome, FaEllipsisH, FaSearch } from 'react-icons/fa';
import Image from "next/image"; 
import equilateralImg from './assets/images/equilateral.png';
import isoscelesImg from './assets/images/isosceles.png';
import rightTriangleImg from './assets/images/right_triangle.png';
import scaleneImg from './assets/images/scalene.png';
import iconImg from './assets/images/Image_Icon.png'; // Import Image from next/image

export default function Home() {
  // State สำหรับเก็บค่าด้านของสามเหลี่ยม
  const [sideA, setSideA] = useState<string>("");
  const [sideB, setSideB] = useState<string>("");
  const [sideC, setSideC] = useState<string>("");
  const [triangleType, setTriangleType] = useState<string>("");
  const [triangleClass, setTriangleClass] = useState<string>("");
  const [language, setLanguage] = useState<"th" | "en">("th");
  const [perimeter, setPerimeter] = useState<number | null>(null);
  const [area, setArea] = useState<number | null>(null);

  const triangleImages = {
    equilateral: equilateralImg,
    isosceles: isoscelesImg,
    right: rightTriangleImg,
    scalene: scaleneImg,
    icon: iconImg
  };

  const calculateTriangle = () => {
    const a = parseFloat(sideA);
    const b = parseFloat(sideB);
    const c = parseFloat(sideC);

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
      setTriangleType(
        language === "th"
          ? "กรุณากรอกตัวเลขที่ถูกต้องสำหรับทุกด้าน"
          : "Please enter valid numbers for all sides."
      );
      return;
    }

    if (a + b <= c || a + c <= b || b + c <= a) {
      setTriangleType(
        language === "th"
          ? "ด้านที่กรอกไม่สามารถเป็นสามเหลี่ยมได้"
          : "The sides do not form a triangle."
      );
      return;
    }

    let triangleClass = "";
    let calculatedPerimeter = a + b + c;
    let calculatedArea = 0;

    if (a === b && b === c) {
      setTriangleType("equilateral");
      triangleClass = "border-b-[100px] border-blue-500";
      calculatedArea = (Math.sqrt(3) / 4) * a * a;
    } else if (a === b || b === c || a === c) {
      setTriangleType("isosceles");
      triangleClass = "border-b-[100px] border-yellow-500";
      // ใช้สูตร Heron's Formula
      const s = (a + b + c) / 2;
      calculatedArea = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    } else if (
      a * a + b * b === c * c ||
      a * a + c * c === b * b ||
      b * b + c * c === a * a
    ) {
      setTriangleType("right");
      triangleClass = "bg-green-500 w-[100px] h-[100px] clip-path-polygon";
      calculatedArea = 0.5 * a * b; // Assuming a and b are perpendicular sides
    } else {
      setTriangleType("scalene");
      triangleClass = "border-b-[100px] border-red-500";
      const s = (a + b + c) / 2;
      calculatedArea = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    }

    setPerimeter(calculatedPerimeter);
    setArea(calculatedArea);
    setTriangleClass(triangleClass);
  };

  const resetInputs = () => {
    setSideA("");
    setSideB("");
    setSideC("");
    setTriangleType("");
    setTriangleClass("");
    setPerimeter(null);
    setArea(null);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "th" ? "en" : "th"));
  };

  return (
    <div className="flex bg-white h-screen w-screen">
      <div className="flex flex-col items-center justify-center h-full w-full md:w-1/2 bg-[#faede1]">
        <div className="flex items-center">
          <FaHome className="text-[#fe9f73] text-3xl mr-2" />
          <div className="flex items-center bg-[#fcc1a2] rounded-lg px-4 py-2">
            <FaSearch className="text-white text-xl mr-2 " />
            <input
              type="text"
              className="flex-grow bg-transparent outline-none text-white"
            />
          </div>
          <FaEllipsisH className="text-[#fe9f73] text-3xl ml-2" />
        </div>
        <h1 className="text-[80px] font-bold text-white">
          {language === "th" ? "สามเหลี่ยม" : "Triangle"}
        </h1>
        <div className="w-[400px] h-[250px] bg-white rounded-xl">
          <div className="m-4 p-2 flex flex-col items-center justify-center">
            {triangleType ? (
              <div className="text-center">
                <div className="mx-auto flex justify-center">
                  {triangleType === "equilateral" && (
                    <Image src={triangleImages.equilateral} alt="Equilateral Triangle" width={200} height={200} />
                  )}
                  {triangleType === "isosceles" && (
                    <Image src={triangleImages.isosceles} alt="Isosceles Triangle" width={200} height={200} />
                  )}
                  {triangleType === "right" && (
                    <Image src={triangleImages.right} alt="Right Triangle" width={200} height={200} />
                  )}
                  {triangleType === "scalene" && (
                    <Image src={triangleImages.scalene} alt="Scalene Triangle" width={200} height={200} />
                  )}
                </div>

                {/* Area and perimeter box below the image inside the white box */}
                {perimeter && area !== null && (
                  <div className="mt-4 p-4 bg-[#fe9f73] rounded-xl">
                    <p className="text-lg text-white">{language === "th" ? "ขนาด" : "Area"}: {area.toFixed(2)}</p>
                    <p className="text-lg text-white">{language === "th" ? "เส้นรอบรูป" : "Perimeter"}: {perimeter}</p>
                  </div>
                )}
              </div>
            ) : (
              // Show default equilateral triangle image before calculation
              <div className="text-center flex flex-col items-center justify-center">
                <Image src={triangleImages.icon} alt="Equilateral Triangle" width={200} height={200} />
              </div>
            )}
          </div>
        </div>

        <button
          className="flex flex-row items-center mt-24 px-2 py-2 bg-[#fe9f73] text-white rounded-full hover:bg-[#ff8952]"
          onClick={toggleLanguage}
        >
          <FaGlobe className="mr-2 text-3xl" /> {/* Add the icon here */}
          {language === "th" ? "ไทย" : "English"}
        </button>
      </div>
      <div className="flex flex-col items-center justify-center h-full w-full md:w-1/2">
        <div className="flex flex-col items-center justify-center gap-4 w-3/4 md:w-1/2">
          <input
            type="number"
            value={sideA}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSideA(e.target.value)
            }
            placeholder={language === "th" ? "กรอกด้านที่ 1 ที่นี่ ..." : "type the side1 here ..."}
            className="p-2 bg-[#fec960] text-white rounded-lg placeholder-white text-center"
          />
          <input
            type="number"
            value={sideB}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSideB(e.target.value)
            }
            placeholder={language === "th" ? "กรอกด้านที่ 2 ที่นี่ ..." : "type the side2 here ..."}
            className="p-2 bg-[#fe95b6] text-white rounded-lg placeholder-white text-center"
          />
          <input
            type="number"
            value={sideC}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSideC(e.target.value)
            }
            placeholder={language === "th" ? "กรอกด้านที่ 3 ที่นี่ ..." : "type the side3 here ..."}
            className="p-2 bg-[#fe9f73] text-white rounded-lg placeholder-white text-center"
          />

          <div className="flex gap-4 mt-6">
            <button
              className="Btn1 px-6 py-2 text-center text-white rounded-lg hover:bg-[#f55454]"
              onClick={resetInputs}
            >
              {language === "th" ? "รีเซ็ต" : "Reset"}
            </button>
            <button
              className="Btn2 px-6 py-2 text-center text-white rounded-lg hover:bg-[#2c9968]"
              onClick={calculateTriangle}
            >
              {language === "th" ? "คำนวณ" : "Calculate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
