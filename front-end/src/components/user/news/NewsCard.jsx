import { motion } from "framer-motion";

const NewsCard = ({ n, userEmail, onLike, onDislike, onOpen }) => {
  const liked = n.likedBy?.includes(userEmail);
  const disliked = n.dislikedBy?.includes(userEmail);

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-lg cursor-pointer"
      onClick={() => onOpen(n)}
    >
      {/* IMAGE */}
      {n.image && (
        <img
          src={n.image}
          className="w-full h-48 object-cover"
        />
      )}

      {/* CONTENT */}
      <div className="p-4 space-y-3">

        {/* CATEGORY */}
        <span className="text-xs text-emerald-400 uppercase tracking-wide">
          {n.category}
        </span>

        {/* TITLE */}
        <h2 className="text-lg font-bold text-white">
          {n.title}
        </h2>

        {/* TEXT */}
        <p className="text-sm text-gray-400 line-clamp-3">
          {n.content}
        </p>

        {/* ACTIONS */}
        <div className="flex justify-between items-center pt-2">

          {/* LIKE */}
          <motion.button
            whileTap={{ scale: 1.4 }}
            onClick={(e) => {
              e.stopPropagation();
              onLike(n._id);
            }}
            className={`flex items-center gap-1 text-sm transition ${
              liked
                ? "text-emerald-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {liked ? "👍" : "👍🏻"} {n.likes}
          </motion.button>

          {/* DISLIKE */}
          <motion.button
            whileTap={{ scale: 1.4 }}
            onClick={(e) => {
              e.stopPropagation();
              onDislike(n._id);
            }}
            className={`flex items-center gap-1 text-sm transition ${
              disliked
                ? "text-red-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {disliked ? "👎" : "👎🏻"} {n.dislikes}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;