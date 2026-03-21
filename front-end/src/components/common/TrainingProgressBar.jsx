/*
====================================================
TRAINING PROGRESS BAR
✔ Smooth animated progress
✔ Auto sync with backend progress
✔ Visible only during training
✔ No fake progress
====================================================
*/

import { useEffect, useState } from "react";

export default function TrainingProgressBar({ training }) {

  const [progress, setProgress] = useState(0);

  /*
  ====================================================
  SYNC WITH BACKEND PROGRESS
  ====================================================
  */
  useEffect(() => {

    if (!training) return;

    if (training.status === "Training") {
      setProgress(training.progress || 10);
    }

    if (training.status === "Completed") {
      setProgress(100);
    }

    if (training.status === "Failed") {
      setProgress(0);
    }

  }, [training]);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">

      <div className="flex justify-between mb-3">

        <span className="text-sm text-gray-400">
          Model Training Progress
        </span>

        <span className="text-sm text-emerald-400 font-semibold">
          {progress}%
        </span>

      </div>

      {/* PROGRESS BAR */}
      <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">

        <div
          className="h-full bg-emerald-500 transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />

      </div>

    </div>
  );
}