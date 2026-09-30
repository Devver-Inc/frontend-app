import { Camera } from "lucide-react"
import { useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type ImagePickerProps = {
  imageUrl: string | null
  fallback: string
  accept: string
  label: string
  onSelect: (file: File) => void
}

export function ImagePicker({
  imageUrl,
  fallback,
  accept,
  label,
  onSelect,
}: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="group relative">
      <Avatar className="h-20 w-20 rounded-lg">
        <AvatarImage src={imageUrl ?? undefined} />
        <AvatarFallback className="rounded-lg bg-muted text-lg">
          {fallback}
        </AvatarFallback>
      </Avatar>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
        aria-label={label}
      >
        <Camera className="h-5 w-5 text-white" />
      </button>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={(event) => {
          const file = event.target.files?.[0]
          // Lets the same file be picked again after a removal.
          event.target.value = ""
          if (file) onSelect(file)
        }}
      />
    </div>
  )
}
