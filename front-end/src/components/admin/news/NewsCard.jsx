import { useState } from "react";
import { likeNews, dislikeNews } from "../../services/api";
import { motion } from "framer-motion";

export default function NewsCard({ item }) {

  const [likes, setLikes] = useState(item.likes || 0);
  const [dislikes, setDislikes] = useState(item.dislikes || 0);

  const handleLike = async () => {
    setLikes(likes + 1); // ⚡ instant UI
    await likeNews(item._id);
  };

  const handleDislike = async () => {
    setDislikes(dislikes + 1);
    await dislikeNews(item._id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg"
    >

      {/* IMAGE */}
      {item.image && (
        <img
          src={`http://127.0.0.1:8000/${item.image}`}
          className="w-full h-52 object-cover"
        />
      )}

      {/* CONTENT */}
      <div className="p-4 space-y-3">

        <h3 className="text-lg font-semibold">{item.title}</h3>

        <p className="text-gray-400 text-sm">{item.content}</p>

        {/* LIKE BAR */}
        <div className="flex justify-between text-sm">

          <button onClick={handleLike}>
            ❤️ {likes}
          </button>

          <button onClick={handleDislike}>
            👎 {dislikes}
          </button>

        </div>

      </div>
    </motion.div>
  );
}