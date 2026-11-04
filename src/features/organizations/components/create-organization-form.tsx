import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import { Controller, useForm, useWatch } from "react-hook-form"
import { Field } from "@/components/common/field"
import { ImagePicker } from "@/components/common/image-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCreateOrganization } from "@/features/organizations/hooks/use-create-organization"
import {
  ORGANIZATION_LOGO_MIME_TYPES,
  createOrganizationSchema,
} from "@/features/organizations/schemas/organization.schema"
import { useImageDraft } from "@/hooks/use-image-draft"
import { getErrorMessage } from "@/lib/api/api-error"
import { getInitials } from "@/lib/utils/get-initials"

export function CreateOrganizationForm() {
  const navigate = useNavigate()
  const createOrganization = useCreateOrganization()
  const logo = useImageDraft(null)
  const form = useForm({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: { name: "", description: "", logoFile: null },
  })
  const name = useWatch({ control: form.control, name: "name" })
  const logoError = form.formState.errors.logoFile?.message

  const onLogoSelect = (file: File) => {
    form.setValue("logoFile", file, { shouldValidate: true })
    logo.select(file)
  }

  const onLogoRemove = () => {
    form.setValue("logoFile", null, { shouldValidate: true })
    logo.remove()
  }

  const onSubmit = form.handleSubmit((input) =>
    createOrganization.mutate(input, {
      onSuccess: () => void navigate({ to: "/" }),
    })
  )

  return (
    <form
      noValidate
      className="space-y-6"
      onSubmit={(event) => void onSubmit(event)}
    >
      <div className="flex items-center gap-5">
        <ImagePicker
          imageUrl={logo.previewUrl}
          fallback={name.trim() ? getInitials(name) : "ORG"}
          accept={ORGANIZATION_LOGO_MIME_TYPES.join(",")}
          label="Choose a logo"
          onSelect={onLogoSelect}
        />
        <div className="min-w-0">
          <p className="text-sm font-medium">Logo</p>
          {logoError ? (
            <p className="mt-1 text-sm text-destructive">{logoError}</p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              Optional. PNG, JPG, WEBP, or SVG.
            </p>
          )}
          {logo.previewUrl && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              className="mt-1 -ml-2"
              onClick={onLogoRemove}
            >
              Remove logo
            </Button>
          )}
        </div>
      </div>

      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            label="Name"
            htmlFor="org-name"
            error={fieldState.error?.message}
          >
            <Input
              {...field}
              id="org-name"
              placeholder="Acme"
              autoComplete="organization"
              aria-invalid={fieldState.invalid}
            />
          </Field>
        )}
      />

      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            label="Description"
            htmlFor="org-description"
            hint="Optional."
            error={fieldState.error?.message}
          >
            <Textarea
              {...field}
              id="org-description"
              placeholder="What does this organization build?"
              rows={3}
              aria-invalid={fieldState.invalid}
            />
          </Field>
        )}
      />

      {createOrganization.isError && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {getErrorMessage(
            createOrganization.error,
            "The organization wasn't created. Try again."
          )}
        </p>
      )}

      <Button
        type="submit"
        disabled={createOrganization.isPending || !name.trim()}
      >
        {createOrganization.isPending ? "Creating..." : "Create organization"}
      </Button>
    </form>
  )
}
