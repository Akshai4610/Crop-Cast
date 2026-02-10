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
    return crops.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()),
    );
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
    setLoading(true);
    await deleteCrop(name);
    await refresh(); // reload from parent
    setLoading(false);
  };

  // =========================================
  // UI
  // =========================================
  return (
    <div className="space-y-4">
      {/* Header */}
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

      {/* Loader */}
      {loading && <p className="text-gray-300 text-sm">Updating...</p>}

      {/* Empty */}
      {paginated.length === 0 && (
        <p className="text-gray-400">No crops found</p>
      )}

      {/* Crop rows */}
      {paginated.map((c) => (
        <div
          key={c._id}
          className="flex justify-between items-center bg-white/10 p-3 rounded-xl hover:bg-white/20 transition"
        >
          {/* LEFT → Image + Name */}
          <div className="flex items-center gap-3">
            {c.image_url && (
              <img
                src={c.image_url}
                alt={c.name}
                className="h-10 w-10 object-cover rounded-lg"
              />
            )}

            <span className="font-medium">{c.name}</span>
          </div>

          {/* RIGHT → Actions */}
          <div className="space-x-4 text-sm">
            <button
              onClick={() => setEditData(c)}
              className="text-blue-400 hover:text-blue-300"
            >
              Edit
            </button>

            <button
              onClick={() => remove(c.name)}
              className="text-red-400 hover:text-red-300"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-3 justify-end mt-3 text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 bg-white/20 rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-gray-400">
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-white/20 rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
