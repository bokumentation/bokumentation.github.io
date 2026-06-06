import { useState, useEffect } from 'react'
import GalleryLightbox from '@/components/ui/gallery-lightbox'
import type { CollectionEntry } from 'astro:content'

interface Props {
  entries: CollectionEntry<'gallery'>[]
}

const GalleryGrid = ({ entries }: Props) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const button = target.closest('[data-gallery-index]') as HTMLElement | null
      if (button) {
        const index = parseInt(button.dataset.galleryIndex || '', 10)
        if (!isNaN(index)) {
          setLightboxIndex(index)
        }
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <>
      {lightboxIndex !== null && (
        <GalleryLightbox
          entries={entries}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}

export default GalleryGrid
