import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function OTPModal({ open, onClose, onVerify }) {

  const [otp,setOtp] = useState("");

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center">

        <div className="absolute inset-0 bg-black/70" onClick={onClose}/>

        <motion.div
          initial={{scale:0.8,opacity:0}}
          animate={{scale:1,opacity:1}}
          className="glass-card w-96 space-y-4"
        >
          <h2 className="text-lg text-white text-center">
            Verify Email
          </h2>

          <input
            value={otp}
            onChange={(e)=>setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full p-3 rounded-xl bg-white/10 text-white text-center tracking-widest"
          />

          <button
            onClick={()=>onVerify(otp)}
            className="w-full bg-emerald-400 text-black py-2 rounded-xl"
          >
            Verify
          </button>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}