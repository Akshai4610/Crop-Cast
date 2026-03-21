import { useState } from "react";
import { Trash2, Ban, Eye } from "lucide-react";

import { deleteUser, blockUser } from "../../../services/api";

import DeleteConfirmModal from "../../common/DeleteConfirmModal";
import UserPagination from "./UserPagination";
import UserDetailsModal from "./UserDetailsModal";

export default function UserTable({ users, page, setPage, total, refresh }) {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const handleDelete = async () => {
    if (!deleteTarget) return;

    await deleteUser(deleteTarget.id);

    setDeleteTarget(null);

    refresh();
  };

  const handleBlock = async (id) => {
    await blockUser(id);

    refresh();
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-gray-400 border-b border-gray-800">
          <tr>
            <th className="py-3 text-left">User</th>
            <th>Email</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-gray-900 hover:bg-gray-900"
            >
              <td className="py-4 flex items-center gap-3">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.fullname}`}
                  className="w-9 h-9 rounded-full"
                />

                {user.fullname}
              </td>

              <td>{user.email}</td>

              <td>
                {user.blocked ? (
                  <span className="text-red-400">Blocked</span>
                ) : (
                  <span className="text-green-400">Active</span>
                )}
              </td>

              <td className="flex justify-end gap-4">
                <button
                  onClick={() => setViewUser(user)}
                  className="text-indigo-400"
                >
                  <Eye size={18} />
                </button>

                <button
                  onClick={() => handleBlock(user.id)}
                  className="text-yellow-400"
                >
                  <Ban size={18} />
                </button>

                <button
                  onClick={() => setDeleteTarget(user)}
                  className="text-red-400"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <UserPagination page={page} setPage={setPage} total={total} />

      <DeleteConfirmModal
        open={!!deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        title="Delete User"
        message="User will be permanently removed"
        itemName={deleteTarget?.fullname}
      />

      <UserDetailsModal
        open={!!viewUser}
        user={viewUser}
        onClose={() => setViewUser(null)}
      />
    </div>
  );
}
