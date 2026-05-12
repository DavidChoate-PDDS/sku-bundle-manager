import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { Input, Checkbox, SlideoutMenu, Button } from '@planetdds/ui'
import { SearchMd } from '@untitledui/icons'
import { FEATURES, FEATURE_GROUPS } from '../lib/features'

type Props = {
  open: boolean
  activeFeatures: string[]
  onSave: (features: string[]) => void
  onClose: () => void
}

export default function CatalogPanel({ open, activeFeatures, onSave, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState<string[]>(activeFeatures)
  const [showSelectedOnly, setShowSelectedOnly] = useState(false)

  useEffect(() => {
    if (open) {
      setDraft(activeFeatures)
      setQuery('')
      setShowSelectedOnly(false)
    }
  }, [open])

  const added = new Set(draft)

  function handleToggle(key: string) {
    setDraft(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  function handleSave(close: () => void) {
    onSave(draft)
    close()
  }

  function handleCancel(close: () => void) {
    setDraft(activeFeatures)
    onClose()
    close()
  }

  const filtered = useMemo(() => {
    let items = FEATURES
    if (showSelectedOnly) items = items.filter(f => added.has(f.key))
    if (query) items = items.filter(f =>
      f.key.toLowerCase().includes(query.toLowerCase()) ||
      f.desc.toLowerCase().includes(query.toLowerCase())
    )
    if (query) items = [...items].sort((a, b) => (added.has(b.key) ? 1 : 0) - (added.has(a.key) ? 1 : 0))
    return items
  }, [query, draft, showSelectedOnly])

  const groupedAll = useMemo(() => {
    if (query || showSelectedOnly) return null
    return FEATURE_GROUPS.map(g => ({
      group: g,
      items: FEATURES.filter(f => f.group === g),
    }))
  }, [query, showSelectedOnly])

  const changeCount = draft.filter(k => !activeFeatures.includes(k)).length +
    activeFeatures.filter(k => !draft.includes(k)).length

  return (
    <SlideoutMenu isOpen={open} onOpenChange={v => { if (!v) onClose() }} isDismissable={false} className="z-50" dialogClassName="!overflow-hidden">
      {({ close }) => (
        <>
          <SlideoutMenu.Header onClose={() => handleCancel(close)}>
            <div className="pr-8 flex flex-col gap-3">
              <div>
                <div className="text-sm font-semibold text-primary">Site features catalog</div>
                <div className="text-xs text-tertiary mt-0.5">Select features to include in this bundle</div>
              </div>
              <Input
                size="sm"
                icon={SearchMd}
                placeholder="Search features…"
                value={query}
                onChange={setQuery}
              />
              <div className="flex items-center justify-between">
                <Checkbox
                  isSelected={showSelectedOnly}
                  onChange={setShowSelectedOnly}
                  size="sm"
                  label={<span className="text-xs text-secondary">Show selected only</span>}
                />
                <span className="text-xs text-tertiary">{filtered.length} feature{filtered.length !== 1 ? 's' : ''} shown</span>
              </div>
            </div>
          </SlideoutMenu.Header>

          <CatalogScrollArea open={open}>
            {filtered.length === 0 && (
              <p className="text-center text-xs text-tertiary py-8">
                {`No features match "${query}"`}
              </p>
            )}
            {groupedAll
              ? groupedAll.map(({ group, items }) => items.length === 0 ? null : (
                <div key={group}>
                  <div className="sticky top-0 z-10 pl-4 md:pl-6 pr-4 py-1.5 text-xs font-bold text-tertiary uppercase tracking-wide bg-[#f8f9fb] border-y border-[#f1f5f9]">
                    {group}
                  </div>
                  {items.map(f => <CatalogItem key={f.key} featureKey={f.key} desc={f.desc} added={added.has(f.key)} onToggle={handleToggle} />)}
                </div>
              ))
              : filtered.map(f => <CatalogItem key={f.key} featureKey={f.key} desc={f.desc} added={added.has(f.key)} onToggle={handleToggle} />)
            }
          </CatalogScrollArea>

          <SlideoutMenu.Footer>
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-tertiary">
                <strong className="text-brand-600">{draft.length}</strong> feature{draft.length !== 1 ? 's' : ''} selected
                {changeCount > 0 && <span className="ml-1">· {changeCount} unsaved change{changeCount !== 1 ? 's' : ''}</span>}
              </span>
              <div className="flex items-center gap-2">
                <Button color="secondary" size="sm" onPress={() => handleCancel(close)}>Cancel</Button>
                <Button color="primary" size="sm" onPress={() => handleSave(close)}>Save changes</Button>
              </div>
            </div>
          </SlideoutMenu.Footer>
        </>
      )}
    </SlideoutMenu>
  )
}

function CatalogScrollArea({ children, open }: { children: React.ReactNode; open: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [thumb, setThumb] = useState({ height: 0, top: 0, visible: false })
  const [dragging, setDragging] = useState(false)
  const [hovering, setHovering] = useState(false)
  const dragState = useRef({ startY: 0, startScrollTop: 0 })

  const TOP_INSET = 40

  const updateThumb = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { clientHeight, scrollHeight, scrollTop } = el
    if (scrollHeight <= clientHeight) {
      setThumb(t => ({ ...t, visible: false }))
      return
    }
    const trackHeight = clientHeight - TOP_INSET
    const h = Math.max((clientHeight / scrollHeight) * trackHeight, 32)
    const top = TOP_INSET + (scrollTop / (scrollHeight - clientHeight)) * (trackHeight - h)
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
  }, [updateThumb, open])

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
      const trackHeight = clientHeight - TOP_INSET
      const thumbH = Math.max((clientHeight / scrollHeight) * trackHeight, 32)
      const dy = e.clientY - dragState.current.startY
      const ratio = (scrollHeight - clientHeight) / (trackHeight - thumbH)
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
    <div className="relative flex-1 min-h-0" style={{ alignSelf: 'stretch' }}>
      <div
        ref={scrollRef}
        className="catalog-scroll absolute inset-0 overflow-y-scroll"
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

function CatalogItem({ featureKey, desc, added, onToggle }: {
  featureKey: string
  desc: string
  added: boolean
  onToggle: (key: string) => void
}) {
  return (
    <div
      onClick={() => onToggle(featureKey)}
      className="w-full text-left pl-4 md:pl-6 pr-3.5 py-2.5 flex items-center gap-2.5 border-b border-[#f2f4f7] transition-colors cursor-pointer hover:bg-[#f9fafb]"
    >
      <Checkbox
        isSelected={added}
        onChange={() => onToggle(featureKey)}
        size="sm"
        aria-label={featureKey}
      />
      <div className="flex-1 min-w-0 pointer-events-none">
        <div className="text-sm font-medium truncate text-primary">{featureKey}</div>
        {desc && <div className="text-sm text-tertiary mt-0.5 truncate">{desc}</div>}
      </div>
    </div>
  )
}
