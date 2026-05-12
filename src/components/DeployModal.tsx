import { useState, useRef } from 'react'
import { Button, Badge, ModalOverlay, Modal, Dialog, CloseButton, ComboBox, SelectItem } from '@planetdds/ui'
import { MOCK_PGIDS, SF_SKUS } from '../lib/skus'
import type { Bundle } from '../lib/api'

type Props = {
  open: boolean
  bundle: Bundle | null
  onClose: () => void
  onDeployed: () => void
}

type Pgid = typeof MOCK_PGIDS[number]

export default function DeployModal({ open, bundle, onClose, onDeployed }: Props) {
  const [step, setStep] = useState(1)
  const [pgid, setPgid] = useState<Pgid | null>(null)
  const focusSinkRef = useRef<HTMLDivElement>(null)

  function reset() {
    setStep(1); setPgid(null)
  }

  function handleClose() { reset(); onClose() }

  function copyManifest() {
    if (!pgid || !bundle) return
    const text = [
      'SKU Feature Bundle Manifest',
      '===========================',
      `Bundle:   ${bundle.name}`,
      `SKU:      ${bundle.sku ?? 'Not linked'}`,
      `PGID:     ${pgid.id} – ${pgid.name}`,
      `Features: ${bundle.features.length} (${bundle.features.join(', ') || 'none'})`,
    ].join('\n')
    navigator.clipboard.writeText(text)
  }

  if (!bundle) return null

  const skuData = bundle.sku ? SF_SKUS[bundle.sku] : null
  return (
    <ModalOverlay isOpen={open} onOpenChange={handleClose} isDismissable>
      <Modal>
        <Dialog aria-label={`Enable for PGID: ${bundle.name}`}>
          <div className="bg-white rounded-xl shadow-2xl w-[560px] max-w-[95vw] flex flex-col">
            {/* Header */}
            <div className="px-5 pt-5 pb-4 border-b border-[#e4e7ec] flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold text-primary">Enable for PGID: {bundle.name}</h2>
                <p className="text-sm text-tertiary mt-0.5">Select the practice group to enable this bundle for</p>
              </div>
              <CloseButton onPress={handleClose} label="Close" size="sm" />
            </div>

            {/* Focus sink — always mounted, absorbs focus to prevent ComboBox opening uninvited */}
            <div ref={focusSinkRef} tabIndex={-1} style={{ outline: 'none', height: 0, overflow: 'hidden' }} />

            {/* Body */}
            <div className="px-5 py-5" style={{ minHeight: 200 }}>
              {step === 1 && (
                <div className="flex flex-col gap-1.5">
                  <div className="text-xs font-bold text-tertiary uppercase tracking-wide">Pick a practice group</div>
                  <ComboBox
                    size="sm"
                    placeholder="Search by name or PGID…"
                    shortcut={false}
                    selectedKey={pgid?.id ?? null}
                    menuTrigger="focus"
                    onOpenChange={isOpen => { if (!isOpen) focusSinkRef.current?.focus() }}
                    onSelectionChange={key => {
                      const found = MOCK_PGIDS.find(p => p.id === String(key))
                      if (found) setPgid(found)
                    }}
                  >
                    {MOCK_PGIDS.map(p => (
                      <SelectItem key={p.id} id={p.id} textValue={`(${p.id}) ${p.name}`}>
                        <span className="truncate">
                          <span className="font-semibold text-primary">({p.id})</span>
                          <span className="font-normal text-tertiary ml-1.5">{p.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </ComboBox>
                </div>
              )}

              {step === 2 && pgid && (
                <div className="flex flex-col gap-4">
                  <div className="bg-[#f8f9fb] border border-[#e4e7ec] rounded-xl p-4 flex flex-col gap-3">
                    {[
                      { label: 'Bundle', value: <span className="font-semibold text-primary">{bundle.name}</span> },
                      { label: 'SKU', value: bundle.sku
                        ? <span className="text-secondary">{bundle.sku} <span className="text-xs text-tertiary">· {skuData?.catLabel}</span></span>
                        : <em className="text-tertiary">Not linked</em> },
                      { label: 'PGID', value: <span className="text-secondary">{pgid.id} – {pgid.name}</span> },
                      { label: 'Features', value: bundle.features.length
                        ? <Badge type="pill-color" color="brand" size="sm">{bundle.features.length} site feature{bundle.features.length !== 1 ? 's' : ''} will be enabled</Badge>
                        : <Badge type="pill-color" color="warning" size="sm">No features mapped yet</Badge> },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-start gap-3 text-sm">
                        <span className="w-20 text-xs font-bold text-tertiary uppercase tracking-wide pt-0.5 flex-shrink-0">{label}</span>
                        <span className="flex-1">{value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-tertiary">
                    In production, this would trigger automated provisioning via the Denticon admin API.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-[#e4e7ec] flex items-center justify-end gap-2">
              {step === 1 && (
                <>
                  <Button color="secondary" size="sm" onPress={handleClose}>Cancel</Button>
                  <Button color="primary" size="sm" isDisabled={!pgid} onPress={() => setStep(2)}>Review</Button>
                </>
              )}
              {step === 2 && (
                <>
                  <Button color="secondary" size="sm" onPress={() => { focusSinkRef.current?.focus(); setStep(1) }}>Back</Button>
                  <div className="flex-1" />
                  <Button color="secondary" size="sm" onPress={copyManifest}>Copy summary</Button>
                  <Button color="primary" size="sm" onPress={() => { handleClose(); onDeployed() }}>Confirm</Button>
                </>
              )}
            </div>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  )
}
