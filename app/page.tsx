"use client";

import { useState, useEffect } from "react";
import {
  FaGlobe,
  FaHome,
  FaEllipsisH,
  FaSearch,
  FaChevronDown,
} from "react-icons/fa";
import Image from "next/image";
import equilateralImg from "./assets/images/equilateral.png";
import isoscelesImg from "./assets/images/isosceles.png";
import rightTriangleImg from "./assets/images/right_triangle.png";
import scaleneImg from "./assets/images/scalene.png";
import iconImg from "./assets/images/Image_Icon.png";
import Swal from "sweetalert2";

type TriangleType = "" | "equilateral" | "isosceles" | "right" | "scalene";

export default function Home() {
  const [sideA, setSideA] = useState<string>("");
  const [sideB, setSideB] = useState<string>("");
  const [sideC, setSideC] = useState<string>("");
  const [triangleType, setTriangleType] = useState<TriangleType>("");
  const [selectedType, setSelectedType] = useState<TriangleType>("");
  const [, setTriangleClass] = useState<string>("");
  const [language, setLanguage] = useState<"th" | "en">("th");
  const [perimeter, setPerimeter] = useState<number | null>(null);
  const [area, setArea] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const triangleImages = {
    equilateral: equilateralImg,
    isosceles: isoscelesImg,
    right: rightTriangleImg,
    scalene: scaleneImg,
    icon: iconImg,
  };

  const triangleTypeLabels: Record<TriangleType, { th: string; en: string }> = {
    "": { th: "เลือกชนิดสามเหลี่ยม", en: "Select triangle type" },
    equilateral: { th: "สามเหลี่ยมด้านเท่า", en: "Equilateral" },
    isosceles: { th: "สามเหลี่ยมหน้าจั่ว", en: "Isosceles" },
    right: { th: "สามเหลี่ยมมุมฉาก", en: "Right" },
    scalene: { th: "สามเหลี่ยมด้านไม่เท่า", en: "Scalene" },
  };

  const isValidNumber = (value: string): boolean => {
    const regex = /^\d+(\.\d{1,2})?$/;
    return regex.test(value) && parseFloat(value) > 0;
  };

  useEffect(() => {
    if (triangleType) {
      setSelectedType(triangleType);
    }
  }, [triangleType]);

  const canFormTriangle = (a: number, b: number, c: number): boolean => {
    return a + b > c && a + c > b && b + c > a;
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
      Math.abs(a * a + b * b - c * c) < 0.01 ||
      Math.abs(a * a + c * c - b * b) < 0.01 ||
      Math.abs(b * b + c * c - a * a) < 0.01
    ) {
      setTriangleType("right");
      newTriangleClass = "bg-green-500 w-[100px] h-[100px] clip-path-polygon";
      let base, height;
      if (a * a + b * b - c * c < 0.01) {
        base = a;
        height = b;
      } else if (a * a + c * c - b * b < 0.01) {
        base = a;
        height = c;
      } else {
        base = b;
        height = c;
      }
      calculatedArea = 0.5 * base * height;
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
    setSelectedType("");
    setTriangleClass("");
    setPerimeter(null);
    setArea(null);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "th" ? "en" : "th"));
  };

  const suggestTriangleSides = (type: TriangleType) => {
    setSelectedType(type);
  
    const defaultSide = 5;
    
    const validSides = [];
    if (isValidNumber(sideA))
      validSides.push({ side: "A", value: parseFloat(sideA) });
    if (isValidNumber(sideB))
      validSides.push({ side: "B", value: parseFloat(sideB) });
    if (isValidNumber(sideC))
      validSides.push({ side: "C", value: parseFloat(sideC) });
  
    let referenceSide = validSides.length > 0 ? validSides[0].value : defaultSide;

    referenceSide = Math.round(referenceSide * 100) / 100;
  
    let suggestedSides = {
      A: isValidNumber(sideA) ? parseFloat(sideA) : null,
      B: isValidNumber(sideB) ? parseFloat(sideB) : null,
      C: isValidNumber(sideC) ? parseFloat(sideC) : null,
    };
  
    let message = "";
  
    switch (type) {
      case "equilateral":
        suggestedSides = {
          A: referenceSide,
          B: referenceSide,
          C: referenceSide,
        };
        message =
          language === "th"
            ? `สามเหลี่ยมด้านเท่าต้องมีด้านทั้งสามเท่ากัน: ${referenceSide}`
            : `Equilateral triangle requires all sides to be equal: ${referenceSide}`;
        break;
  
      case "isosceles":
        if (validSides.length === 0 || validSides.length === 1) {
          const thirdSide = parseFloat((referenceSide * 1.5).toFixed(2));
  
          suggestedSides = {
            A: referenceSide,
            B: referenceSide,
            C: thirdSide,
          };
          message =
            language === "th"
              ? `สามเหลี่ยมหน้าจั่วต้องมีด้านเท่ากันอย่างน้อย 2 ด้าน, แนะนำ: A=${referenceSide}, B=${referenceSide}, C=${thirdSide}`
              : `Isosceles triangle requires at least 2 equal sides, suggested: A=${referenceSide}, B=${referenceSide}, C=${thirdSide}`;
        } else if (validSides.length >= 2) {
          validSides.sort((a, b) => a.value - b.value);

          const currentTriangleValid = validSides.length >= 3 && 
                                      (validSides[0].value + validSides[1].value > validSides[2].value);
          const allEqual = 
            isValidNumber(sideA) &&
            isValidNumber(sideB) &&
            isValidNumber(sideC) &&
            parseFloat(sideA) === parseFloat(sideB) &&
            parseFloat(sideB) === parseFloat(sideC);
  
          if (allEqual) {

            const baseValue = parseFloat(sideA);
            const newThirdSide = parseFloat((baseValue * 1.5).toFixed(2));
            
            suggestedSides = {
              A: baseValue,
              B: baseValue,
              C: newThirdSide,
            };
            
            message = language === "th"
              ? `เปลี่ยนจากสามเหลี่ยมด้านเท่าเป็นสามเหลี่ยมหน้าจั่ว: A=${baseValue}, B=${baseValue}, C=${newThirdSide}`
              : `Change from equilateral to isosceles: A=${baseValue}, B=${baseValue}, C=${newThirdSide}`;
          } else if (!currentTriangleValid) {
            const smallestSide = validSides[0].value;
            
            suggestedSides = {
              A: smallestSide,
              B: smallestSide,
              C: smallestSide * 1.8,
            };
            
            message = language === "th"
              ? `สามเหลี่ยมหน้าจั่วแนะนำ: A=${smallestSide}, B=${smallestSide}, C=${(smallestSide * 1.8).toFixed(2)}`
              : `Suggested isosceles triangle: A=${smallestSide}, B=${smallestSide}, C=${(smallestSide * 1.8).toFixed(2)}`;
          } else {
            let sideToAdjust = "C";
            let valueToUse = validSides[0].value;
            
            if (validSides[0].value === validSides[1].value) {
              sideToAdjust = "C";
              valueToUse = validSides[0].value;
            } else if (validSides[1].value === validSides[2].value) {
              valueToUse = validSides[1].value;
            } else {
              sideToAdjust = "B";
              valueToUse = validSides[0].value;
            }
            
            suggestedSides = {
              A: sideToAdjust === "A" ? valueToUse : validSides[0].value,
              B: sideToAdjust === "B" ? valueToUse : validSides[1].value,
              C: sideToAdjust === "C" ? valueToUse : validSides[2].value,
            };
            
            message = language === "th"
              ? `สามเหลี่ยมหน้าจั่วต้องมีด้านเท่ากันอย่างน้อย 2 ด้าน, แนะนำให้ปรับด้าน ${sideToAdjust}`
              : `Isosceles triangle requires at least 2 equal sides, suggested adjusting side ${sideToAdjust}`;
          }
        }
        break;
  
      case "right":
        let scale = referenceSide / 3;
  
        scale = Math.round(scale * 100) / 100;
  
        if (Math.abs(scale - Math.round(scale)) < 0.01) {
          scale = Math.round(scale);
        }
  
        const rightSideA = parseFloat((3 * scale).toFixed(2));
        const rightSideB = parseFloat((4 * scale).toFixed(2));
        const rightSideC = parseFloat((5 * scale).toFixed(2));
  
        const a = rightSideA;
        const b = rightSideB;
        const c = rightSideC;

        if (a + b <= c || a + c <= b || b + c <= a) {
          const newScale = referenceSide / 5;
          const adjustedA = parseFloat((5 * newScale).toFixed(2));
          const adjustedB = parseFloat((12 * newScale).toFixed(2)); 
          const adjustedC = parseFloat((13 * newScale).toFixed(2));
          
          suggestedSides = {
            A: adjustedA,
            B: adjustedB, 
            C: adjustedC
          };
          
          message = language === "th"
            ? `สามเหลี่ยมมุมฉากแนะนำอัตราส่วน 5:12:13, ได้: A=${adjustedA}, B=${adjustedB}, C=${adjustedC}`
            : `Right triangle suggested with 5:12:13 ratio: A=${adjustedA}, B=${adjustedB}, C=${adjustedC}`;
        } else {
          suggestedSides = {
            A: rightSideA,
            B: rightSideB,
            C: rightSideC,
          };
          
          message = language === "th"
            ? `สามเหลี่ยมมุมฉากแนะนำอัตราส่วน 3:4:5, ได้: A=${rightSideA}, B=${rightSideB}, C=${rightSideC}`
            : `Right triangle suggested with 3:4:5 ratio: A=${rightSideA}, B=${rightSideB}, C=${rightSideC}`;
        }
        break;
  
      case "scalene":
        if (validSides.length >= 3) {
          validSides.sort((a, b) => a.value - b.value);
        }
  
        const smallestSide = validSides.length > 0 ? validSides[0].value : referenceSide;

        const scaleneSideB = parseFloat((smallestSide * 1.4).toFixed(2));
        const scaleneSideC = parseFloat((smallestSide * 2.2).toFixed(2));

        if (smallestSide + scaleneSideB <= scaleneSideC) {

          const adjustedC = parseFloat((smallestSide + scaleneSideB - 0.01).toFixed(2));
          
          suggestedSides = {
            A: smallestSide,
            B: scaleneSideB,
            C: adjustedC
          };
          
          message = language === "th"
            ? `สามเหลี่ยมด้านไม่เท่าต้องมีด้านไม่เท่ากันทั้งสามด้าน, แนะนำ: A=${smallestSide}, B=${scaleneSideB}, C=${adjustedC}`
            : `Scalene triangle requires all sides to be different, suggested: A=${smallestSide}, B=${scaleneSideB}, C=${adjustedC}`;
        } else {
          suggestedSides = {
            A: smallestSide,
            B: scaleneSideB,
            C: scaleneSideC
          };
          
          message = language === "th"
            ? `สามเหลี่ยมด้านไม่เท่าต้องมีด้านไม่เท่ากันทั้งสามด้าน, แนะนำ: A=${smallestSide}, B=${scaleneSideB}, C=${scaleneSideC}`
            : `Scalene triangle requires all sides to be different, suggested: A=${smallestSide}, B=${scaleneSideB}, C=${scaleneSideC}`;
        }
        break;
    }
  
    Swal.fire({
      title: language === "th" ? "ข้อเสนอแนะ" : "Suggestion",
      text: message,
      icon: "info",
      showCancelButton: true,
      confirmButtonText:
        language === "th" ? "ใช้ค่าที่แนะนำ" : "Use suggested values",
      cancelButtonText: language === "th" ? "ยกเลิก" : "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {

        if (suggestedSides.A !== null && suggestedSides.B !== null && suggestedSides.C !== null) {

          const a = suggestedSides.A;
          const b = suggestedSides.B;
          const c = suggestedSides.C;
          

          if (a + b <= c || a + c <= b || b + c <= a) {

            const base = Math.min(a, b, c);
            suggestedSides.A = base;
            suggestedSides.B = base;
            suggestedSides.C = base * 1.5;
          }

          if (suggestedSides.A !== null) {
            const formattedA = Number.isInteger(suggestedSides.A)
              ? suggestedSides.A.toString()
              : suggestedSides.A.toFixed(2);
            setSideA(formattedA);
          }
  
          if (suggestedSides.B !== null) {
            const formattedB = Number.isInteger(suggestedSides.B)
              ? suggestedSides.B.toString()
              : suggestedSides.B.toFixed(2);
            setSideB(formattedB);
          }
  
          if (suggestedSides.C !== null) {
            const formattedC = Number.isInteger(suggestedSides.C)
              ? suggestedSides.C.toString()
              : suggestedSides.C.toFixed(2);
            setSideC(formattedC);
          }
        }
        

        setTimeout(() => {

          const a = parseFloat(sideA);
          const b = parseFloat(sideB);
          const c = parseFloat(sideC);
          
          if (isValidNumber(sideA) && isValidNumber(sideB) && isValidNumber(sideC)) {
            if (a + b > c && a + c > b && b + c > a) {
              calculateTriangle();
            } else {

              Swal.fire({
                icon: "info",
                title: language === "th" ? "ข้อความ" : "Message",
                text: language === "th" 
                  ? "ได้ปรับค่าให้เป็นสามเหลี่ยม โปรดกดคำนวณอีกครั้ง" 
                  : "Values have been adjusted. Please press Calculate again."
              });
            }
          }
        }, 150);
      }
    });
  };

  return (
    <div className="flex bg-white h-screen w-screen">
      <div className="flex flex-col items-center justify-center h-full w-full md:w-1/2 bg-[#faede1]">
        <div className="flex items-center">
          <FaHome className="text-[#fe9f73] text-3xl mr-2" />
          <div className="relative">
            <div
              className="flex items-center bg-[#fcc1a2] rounded-lg px-4 py-2 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <FaSearch className="text-white text-xl mr-2" />
              <div className="flex-grow text-white">
                {triangleTypeLabels[selectedType][language]}
              </div>
              <FaChevronDown className="text-white ml-2" />
            </div>

            {dropdownOpen && (
              <div className="absolute mt-1 w-full bg-white rounded-lg shadow-lg z-10">
                {(Object.keys(triangleTypeLabels) as TriangleType[])
                  .filter((type) => type !== "")
                  .map((type) => (
                    <div
                      key={type}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        suggestTriangleSides(type);
                        setDropdownOpen(false);
                      }}
                    >
                      {triangleTypeLabels[type][language]}
                    </div>
                  ))}
              </div>
            )}
          </div>
          <FaEllipsisH className="text-[#fe9f73] text-3xl ml-2" />
        </div>
        <h1 className="text-[60px] font-bold text-white">
          {selectedType
            ? triangleTypeLabels[selectedType][language]
            : language === "th" 
            ? "สามเหลี่ยม"
            : "Triangle"}
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