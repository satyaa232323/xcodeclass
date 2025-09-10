export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-900 shadow rounded-lg mb-6">
      <h2 className="text-xl font-semibold">Admin Dashboard</h2>
      <input
        type="text"
        placeholder="Search here"
        className="border px-4 py-2 rounded-lg w-64"
      />
    </header>
  );
}
