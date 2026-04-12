import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const NewsCard = ({ n, userEmail, onLike, onDislike, onOpen }) => {
  const [showLikeAnim, setShowLikeAnim] = useState(false);
  
  const isPremium = !!localStorage.getItem("premium_key");
  const liked = n.likedBy?.includes(userEmail);
  const disliked = n.dislikedBy?.includes(userEmail);

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (isPremium && !liked) {
      setShowLikeAnim(true);
      setTimeout(() => setShowLikeAnim(false), 1000);
    }
    onLike(n._id);
  };

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
          <div className="relative">
            <motion.button
              whileTap={{ scale: 1.4 }}
              onClick={handleLikeClick}
              className={`flex items-center gap-1 text-sm transition relative z-10 ${
                liked
                  ? "text-emerald-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {liked ? "👍" : "👍🏻"} {n.likes}
            </motion.button>

            {/* PREMIUM ANIMATION */}
            <AnimatePresence>
              {showLikeAnim && (
                <>
                  <motion.div
                    className="absolute top-1/2 left-3 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    initial={{ opacity: 1, scale: 0.5 }}
                    animate={{ opacity: 0, scale: 2.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <div className="w-6 h-6 rounded-full border-[3px] border-emerald-400" />
                  </motion.div>
                  <motion.div
                    className="absolute -top-4 left-0 pointer-events-none"
                    initial={{ opacity: 1, y: 0, scale: 0.5 }}
                    animate={{ opacity: 0, y: -25, scale: 1.2 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <span className="text-emerald-300 text-lg">✨</span>
                  </motion.div>
                  <motion.div
                    className="absolute -top-2 left-6 pointer-events-none"
                    initial={{ opacity: 1, x: 0, y: 0, scale: 0.3 }}
                    animate={{ opacity: 0, x: 15, y: -15, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                  >
                    <span className="text-emerald-400 text-sm">✨</span>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

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