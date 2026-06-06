import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import type { CollectionEntry } from 'astro:content'

interface Props {
  entries: CollectionEntry<'gallery'>[]
  initialIndex: number
  onClose: () => void
}

const GalleryLightbox = ({ entries, initialIndex, onClose }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  useEffect(() => {
    itemRefs.current[initialIndex]?.scrollIntoView({ behavior: 'instant' })
  }, [initialIndex])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index)
            if (!isNaN(index)) {
              setCurrentIndex(index)
            }
          }
        }
      },
      { threshold: 0.5 }
    )

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div
      className="fixed inset-0 z-[200] bg-background"
      role="dialog"
      aria-modal="true"
    >
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background/80 backdrop-blur-sm px-4 py-3">
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} / {entries.length}
        </span>
        <button
          onClick={onClose}
          className="size-9 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Scrollable feed */}
      <div
        ref={containerRef}
        className="h-[calc(100vh-48px)] overflow-y-auto"
      >
        {entries.map((entry, i) => (
          <div
            key={entry.id}
            ref={(el) => (itemRefs.current[i] = el)}
            data-index={i}
            className="flex flex-col items-center px-4 pt-6 pb-4 border-b border-border/30 last:border-b-0"
          >
            <img
              src={entry.data.image.src}
              alt={entry.data.title}
              className="w-full max-w-2xl max-h-[75vh] object-contain rounded-md"
            />

            <div className="w-full max-w-lg mt-4">
              <h2 className="font-semibold text-sm">{entry.data.title}</h2>
              {entry.data.description && (
                <p className="text-muted-foreground text-sm mt-1">
                  {entry.data.description}
                </p>
              )}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                {entry.data.camera && <span>{entry.data.camera}</span>}
                {entry.data.lens && <span>{entry.data.lens}</span>}
                {entry.data.location && <span>{entry.data.location}</span>}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(entry.data.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GalleryLightbox
