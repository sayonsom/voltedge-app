export default function Card({ children, className = '', onClick = null }) {
  return (
    <div 
      className={`bg-white border border-gray-200 rounded p-3 
                  hover:border-[#0078d4] hover:shadow-sm 
                  transition-all ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
