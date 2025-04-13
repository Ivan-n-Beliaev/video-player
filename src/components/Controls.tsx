import React from "react";

type ControlsProps = {
  sync: boolean;
  onToggleSync: () => void;
};

const Controls: React.FC<ControlsProps> = ({ sync, onToggleSync }) => (
  <div className="flex items-center gap-4 mb-6">
    <button
      className={`px-4 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition ${
        sync ? "ring-2 ring-blue-300" : ""
      }`}
      onClick={onToggleSync}
    >
      {sync ? "Sync: ON" : "Sync: OFF"}
    </button>
    <span className="text-gray-300 text-sm">
      {sync
        ? "Videos will play/pause together"
        : "Videos play independently"}
    </span>
  </div>
);

export default Controls;
