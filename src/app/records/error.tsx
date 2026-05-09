"use client";

export default function RecordsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="text-center py-20">
      <p className="text-4xl mb-4">😵</p>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        出错了
      </h2>
      <p className="text-gray-500 mb-6">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        重试
      </button>
    </div>
  );
}
