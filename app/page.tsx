"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Download, ImageIcon, Sliders, Trash2, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import PhotoGrid from "@/components/photo-grid"
import FilterPanel from "@/components/filter-panel"
import CameraCapture from "@/components/camera-capture"

// Layout types
type LayoutType = "1x1" | "1x2" | "1x3" | "1x4" | "2x2"

export default function PhotoBooth() {
  const [photos, setPhotos] = useState<string[]>([])
  const [layout, setLayout] = useState<LayoutType>("1x1")
  const [activeFilter, setActiveFilter] = useState<string>("none")
  const [watermark, setWatermark] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("upload")
  const compositionRef = useRef<HTMLDivElement>(null)

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

  // Load watermark (in a real app, this would be your logo)
  useEffect(() => {
    // This is a placeholder. The user will provide their own watermark later
    setWatermark("/placeholder.svg?height=50&width=100")
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = [...photos]
      const filesArray = Array.from(e.target.files)
      const maxPhotos = getMaxPhotos()

      try {
        for (const file of filesArray) {
          if (newPhotos.length < maxPhotos) {
            // Crop the image to square before adding
            const croppedDataUrl = await cropToSquare(file)
            newPhotos.push(croppedDataUrl)
          }
        }
        setPhotos([...newPhotos])
      } catch (error) {
        console.error("Error processing images:", error)
        alert("There was an error processing one or more images. Please try again.")
      }
    }
  }

  const removePhoto = (index: number) => {
    const newPhotos = [...photos]
    newPhotos.splice(index, 1)
    setPhotos(newPhotos)
  }

  const downloadComposition = () => {
    if (!compositionRef.current) return

    const element = compositionRef.current

    // Use html2canvas or similar library in a real implementation
    alert("In a complete implementation, this would download the composition with the applied filters and watermark.")
  }

  const clearPhotos = () => {
    setPhotos([])
    setActiveFilter("none")
  }

  // When layout changes, trim photos if needed
  useEffect(() => {
    const maxPhotos = getMaxPhotos()
    if (photos.length > maxPhotos) {
      setPhotos(photos.slice(0, maxPhotos))
    }
  }, [layout])

  // Function to crop image to square
  const cropToSquare = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (!e.target?.result) {
          reject(new Error("Failed to read file"))
          return
        }

        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement("canvas")
          const size = Math.min(img.width, img.height)
          canvas.width = size
          canvas.height = size

          const x = (img.width - size) / 2
          const y = (img.height - size) / 2

          const ctx = canvas.getContext("2d")
          if (!ctx) {
            reject(new Error("Could not get canvas context"))
            return
          }
          ctx.drawImage(img, x, y, size, size, 0, 0, size, size)
          resolve(canvas.toDataURL("image/jpeg"))
        }
        img.onerror = () => {
          reject(new Error("Failed to load image"))
        }
        img.src = e.target.result as string
      }
      reader.onerror = () => {
        reject(new Error("Failed to read file"))
      }
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">NextBooth</h1>
        <p className="text-muted-foreground">Create beautiful photo compositions with filters and layouts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div
            ref={compositionRef}
            className="bg-white rounded-lg shadow-lg p-4 min-h-[500px] flex items-center justify-center"
          >
            {photos.length > 0 ? (
              <PhotoGrid photos={photos} layout={layout} filter={activeFilter} watermark={watermark} />
            ) : (
              <div className="text-center p-12 border-2 border-dashed border-muted-foreground/20 rounded-lg">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Photos Selected</h3>
                <p className="text-muted-foreground mb-4">Upload photos to create your composition</p>
                <Button onClick={() => setActiveTab("upload")}>Select Photos</Button>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2 justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Layout:</span>
              <RadioGroup
                value={layout}
                onValueChange={(value) => setLayout(value as LayoutType)}
                className="flex gap-2"
              >
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="1x1" id="layout-1x1" />
                  <Label htmlFor="layout-1x1">1×1</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="1x2" id="layout-1x2" />
                  <Label htmlFor="layout-1x2">1×2</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="1x3" id="layout-1x3" />
                  <Label htmlFor="layout-1x3">1×3</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="1x4" id="layout-1x4" />
                  <Label htmlFor="layout-1x4">1×4</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="2x2" id="layout-2x2" />
                  <Label htmlFor="layout-2x2">2×2</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearPhotos} disabled={photos.length === 0}>
                <Trash2 className="mr-2 h-4 w-4" /> Clear
              </Button>
              <Button onClick={downloadComposition} disabled={photos.length === 0}>
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </div>
          </div>
        </div>

        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">
                <ImageIcon className="mr-2 h-4 w-4" /> Upload
              </TabsTrigger>
              <TabsTrigger value="camera">
                <Video className="mr-2 h-4 w-4" /> Camera
              </TabsTrigger>
              <TabsTrigger value="filters" disabled={photos.length === 0}>
                <Sliders className="mr-2 h-4 w-4" /> Filters
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="p-4 border rounded-lg mt-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Upload Photos</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select up to {getMaxPhotos()} photos for your {layout} layout
                  </p>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="photo-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImageIcon className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                      </div>
                      <input
                        id="photo-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                </div>

                {photos.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Selected Photos</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo || "/placeholder.svg"}
                            alt={`Selected photo ${index + 1}`}
                            className="w-full h-24 object-cover rounded-md"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removePhoto(index)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="camera" className="p-4 border rounded-lg mt-2">
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-2">Take Photos</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Use your camera to take photos for your {layout} layout
                </p>
                <CameraCapture
                  onCapture={async (photoDataUrl) => {
                    if (photos.length < getMaxPhotos()) {
                      // Convert data URL to File object
                      const response = await fetch(photoDataUrl)
                      const blob = await response.blob()
                      const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" })

                      try {
                        // Crop to square
                        const croppedDataUrl = await cropToSquare(file)
                        setPhotos([...photos, croppedDataUrl])
                      } catch (error) {
                        console.error("Error processing camera photo:", error)
                        alert("There was an error processing the photo. Please try again.")
                      }
                    } else {
                      alert(`Maximum of ${getMaxPhotos()} photos allowed for ${layout} layout`)
                    }
                  }}
                />
              </div>
            </TabsContent>
            <TabsContent value="filters" className="p-4 border rounded-lg mt-2">
              <FilterPanel activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

