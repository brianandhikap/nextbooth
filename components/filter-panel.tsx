"use client"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FilterPanelProps {
  activeFilter: string
  setActiveFilter: (filter: string) => void
}

export default function FilterPanel({ activeFilter, setActiveFilter }: FilterPanelProps) {
  const filters = [
    { id: "none", name: "Original" },
    { id: "grayscale", name: "Grayscale" },
    { id: "sepia", name: "Sepia" },
    { id: "invert", name: "Invert" },
    { id: "blur", name: "Blur" },
    { id: "brightness", name: "Brightness" },
    { id: "contrast", name: "Contrast" },
    // Instagram-like filters
    { id: "clarendon", name: "Clarendon" },
    { id: "gingham", name: "Gingham" },
    { id: "moon", name: "Moon" },
    { id: "lark", name: "Lark" },
    { id: "reyes", name: "Reyes" },
    { id: "juno", name: "Juno" },
    { id: "slumber", name: "Slumber" },
    { id: "crema", name: "Crema" },
    { id: "ludwig", name: "Ludwig" },
    { id: "aden", name: "Aden" },
    { id: "perpetua", name: "Perpetua" },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Apply Filters</h3>
      <p className="text-sm text-muted-foreground mb-4">Select a filter to apply to all photos</p>

      <ScrollArea className="h-[400px] pr-4">
        <div className="grid grid-cols-2 gap-2">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.id

            return (
              <Button
                key={filter.id}
                variant={isActive ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.name}
              </Button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

