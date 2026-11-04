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
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label={label}
        className="group relative size-20 shrink-0 cursor-pointer rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Avatar className="size-20 rounded-xl transition-transform duration-100 ease-out group-active:scale-[.97]">
          <AvatarImage src={imageUrl ?? undefined} className="object-cover" />
          <AvatarFallback className="rounded-xl bg-muted text-xl font-medium">
            {fallback}
          </AvatarFallback>
        </Avatar>
        <span className="absolute -right-1.5 -bottom-1.5 grid size-7 place-items-center rounded-full bg-foreground text-background ring-2 ring-background">
          <Camera className="size-3.5" />
        </span>
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
    </>
  )
}
