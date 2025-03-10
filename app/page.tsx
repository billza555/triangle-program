"use client";

import { useState } from "react";
import { FaGlobe, FaHome, FaEllipsisH, FaSearch } from "react-icons/fa";
import Image from "next/image";
import equilateralImg from "./assets/images/equilateral.png";
import isoscelesImg from "./assets/images/isosceles.png";
import rightTriangleImg from "./assets/images/right_triangle.png";
import scaleneImg from "./assets/images/scalene.png";
import iconImg from "./assets/images/Image_Icon.png";
import Swal from "sweetalert2";

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

  // State สำหรับจัดการ dropdown
  const [searchInput, setSearchInput] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedTriangle, setSelectedTriangle] = useState<string | null>(null);

  const triangleImages = {
    equilateral: equilateralImg,
    isosceles: isoscelesImg,
    right: rightTriangleImg,
    scalene: scaleneImg,
    icon: iconImg,
  };

  // เพิ่มข้อมูลตัวอย่างสำหรับแต่ละประเภทสามเหลี่ยม
  const triangleExamples = {
    equilateral: {
      title: language === "th" ? "สามเหลี่ยมด้านเท่า" : "Equilateral Triangle",
      sides: ["10", "10", "10"],
    },
    isosceles: {
      title: language === "th" ? "สามเหลี่ยมหน้าจั่ว" : "Isosceles Triangle",
      sides: ["10", "10", "14"],
    },
    right: {
      title: language === "th" ? "สามเหลี่ยมมุมฉาก" : "Right Triangle",
      sides: ["3", "4", "5"],
    },
    scalene: {
      title: language === "th" ? "สามเหลี่ยมด้านไม่เท่า" : "Scalene Triangle",
      sides: ["7", "8", "9"],
    },
  };

  const isValidNumber = (value: string): boolean => {
    const regex = /^\d+(\.\d{1,2})?$/; // ตรวจสอบว่ามีทศนิยมไม่เกิน 2 ตำแหน่ง
    return regex.test(value) && parseFloat(value) > 0;
  };

  // ฟังก์ชั่นสำหรับจัดการการเลือกประเภทสามเหลี่ยม
  const handleTriangleSelect = (type: string) => {
    setSelectedTriangle(type);
    setSearchInput(triangleExamples[type].title);
    setShowDropdown(false);

    // ตั้งค่าตัวอย่างด้านทั้งสาม
    setSideA(triangleExamples[type].sides[0]);
    setSideB(triangleExamples[type].sides[1]);
    setSideC(triangleExamples[type].sides[2]);
  };

  const calculateTriangle = () => {
    if (
      !isValidNumber(sideA) ||
      !isValidNumber(sideB) ||
      !isValidNumber(sideC)
    ) {
      Swal.fire({
        icon: "error",
        title: language === "th" ? "ข้อผิดพลาด" : "Error",
        text:
          language === "th"
            ? "กรุณากรอกตัวเลขที่มากกว่า 0 และมีทศนิยมไม่เกิน 2 ตำแหน่ง"
            : "Please enter a number greater than 0 with up to 2 decimal places.",
      });
      return;
    }

    const a = parseFloat(sideA);
    const b = parseFloat(sideB);
    const c = parseFloat(sideC);

    if (a + b <= c || a + c <= b || b + c <= a) {
      Swal.fire({
        icon: "error",
        title: language === "th" ? "ข้อผิดพลาด" : "Error",
        text:
          language === "th"
            ? "ด้านที่กรอกไม่สามารถเป็นสามเหลี่ยมได้"
            : "The sides do not form a triangle.",
      });
      return;
    }

    let newTriangleClass = "";
    const calculatedPerimeter = a + b + c;
    let calculatedArea = 0;

    if (a === b && b === c) {
      setTriangleType("equilateral");
      newTriangleClass = "border-b-[100px] border-blue-500";
      calculatedArea = (Math.sqrt(3) / 4) * a * a;
    } else if (a === b || b === c || a === c) {
      setTriangleType("isosceles");
      newTriangleClass = "border-b-[100px] border-yellow-500";
      const s = (a + b + c) / 2;
      calculatedArea = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    } else if (
      a * a + b * b === c * c ||
      a * a + c * c === b * b ||
      b * b + c * c === a * a
    ) {
      setTriangleType("right");
      newTriangleClass = "bg-green-500 w-[100px] h-[100px] clip-path-polygon";
      calculatedArea = 0.5 * a * b;
    } else {
      setTriangleType("scalene");
      newTriangleClass = "border-b-[100px] border-red-500";
      const s = (a + b + c) / 2;
      calculatedArea = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    }

    setPerimeter(calculatedPerimeter);
    setArea(calculatedArea);
    setTriangleClass(newTriangleClass);
  };

  const resetInputs = () => {
    setSideA("");
    setSideB("");
    setSideC("");
    setTriangleType("");
    setTriangleClass("");
    setPerimeter(null);
    setArea(null);
    setSearchInput("");
    setSelectedTriangle(null);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "th" ? "en" : "th"));
  };

  // แก้ไข Search Bar component ให้มี dropdown
  const SearchBarWithDropdown = () => (
    <div className="relative">
      <div className="flex items-center bg-[#fcc1a2] rounded-lg px-4 py-2">
        <FaSearch className="text-white text-xl mr-2" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          className="flex-grow bg-transparent outline-none text-white placeholder-white"
          placeholder={
            language === "th"
              ? "ค้นหาประเภทสามเหลี่ยม..."
              : "Search triangle types..."
          }
        />
      </div>

      {showDropdown && (
        <div className="absolute mt-1 w-full bg-white rounded-lg shadow-lg z-10">
          {Object.keys(triangleExamples).map((type) => (
            <div
              key={type}
              className="px-4 py-2 hover:bg-[#faede1] cursor-pointer flex items-center"
              onClick={() => handleTriangleSelect(type)}
            >
              <div className="w-8 h-8 mr-2">
                <Image
                  src={triangleImages[type]}
                  alt={triangleExamples[type].title}
                  width={32}
                  height={32}
                />
              </div>
              <div>
                <p className="font-medium">{triangleExamples[type].title}</p>
                <p className="text-sm text-gray-500">
                  {language === "th" ? "ด้าน: " : "Sides: "}
                  {triangleExamples[type].sides.join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ส่วนแสดงคำแนะนำ
  const renderRecommendation = () => {
    if (!selectedTriangle) return null;

    return (
      <div className="mt-2 p-2 bg-[#f9f1e8] rounded-lg text-sm">
        <p className="font-medium mb-1">
          {language === "th" ? "แนะนำ: " : "Recommendation: "}
          {triangleExamples[selectedTriangle].title}
        </p>
        <div className="flex gap-2 mt-1">
          <button
            className="px-2 py-1 bg-[#fe9f73] text-white text-xs rounded-md hover:bg-[#ff8952]"
            onClick={() => {
              setSideA(triangleExamples[selectedTriangle].sides[0]);
              setSideB(triangleExamples[selectedTriangle].sides[1]);
              setSideC(triangleExamples[selectedTriangle].sides[2]);
            }}
          >
            {language === "th" ? "ใช้ค่าตัวอย่าง" : "Use example values"}
          </button>
          <button
            className="px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded-md hover:bg-gray-400"
            onClick={() => setSelectedTriangle(null)}
          >
            {language === "th" ? "ยกเลิก" : "Cancel"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex bg-white h-screen w-screen">
      <div className="flex flex-col items-center justify-center h-full w-full md:w-1/2 bg-[#faede1]">
        <div className="flex items-center">
          <FaHome className="text-[#fe9f73] text-3xl mr-2" />
          <SearchBarWithDropdown />
          <FaEllipsisH className="text-[#fe9f73] text-3xl ml-2" />
        </div>

        {/* แสดงคำแนะนำหลังจาก Search */}
        {renderRecommendation()}

        <h1 className="text-[80px] font-bold text-white">
          {language === "th" ? "สามเหลี่ยม" : "Triangle"}
        </h1>
        <div className="w-[400px] h-[250px] bg-white rounded-xl">
          <div className="m-4 p-2 flex flex-col items-center justify-center">
            {triangleType ? (
              <div className="text-center">
                <div className="mx-auto flex justify-center">
                  {triangleType === "equilateral" && (
                    <Image
                      src={triangleImages.equilateral}
                      alt="Equilateral Triangle"
                      width={200}
                      height={200}
                    />
                  )}
                  {triangleType === "isosceles" && (
                    <Image
                      src={triangleImages.isosceles}
                      alt="Isosceles Triangle"
                      width={200}
                      height={200}
                    />
                  )}
                  {triangleType === "right" && (
                    <Image
                      src={triangleImages.right}
                      alt="Right Triangle"
                      width={200}
                      height={200}
                    />
                  )}
                  {triangleType === "scalene" && (
                    <Image
                      src={triangleImages.scalene}
                      alt="Scalene Triangle"
                      width={200}
                      height={200}
                    />
                  )}
                </div>

                {/* Area and perimeter box below the image inside the white box */}
                {perimeter && area !== null && (
                  <div className="mt-4 p-4 bg-[#fe9f73] rounded-xl">
                    <p className="text-lg text-white">
                      {language === "th" ? "ขนาด" : "Area"}: {area.toFixed(2)}
                    </p>
                    <p className="text-lg text-white">
                      {language === "th" ? "เส้นรอบรูป" : "Perimeter"}:{" "}
                      {perimeter}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // Show default equilateral triangle image before calculation
              <div className="text-center flex flex-col items-center justify-center">
                <Image
                  src={triangleImages.icon}
                  alt="Equilateral Triangle"
                  width={200}
                  height={200}
                />
              </div>
            )}
          </div>
        </div>

        <button
          className="flex flex-row items-center mt-24 px-2 py-2 bg-[#fe9f73] text-white rounded-full hover:bg-[#ff8952]"
          onClick={toggleLanguage}
        >
          <FaGlobe className="mr-2 text-3xl" />
          {language === "th" ? "ไทย" : "ENGLISH"}
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
            placeholder={
              language === "th"
                ? "กรอกด้านที่ 1 ที่นี่ ..."
                : "type the side1 here ..."
            }
            className="p-2 bg-[#fec960] text-white rounded-lg placeholder-white text-center"
            step="0.01"
          />
          <input
            type="number"
            value={sideB}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSideB(e.target.value)
            }
            placeholder={
              language === "th"
                ? "กรอกด้านที่ 2 ที่นี่ ..."
                : "type the side2 here ..."
            }
            className="p-2 bg-[#fe95b6] text-white rounded-lg placeholder-white text-center"
            step="0.01"
          />
          <input
            type="number"
            value={sideC}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSideC(e.target.value)
            }
            placeholder={
              language === "th"
                ? "กรอกด้านที่ 3 ที่นี่ ..."
                : "type the side3 here ..."
            }
            className="p-2 bg-[#fe9f73] text-white rounded-lg placeholder-white text-center"
            step="0.01"
          />

          <div className="flex gap-4 mt-6">
            <button
              className="Btn1 px-6 py-2 text-center text-white rounded-lg hover:bg-[#f55454]"
              onClick={resetInputs}
            >
              {language === "th" ? "รีเซ็ต" : "reset"}
            </button>
            <button
              className="Btn2 px-6 py-2 text-center text-white rounded-lg hover:bg-[#2c9968]"
              onClick={calculateTriangle}
            >
              {language === "th" ? "คำนวณ" : "calculate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
