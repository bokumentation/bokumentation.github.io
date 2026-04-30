import { useState, useEffect } from 'react'
import { NAV_LINKS } from '@/consts'
import { Menu, X } from 'lucide-react'

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    const handleViewTransitionStart = () => {
      setIsOpen(false)
    }

    document.addEventListener('astro:before-swap', handleViewTransitionStart)

    return () => {
      document.removeEventListener(
        'astro:before-swap',
        handleViewTransitionStart,
      )
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="size-9 rounded-full flex items-center justify-center hover:bg-secondary transition-colors sm:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-background animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-6 py-4 shadow-border">
              <span className="text-lg font-semibold tracking-tight">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="size-9 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>

            <nav className="flex flex-col px-6 py-6 gap-0">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-lg font-medium py-4 border-b border-border text-foreground/80 hover:text-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="mt-auto px-6 py-6">
              <p className="text-muted-foreground text-sm">
                Bokumentation - Academic Blog
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MobileMenu