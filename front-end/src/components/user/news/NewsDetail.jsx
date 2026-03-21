import { useEffect, useState } from "react";
import {
  addComment,
  getComments,
  deleteComment,
} from "../../../services/api";

const NewsDetail = ({ selected, onClose }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const email = localStorage.getItem("username");

  // LOAD COMMENTS
  useEffect(() => {
    if (selected?._id) {
      loadComments();
    }
  }, [selected]);

  const loadComments = async () => {
    const data = await getComments(selected._id);
    setComments(data);
  };

  // ADD COMMENT
  const handleAddComment = async () => {
    if (!comment.trim()) return;

    await addComment(selected._id, comment);
    setComment("");
    loadComments(); // refresh
  };

  // DELETE COMMENT (FIXED)
  const handleDelete = async (text) => {
    await deleteComment(selected._id, text);
    loadComments(); // refresh
  };

  if (!selected) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 max-w-2xl w-full rounded-2xl p-6 overflow-y-auto max-h-[90vh]">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="float-right text-gray-400"
        >
          ✕
        </button>

        {/* IMAGE */}
        {selected.image && (
          <img
            src={selected.image}
            className="w-full h-64 object-cover rounded-xl mb-4"
          />
        )}

        {/* TITLE */}
        <h1 className="text-2xl font-bold mb-3">
          {selected.title}
        </h1>

        {/* DATE */}
        <p className="text-gray-400 mb-4">
          {new Date(selected.created_at).toDateString()}
        </p>

        {/* CONTENT */}
        <p
          style={{
            fontFamily: selected.fontFamily,
            textAlign: selected.textAlign,
            fontSize: selected.fontSize,
            fontWeight: selected.fontWeight,
            color: selected.color,
          }}
        >
          {selected.content}
        </p>

        {/* COMMENTS */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Comments</h3>

          <div className="space-y-2 mb-3">
            {comments.map((c, i) => (
              <div
                key={i}
                className="flex justify-between items-center text-sm bg-gray-800 p-2 rounded"
              >
                <div>
                  <b>{c.user}</b>: {c.text}
                </div>

                {/* DELETE ONLY OWN COMMENT */}
                {c.user === email && (
                  <button
                    onClick={() => handleDelete(c.text)}
                    className="text-red-400 text-xs ml-2 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div className="flex gap-2">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 p-2 rounded bg-gray-800"
              placeholder="Write comment..."
            />
            <button
              onClick={handleAddComment}
              className="px-3 bg-emerald-400 text-black rounded"
            >
              Post
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NewsDetail;