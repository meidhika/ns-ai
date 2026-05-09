"use client";

import { useRef, useState, useEffect } from "react";
import { Eraser, Pencil } from "lucide-react";

interface CanvasAttachmentProps {
  mode: "input" | "view";
  initialImage?: string; 
  onSave?: (dataUrl: string) => void;
}

export default function CanvasAttachment({
  mode,
  initialImage,
  onSave,
}: CanvasAttachmentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Inisialisasi background putih untuk Canvas
  useEffect(() => {
    if (mode === "input" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [mode]);

  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (mode === "view") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x =
      "touches" in e
        ? e.touches[0].clientX - rect.left
        : (e as React.MouseEvent).clientX - rect.left;
    const y =
      "touches" in e
        ? e.touches[0].clientY - rect.top
        : (e as React.MouseEvent).clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing || mode === "view") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x =
      "touches" in e
        ? e.touches[0].clientX - rect.left
        : (e as React.MouseEvent).clientX - rect.left;
    const y =
      "touches" in e
        ? e.touches[0].clientY - rect.top
        : (e as React.MouseEvent).clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current && onSave) {
      onSave(canvasRef.current.toDataURL("image/png"));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (onSave) onSave(canvas.toDataURL("image/png"));
    }
  };

  if (mode === "view") {
    return (
      <div className="relative rounded-xl overflow-hidden border border-border shadow-sm group bg-white p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={initialImage}
          alt="Canvas Drawing"
          className="max-h-80 w-auto object-contain"
        />
      </div>
    );
  }

  // MODE INPUT
  return (
    <div className="flex flex-col gap-2 p-2 rounded-xl border border-border bg-muted/20 w-max shadow-sm">
      <div className="flex gap-2 mb-1">
        <button
          onClick={clearCanvas}
          className="p-1.5 bg-background border border-border rounded-md text-muted-foreground hover:text-destructive flex items-center gap-1 text-xs font-medium"
        >
          <Eraser size={14} /> Clear
        </button>
        <div className="px-2 py-1.5 flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <Pencil size={14} /> Draw inside the box
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="border border-border bg-white rounded-lg cursor-crosshair touch-none shadow-sm"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    </div>
  );
}
