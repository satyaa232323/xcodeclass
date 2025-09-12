export default function Header({ title }: { title: string }) {
  return (
    <header className="flex justify-between items-center p-4 bg-red-500 shadow rounded-lg mb-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <input
        type="text"
        placeholder="Search here"
        className="border px-4 py-2 rounded-lg w-64"
      />
    </header>
  );
}
