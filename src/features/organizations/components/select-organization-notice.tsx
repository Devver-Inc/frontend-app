export function SelectOrganizationNotice({ message }: { message: string }) {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
