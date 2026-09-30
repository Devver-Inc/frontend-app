import { useEffect, useRef, useState } from "react"

type ImageDraft = {
  file: File | null
  url: string | null
}

// An image picked (or removed) but not saved yet, previewed through an object
// URL. `commit` keeps the preview once saved, for APIs whose stored URL cannot
// be displayed right away.
export function useImageDraft(savedUrl: string | null) {
  const [draft, setDraft] = useState<ImageDraft | null>(null)
  const [committed, setCommitted] = useState<ImageDraft | null>(null)
  const objectUrls = useRef(new Set<string>())

  useEffect(() => {
    const urls = objectUrls.current
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
      urls.clear()
    }
  }, [])

  const release = (url: string | null | undefined) => {
    if (!url) return
    URL.revokeObjectURL(url)
    objectUrls.current.delete(url)
  }

  const select = (file: File) => {
    release(draft?.url)
    const url = URL.createObjectURL(file)
    objectUrls.current.add(url)
    setDraft({ file, url })
  }

  const remove = () => {
    release(draft?.url)
    setDraft({ file: null, url: null })
  }

  const reset = () => {
    release(draft?.url)
    setDraft(null)
  }

  const commit = () => {
    if (!draft) return
    release(committed?.url)
    setCommitted(draft)
    setDraft(null)
  }

  const baselineUrl = committed ? committed.url : savedUrl

  return {
    file: draft?.file ?? null,
    isRemoved: draft !== null && draft.file === null,
    isDirty: draft !== null,
    previewUrl: draft ? draft.url : baselineUrl,
    baselineUrl,
    select,
    remove,
    reset,
    commit,
  }
}
