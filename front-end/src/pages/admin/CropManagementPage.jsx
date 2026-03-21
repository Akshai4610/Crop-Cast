/*
====================================================
Admin Crop Management Page (Optimized Version)
- Crop CRUD
- Dataset Manager
- Centralized Training Status
- Smart polling
- Performance optimized
====================================================
*/

import { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

import {
  getDatasetRows,
  getTrainingStatus,
  getAllCrops,
} from "../../services/api";

import CropForm from "../../components/admin/crop/CropForm";
import CropTable from "../../components/admin/crop/CropTable";
import DatasetStats from "../../components/admin/crop/DatasetStats";
import DatasetForm from "../../components/admin/crop/DataSetForm";
import DatasetTable from "../../components/admin/crop/DatasetTable";
import AdminNavbar from "../../components/admin/navbar/AdminNavbar";
import { ToastProvider } from "../../context/ToastContext";

export default function CropManagementPage() {
  const location = useLocation();

  // Memoized route check (prevents re-calculation)
  const isDataset = useMemo(
    () => location.pathname.includes("dataset"),
    [location.pathname],
  );

  /*
  ====================================================
  STATE
  ====================================================
  */

  const [rows, setRows] = useState([]);
  const [training, setTraining] = useState(null);
  const [crops, setCrops] = useState([]);
  const [editData, setEditData] = useState(null);

  /*
  ====================================================
  DATASET LOADER (memoized to prevent recreation)
  ====================================================
  */
  const loadDataset = useCallback(async () => {
    try {
      const res = await getDatasetRows({ page: 1, limit: 500 });
      setRows(res.data);
    } catch (err) {
      console.error("Dataset load failed", err);
    }
  }, []);

  /*
  ====================================================
  TRAINING STATUS LOADER
  ====================================================
  */
  const loadTrainingStatus = useCallback(async () => {
    try {
      const res = await getTrainingStatus();
      setTraining(res);
    } catch (err) {
      console.error("Training status load failed");
    }
  }, []);

  /*
  ====================================================
  SMART POLLING
  Only poll when training is active
  ====================================================
  */
  useEffect(() => {
    loadTrainingStatus();
  }, [loadTrainingStatus]);

  useEffect(() => {
    if (training?.status === "Training") {
      const interval = setInterval(() => {
        loadTrainingStatus();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [training?.status, loadTrainingStatus]);

  /*
  ====================================================
  LOAD DATASET WHEN PAGE ACTIVE
  ====================================================
  */
  useEffect(() => {
    if (isDataset) loadDataset();
  }, [isDataset, loadDataset]);

  /*
  ====================================================
  LOAD CROPS
  ====================================================
  */
  const loadCrops = useCallback(async () => {
    try {
      const data = await getAllCrops();
      setCrops(data);
    } catch (err) {
      console.error("Crop load failed");
    }
  }, []);

  useEffect(() => {
    loadCrops();
  }, [loadCrops]);

  /*
  ====================================================
  RENDER
  ====================================================
  */
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-950 text-white">
        <AdminNavbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isDataset ? (
            <div className="space-y-8">
              <DatasetStats rows={rows} training={training} />

              <div className="grid xl:grid-cols-3 gap-8">
                <div className="glass-card p-6">
                  <DatasetForm refresh={loadDataset} />
                </div>

                <div className="xl:col-span-2 glass-card p-6">
                  <DatasetTable
                    rows={rows}
                    refresh={loadDataset}
                    training={training}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="glass-card p-6">
                <CropForm
                  refresh={loadCrops}
                  editData={editData}
                  setEditData={setEditData}
                />
              </div>

              <div className="lg:col-span-2 glass-card p-6">
                <CropTable
                  crops={crops}
                  refresh={loadCrops}
                  setEditData={setEditData}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </ToastProvider>
  );
}
