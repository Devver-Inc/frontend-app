import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { Field } from "@/components/common/field"
import { ImagePicker } from "@/components/common/image-picker"
import { SettingsRow } from "@/components/common/section"
import { UnsavedChangesBar } from "@/components/common/unsaved-changes-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDeleteProfilePicture } from "@/features/profile/hooks/use-delete-profile-picture"
import { useUpdateMe } from "@/features/profile/hooks/use-update-me"
import { useUploadProfilePicture } from "@/features/profile/hooks/use-upload-profile-picture"
import {
  PROFILE_PICTURE_MIME_TYPES,
  personalInformationSchema,
  profilePictureSchema,
} from "@/features/profile/schemas/profile.schema"
import { useImageDraft } from "@/hooks/use-image-draft"
import type { UserProfile } from "@/lib/auth/auth-client"
import { formatLongDate } from "@/lib/utils/format-date"
import { getInitials } from "@/lib/utils/get-initials"

const getDisplayName = (profile: UserProfile | undefined): string => {
  if (!profile) return "User"
  const fullName =
    `${profile.givenName ?? ""} ${profile.familyName ?? ""}`.trim()
  return fullName || profile.name || profile.username || "User"
}

export function PersonalInformationForm({
  profile,
}: {
  profile: UserProfile | undefined
}) {
  const updateMe = useUpdateMe()
  const uploadPicture = useUploadProfilePicture()
  const deletePicture = useDeleteProfilePicture()
  // Logto may not serve a new picture right away: once uploaded, the local
  // preview stays until the page is left.
  const picture = useImageDraft(profile?.picture ?? null)
  const savedValues = useMemo(
    () => ({
      firstName: profile?.givenName ?? "",
      lastName: profile?.familyName ?? "",
    }),
    [profile]
  )
  const form = useForm({
    resolver: zodResolver(personalInformationSchema),
    values: savedValues,
  })
  const [firstName, lastName] = useWatch({
    control: form.control,
    name: ["firstName", "lastName"],
  })

  const isSaving = form.formState.isSubmitting
  const isDirty =
    profile !== undefined &&
    (firstName.trim() !== savedValues.firstName ||
      lastName.trim() !== savedValues.lastName ||
      picture.isDirty)

  const onPictureSelect = (file: File) => {
    const result = profilePictureSchema.safeParse(file)
    if (!result.success) {
      toast.error(result.error.issues[0]?.message)
      return
    }
    picture.select(file)
  }

  const discard = () => {
    form.reset(savedValues)
    picture.reset()
  }

  const save = form.handleSubmit(async (input) => {
    try {
      await updateMe.mutateAsync(input)
      if (picture.file) {
        await uploadPicture.mutateAsync(picture.file)
      } else if (picture.isRemoved && picture.baselineUrl) {
        await deletePicture.mutateAsync()
      }
      picture.commit()
      toast.success("Changes saved.")
    } catch {
      // The failed mutation already reported its error.
    }
  })

  return (
    <>
      <SettingsRow title="Picture" description="8 MB at most.">
        <div className="flex items-center gap-4">
          <ImagePicker
            imageUrl={picture.previewUrl}
            fallback={getInitials(getDisplayName(profile))}
            accept={PROFILE_PICTURE_MIME_TYPES.join(",")}
            label="Change picture"
            onSelect={onPictureSelect}
          />
          {picture.previewUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={picture.remove}
            >
              Remove picture
            </Button>
          )}
        </div>
      </SettingsRow>

      <SettingsRow title="Name">
        <div className="grid max-w-md gap-4 sm:grid-cols-2">
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                label="First name"
                htmlFor="first-name"
                error={fieldState.error?.message}
              >
                <Input
                  {...field}
                  id="first-name"
                  autoComplete="given-name"
                  aria-invalid={fieldState.invalid}
                />
              </Field>
            )}
          />
          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                label="Last name"
                htmlFor="last-name"
                error={fieldState.error?.message}
              >
                <Input
                  {...field}
                  id="last-name"
                  autoComplete="family-name"
                  aria-invalid={fieldState.invalid}
                />
              </Field>
            )}
          />
        </div>
      </SettingsRow>

      {profile?.email && (
        <SettingsRow
          title="Email"
          description="You sign in with this address. It can't be changed here."
        >
          <p className="font-medium">
            {profile.email}
            {profile.emailVerified && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                Verified
              </span>
            )}
          </p>
          {profile.createdAt && (
            <p className="mt-1 text-sm text-muted-foreground">
              Member since {formatLongDate(profile.createdAt)}
            </p>
          )}
        </SettingsRow>
      )}

      <UnsavedChangesBar
        isVisible={isDirty}
        title="Unsaved changes"
        description="They only apply once saved."
      >
        <Button variant="ghost" size="sm" onClick={discard}>
          Discard
        </Button>
        <Button size="sm" onClick={() => void save()} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </UnsavedChangesBar>
    </>
  )
}
