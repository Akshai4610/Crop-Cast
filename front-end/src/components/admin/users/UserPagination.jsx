export default function UserPagination({
  page,
  setPage,
  total
}){

  const totalPages = Math.ceil(total / 10)

  return(

    <div className="flex justify-center gap-4 p-4">

      <button
        onClick={()=>setPage(page-1)}
        disabled={page===1}
        className="px-3 py-1 bg-gray-700 rounded"
      >
        Prev
      </button>

      <span>
        Page {page} / {totalPages}
      </span>

      <button
        onClick={()=>setPage(page+1)}
        disabled={page===totalPages}
        className="px-3 py-1 bg-gray-700 rounded"
      >
        Next
      </button>

    </div>
  )
}