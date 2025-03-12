"use client";

import { useState, useRef } from "react";
import { Upload, MoveLeft, MoveRight, MoveUp, MoveDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";

interface Position {
  x: number;
  y: number;
}

export default function Home() {
  const [images, setImages] = useState<{
    figma: string | null;
    screenshot: string | null;
  }>({
    figma: null,
    screenshot: null,
  });
  const [opacity, setOpacity] = useState(0.5);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-primary");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("border-primary");
  };

  const handleDrop = (type: "figma" | "screenshot") => (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-primary");
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => ({
          ...prev,
          [type]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput =
    (type: "figma" | "screenshot") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages((prev) => ({
            ...prev,
            [type]: reader.result as string,
          }));
        };
        reader.readAsDataURL(file);
      }
    };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (overlayRef.current) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && overlayRef.current) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const adjustPosition = (direction: "left" | "right" | "up" | "down") => {
    const step = 1;
    const adjustments = {
      left: { x: -step, y: 0 },
      right: { x: step, y: 0 },
      up: { x: 0, y: -step },
      down: { x: 0, y: step },
    };
    setPosition((prev) => ({
      x: prev.x + adjustments[direction].x,
      y: prev.y + adjustments[direction].y,
    }));
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Design Comparison Tool
          </h1>
          <p className="mt-4 text-gray-400 text-lg">
            Figmaデザインとスクリーンショットを完璧に比較
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Figma Design Upload */}
          <Card className="bg-[#1A1A1A] border-[#2A2A2A] p-8">
            <div className="flex flex-col items-center gap-6">
              <h2 className="text-2xl font-semibold text-white">
                Figmaデザイン
              </h2>
              <div
                className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed border-gray-700 transition-all duration-300 hover:border-blue-500 bg-[#111111]"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop("figma")}
              >
                {images.figma ? (
                  <Image
                    src={images.figma}
                    alt="Figma design"
                    className="w-full h-full object-contain"
                    fill
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Upload className="w-16 h-16 text-gray-600 mb-4" />
                    <p className="text-gray-400 text-center px-4">
                      ドラッグ＆ドロップ
                      <br />
                      または
                      <br />
                      クリックしてアップロード
                    </p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput("figma")}
                className="hidden"
                id="figma-image"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById("figma-image")?.click()}
                className="w-full bg-blue-500/10 border-blue-500/50 hover:bg-blue-500/20 text-blue-400"
              >
                Figmaデザインをアップロード
              </Button>
            </div>
          </Card>

          {/* Screenshot Upload */}
          <Card className="bg-[#1A1A1A] border-[#2A2A2A] p-8">
            <div className="flex flex-col items-center gap-6">
              <h2 className="text-2xl font-semibold text-white">
                スクリーンショット
              </h2>
              <div
                className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed border-gray-700 transition-all duration-300 hover:border-purple-500 bg-[#111111]"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop("screenshot")}
              >
                {images.screenshot ? (
                  <Image
                    src={images.screenshot}
                    alt="App screenshot"
                    className="w-full h-full object-contain"
                    fill
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Upload className="w-16 h-16 text-gray-600 mb-4" />
                    <p className="text-gray-400 text-center px-4">
                      ドラッグ＆ドロップ
                      <br />
                      または
                      <br />
                      クリックしてアップロード
                    </p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput("screenshot")}
                className="hidden"
                id="screenshot-image"
              />
              <Button
                variant="outline"
                onClick={() =>
                  document.getElementById("screenshot-image")?.click()
                }
                className="w-full bg-purple-500/10 border-purple-500/50 hover:bg-purple-500/20 text-purple-400"
              >
                スクリーンショットをアップロード
              </Button>
            </div>
          </Card>
        </div>

        {/* Overlay Comparison View */}
        {images.figma && images.screenshot && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              オーバーレイ比較
            </h2>

            {/* Controls */}
            <Card className="bg-[#1A1A1A] border-[#2A2A2A] p-6 mb-8">
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <span className="text-sm font-medium text-gray-400 w-24">
                    透明度
                  </span>
                  <Slider
                    value={[opacity * 100]}
                    onValueChange={([value]) => setOpacity(value / 100)}
                    max={100}
                    step={1}
                    className="w-full [&_.relative]:bg-gray-500 [&_[role=slider]]:bg-purple-500 [&_[role=slider]]:border-purple-400"
                  />
                  <span className="text-sm font-medium text-gray-400 w-16">
                    {Math.round(opacity * 100)}%
                  </span>
                </div>

                <div className="flex justify-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => adjustPosition("left")}
                    className="bg-gray-800/50 border-gray-700 hover:bg-gray-800"
                  >
                    <MoveLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => adjustPosition("right")}
                    className="bg-gray-800/50 border-gray-700 hover:bg-gray-800"
                  >
                    <MoveRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => adjustPosition("up")}
                    className="bg-gray-800/50 border-gray-700 hover:bg-gray-800"
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => adjustPosition("down")}
                    className="bg-gray-800/50 border-gray-700 hover:bg-gray-800"
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Comparison View */}
            <Card className="bg-[#1A1A1A] border-[#2A2A2A] p-1 overflow-hidden">
              <div
                className="relative w-full aspect-video bg-[#111111] rounded-lg overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <Image
                  src={images.figma}
                  alt="Figma design"
                  className="absolute inset-0 w-full h-full object-contain"
                  fill
                  unoptimized
                />
                <div
                  ref={overlayRef}
                  className="absolute inset-0 cursor-move"
                  onMouseDown={handleMouseDown}
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                  }}
                >
                  <Image
                    src={images.screenshot}
                    alt="App screenshot"
                    className="w-full h-full object-contain"
                    style={{ opacity }}
                    fill
                    unoptimized
                  />
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
