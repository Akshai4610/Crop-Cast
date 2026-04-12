/*
====================================================
News Search + Filter + Add Button
====================================================
*/

export default function NewsSearchBar({
  search,
  setSearch,
  category,
  setCategory,
  onAdd
}) {
  return (
    <div className="glass-card p-4 flex flex-col md:flex-row gap-4 justify-between items-center">

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Search news..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 w-full md:w-1/3"
      />

      {/* 📂 CATEGORY */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-700"
      >
        <option value="">All</option>
        <option value="crop">Crop</option>
        <option value="weather">Weather</option>
        <option value="general">General</option>
      </select>

      {/* ➕ ADD */}
      <button
        onClick={onAdd}
        className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg"
      >
        + Add News
      </button>

    </div>
  );
}