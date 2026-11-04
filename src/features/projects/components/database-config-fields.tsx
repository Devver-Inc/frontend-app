import { Plus, Trash2 } from "lucide-react"
import { Controller, useFieldArray } from "react-hook-form"
import type { Control } from "react-hook-form"
import { Field } from "@/components/common/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DATABASE_REPLICAS_MAX,
  DATABASE_STORAGE_MAX,
  DATABASE_TYPES,
} from "@/features/projects/schemas/project.schema"
import type {
  CreateProjectValues,
  DatabaseType,
} from "@/features/projects/types/project.types"
import { DATABASE_LABELS } from "@/features/projects/utils/database-labels"

const DEFAULT_DATABASE = {
  username: "",
  password: "",
  replicaCount: 1,
  ram: 0.5,
  cpuCores: 0.5,
  storage: 1,
}

const toNumber = (value: string) => (value === "" ? 0 : Number(value))

type DatabaseConfigFieldsProps = {
  control: Control<CreateProjectValues>
}

// The API accepts one database of each engine, set when the project is created.
export function DatabaseConfigFields({ control }: DatabaseConfigFieldsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "databaseConfigurations",
  })
  const usedTypes = new Set(fields.map(({ type }) => type))
  const nextType = DATABASE_TYPES.find((type) => !usedTypes.has(type))

  return (
    <div className="space-y-3">
      {fields.map((database, index) => (
        <fieldset
          key={database.id}
          className="space-y-3 rounded-xl bg-muted p-4"
        >
          <div className="flex items-center justify-between gap-2">
            <legend className="float-left text-sm font-medium">
              {DATABASE_LABELS[database.type]}
            </legend>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Remove ${DATABASE_LABELS[database.type]}`}
              onClick={() => remove(index)}
            >
              <Trash2 />
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Controller
              name={`databaseConfigurations.${index}.username`}
              control={control}
              render={({ field }) => (
                <Field label="Username" htmlFor={`db-${index}-username`}>
                  <Input
                    {...field}
                    id={`db-${index}-username`}
                    autoComplete="off"
                  />
                </Field>
              )}
            />
            <Controller
              name={`databaseConfigurations.${index}.password`}
              control={control}
              render={({ field }) => (
                <Field label="Password" htmlFor={`db-${index}-password`}>
                  <Input
                    {...field}
                    id={`db-${index}-password`}
                    type="password"
                    autoComplete="new-password"
                  />
                </Field>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Controller
              name={`databaseConfigurations.${index}.replicaCount`}
              control={control}
              render={({ field }) => (
                <Field label="Replicas" htmlFor={`db-${index}-replicas`}>
                  <Input
                    {...field}
                    id={`db-${index}-replicas`}
                    type="number"
                    min={1}
                    max={DATABASE_REPLICAS_MAX}
                    step={1}
                    onChange={(event) =>
                      field.onChange(toNumber(event.target.value))
                    }
                  />
                </Field>
              )}
            />
            <Controller
              name={`databaseConfigurations.${index}.cpuCores`}
              control={control}
              render={({ field }) => (
                <Field label="CPU cores" htmlFor={`db-${index}-cpu`}>
                  <Input
                    {...field}
                    id={`db-${index}-cpu`}
                    type="number"
                    min={0.1}
                    step={0.1}
                    onChange={(event) =>
                      field.onChange(toNumber(event.target.value))
                    }
                  />
                </Field>
              )}
            />
            <Controller
              name={`databaseConfigurations.${index}.ram`}
              control={control}
              render={({ field }) => (
                <Field label="RAM (GB)" htmlFor={`db-${index}-ram`}>
                  <Input
                    {...field}
                    id={`db-${index}-ram`}
                    type="number"
                    min={0.5}
                    step={0.5}
                    onChange={(event) =>
                      field.onChange(toNumber(event.target.value))
                    }
                  />
                </Field>
              )}
            />
            <Controller
              name={`databaseConfigurations.${index}.storage`}
              control={control}
              render={({ field }) => (
                <Field label="Storage (GB)" htmlFor={`db-${index}-storage`}>
                  <Input
                    {...field}
                    id={`db-${index}-storage`}
                    type="number"
                    min={1}
                    max={DATABASE_STORAGE_MAX}
                    step={1}
                    onChange={(event) =>
                      field.onChange(toNumber(event.target.value))
                    }
                  />
                </Field>
              )}
            />
          </div>
        </fieldset>
      ))}

      {nextType && (
        <div className="flex flex-wrap gap-2">
          {DATABASE_TYPES.filter((type) => !usedTypes.has(type)).map(
            (type: DatabaseType) => (
              <Button
                key={type}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ ...DEFAULT_DATABASE, type })}
              >
                <Plus />
                {DATABASE_LABELS[type]}
              </Button>
            )
          )}
        </div>
      )}
    </div>
  )
}
