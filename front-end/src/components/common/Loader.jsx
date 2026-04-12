/*
========================================
Simple fancy spinner loader
========================================
*/

export default function Loader() {
  return (
    <div className="flex justify-center py-6">
      <div className="h-8 w-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
