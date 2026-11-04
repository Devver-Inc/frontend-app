import { Plus, Trash2 } from "lucide-react"
import { Controller, useFieldArray } from "react-hook-form"
import type { Control } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type {
  CreateDeploymentValues,
  DatabaseEngine,
} from "@/features/deployments/types/deployment.types"
import { DATABASE_LABELS } from "@/features/projects/utils/database-labels"

type DatabaseLinkFieldsProps = {
  control: Control<CreateDeploymentValues>
  engines: DatabaseEngine[]
}

export function DatabaseLinkFields({
  control,
  engines,
}: DatabaseLinkFieldsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "dbLinks",
  })

  return (
    <div className="space-y-2">
      {fields.map((link, index) => (
        <div
          key={link.id}
          className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 sm:grid-cols-[minmax(0,1fr)_8rem_minmax(0,1fr)_auto]"
        >
          <Controller
            name={`dbLinks.${index}.env`}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                aria-label="Environment variable"
                placeholder="DATABASE_URL"
                autoComplete="off"
                className="max-sm:col-span-2"
              />
            )}
          />
          <Controller
            name={`dbLinks.${index}.engine`}
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  aria-label="Database engine"
                  className="w-full max-sm:col-span-2"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {engines.map((engine) => (
                    <SelectItem key={engine} value={engine}>
                      {DATABASE_LABELS[engine]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <Controller
            name={`dbLinks.${index}.database`}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                aria-label="Database name"
                placeholder="Database name"
                autoComplete="off"
              />
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove database link"
            onClick={() => remove(index)}
          >
            <Trash2 />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ env: "", engine: engines[0], database: "" })}
      >
        <Plus />
        Link a database
      </Button>
    </div>
  )
}
