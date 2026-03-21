import { useState } from "react";
import DeleteConfirmModal from "../../common/DeleteConfirmModal";
import { deleteNews } from "../../../services/api";
import { motion } from "framer-motion";

export default function NewsTable({ news, onEdit, refresh }) {

  const [selected, setSelected] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);

  const handleDeleteClick = (item) => {
    if (!item?._id) return;

    setSelected(item);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    if (!selected?._id) return;

    try {
      await deleteNews(selected._id);
      refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setOpenDelete(false);
      setSelected(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left">

          <thead>
            <tr className="border-b border-gray-700 text-gray-300">
              <th className="py-3">Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Likes</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {news.map((n) => (
              <motion.tr
                key={n._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-b border-gray-800 hover:bg-gray-800/40"
              >
                <td className="py-2">
                  {n.image && (
                    <img
                      src={n.image}   // ✅ FIXED (base64)
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  )}
                </td>

                <td>{n.title}</td>
                <td className="capitalize">{n.category}</td>

                <td className="text-emerald-400">
                  👍 {n.likes || 0} / 👎 {n.dislikes || 0}
                </td>

                <td>
                  {new Date(n.created_at).toLocaleDateString()}
                </td>

                <td className="space-x-3">
                  <button
                    onClick={() => onEdit(n)}
                    className="text-blue-400 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteClick(n)}
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteConfirmModal
        open={openDelete}
        onConfirm={confirmDelete}
        onCancel={() => setOpenDelete(false)}
        title="Delete News"
        message="This action cannot be undone"
        itemName={selected?.title}
        image={selected?.image} // ✅ FIXED
      />
    </>
  );
}