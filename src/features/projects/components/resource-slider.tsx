import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  MACHINE_RESOURCE_MAX,
  MACHINE_RESOURCE_MIN,
} from "@/features/projects/schemas/project.schema"

type ResourceSliderProps = {
  id: string
  label: string
  unit: string
  value: number
  onChange: (value: number) => void
}

export function ResourceSlider({
  id,
  label,
  unit,
  value,
  onChange,
}: ResourceSliderProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-baseline justify-between">
        <Label htmlFor={id}>{label}</Label>
        <output htmlFor={id} className="text-sm font-medium">
          {value.toFixed(1)} {unit}
        </output>
      </div>
      <Slider
        id={id}
        aria-label={label}
        min={MACHINE_RESOURCE_MIN}
        max={MACHINE_RESOURCE_MAX}
        step={0.1}
        value={[value]}
        onValueChange={([next]) => onChange(next)}
      />
    </div>
  )
}
