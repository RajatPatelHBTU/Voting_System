
interface DetailItemProps {
    label: string
    value: string
    type?: "text" | "image"
    className?: string
  }
  
  export default function DetailItem({ label, value, type = "text", className = "" }: DetailItemProps) {
    return (
      <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
        <h2 className="text-sm font-medium text-purple-700 mb-2">{label}</h2>
        {type === "text" && <p className="text-gray-800">{value}</p>}
        {type === "image" && (
          <div> 
            <img src={value || "/placeholder.svg"} alt={label} className="w-full h-48 object-contain rounded-lg" />
          </div>
          // 
        )}
      </div>
    )
  }
  
  