import { useState, useEffect } from 'react'
import { CardHeaderSimple, Button, Select, SelectItem, TextArea, Table } from '@planetdds/ui'
import { Edit01, PuzzlePiece01, Plus } from '@untitledui/icons'
import { SF_SKU_GROUPS, SF_SKUS } from '../lib/skus'
import { FEATURES } from '../lib/features'
import type { Bundle } from '../lib/api'

type Props = {
  bundle: Bundle
  onOpenCatalog: () => void
  onDeploy: () => void
  onDelete: () => void
  onUpdate: (patch: Partial<Pick<Bundle, 'name' | 'sku' | 'notes' | 'features'>>) => void
  onEditingChange: (editing: boolean) => void
  onSaved: () => void
}

const SKU_ITEMS = [
  { id: '', label: '— Not linked yet —' },
  ...SF_SKU_GROUPS.flatMap(g => g.items.map(s => ({ id: s, label: s }))),
]

export default function BundleDetail({
  bundle, onOpenCatalog, onDeploy, onDelete, onUpdate, onEditingChange, onSaved,
}: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftSku, setDraftSku] = useState<string | null>(bundle.sku)
  const [draftNotes, setDraftNotes] = useState(bundle.notes ?? '')

  useEffect(() => {
    setIsEditing(false)
    onEditingChange(false)
    setDraftSku(bundle.sku)
    setDraftNotes(bundle.notes ?? '')
  }, [bundle.id])

  function handleSave() {
    onUpdate({ sku: draftSku, notes: draftNotes })
    setIsEditing(false)
    onEditingChange(false)
    onSaved()
  }

  function handleCancel() {
    setDraftSku(bundle.sku)
    setDraftNotes(bundle.notes ?? '')
    setIsEditing(false)
    onEditingChange(false)
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto px-12 py-6" style={{ backgroundColor: '#f8f9fb' }}>
        <div className="bg-white border border-[#e4e7ec] rounded-xl overflow-hidden max-w-4xl">

          {/* Bundle header */}
          <CardHeaderSimple
            title={bundle.sku ?? 'Salesforce SKU'}
            supportingText={bundle.sku && SF_SKUS[bundle.sku]
              ? [SF_SKUS[bundle.sku].catLabel, SF_SKUS[bundle.sku].price, SF_SKUS[bundle.sku].floor].filter(Boolean).join(' · ')
              : undefined}
            actions={
              <div className="flex items-center gap-3">
                <Button color="tertiary" size="md" isDisabled={isEditing} onPress={onDelete}>Delete bundle</Button>
                <Button color="primary" size="md" isDisabled={isEditing} onPress={onDeploy}>Enable for PGID</Button>
              </div>
            }
            divider
          />

          {/* Bundle Details header */}
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-base font-semibold text-primary">Bundle details</span>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Button color="secondary" size="sm" onPress={handleCancel}>Cancel</Button>
                <Button color="primary" size="sm" onPress={handleSave}>Save</Button>
              </div>
            ) : (
              <Button color="secondary" size="sm" iconLeading={Edit01} onPress={() => { setIsEditing(true); onEditingChange(true) }}>Edit bundle</Button>
            )}
          </div>

          {/* SKU + Notes */}
          <div className="flex gap-0">
            <div className="p-5 w-80 shrink-0">
              <Select
                label="Salesforce SKU"
                size="md"
                selectedKey={draftSku ?? ''}
                onSelectionChange={key => setDraftSku((key as string) || null)}
                items={SKU_ITEMS}
                isDisabled={!isEditing}
              >
                {item => <SelectItem {...item} />}
              </Select>
            </div>
            <div className="p-5 flex-1">
              <TextArea
                key={bundle.id}
                label="Notes & implementation context"
                value={draftNotes}
                onChange={setDraftNotes}
                rows={4}
                placeholder="e.g. Must enable Twilio registration before 2-Way SMS goes live. Requires ops to verify 10DLC campaign registration is complete…"
                isDisabled={!isEditing}
              />
            </div>
          </div>

          {/* Site Features */}
          <div className="border-t border-[#e4e7ec]">
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-primary">Site features</span>
                <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{bundle.features.length}</span>
              </div>
              <Button color="secondary" size="sm" iconLeading={bundle.features.length > 0 ? Edit01 : Plus} isDisabled={isEditing} onPress={onOpenCatalog}>{bundle.features.length > 0 ? 'Edit site features' : 'Add site features'}</Button>
            </div>

            {bundle.features.length === 0 ? (
              <div className="px-5 py-8 flex flex-col items-center gap-2 border-t border-[#e4e7ec]">
                <PuzzlePiece01 size={28} className="text-quaternary" />
                <div className="text-sm font-semibold text-secondary">No features added yet</div>
                <div className="text-xs text-tertiary">Use "Edit site features" above to start building.</div>
              </div>
            ) : (
              <Table aria-label="Site features" size="sm">
                <Table.Header>
                  <Table.Head label="Feature" />
                  <Table.Head label="Description" />
                </Table.Header>
                <Table.Body>
                  {bundle.features.map(key => {
                    const f = FEATURES.find(x => x.key === key) ?? { key, desc: '' }
                    return (
                      <Table.Row key={key} id={key}>
                        <Table.Cell className="font-medium text-primary">{f.key}</Table.Cell>
                        <Table.Cell className="text-tertiary">{f.desc}</Table.Cell>
                      </Table.Row>
                    )
                  })}
                </Table.Body>
              </Table>
            )}
          </div>

        </div>
      </div>

    </div>
  )
}
