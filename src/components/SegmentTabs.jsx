import { useState } from "react"

const segments = [
  "Asistentes",
  "Internos",
  "Externos",
  "Técnicos",
]

export default function SegmentTabs() {
  const [active, setActive] = useState("Asistentes")

  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      {segments.map((seg) => (
        <button
          key={seg}
          onClick={() => setActive(seg)}
          className={`px-4 py-2 text-sm rounded-md transition-all
            ${
              active === seg
                ? "bg-blue-900 text-white shadow"
                : "text-gray-600 hover:bg-gray-200"
            }
          `}
        >
          {seg}
        </button>
      ))}
    </div>
  )
}
