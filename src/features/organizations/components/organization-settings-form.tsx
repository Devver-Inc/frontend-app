import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { Field } from "@/components/common/field"
import { ImagePicker } from "@/components/common/image-picker"
import { SettingsRow } from "@/components/common/section"
import { UnsavedChangesBar } from "@/components/common/unsaved-changes-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useDeleteOrganizationLogo } from "@/features/organizations/hooks/use-delete-organization-logo"
import { useUpdateOrganization } from "@/features/organizations/hooks/use-update-organization"
import { useUploadOrganizationLogo } from "@/features/organizations/hooks/use-upload-organization-logo"
import {
  ORGANIZATION_LOGO_MIME_TYPES,
  organizationSettingsLogoSchema,
  organizationSettingsSchema,
} from "@/features/organizations/schemas/organization.schema"
import type { Organization } from "@/features/organizations/types/organization.types"
import { useImageDraft } from "@/hooks/use-image-draft"
import { getInitials } from "@/lib/utils/get-initials"

// The API does not return the description: the field starts empty and only
// sends a new one.
const toFormValues = (organization: Organization) => ({
  name: organization.name,
  description: "",
})

export function OrganizationSettingsForm({
  organization,
}: {
  organization: Organization
}) {
  const updateOrganization = useUpdateOrganization(organization.id)
  const uploadLogo = useUploadOrganizationLogo(organization.id)
  const deleteLogo = useDeleteOrganizationLogo(organization.id)
  const logo = useImageDraft(organization.coverImageUrl)
  const form = useForm({
    resolver: zodResolver(organizationSettingsSchema),
    defaultValues: toFormValues(organization),
  })
  const [name, description] = useWatch({
    control: form.control,
    name: ["name", "description"],
  })

  const isDirty =
    name !== organization.name || description !== "" || logo.isDirty
  const isSaving = form.formState.isSubmitting

  const onLogoSelect = (file: File) => {
    const result = organizationSettingsLogoSchema.safeParse(file)
    if (!result.success) {
      toast.error(result.error.issues[0]?.message)
      return
    }
    logo.select(file)
  }

  const discard = () => {
    form.reset(toFormValues(organization))
    logo.reset()
  }

  const save = form.handleSubmit(async (input) => {
    try {
      let saved = await updateOrganization.mutateAsync({
        name: input.name,
        description: input.description || undefined,
      })
      if (logo.file) {
        saved = await uploadLogo.mutateAsync(logo.file)
      } else if (logo.isRemoved && organization.coverImageUrl) {
        saved = await deleteLogo.mutateAsync()
      }
      form.reset(toFormValues(saved))
      logo.reset()
      toast.success("Changes saved.")
    } catch {
      // The failed mutation already reported its error.
    }
  })

  return (
    <>
      <SettingsRow
        title="Logo"
        description="Shown next to your organization's name. 5 MB at most."
      >
        <div className="flex items-center gap-4">
          <ImagePicker
            imageUrl={logo.previewUrl}
            fallback={
              organization.name ? getInitials(organization.name) : "ORG"
            }
            accept={ORGANIZATION_LOGO_MIME_TYPES.join(",")}
            label="Change logo"
            onSelect={onLogoSelect}
          />
          {logo.previewUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={logo.remove}
            >
              Remove logo
            </Button>
          )}
        </div>
      </SettingsRow>

      <SettingsRow title="Details">
        <div className="max-w-md space-y-5">
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
                label="New description"
                htmlFor="org-description"
                hint="Leave it empty to keep the current one."
                error={fieldState.error?.message}
              >
                <Textarea
                  {...field}
                  id="org-description"
                  rows={3}
                  aria-invalid={fieldState.invalid}
                />
              </Field>
            )}
          />
        </div>
      </SettingsRow>

      <UnsavedChangesBar
        isVisible={isDirty}
        title="Unsaved changes"
        description="They only apply once saved."
      >
        <Button variant="ghost" size="sm" onClick={discard}>
          Discard
        </Button>
        <Button
          size="sm"
          onClick={() => void save()}
          disabled={isSaving || !name.trim()}
        >
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </UnsavedChangesBar>
    </>
  )
}
