export default function Error({ error }: { error: string }) {
  return (
    <div className="min-w-[300px] bg-gray-900 shadow-2xl p-6 text-white font-sans">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Error
        </h2>
      </div>
      <div className="flex items-center space-x-3">
        <div>
          <p className="text-sm text-gray-300">{error}</p>
        </div>
      </div>
    </div>
  );
}
