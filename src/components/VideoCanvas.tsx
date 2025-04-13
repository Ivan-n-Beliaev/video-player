import React, { useRef, useEffect, useState } from "react";

type VideoCanvasProps = {
  video: HTMLVideoElement | null;
};

const VideoCanvas: React.FC<VideoCanvasProps> = ({ video }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);

  // Dynamically set canvas size to match video resolution
  useEffect(() => {
    if (!video || !canvasRef.current) return;
    if (video.videoWidth && video.videoHeight) {
      canvasRef.current.width = video.videoWidth;
      canvasRef.current.height = video.videoHeight;
    }
  }, [video?.videoWidth, video?.videoHeight, video]);

  // Draw current video frame to canvas using requestVideoFrameCallback if available
  useEffect(() => {
    if (!video || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    let stopped = false;

    function drawFrame() {
      if (stopped || !video || !ctx) return;
      ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      if (video.readyState >= 2) {
        const w = video.videoWidth * zoom;
        const h = video.videoHeight * zoom;
        const x = offset.x + (canvasRef.current!.width - w) / 2;
        const y = offset.y + (canvasRef.current!.height - h) / 2;
        ctx.drawImage(video, x, y, w, h);
      }
    }

    // Use requestVideoFrameCallback if available for smooth updates
    function onFrame() {
      drawFrame();
      if (!stopped && video && "requestVideoFrameCallback" in video) {
        (video as any).requestVideoFrameCallback(onFrame);
      }
    }

    if (video && "requestVideoFrameCallback" in video) {
      (video as any).requestVideoFrameCallback(onFrame);
    } else if (video) {
      // Fallback: redraw on timeupdate and seeked
      const fallbackDraw = () => drawFrame();
      (video as HTMLVideoElement).addEventListener("timeupdate", fallbackDraw);
      (video as HTMLVideoElement).addEventListener("seeked", fallbackDraw);
      // Also draw once initially
      drawFrame();
      return () => {
        stopped = true;
        (video as HTMLVideoElement).removeEventListener("timeupdate", fallbackDraw);
        (video as HTMLVideoElement).removeEventListener("seeked", fallbackDraw);
      };
    }

    return () => {
      stopped = true;
    };
  }, [video, zoom, offset]);

  // Basic pan with mouse drag
  const handlePointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragging && lastPos) {
      setOffset((prev) => ({
        x: prev.x + (e.clientX - lastPos.x),
        y: prev.y + (e.clientY - lastPos.y),
      }));
      setLastPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handlePointerUp = () => {
    setDragging(false);
    setLastPos(null);
  };

  // Pinch-to-zoom with wheel
  const handleWheel = (e: React.WheelEvent) => {
    // Always prevent default to stop browser zoom
    e.preventDefault();
    if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.buttons) {
      setZoom((z) => Math.max(0.1, Math.min(5, z - e.deltaY * 0.01)));
    }
  };

  // Responsive, square aspect ratio using CSS
  return (
    <div className="w-full h-full flex items-center justify-center aspect-square relative">
      <canvas
        ref={canvasRef}
        className="bg-black rounded w-full h-full max-w-full max-h-full"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
        tabIndex={0}
        style={{
          outline: "none",
          cursor: dragging ? "grabbing" : "grab",
          objectFit: "contain",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default VideoCanvas;
