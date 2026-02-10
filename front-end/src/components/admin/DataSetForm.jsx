import { useState } from "react";
import { addDatasetRow } from "../../services/api";

export default function DatasetForm() {
  const [row, setRow] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
    label: "",
  });

  const handle = (e) => setRow({ ...row, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    await addDatasetRow(row);
    alert("Dataset row added");
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-4 gap-3">
      {Object.keys(row).map((k) => (
        <input
          key={k}
          name={k}
          placeholder={k}
          onChange={handle}
          className="p-2 rounded bg-white/20"
        />
      ))}
      <button className="col-span-4 bg-emerald-400 p-2 rounded">Add Row</button>
    </form>
  );
}
