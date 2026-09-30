import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import { Controller, useForm, useWatch } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCreateOrganization } from "@/features/organizations/hooks/use-create-organization"
import {
  ORGANIZATION_LOGO_MIME_TYPES,
  createOrganizationSchema,
} from "@/features/organizations/schemas/organization.schema"
import { getErrorMessage } from "@/lib/api/api-error"
import { getFirstErrorMessage } from "@/lib/utils/form-errors"

export function CreateOrganizationForm() {
  const navigate = useNavigate()
  const createOrganization = useCreateOrganization()
  const form = useForm({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: { name: "", description: "", logoFile: null },
  })
  const name = useWatch({ control: form.control, name: "name" })

  const onSubmit = form.handleSubmit((input) =>
    createOrganization.mutate(input, {
      onSuccess: () => void navigate({ to: "/" }),
    })
  )

  const errorMessage =
    getFirstErrorMessage(form.formState.errors) ??
    (createOrganization.isError
      ? getErrorMessage(
          createOrganization.error,
          "Failed to create organization."
        )
      : undefined)

  return (
    <Card className="glass-surface border-border/50">
      <CardHeader>
        <CardTitle className="text-base">Organization Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={onSubmit}>
          <Controller
            name="name"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="org-name">
                  Organization name{" "}
                  <span className="text-destructive-foreground">*</span>
                </Label>
                <Input
                  {...field}
                  id="org-name"
                  placeholder="Acme Inc."
                  required
                />
              </div>
            )}
          />

          <Controller
            name="description"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="org-description">Description</Label>
                <Textarea
                  {...field}
                  id="org-description"
                  placeholder="What is this organization about?"
                  rows={4}
                />
              </div>
            )}
          />

          <Controller
            name="logoFile"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="org-logo">Logo (optional)</Label>
                <input
                  id="org-logo"
                  name={field.name}
                  ref={field.ref}
                  type="file"
                  accept={ORGANIZATION_LOGO_MIME_TYPES.join(",")}
                  onBlur={field.onBlur}
                  onChange={(event) =>
                    field.onChange(event.target.files?.[0] ?? null)
                  }
                  className="block w-full text-sm text-foreground file:mr-3 file:rounded-md file:border file:border-border/70 file:bg-glass-surface-strong file:px-3 file:py-2 file:text-sm file:font-medium file:text-foreground file:hover:bg-accent"
                />
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP or SVG. The image will be resized
                  automatically.
                </p>
              </div>
            )}
          />

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              disabled={createOrganization.isPending || !name.trim()}
            >
              {createOrganization.isPending
                ? "Creating..."
                : "Create organization"}
            </Button>
            {errorMessage && (
              <p className="text-sm font-medium text-destructive-foreground">
                {errorMessage}
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
