/*
========================================================
CropTable (FINAL PRODUCTION FIXED VERSION)
✔ Delete confirmation always works
✔ No instant second delete bug
✔ Modal resets properly
✔ Filter text visible
✔ Safe async handling
✔ Stable production logic
========================================================
*/

import { useState, useMemo, useEffect } from "react";
import { deleteCrop } from "../../services/api";
import DeleteConfirmModal from "../common/DeleteConfirmModal";
import useDebounce from "../common/useDebounce";
import Loader from "../common/Loader";
import { useToast } from "../../context/ToastContext";

export default function CropTable({ crops = [], refresh, setEditData }) {
  const { showToast } = useToast();

  // ===============================
  // STATE
  // ===============================
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("az");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // crop selected for delete
  const [selected, setSelected] = useState(null);

  const pageSize = 5;
  const debouncedSearch = useDebounce(search);

  // ===============================
  // RESET PAGE WHEN FILTER CHANGES
  // ===============================
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sort]);

  // ===============================
  // FILTER + SORT LOGIC
  // ===============================
  const filtered = useMemo(() => {
    let result = [...crops];

    if (debouncedSearch.trim()) {
      const term = debouncedSearch.toLowerCase();
      result = result.filter((c) =>
        (c.name || "").toLowerCase().includes(term),
      );
    }

    result.sort((a, b) =>
      sort === "az"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name),
    );

    return result;
  }, [crops, debouncedSearch, sort]);

  const totalPages = Math.ceil(filtered.length / pageSize);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // ===============================
  // SAFE DELETE CONFIRM
  // ===============================
  const handleDeleteConfirm = async () => {
    if (!selected || loading) return;

    try {
      setLoading(true);

      const cropId = selected._id ?? selected.id;

      await deleteCrop(cropId);

      showToast("success", `${selected.name} deleted successfully`);

      await refresh?.();
    } catch (err) {
      showToast("error", "Delete failed");
    } finally {
      // VERY IMPORTANT:
      // Reset modal AFTER everything completes
      setLoading(false);
      setSelected(null);
    }
  };

  return (
    <div className="space-y-4 relative">
      {/* ===============================
          DELETE CONFIRM MODAL
          =============================== */}
      <DeleteConfirmModal
        key={selected?._id || selected?.id || "modal"}
        open={Boolean(selected)}
        title="Delete Crop?"
        itemName={selected?.name}
        image={selected?.image_url}
        message="This crop will be permanently removed."
        onCancel={() => !loading && setSelected(null)}
        onConfirm={handleDeleteConfirm}
      />

      <h2 className="text-xl font-semibold text-emerald-400">🌱 Crop List</h2>

      {/* ===============================
          FILTERS (FIXED TEXT VISIBILITY)
          =============================== */}
      <div className="flex gap-3">
        {/* Search */}
        <input
          placeholder="Search crop..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 rounded-xl 
                     bg-slate-700 
                     text-white 
                     placeholder-gray-300
                     outline-none focus:ring-2 focus:ring-emerald-400"
        />

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="p-3 rounded-xl 
                     bg-slate-700 
                     text-white 
                     outline-none"
        >
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
        </select>
      </div>

      {loading && <Loader />}

      {paginated.length === 0 && (
        <p className="text-gray-400">No crops found</p>
      )}

      {/* ===============================
          CROP LIST
          =============================== */}
      {paginated.map((c) => (
        <div
          key={c._id ?? c.id}
          className="flex justify-between items-center 
                     bg-white/10 
                     p-3 rounded-xl 
                     hover:scale-[1.02] 
                     transition-all"
        >
          <div className="flex items-center gap-3">
            {c.image_url && (
              <img
                src={c.image_url}
                alt={c.name}
                className="h-10 w-10 object-cover rounded-lg"
              />
            )}
            <span className="text-white font-medium">{c.name}</span>
          </div>

          <div className="space-x-4 text-sm">
            <button
              onClick={() => setEditData?.(c)}
              className="text-blue-400 hover:underline"
            >
              Edit
            </button>

            <button
              disabled={loading}
              onClick={() => setSelected(c)} // ALWAYS open modal
              className="text-red-400 hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* ===============================
          PAGINATION
          =============================== */}
      {totalPages > 1 && (
        <div className="flex gap-3 justify-end items-center">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 bg-slate-700 text-white rounded"
          >
            Prev
          </button>

          <span className="text-white">
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-slate-700 text-white rounded"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
