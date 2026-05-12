import { useState } from 'react'
import { Button, Input, Select, SelectItem, ModalOverlay, Modal, Dialog, CloseButton } from '@planetdds/ui'
import { SF_SKU_GROUPS } from '../lib/skus'

type Props = {
  open: boolean
  onClose: () => void
  onCreate: (name: string, sku: string | null) => void
}

const SKU_ITEMS = [
  { id: '', label: '— Not linked yet —' },
  ...SF_SKU_GROUPS.flatMap(g => g.items.map(s => ({ id: s, label: s }))),
]

export default function NewBundleModal({ open, onClose, onCreate }: Props) {
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')

  function handleCreate() {
    if (!name.trim()) return
    onCreate(name.trim(), sku || null)
    setName('')
    setSku('')
  }

  return (
    <ModalOverlay isOpen={open} onOpenChange={onClose} isDismissable>
      <Modal>
        <Dialog aria-label="Create new bundle">
          <div className="bg-white rounded-xl shadow-2xl w-[420px] max-w-[95vw] flex flex-col">
            <div className="px-5 pt-5 pb-4 border-b border-[#e4e7ec] flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold text-primary">Create new bundle</h2>
                <p className="text-sm text-tertiary mt-0.5">Name it, optionally link a Salesforce SKU</p>
              </div>
              <CloseButton onPress={onClose} label="Close" size="sm" />
            </div>

            <div className="px-5 py-5 flex flex-col gap-4">
              <Input
                label="Bundle name"
                size="md"
                placeholder="e.g. Patient+ Feature Set"
                value={name}
                onChange={setName}
              />
              <Select
                label="Salesforce SKU"
                size="md"
                selectedKey={sku}
                onSelectionChange={key => setSku(key as string)}
                items={SKU_ITEMS}
              >
                {item => <SelectItem {...item} />}
              </Select>
            </div>

            <div className="px-5 py-3 border-t border-[#e4e7ec] flex justify-end gap-2">
              <Button color="secondary" size="sm" onPress={onClose}>Cancel</Button>
              <Button color="primary" size="sm" isDisabled={!name.trim()} onPress={handleCreate}>
                Create bundle
              </Button>
            </div>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  )
}
