export default function Input({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  required = false,
  disabled = false,
  className = '',
  label = null,
  error = null
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-sm text-gray-600 font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="w-full py-2 px-3 rounded border border-gray-200 text-sm 
                   focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:ring-opacity-50 
                   disabled:bg-gray-100 disabled:cursor-not-allowed
                   placeholder:text-gray-400"
      />
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
}
