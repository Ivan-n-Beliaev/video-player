import React, { useRef, useState } from "react";
import './App.css'

import VideoPlayer from './components/VideoPlayer'
import Controls from './components/Controls'

function App() {
  const [sync, setSync] = useState(false);

  // Refs to control both video players
  const leftVideoRef = useRef<{ play: () => void; pause: () => void }>(null);
  const rightVideoRef = useRef<{ play: () => void; pause: () => void }>(null);

  const handleToggleSync = () => setSync((prev) => !prev);

  const handlePlay = () => {
    if (sync) {
      leftVideoRef.current?.play();
      rightVideoRef.current?.play();
    } else {
      leftVideoRef.current?.play();
      rightVideoRef.current?.play();
    }
  };

  const handlePause = () => {
    if (sync) {
      leftVideoRef.current?.pause();
      rightVideoRef.current?.pause();
    } else {
      leftVideoRef.current?.pause();
      rightVideoRef.current?.pause();
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-0 m-0 w-full h-full">
      <h1 className="text-3xl font-bold text-white mb-4 mt-4">Dual Video Player</h1>
      <Controls
        sync={sync}
        onToggleSync={handleToggleSync}
      />
      <div className="flex flex-row w-full h-full justify-center items-center gap-0">
        <div className="flex-1 flex justify-center items-center h-[80vh]">
          <VideoPlayer label="Left Video" ref={leftVideoRef} />
        </div>
        <div className="flex-1 flex justify-center items-center h-[80vh]">
          <VideoPlayer label="Right Video" ref={rightVideoRef} />
        </div>
      </div>
    </div>
  )
}

export default App
