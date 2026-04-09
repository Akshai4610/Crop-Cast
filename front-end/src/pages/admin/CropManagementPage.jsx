import { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

import {
  getDatasetRows,
  getTrainingStatus,
  getAllCrops,
  addDatasetRow,
  updateDatasetRow,
} from "../../services/api";

import CropForm from "../../components/admin/crop/CropForm";
import CropTable from "../../components/admin/crop/CropTable";
import DatasetStats from "../../components/admin/crop/DatasetStats";
import DatasetForm from "../../components/admin/crop/DatasetForm";
import DatasetTable from "../../components/admin/crop/DatasetTable";
import Navbar from "../../components/common/Navbar";
import { ToastProvider } from "../../context/ToastContext";

export default function CropManagementPage() {
  const location = useLocation();

  const isDataset = useMemo(
    () => location.pathname.includes("dataset"),
    [location.pathname]
  );

  const [rows, setRows] = useState([]);
  const [training, setTraining] = useState({});
  const [crops, setCrops] = useState([]);
  const [editData, setEditData] = useState(null);

  // ✅ ONLY THIS FOR DATASET EDIT
  const [editingRow, setEditingRow] = useState(null);

  // ================= LOAD DATASET =================
  const loadDataset = useCallback(async () => {
    const res = await getDatasetRows({ page: 1, limit: 500 });
    setRows(res.data || []);
  }, []);

  // ================= TRAINING =================
  const loadTrainingStatus = useCallback(async () => {
    const res = await getTrainingStatus();
    setTraining(res || {});
  }, []);

  useEffect(() => {
    loadTrainingStatus();

    const interval = setInterval(loadTrainingStatus, 1000);
    return () => clearInterval(interval);
  }, [loadTrainingStatus]);

  useEffect(() => {
    if (isDataset) loadDataset();
  }, [isDataset, loadDataset]);

  useEffect(() => {
    if (training?.status === "Completed") {
      setTimeout(() => {
        loadTrainingStatus();
      }, 800); // 👈 allow 100% to be visible
    }
  }, [training?.status]);

  // ================= CROPS =================
  const loadCrops = useCallback(async () => {
    const data = await getAllCrops();
    setCrops(data);
  }, []);

  useEffect(() => {
    loadCrops();
  }, [loadCrops]);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar/>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {isDataset ? (
            <div className="space-y-8">

              <DatasetStats rows={rows} training={training} />

              <div className="grid xl:grid-cols-3 gap-8">

                {/* ✅ ONLY ONE FORM */}
                <div className="glass-card p-6">
                  <DatasetForm
                    initialData={editingRow}
                    onCancel={() => setEditingRow(null)}
                    onSave={async (data) => {
                      if (editingRow) {
                        await updateDatasetRow(editingRow.index, data);
                      } else {
                        await addDatasetRow(data);
                      }

                      setEditingRow(null);

                      loadDataset();
                      await loadTrainingStatus();
                    }}
                  />
                </div>

                {/* TABLE */}
                <div className="xl:col-span-2 glass-card p-6">
                  <DatasetTable
                    rows={rows}
                    training={training}
                    setEditingRow={setEditingRow}
                    refresh={loadDataset}
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