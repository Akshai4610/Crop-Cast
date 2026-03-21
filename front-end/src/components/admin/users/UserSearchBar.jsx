export default function UserSearchBar({
  search,
  setSearch,
  sort,
  setSort
}){

  return(

    <div className="flex gap-6">

      <input
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        placeholder="Search users..."
        className="
          px-4 py-2
          rounded-lg
          bg-gray-800
          text-white
        "
      />

      <select
        value={sort}
        onChange={(e)=>setSort(e.target.value)}
        className="
          px-4 py-2
          rounded-lg
          bg-gray-800
        "
      >
        <option value="az">A-Z</option>
        <option value="za">Z-A</option>
      </select>

    </div>

  )
}