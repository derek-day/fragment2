// "use client";
// import { useState } from "react";

// export default function NameInput({ label, onSubmit }) {
//   const [value, setValue] = useState("");

//   return (
//     <div className="w-full max-w-md">
//       <label className="block mb-2">{label}</label>
//       <input
//         type="text"
//         className="border p-2 rounded w-full mb-4 text-black"
//         value={value}
//         onChange={(e) => setValue(e.target.value)}
//       />
//       <button
//         className={`mt-2 bg-green-600 px-4 py-2 rounded text-white hover:bg-green-800 ${
//           value.trim() === "" ? "opacity-50 cursor-not-allowed" : ""
//         }`}
//         onClick={() => onSubmit(value)}
//         disabled={value.trim() === ""}
//       >
//         Continue
//       </button>
//     </div>
//   );
// }


export default function NameInput({ label, value, onChange }) {
  return (
    <div>
      <label className="block mb-2">{label}</label>
      <input
        type="text"
        className="border p-2 w-full mb-4 text-black"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
