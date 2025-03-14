import type { CSSProperties } from "react"

type LayoutType = "1x1" | "1x2" | "1x3" | "1x4" | "2x2"

interface PhotoGridProps {
  photos: string[]
  layout: LayoutType
  filter: string
  watermark: string | null
}

export default function PhotoGrid({ photos, layout, filter, watermark }: PhotoGridProps) {
  // Get max photos based on layout
  const getMaxPhotos = () => {
    switch (layout) {
      case "1x1":
        return 1
      case "1x2":
        return 2
      case "1x3":
        return 3
      case "1x4":
        return 4
      case "2x2":
        return 4
      default:
        return 1
    }
  }

  // Limit photos to the layout size
  const displayPhotos = photos.slice(0, getMaxPhotos())

  // Apply CSS filter based on selected filter
  const getFilterStyle = (): CSSProperties => {
    switch (filter) {
      case "grayscale":
        return { filter: "grayscale(100%)" }
      case "sepia":
        return { filter: "sepia(100%)" }
      case "invert":
        return { filter: "invert(100%)" }
      case "blur":
        return { filter: "blur(2px)" }
      case "brightness":
        return { filter: "brightness(150%)" }
      case "contrast":
        return { filter: "contrast(200%)" }
      // Instagram-like filters
      case "clarendon":
        return { filter: "contrast(120%) saturate(125%) brightness(110%)" }
      case "gingham":
        return { filter: "brightness(105%) hue-rotate(350deg)" }
      case "moon":
        return { filter: "grayscale(100%) brightness(110%)" }
      case "lark":
        return { filter: "brightness(110%) contrast(110%) saturate(130%)" }
      case "reyes":
        return { filter: "sepia(30%) brightness(110%) contrast(85%) saturate(75%)" }
      case "juno":
        return { filter: "saturate(135%) hue-rotate(330deg)" }
      case "slumber":
        return { filter: "saturate(85%) brightness(105%)" }
      case "crema":
        return { filter: "brightness(110%) contrast(90%) saturate(150%)" }
      case "ludwig":
        return { filter: "contrast(105%) brightness(105%) saturate(105%)" }
      case "aden":
        return { filter: "brightness(115%) saturate(140%) sepia(20%)" }
      case "perpetua":
        return { filter: "brightness(110%) contrast(110%) saturate(120%)" }
      default:
        return {}
    }
  }

  // Get grid layout classes based on layout type
  const getGridClasses = () => {
    switch (layout) {
      case "1x1":
        return "grid-cols-1 grid-rows-1"
      case "1x2":
        return "grid-cols-1 grid-rows-2"
      case "1x3":
        return "grid-cols-1 grid-rows-3"
      case "1x4":
        return "grid-cols-1 grid-rows-4"
      case "2x2":
        return "grid-cols-2 grid-rows-2"
      default:
        return "grid-cols-1"
    }
  }

  return (
    <div className="w-full relative">
      <div
        className={`grid gap-2 ${getGridClasses()}`}
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          aspectRatio:
            layout === "1x1"
              ? "1/1"
              : layout === "1x2"
                ? "1/2"
                : layout === "1x3"
                  ? "1/3"
                  : layout === "1x4"
                    ? "1/4"
                    : layout === "2x2"
                      ? "1/1"
                      : "1/1",
        }}
      >
        {displayPhotos.map((photo, index) => (
          <div key={index} className="relative overflow-hidden rounded-lg aspect-square" style={getFilterStyle()}>
            <img src={photo || "/placeholder.svg"} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}

        {/* Fill empty slots with placeholders */}
        {Array.from({ length: getMaxPhotos() - displayPhotos.length }).map((_, index) => (
          <div
            key={`placeholder-${index}`}
            className="bg-muted rounded-lg flex items-center justify-center aspect-square"
          >
            <span className="text-muted-foreground">Add Photo</span>
          </div>
        ))}
      </div>

      {/* Watermark */}
      {watermark && (
        <div className="absolute bottom-2 right-2 opacity-70">
          <img src={watermark || "/placeholder.svg"} alt="Watermark" className="h-8 w-auto" />
        </div>
      )}
    </div>
  )
}

