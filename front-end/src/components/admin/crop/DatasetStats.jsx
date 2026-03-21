/*
====================================================
DATASET STATS (ADMIN DASHBOARD)
✔ Safe training state handling
✔ Responsive cards
✔ Training status mapping
✔ Progress bar only when training
✔ Optimized rendering
====================================================
*/

import { memo, useMemo } from "react";
import TrainingProgressBar from "../../common/TrainingProgressBar";

function DatasetStats({ rows = [], training }) {

  /*
  ====================================================
  NORMALIZE TRAINING OBJECT
  prevents undefined crashes
  ====================================================
  */
  const trainingData = training || {
    status: "Idle",
    accuracy: 0,
    progress: 0,
  };

  /*
  ====================================================
  MAP BACKEND STATUS → USER FRIENDLY STATUS
  ====================================================
  */
  const statusInfo = useMemo(() => {

    switch (trainingData.status) {

      case "Training":
        return {
          text: "Training Process Ongoing",
          color: "text-yellow-400"
        };

      case "Completed":
        return {
          text: "Training Process Completed",
          color: "text-emerald-400"
        };

      case "Failed":
        return {
          text: "Training Process Encountered an Error",
          color: "text-red-400"
        };

      default:
        return {
          text: "Pending",
          color: "text-gray-400"
        };
    }

  }, [trainingData.status]);

  /*
  ====================================================
  SHOW PROGRESS BAR ONLY DURING TRAINING
  ====================================================
  */
  const showProgress = trainingData.status === "Training" && trainingData.progress > 0;

  return (
    <div className="space-y-6 mb-8">

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* TOTAL ROWS */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <h3 className="text-3xl font-bold text-emerald-400">
            {rows?.length || 0}
          </h3>
          <p className="text-gray-400 mt-2">Total Dataset Rows</p>
        </div>

        {/* MODEL ACCURACY */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <h3 className="text-2xl font-bold text-blue-400">
            {Number(trainingData.accuracy || 0).toFixed(2)}%
          </h3>
          <p className="text-gray-400 mt-2">Model Accuracy</p>
        </div>

        {/* TRAINING STATUS */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <h3 className={`text-lg font-bold ${statusInfo.color}`}>
            {statusInfo.text}
          </h3>
          <p className="text-gray-400 mt-2">Training Status</p>
        </div>

        {/* MODEL TYPE */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-yellow-400">
            RandomForest
          </h3>
          <p className="text-gray-400 mt-2">Model Type</p>
        </div>

      </div>

      {/* TRAINING PROGRESS */}
      {showProgress && (
        <TrainingProgressBar training={trainingData} />
      )}

    </div>
  );
}

export default memo(DatasetStats);