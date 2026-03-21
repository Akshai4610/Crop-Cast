/*
========================================================
DATASET TABLE (ADMIN PANEL)
✔ Stable Edit / Delete
✔ Retrain detection
✔ Responsive table
✔ Pagination
✔ Toast feedback
✔ Clean architecture
========================================================
*/

import { useState, useMemo, useEffect } from "react";
import {
  retrainModel,
  deleteDatasetRow,
  updateDatasetRow,
} from "../../../services/api";

import EditModal from "../../common/EditModal";
import DeleteConfirmModal from "../../common/DeleteConfirmModal";
import Toast from "../../common/Toast";

export default function DatasetTable({ rows = [], refresh }) {
  /* =====================================================
  STATE
  ===================================================== */

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [editRow, setEditRow] = useState(null);
  const [deleteRow, setDeleteRow] = useState(null);

  const [datasetChanged, setDatasetChanged] = useState(false);
  const [isTraining, setIsTraining] = useState(false);

  const [sortDirection, setSortDirection] = useState("asc");
  const [toast, setToast] = useState(null);

  const pageSize = 8;

    /* ===================================================
     Detect dataset change
  =================================================== */

  useEffect(() => {

    if (rows.length > 0) {
      setDatasetChanged(true);
    }

  }, [rows]);

  /* =====================================================
  SEARCH FILTER
  ===================================================== */

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;

    return rows.filter((row) =>
      Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase()),
    );
  }, [rows, search]);

  /* =====================================================
  SORT
  ===================================================== */

  const sortedRows = useMemo(() => {
    const sorted = [...filteredRows];

    sorted.sort((a, b) => {
      const A = a.label?.toLowerCase() || "";
      const B = b.label?.toLowerCase() || "";

      return sortDirection === "asc" ? A.localeCompare(B) : B.localeCompare(A);
    });

    return sorted;
  }, [filteredRows, sortDirection]);

  /* =====================================================
  PAGINATION
  ===================================================== */

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));

  const paginatedRows = sortedRows.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  /* =====================================================
  TRAIN MODEL
  ===================================================== */

  const handleTrain = async () => {
    if (!datasetChanged || isTraining) return;

    try {
      setIsTraining(true);

      await retrainModel();

      setDatasetChanged(false);

      setToast({
        type: "success",
        message: "Model training completed",
      });

      await refresh?.();
    } catch (err) {
      setToast({
        type: "error",
        message: "Training failed",
      });
    } finally {
      setIsTraining(false);
    }
  };

  /* =====================================================
  DELETE DATASET
  ===================================================== */

  const handleDeleteConfirm = async () => {
    if (!deleteRow) return;

    try {
      await deleteDatasetRow(deleteRow._id);

      setDeleteRow(null);

      setDatasetChanged(true);

      setToast({
        type: "success",
        message: "Dataset deleted",
      });

      await refresh?.();
    } catch {
      setToast({
        type: "error",
        message: "Delete failed",
      });
    }
  };

  /* =====================================================
  EDIT DATASET
  ===================================================== */

  const handleEditSave = async (updatedData) => {
    try {
      await updateDatasetRow(editRow._id, updatedData);

      setEditRow(null);

      setDatasetChanged(true);

      setToast({
        type: "success",
        message: "Dataset updated",
      });

      await refresh?.();
    } catch (err) {
      setToast({
        type: "error",
        message: "Update failed",
      });
    }
  };

  /* =====================================================
  UI
  ===================================================== */

  return (
    <div className="w-full space-y-6">
      {/* ================= TOP BAR ================= */}

      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        {/* SEARCH + SORT */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search dataset..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 w-full sm:w-64 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />

          <select
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
            className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
          >
            <option value="asc">Label A → Z</option>
            <option value="desc">Label Z → A</option>
          </select>
        </div>

        {/* TRAIN BUTTON */}

        <button
          onClick={handleTrain}
          disabled={!datasetChanged || isTraining}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition
          
          ${
            isTraining
              ? "bg-gray-600 cursor-not-allowed"
              : datasetChanged
                ? "bg-orange-600 hover:bg-orange-700"
                : "bg-gray-700 cursor-not-allowed"
          }
          
          `}
        >
          {isTraining
            ? "Training..."
            : datasetChanged
              ? "Retrain Model"
              : "Train Model"}
        </button>
      </div>

      {/* ================= TABLE ================= */}

      <div className="w-full overflow-x-auto border border-gray-800 rounded-xl">
        <table className="min-w-full text-sm text-center">
          <thead className="bg-gray-900 text-gray-300">
            <tr>
              <th className="py-3 px-2">N</th>
              <th className="px-2">P</th>
              <th className="px-2">K</th>
              <th className="px-2">Temp</th>
              <th className="px-2">Humidity</th>
              <th className="px-2">pH</th>
              <th className="px-2">Rain</th>
              <th className="px-2">Crop</th>
              <th className="px-2">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-gray-950 text-gray-200">
            {paginatedRows.map((row) => (
              <tr
                key={row._id}
                className="border-t border-gray-800 hover:bg-gray-900 transition"
              >
                <td className="py-2">{row.N}</td>
                <td>{row.P}</td>
                <td>{row.K}</td>
                <td>{row.temperature}</td>
                <td>{row.humidity}</td>
                <td>{row.ph}</td>
                <td>{row.rainfall}</td>

                <td className="text-emerald-400 font-semibold">{row.label}</td>

                <td>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => setEditRow(row)}
                      className="px-3 py-1 text-xs rounded bg-blue-600 hover:bg-blue-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteRow(row)}
                      className="px-3 py-1 text-xs rounded bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {paginatedRows.length === 0 && (
              <tr>
                <td colSpan="9" className="py-6 text-gray-400">
                  No dataset rows found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}

      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-1 bg-gray-800 rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-gray-400 text-sm">
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-1 bg-gray-800 rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* ================= MODALS ================= */}

      {editRow && (
        <EditModal
          isOpen={true}
          data={editRow}
          onClose={() => setEditRow(null)}
          onSave={handleEditSave}
        />
      )}

      {deleteRow && (
        <DeleteConfirmModal
          open={true}
          title="Delete Dataset"
          message="This dataset row will be permanently removed."
          itemName={deleteRow.label}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteRow(null)}
        />
      )}

      {/* ================= TOAST ================= */}

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
