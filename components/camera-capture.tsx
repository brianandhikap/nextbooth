"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, FlipHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CameraCaptureProps {
  onCapture: (photoDataUrl: string) => void
}

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user")
  const [error, setError] = useState<string | null>(null)

  // Start camera
  const startCamera = async () => {
    try {
      setError(null)
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
        setIsCameraActive(true)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Could not access camera. Please make sure you've granted permission.")
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
      setIsCameraActive(false)
    }
  }

  // Switch camera (front/back)
  const switchCamera = () => {
    stopCamera()
    setFacingMode(facingMode === "user" ? "environment" : "user")
  }

  // Capture photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw current video frame to canvas
      const context = canvas.getContext("2d")
      if (context) {
        // If using front camera, flip the image horizontally
        if (facingMode === "user") {
          context.translate(canvas.width, 0)
          context.scale(-1, 1)
        }

        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convert canvas to data URL
        const photoDataUrl = canvas.toDataURL("image/jpeg")

        // Pass the captured photo data URL to parent component
        onCapture(photoDataUrl)
      }
    }
  }

  // Start camera when component mounts or facingMode changes
  useEffect(() => {
    if (!isCameraActive) {
      startCamera()
    }

    // Clean up on unmount
    return () => {
      stopCamera()
    }
  }, [facingMode])

  return (
    <div className="relative">
      {error && <div className="p-4 mb-4 bg-destructive/10 text-destructive rounded-md">{error}</div>}

      <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
        />

        {/* Hidden canvas for capturing photos */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="mt-4 flex justify-center gap-4">
        <Button variant="outline" size="icon" onClick={switchCamera} title="Switch Camera">
          <FlipHorizontal className="h-5 w-5" />
        </Button>

        <Button
          onClick={capturePhoto}
          size="lg"
          className="rounded-full w-16 h-16 p-0 flex items-center justify-center"
        >
          <Camera className="h-8 w-8" />
        </Button>

        <Button variant="outline" size="icon" onClick={stopCamera} title="Close Camera">
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

