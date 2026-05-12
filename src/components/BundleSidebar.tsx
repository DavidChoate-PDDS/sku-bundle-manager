import { useState, useRef, useEffect, useCallback } from 'react'
import { Input } from '@planetdds/ui'
import { SearchMd } from '@untitledui/icons'
import { Badge } from '@planetdds/ui'
import { SF_SKUS } from '../lib/skus'
import type { Bundle } from '../lib/api'

type Props = {
  bundles: Bundle[]
  activeId: number | null
  onSelect: (id: number) => void
  onNew: () => void
}

export default function BundleSidebar({ bundles, activeId, onSelect, onNew }: Props) {
  const [query, setQuery] = useState('')

  const filtered = bundles.filter(b =>
    b.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-[#e4e7ec] flex flex-col overflow-hidden">
      <div className="pt-6 px-4 pb-3 border-b border-[#e4e7ec]">
        <Input
          size="sm"
          icon={SearchMd}
          placeholder="Search bundles…"
          value={query}
          onChange={setQuery}
        />
      </div>

      <SidebarScrollArea>
        <div className="px-4 py-3 flex flex-col gap-2">
          {bundles.length === 0 && (
            <p className="py-6 text-center text-xs text-[#667085]">
              No bundles yet. Click <strong>+ New bundle</strong> to start.
            </p>
          )}
          {bundles.length > 0 && filtered.length === 0 && (
            <p className="py-6 text-center text-xs text-[#667085]">No bundles match "{query}"</p>
          )}
          {filtered.map(b => {
            const isActive = b.id === activeId
            return (
              <button
                key={b.id}
                onClick={() => onSelect(b.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all duration-100 ${
                  isActive
                    ? 'bg-blue-50 border-blue-400 shadow-sm'
                    : 'bg-white border-[#e4e7ec] hover:border-[#c8d0da] hover:shadow-sm'
                }`}
              >
                <div className="text-[13px] font-semibold text-[#1F3864] truncate">{b.name}</div>
                <div className="text-[11px] text-[#667085] mt-0.5 truncate">
                  {b.sku && SF_SKUS[b.sku] ? SF_SKUS[b.sku].catLabel : b.sku ?? 'No SKU linked'}
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <Badge
                    type="pill-color"
                    color={isActive ? 'brand' : 'gray'}
                    size="sm"
                  >
                    {b.features.length} feature{b.features.length !== 1 ? 's' : ''}
                  </Badge>
                  {!b.sku && (
                    <Badge type="pill-color" color="warning" size="sm">Unlinked</Badge>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </SidebarScrollArea>
    </aside>
  )
}

function SidebarScrollArea({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [thumb, setThumb] = useState({ height: 0, top: 0, visible: false })
  const [dragging, setDragging] = useState(false)
  const [hovering, setHovering] = useState(false)
  const dragState = useRef({ startY: 0, startScrollTop: 0 })

  const updateThumb = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { clientHeight, scrollHeight, scrollTop } = el
    if (scrollHeight <= clientHeight + 60) {
      setThumb(t => ({ ...t, visible: false }))
      return
    }
    const h = Math.max((clientHeight / scrollHeight) * clientHeight, 32)
    const top = (scrollTop / (scrollHeight - clientHeight)) * (clientHeight - h)
    setThumb({ height: h, top, visible: true })
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateThumb()
    el.addEventListener('scroll', updateThumb, { passive: true })
    const ro = new ResizeObserver(updateThumb)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', updateThumb)
      ro.disconnect()
    }
  }, [updateThumb])

  const onThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setDragging(true)
    dragState.current = { startY: e.clientY, startScrollTop: scrollRef.current?.scrollTop ?? 0 }
  }

  useEffect(() => {
    if (!dragging) return
    const onMove = (e: MouseEvent) => {
      const el = scrollRef.current
      if (!el) return
      const { clientHeight, scrollHeight } = el
      const thumbH = Math.max((clientHeight / scrollHeight) * clientHeight, 32)
      const dy = e.clientY - dragState.current.startY
      const ratio = (scrollHeight - clientHeight) / (clientHeight - thumbH)
      el.scrollTop = dragState.current.startScrollTop + dy * ratio
    }
    const onUp = () => setDragging(false)
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
  }, [dragging])

  return (
    <div className="relative flex-1 min-h-0">
      <div
        ref={scrollRef}
        className="catalog-scroll absolute inset-0 overflow-y-scroll pb-1"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {children}
      </div>

      {thumb.visible && (
        <div
          className="absolute right-0 top-0 bottom-0 w-[18px] pointer-events-none"
          style={{ opacity: hovering || dragging ? 1 : 0, transition: 'opacity 150ms ease' }}
        >
          <div
            className="absolute rounded-full cursor-pointer pointer-events-auto"
            style={{
              top: thumb.top,
              height: thumb.height,
              left: 6,
              right: 6,
              background: dragging ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.2)',
              transition: dragging ? 'none' : 'background 150ms ease',
            }}
            onMouseDown={onThumbMouseDown}
          />
        </div>
      )}
    </div>
  )
}
