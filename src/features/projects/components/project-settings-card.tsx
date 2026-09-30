import { Controller } from "react-hook-form"
import type { Control } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { CommentPermissionRadios } from "@/features/projects/components/comment-permission-radios"
import {
  MACHINE_RESOURCE_MAX,
  MACHINE_RESOURCE_MIN,
} from "@/features/projects/schemas/project.schema"
import type {
  Project,
  ProjectSettingsValues,
} from "@/features/projects/types/project.types"

type ProjectSettingsCardProps = {
  project: Project
  control: Control<ProjectSettingsValues>
}

export function ProjectSettingsCard({
  project,
  control,
}: ProjectSettingsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Project Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="project-name">Project name</Label>
          <Input id="project-name" value={project.name} readOnly />
        </div>

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                {...field}
                id="project-description"
                maxLength={256}
                rows={3}
              />
            </div>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Controller
            name="machineConfiguration.cpuCores"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="cpu-cores">CPU Cores</Label>
                <div className="text-xs text-muted-foreground">
                  {field.value.toFixed(1)}
                </div>
                <Slider
                  id="cpu-cores"
                  min={MACHINE_RESOURCE_MIN}
                  max={MACHINE_RESOURCE_MAX}
                  step={0.1}
                  value={[field.value]}
                  onValueChange={([value]) => field.onChange(value)}
                />
              </div>
            )}
          />
          <Controller
            name="machineConfiguration.ram"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="ram">RAM (GB)</Label>
                <div className="text-xs text-muted-foreground">
                  {field.value.toFixed(1)}
                </div>
                <Slider
                  id="ram"
                  min={MACHINE_RESOURCE_MIN}
                  max={MACHINE_RESOURCE_MAX}
                  step={0.1}
                  value={[field.value]}
                  onValueChange={([value]) => field.onChange(value)}
                />
              </div>
            )}
          />
          <div className="space-y-2">
            <Label htmlFor="storage-future">Storage (GB)</Label>
            <Input id="storage-future" value="Coming soon" disabled readOnly />
            <p className="text-xs text-muted-foreground">
              Storage configuration will be available in a future release.
            </p>
          </div>
        </div>

        <Controller
          name="commentPermission"
          control={control}
          render={({ field }) => (
            <CommentPermissionRadios
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </CardContent>
    </Card>
  )
}
