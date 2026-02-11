/*
========================================================
CropTable (Clean Professional Version)
--------------------------------------------------------
Responsibilities:
✔ Display crops (from parent)
✔ Search
✔ Pagination
✔ Edit
✔ Delete
✔ Image preview
NO data fetching here (parent handles it)
========================================================
*/

import { useState, useMemo } from "react";
import { deleteCrop } from "../../services/api";

export default function CropTable({ crops = [], refresh, setEditData }) {
  // =========================================
  // Local UI states only
  // =========================================
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const pageSize = 5;

  // =========================================
  // Filtered list (optimized with useMemo)
  // =========================================

  const filtered = useMemo(() => {
    // Always normalize to array
    const list = Array.isArray(crops)
      ? crops
      : Array.isArray(crops?.data)
        ? crops.data
        : [];

    if (!search.trim()) return list;

    const term = search.toLowerCase();

    return list.filter((c) => (c?.name || "").toLowerCase().includes(term));
  }, [crops, search]);

  // =========================================
  // Pagination
  // =========================================
  const totalPages = Math.ceil(filtered.length / pageSize);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // =========================================
  // Delete crop
  // =========================================
  const remove = async (name) => {
    try {
      setLoading(true);
      await deleteCrop(name);
      await refresh?.();
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // UI
  // =========================================
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-emerald-400">🌱 Crop List</h2>

      {/* Search */}
      <input
        placeholder="Search crop..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="w-full p-3 rounded-xl bg-white/20 outline-none"
      />

      {loading && <p className="text-gray-300 text-sm">Updating...</p>}

      {paginated.length === 0 && (
        <p className="text-gray-400">No crops found</p>
      )}

      {paginated.map((c) => (
        <div
          key={c._id}
          className="flex justify-between items-center bg-white/10 p-3 rounded-xl"
        >
          <div className="flex items-center gap-3">
            {c.image_url && (
              <img
                src={c.image_url}
                alt={c.name}
                className="h-10 w-10 object-cover rounded-lg"
              />
            )}
            <span>{c.name}</span>
          </div>

          <div className="space-x-4 text-sm">
            <button onClick={() => setEditData?.(c)} className="text-blue-400">
              Edit
            </button>

            <button onClick={() => remove(c.name)} className="text-red-400">
              Delete
            </button>
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex gap-3 justify-end">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 bg-white/20 rounded"
          >
            Prev
          </button>

          <span>
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-white/20 rounded"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
