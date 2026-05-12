import { ModalCompound } from '@planetdds/ui'
import { Trash01 } from '@untitledui/icons'
import type { Bundle } from '../lib/api'

type Props = {
  open: boolean
  bundle: Bundle | null
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteBundleModal({ open, bundle, onClose, onConfirm }: Props) {
  if (!bundle) return null

  return (
    <ModalCompound isOpen={open} onOpenChange={v => { if (!v) onClose() }} maxWidth="sm">
      <ModalCompound.Header
        icon={Trash01}
        iconColor="error"
        title="Delete bundle?"
        description={
          <>
            <strong>{bundle.name}</strong> and all of its feature mappings will be permanently removed. This cannot be undone.
          </>
        }
        layout="stacked"
      />
      <ModalCompound.Footer
        primaryLabel="Delete bundle"
        secondaryLabel="Cancel"
        primaryColor="primary-destructive"
        onPrimary={onConfirm}
        onSecondary={onClose}
        layout="stacked"
      />
    </ModalCompound>
  )
}
