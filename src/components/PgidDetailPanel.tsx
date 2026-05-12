import { useRef, useState, useEffect, useCallback } from 'react'
import { SlideoutMenu, Badge } from '@planetdds/ui'
import { CheckCircle, XCircle, MarkerPin01, PuzzlePiece01 } from '@untitledui/icons'
import { FEATURES } from '../lib/features'
import type { AccessRecord } from './AccessReview'
import type { MOCK_PGIDS } from '../lib/skus'

type PgidData = typeof MOCK_PGIDS[number]

type Props = {
  open: boolean
  record: AccessRecord | null
  pgidData: PgidData | null
  onClose: () => void
}

const FLAGS = [
  { key: 'integratedPayments' as const, label: 'Integrated payments' },
  { key: 'aiVoicePerio' as const, label: 'AI Voice Perio' },
  { key: 'aiVoiceRestorative' as const, label: 'AI Voice Restorative' },
  { key: 'twilioApproved' as const, label: 'Twilio registration approved' },
  { key: 'locationLive' as const, label: 'Location live' },
]

function Flag({ enabled, label }: { enabled: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 py-2 border-b border-[#f2f4f7]">
      {enabled
        ? <CheckCircle size={16} className="text-[#17b26a] shrink-0" />
        : <XCircle size={16} className="text-[#d0d5dd] shrink-0" />}
      <span className={`text-sm ${enabled ? 'text-primary' : 'text-tertiary'}`}>{label}</span>
    </div>
  )
}

function ScrollArea({ children, open }: { children: React.ReactNode; open: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [thumb, setThumb] = useState({ height: 0, top: 0, visible: false })
  const [dragging, setDragging] = useState(false)
  const [hovering, setHovering] = useState(false)
  const dragState = useRef({ startY: 0, startScrollTop: 0 })
  const TOP_INSET = 0

  const updateThumb = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { clientHeight, scrollHeight, scrollTop } = el
    if (scrollHeight <= clientHeight) { setThumb(t => ({ ...t, visible: false })); return }
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
    return () => { el.removeEventListener('scroll', updateThumb); ro.disconnect() }
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
      el.scrollTop = dragState.current.startScrollTop + dy * ((scrollHeight - clientHeight) / (trackHeight - thumbH))
    }
    const onUp = () => setDragging(false)
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
  }, [dragging])

  return (
    <div className="relative flex-1 min-h-0" style={{ alignSelf: 'stretch' }}>
      <div ref={scrollRef} className="catalog-scroll absolute inset-0 overflow-y-scroll"
        onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
        {children}
      </div>
      {thumb.visible && (
        <div className="absolute right-0 top-0 bottom-0 w-[18px] pointer-events-none"
          style={{ opacity: hovering || dragging ? 1 : 0, transition: 'opacity 150ms ease' }}>
          <div className="absolute rounded-full cursor-pointer pointer-events-auto"
            style={{ top: thumb.top, height: thumb.height, left: 6, right: 6,
              background: dragging ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.2)',
              transition: dragging ? 'none' : 'background 150ms ease' }}
            onMouseDown={onThumbMouseDown} />
        </div>
      )}
    </div>
  )
}

export default function PgidDetailPanel({ open, record, pgidData, onClose }: Props) {
  const enabledFeatures = record
    ? FEATURES.filter(f => record.features.includes(f.key))
    : []

  return (
    <SlideoutMenu isOpen={open} onOpenChange={v => { if (!v) onClose() }} isDismissable className="z-50" dialogClassName="!overflow-hidden">
      {({ close }) => {
        if (!record) return null
        return (
          <>
            <SlideoutMenu.Header onClose={() => { onClose(); close() }}>
              <div className="pr-8 flex flex-col gap-1">
                <div className="text-sm font-semibold text-primary">{record.name}</div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-tertiary">PGID {record.pgid}</span>
                  {record.skus.length > 0
                    ? record.skus.map(s => <Badge key={s} type="pill-color" color="brand" size="sm">{s}</Badge>)
                    : <span className="text-xs text-tertiary italic">No SKU linked</span>}
                </div>
              </div>
            </SlideoutMenu.Header>

            <ScrollArea open={open}>
              {/* Stats row */}
              <div className="grid grid-cols-3 divide-x divide-[#f2f4f7] border-b border-[#f2f4f7]">
                {[
                  { label: 'Live OIDs', value: record.liveOids },
                  { label: 'w/ Pay', value: record.liveOidsWithPay },
                  { label: 'Features', value: record.features.length },
                ].map(s => (
                  <div key={s.label} className="px-4 py-3 text-center">
                    <div className="text-xl font-bold text-primary">{s.value}</div>
                    <div className="text-xs text-tertiary mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Flags */}
              <div className="px-4 md:px-6 pt-4 pb-2">
                <div className="text-xs font-bold text-tertiary uppercase tracking-wide mb-1">Status flags</div>
                {FLAGS.map(f => (
                  <Flag key={f.key} enabled={record[f.key]} label={f.label} />
                ))}
              </div>

              {/* Offices */}
              <div className="px-4 md:px-6 pt-4 pb-2">
                <div className="text-xs font-bold text-tertiary uppercase tracking-wide mb-2">
                  Offices <span className="ml-1 font-normal normal-case">({pgidData?.offices.length ?? 0})</span>
                </div>
                {pgidData && pgidData.offices.length > 0 ? (
                  pgidData.offices.map(o => (
                    <div key={o} className="flex items-center gap-2 py-2 border-b border-[#f2f4f7]">
                      <MarkerPin01 size={14} className="text-tertiary shrink-0" />
                      <span className="text-sm text-secondary">{o}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-tertiary py-2">No offices on record</div>
                )}
              </div>

              {/* Features */}
              <div className="px-4 md:px-6 pt-4 pb-6">
                <div className="text-xs font-bold text-tertiary uppercase tracking-wide mb-2">
                  Site features <span className="ml-1 font-normal normal-case">({enabledFeatures.length})</span>
                </div>
                {enabledFeatures.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-8 text-center">
                    <PuzzlePiece01 size={24} className="text-quaternary" />
                    <div className="text-sm text-tertiary">No site features enabled</div>
                  </div>
                ) : (
                  enabledFeatures.map(f => (
                    <div key={f.key} className="py-2.5 border-b border-[#f2f4f7]">
                      <div className="text-sm font-medium text-primary">{f.key}</div>
                      {f.desc && <div className="text-xs text-tertiary mt-0.5">{f.desc}</div>}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </>
        )
      }}
    </SlideoutMenu>
  )
}
