export default function ViewUserModal({user,onClose}){

  if(!user) return null

  return(

    <div className="fixed inset-0 flex items-center justify-center bg-black/70">

      <div className="bg-gray-900 p-6 rounded-xl w-96">

        <h2 className="text-xl mb-4">
          User Details
        </h2>

        <p>Name: {user.fullname}</p>
        <p>Email: {user.email}</p>
        <p>Status: {user.blocked ? "Blocked":"Active"}</p>

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-700 rounded"
        >
          Close
        </button>

      </div>

    </div>
  )
}