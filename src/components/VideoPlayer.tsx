import React, { useRef, useState, useImperativeHandle, forwardRef, useEffect } from "react";
import VideoCanvas from "./VideoCanvas";

type VideoPlayerProps = {
  label: string;
};

export type VideoPlayerHandle = {
  play: () => void;
  pause: () => void;
};

const DEFAULT_FPS = 30; // Can be improved with actual video metadata

const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(({ label }, ref) => {
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [fps, setFps] = useState<number>(DEFAULT_FPS);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoURL(url);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
      // TODO: Extract actual FPS from video metadata if possible
      setFps(DEFAULT_FPS);
    }
  };

  const stepFrame = (direction: 1 | -1) => {
    if (videoRef.current && fps > 0) {
      const frameDuration = 1 / fps;
      videoRef.current.currentTime += direction * frameDuration;
    }
  };

  // Keyboard event support for frame stepping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current || !containerRef.current.contains(document.activeElement)) return;
      if (e.key === "ArrowLeft") {
        stepFrame(-1);
        e.preventDefault();
      } else if (e.key === "ArrowRight") {
        stepFrame(1);
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fps]);

  useImperativeHandle(ref, () => ({
    play: () => {
      videoRef.current?.play();
    },
    pause: () => {
      videoRef.current?.pause();
    }
  }));

  return (
    <div className="flex flex-col items-center" tabIndex={0} ref={containerRef}>
      <span className="text-white mb-2">{label}</span>
      <input
        type="file"
        accept="video/*"
        className="mb-2 text-xs"
        onChange={handleFileChange}
      />
      <div className="flex gap-2 mb-2">
        <button
          className="px-2 py-1 rounded bg-gray-700 text-white text-xs hover:bg-gray-600"
          onClick={() => stepFrame(-1)}
          disabled={!videoURL}
        >
          ◀ Prev Frame
        </button>
        <button
          className="px-2 py-1 rounded bg-gray-700 text-white text-xs hover:bg-gray-600"
          onClick={() => stepFrame(1)}
          disabled={!videoURL}
        >
          Next Frame ▶
        </button>
        <button
          className="px-2 py-1 rounded bg-green-600 text-white text-xs hover:bg-green-700"
          onClick={() => videoRef.current?.play()}
          disabled={!videoURL}
        >
          Play
        </button>
        <button
          className="px-2 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700"
          onClick={() => videoRef.current?.pause()}
          disabled={!videoURL}
        >
          Pause
        </button>
      </div>
      {/* Offscreen video element for frame extraction */}
      <video
        ref={videoRef}
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          opacity: 0,
          pointerEvents: "none"
        }}
        controls
        preload="metadata"
        src={videoURL || undefined}
      />
      {/* Canvas for zoom/pan/gesture rendering */}
      <VideoCanvas video={videoRef.current} />
      <div className="mt-2 text-xs text-gray-400">
        {videoURL ? `Video loaded | FPS: ${fps}` : "No video loaded"}
      </div>
    </div>
  );
});

export default VideoPlayer;
