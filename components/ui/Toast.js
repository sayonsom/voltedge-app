export default function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`min-w-[280px] max-w-[360px] bg-white border rounded shadow-lg p-3 ${
            t.type === 'success' ? 'border-green-200' : t.type === 'error' ? 'border-red-200' : 'border-gray-200'
          }`}
        >
          {t.title && (
            <div className="text-sm font-semibold text-gray-900 mb-1">{t.title}</div>
          )}
          {t.description && (
            <div className="text-xs text-gray-700">{t.description}</div>
          )}
          <button
            onClick={() => onDismiss?.(t.id)}
            className="mt-2 text-xs text-[#0078d4] hover:underline"
          >
            Dismiss
          </button>
        </div>)
      )}
    </div>
  );
}
