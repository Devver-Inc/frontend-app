import { zodResolver } from "@hookform/resolvers/zod"
import { Shield } from "lucide-react"
import { useMemo } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { ImagePicker } from "@/components/common/image-picker"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
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

export function PersonalInformationCard({
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

  const displayName = getDisplayName(profile)
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

  const save = form.handleSubmit(async (input) => {
    try {
      await updateMe.mutateAsync(input)
      if (picture.file) {
        await uploadPicture.mutateAsync(picture.file)
      } else if (picture.isRemoved && picture.baselineUrl) {
        await deletePicture.mutateAsync()
      }
      picture.commit()
      toast.success("Profile updated successfully.")
    } catch {
      // The failed mutation already reported its error.
    }
  })

  return (
    <Card className="glass-surface border-border/50">
      <CardHeader>
        <CardTitle className="text-base">Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-6">
          <ImagePicker
            imageUrl={picture.previewUrl}
            fallback={getInitials(displayName)}
            accept={PROFILE_PICTURE_MIME_TYPES.join(",")}
            label="Change avatar"
            onSelect={onPictureSelect}
          />
          <div className="flex-1 space-y-1">
            <p className="font-medium">{displayName}</p>
            {profile?.email && (
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">{profile.email}</p>
                {profile.emailVerified && (
                  <Badge
                    variant="secondary"
                    className="gap-1 text-xs font-normal"
                  >
                    <Shield className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
            )}
            {profile?.createdAt ? (
              <p className="text-xs text-muted-foreground">
                Member since {formatLongDate(profile.createdAt)}
              </p>
            ) : null}
            <div className="pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={!picture.previewUrl}
                onClick={picture.remove}
              >
                Remove avatar
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="first-name">
                  First Name{" "}
                  <span className="text-destructive-foreground">*</span>
                </Label>
                <Input
                  {...field}
                  id="first-name"
                  placeholder="John"
                  className={fieldState.invalid ? "border-destructive" : ""}
                />
                {fieldState.error && (
                  <p className="text-xs text-destructive-foreground">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="last-name">
                  Last Name{" "}
                  <span className="text-destructive-foreground">*</span>
                </Label>
                <Input
                  {...field}
                  id="last-name"
                  placeholder="Doe"
                  className={fieldState.invalid ? "border-destructive" : ""}
                />
                {fieldState.error && (
                  <p className="text-xs text-destructive-foreground">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            value={profile?.email ?? ""}
            disabled
            className="text-muted-foreground"
          />
          <p className="text-xs text-muted-foreground">
            Email is managed through your authentication provider.
          </p>
        </div>

        {isDirty && (
          <div className="flex justify-end">
            <Button
              onClick={() => void save()}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
