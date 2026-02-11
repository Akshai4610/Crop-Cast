/*
====================================================
Admin Crop Management Page
- Two sections:
   1) Crop Details CRUD
   2) Dataset Manager
- Professional card design
====================================================
*/

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import AdminNavbar from "../../components/admin/navbar/AdminNavbar";
import CropForm from "../../components/admin/CropForm";
import CropTable from "../../components/admin/CropTable";
import DatasetForm from "../../components/admin/DataSetForm";

import { getAllCrops } from "../../services/api";

export default function CropManagementPage() {
  const [params] = useSearchParams();
  const tab = params.get("tab");

  // ============================================
  // Central crop state (single source of truth)
  // ============================================
  const [crops, setCrops] = useState([]);
  const [editData, setEditData] = useState(null);

  // ============================================
  // Load crops from backend
  // ============================================
  const load = async () => {
    const data = await getAllCrops();
    setCrops(data);
  };

  // first load
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <AdminNavbar />

      <div className="p-10">
        {tab === "dataset" ? (
          <DatasetForm />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT → FORM */}
            <div className="glass-card p-6">
              <CropForm
                refresh={load}
                editData={editData}
                setEditData={setEditData}
              />
            </div>

            {/* RIGHT → TABLE */}
            <div className="lg:col-span-2 glass-card p-6">
              <CropTable
                crops={crops}
                refresh={load}
                setEditData={setEditData}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
