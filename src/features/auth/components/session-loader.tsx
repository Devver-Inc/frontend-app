import { FullScreenLoader } from "@/components/common/full-screen-loader"

export function SessionLoader() {
  return (
    <FullScreenLoader
      className="bg-background"
      iconClassName="text-muted-foreground"
    />
  )
}
