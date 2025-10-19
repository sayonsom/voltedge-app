export default function Button({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  onClick, 
  disabled = false,
  className = '',
  icon = null
}) {
  const baseStyles = 'py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors shadow-sm font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#0078d4] hover:bg-[#106ebe] text-white',
    secondary: 'bg-white hover:bg-[#f3f2f1] text-gray-900 border border-gray-200',
    icon: 'hover:bg-[#106ebe] p-2 rounded transition-colors',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {icon && icon}
      {children}
    </button>
  );
}
