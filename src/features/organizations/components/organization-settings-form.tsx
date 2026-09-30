import { zodResolver } from "@hookform/resolvers/zod"
import { Save, X } from "lucide-react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { ImagePicker } from "@/components/common/image-picker"
import { UnsavedChangesBar } from "@/components/common/unsaved-changes-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { getFirstErrorMessage } from "@/lib/utils/form-errors"
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

  const save = form.handleSubmit(
    async (input) => {
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
        toast.success("Organization updated successfully.")
      } catch {
        // The failed mutation already reported its error.
      }
    },
    (errors) => toast.error(getFirstErrorMessage(errors))
  )

  return (
    <>
      <Card className="glass-surface border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Organization Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-6">
            <ImagePicker
              imageUrl={logo.previewUrl}
              fallback={
                organization.name ? getInitials(organization.name) : "ORG"
              }
              accept={ORGANIZATION_LOGO_MIME_TYPES.join(",")}
              label="Change organization logo"
              onSelect={onLogoSelect}
            />
            <div className="space-y-2">
              <p className="text-sm font-medium">Organization Avatar</p>
              <p className="text-xs text-muted-foreground">
                Upload a logo or avatar for your organization. Recommended size:
                200x200px (max 5 MB).
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={!logo.previewUrl}
                onClick={logo.remove}
              >
                Remove avatar
              </Button>
            </div>
          </div>

          <Controller
            name="name"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="org-name">
                  Organization Name{" "}
                  <span className="text-destructive-foreground">*</span>
                </Label>
                <Input
                  {...field}
                  id="org-name"
                  placeholder="Organization name"
                />
              </div>
            )}
          />

          <Controller
            name="description"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="org-desc">Description</Label>
                <Textarea
                  {...field}
                  id="org-desc"
                  placeholder="A modern deployment platform for developers"
                  rows={3}
                />
              </div>
            )}
          />
        </CardContent>
      </Card>

      {isDirty && (
        <UnsavedChangesBar
          title="You have unsaved changes"
          description="Save your changes to update the organization settings."
        >
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={discard}>
              <X className="mr-1.5 h-3.5 w-3.5" />
              Discard
            </Button>
            <Button
              size="sm"
              onClick={() => void save()}
              disabled={isSaving || !name.trim()}
            >
              <Save className="mr-1.5 h-3.5 w-3.5" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </UnsavedChangesBar>
      )}
    </>
  )
}
