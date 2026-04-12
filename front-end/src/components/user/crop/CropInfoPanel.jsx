import { useEffect, useState } from "react";
import AddCropDetails from "./AddCropDetails";
import { getCropDetails } from "../../../services/api";

/**
 * Shows crop info or add option
 */
const CropInfoPanel = ({ cropName, user }) => {
  const [crop, setCrop] = useState(null);

  useEffect(() => {
    getCropDetails(cropName).then(setCrop);
  }, [cropName]);

  if (!crop?.exists) {
    // Only admin can add
    if (user.role === "admin") {
      return <AddCropDetails cropName={cropName} onSuccess={() => window.location.reload()} />;
    }
    return <p className="text-yellow-400">Crop details not available</p>;
  }

  return (
    <div className="glass-card space-y-2">
      <h3 className="text-xl text-emerald-400">{cropName}</h3>
      <p>{crop.data.description}</p>
      <p><b>Climate:</b> {crop.data.climate}</p>
      <p><b>Soil:</b> {crop.data.soil}</p>
    </div>
  );
};

export default CropInfoPanel;
