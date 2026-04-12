import { motion } from "framer-motion";

const SkeletonProfile = () => {
  return (
    <div className="animate-pulse bg-white/10 p-6 rounded-2xl">
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-24 h-24 rounded-full bg-gray-700" />
        <div className="space-y-2">
          <div className="w-32 h-4 bg-gray-700 rounded" />
          <div className="w-20 h-3 bg-gray-700 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Array(6).fill().map((_, i) => (
          <div key={i} className="h-10 bg-gray-700 rounded-xl" />
        ))}
      </div>

      <div className="mt-6 h-10 bg-gray-700 rounded-xl" />
    </div>
  );
};

export default SkeletonProfile;