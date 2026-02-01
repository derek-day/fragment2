export default function NameInput({ label, value, onChange }) {
  return (
    <div className="display stat-box p-6 w-full max-w-md text-white">
      <label className="block mb-2">{label}</label>
      <input
        type="text"
        className="border p-2 w-full mb-4 text-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
