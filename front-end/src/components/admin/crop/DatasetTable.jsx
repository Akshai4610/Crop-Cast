import { useEffect, useState, useRef, useMemo } from "react";
import { retrainModel, deleteDatasetRow } from "../../../services/api";

import TrainingProgressBar from "../../common/TrainingProgressBar";
import DeleteConfirmModal from "../../common/DeleteConfirmModal";
import { useToast } from "../../../context/ToastContext";
import { Pencil, Trash2, ArrowUpDown } from "lucide-react";

/* ── columns ── */
const COLS = [
  { key: "N", label: "N" },
  { key: "P", label: "P" },
  { key: "K", label: "K" },
  { key: "temperature", label: "Temp" },
  { key: "humidity", label: "Hum" },
  { key: "ph", label: "pH" },
  { key: "rainfall", label: "Rain" },
  { key: "label", label: "Crop" },
];

export default function DatasetTable({
  rows,
  refresh,
  training,
  setEditingRow,
}) {
  const [deleteRow, setDeleteRow] = useState(null);
  const { showToast } = useToast();
  const prevStatus = useRef(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // "table" | "card"

  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const [page, setPage] = useState(1);
  const perPage = 8;

  // ================= ✅ TOAST =================
  useEffect(() => {
    if (prevStatus.current === "Training" && training?.status === "Completed") {
      showToast("success", "✅ Retrain completed successfully");
    }

    if (prevStatus.current === "Training" && training?.status === "Failed") {
      showToast("error", "❌ Training failed");
    }

    prevStatus.current = training?.status;
  }, [training]);

  // ================= ✅ TRAIN =================
  const handleTrain = async () => {
    if (training?.status === "Training") return;

    try {
      await retrainModel();
    } catch {
      setLocalTraining(false);
    }
  };

  // ================= ✅ BUTTON LOGIC =================
  const isTraining = training?.status === "Training";
  const hasModel = !!training?.last_trained;
  const datasetChanged = !!training?.dataset_changed;

  const isDisabled = isTraining || (hasModel && !datasetChanged);

  const buttonText = (() => {
    if (isTraining) return `Training ${training?.progress || 0}%`;
    if (!hasModel) return "Train";
    if (datasetChanged) return "Retrain";
    return "Trained";
  })();

  // ================= FILTER =================
  const processedRows = useMemo(() => {
    let data = [...rows];

    if (search) {
      data = data.filter((r) =>
        Object.values(r).some((v) =>
          String(v).toLowerCase().includes(search.toLowerCase()),
        ),
      );
    }

    if (filter !== "all") {
      data = data.filter((r) => r.label === filter);
    }

    if (sortKey) {
      data.sort((a, b) => {
        const A = a[sortKey];
        const B = b[sortKey];

        if (typeof A === "number") {
          return sortDir === "asc" ? A - B : B - A;
        }

        return sortDir === "asc"
          ? String(A).localeCompare(String(B))
          : String(B).localeCompare(String(A));
      });
    }

    return data;
  }, [rows, search, filter, sortKey, sortDir]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(processedRows.length / perPage);

  const paginatedRows = processedRows.slice(
    (page - 1) * perPage,
    page * perPage,
  );

  useEffect(() => setPage(1), [search, filter]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  // ================= ✅ DELETE FIX =================
  const handleDelete = async () => {
    try {
      const actualRow = processedRows[deleteRow.index];

      const realIndex = rows.findIndex(
        (r) => JSON.stringify(r) === JSON.stringify(actualRow),
      );

      await deleteDatasetRow(realIndex);

      setDeleteRow(null);
      await refresh();

      showToast("success", "Deleted successfully");
    } catch {
      showToast("error", "Delete failed");
    }
  };

  // ✅ RESPONSIVE BREAKPOINT (CRITICAL FIX)
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsCompact(window.innerWidth < 1100); // 🔥 key breakpoint for split screen
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="space-y-5 w-full">
      {/* ✅ FIXED RESPONSIVE CONTROLS */}
      <div className="flex flex-wrap items-center gap-2 w-full">
        <input
          placeholder="Search dataset..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[140px] px-3 py-2 text-sm rounded-lg bg-gray-900 border border-gray-700"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="min-w-[120px] px-3 py-2 text-sm rounded-lg bg-gray-900 border border-gray-700"
        >
          <option value="all">All</option>
          {[...new Set(rows.map((r) => r.label))].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div className="flex gap-2 items-center">
          {/* VIEW TOGGLE */}
          <div className="flex bg-gray-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 rounded ${
                viewMode === "table" ? "bg-indigo-600" : ""
              }`}
            >
              Table
            </button>

            <button
              onClick={() => setViewMode("card")}
              className={`px-3 py-1 rounded ${
                viewMode === "card" ? "bg-indigo-600" : ""
              }`}
            >
              Card
            </button>
          </div>

          {/* TRAIN BUTTON */}
          <button
            onClick={handleTrain}
            disabled={isDisabled}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap
      ${
        isDisabled
          ? "bg-gray-700 cursor-not-allowed"
          : "bg-indigo-600 hover:bg-indigo-500"
      }`}
          >
            {buttonText}
          </button>
        </div>
      </div>

      {/* PROGRESS */}
      {isTraining && <TrainingProgressBar training={training} />}

      {/* TABLE */}
      {/* ================= RESPONSIVE VIEW ================= */}

      {viewMode === "card" || isCompact ? (
        /* ✅ CARD VIEW (FIXES SPLIT SCREEN 100%) */
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginatedRows.map((r, i) => {
            const globalIndex = (page - 1) * perPage + i;

            return (
              <div
                key={globalIndex}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-indigo-500 transition"
              >
                {/* TOP */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-gray-400">
                    #{globalIndex + 1}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setEditingRow({ ...r, index: globalIndex })
                      }
                      className="text-blue-400"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() =>
                        setDeleteRow({
                          index: globalIndex,
                          label: r.label,
                        })
                      }
                      className="text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* DATA */}
                <div className="space-y-2 text-sm">
                  {COLS.map((col) => (
                    <div key={col.key} className="flex justify-between">
                      <span className="text-gray-500">{col.label}</span>
                      <span className="text-white font-medium truncate max-w-[120px]">
                        {r[col.key]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ✅ DESKTOP TABLE */
        <div className="w-full border border-gray-800 rounded-xl overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
              {/* HEADER */}
              <thead className="bg-gray-900 text-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left w-[60px]">#</th>

                  {COLS.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="px-4 py-3 text-left cursor-pointer whitespace-nowrap"
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        <ArrowUpDown size={12} />
                      </div>
                    </th>
                  ))}

                  <th className="px-4 py-3 text-right w-[100px]">Actions</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {paginatedRows.map((r, i) => {
                  const globalIndex = (page - 1) * perPage + i;

                  return (
                    <tr
                      key={globalIndex}
                      className="border-t border-gray-800 hover:bg-gray-900/40"
                    >
                      <td className="px-4 py-3 text-gray-400">
                        {globalIndex + 1}
                      </td>

                      {COLS.map((col) => (
                        <td key={col.key} className="px-4 py-3">
                          <div className="text-sm text-gray-200 truncate">
                            {r[col.key]}
                          </div>
                        </td>
                      ))}

                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() =>
                              setEditingRow({ ...r, index: globalIndex })
                            }
                            className="text-blue-400"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() =>
                              setDeleteRow({
                                index: globalIndex,
                                label: r.label,
                              })
                            }
                            className="text-red-400"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex flex-wrap justify-between items-center gap-2 text-xs text-gray-500">
        <span>
          Page {page} / {totalPages || 1}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-2 py-1 bg-gray-800 rounded"
          >
            Prev
          </button>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="px-2 py-1 bg-gray-800 rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* DELETE MODAL */}
      {deleteRow && (
        <DeleteConfirmModal
          open
          title="Delete Dataset Row"
          message="This record will be permanently removed."
          itemName={deleteRow.label}
          onConfirm={handleDelete}
          onCancel={() => setDeleteRow(null)}
        />
      )}
    </div>
  );
}
