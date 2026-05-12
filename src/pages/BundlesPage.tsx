import { useState, useEffect, useRef } from 'react'
import { Toaster, IconNotification } from '@planetdds/ui'
import { toast } from 'sonner'
import { Package, Plus, DownloadCloud01 } from '@untitledui/icons'
import { Tabs, TabList, Tab, Button } from '@planetdds/ui'
import { api, type Bundle } from '../lib/api'
import { SF_SKUS, SF_SKU_GROUPS } from '../lib/skus'
import BundleSidebar from '../components/BundleSidebar'
import BundleDetail from '../components/BundleDetail'
import CatalogPanel from '../components/CatalogPanel'
import NewBundleModal from '../components/NewBundleModal'
import DeployModal from '../components/DeployModal'
import DeleteBundleModal from '../components/DeleteBundleModal'
import AccessReview from '../components/AccessReview'

function buildSeeds(): Omit<Bundle, 'id' | 'created_at' | 'updated_at'>[] {
  const entries: [string, string][] = [
    ['Denticon', 'Denticon'],
    ['Denticon Core', 'DentalOS Platform'],
    ['Patient+', 'Patient+'],
    ['Clinical Voice+', 'Clinical Voice+'],
    ['Imaging+', 'Imaging+'],
    ['Payment+', 'Payment+'],
  ]
  return entries.map(([name, sku]) => ({
    name,
    sku,
    notes: SF_SKUS[sku]?.desc ?? '',
    features: [],
  }))
}

export default function BundlesPage() {
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [activeId, setActiveId] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState('plans')
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [deployOpen, setDeployOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [newBundleOpen, setNewBundleOpen] = useState(false)
  const [isBundleEditing, setIsBundleEditing] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const [showDeployed, setShowDeployed] = useState(false)
  const [accessReviewSelectionCount, setAccessReviewSelectionCount] = useState(0)
  const accessReviewExportRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!showSaved) return
    const t = setTimeout(() => setShowSaved(false), 4000)
    return () => clearTimeout(t)
  }, [showSaved])

  useEffect(() => {
    if (!showDeployed) return
    const t = setTimeout(() => setShowDeployed(false), 4000)
    return () => clearTimeout(t)
  }, [showDeployed])
  const didInit = useRef(false)

  const activeBundle = bundles.find(b => b.id === activeId) ?? null

  useEffect(() => {
    if (didInit.current) return
    didInit.current = true
    ;(async () => {
      const data = await api.bundles.list()
      if (data.length === 0) {
        const seeds = buildSeeds()
        const created = await Promise.all(seeds.map(s => api.bundles.create(s)))
        setBundles(created)
        setActiveId(created[0]?.id ?? null)
      } else {
        setBundles(data)
        setActiveId(data[0].id)
      }
    })()
  }, [])

  async function handleCreate(name: string, sku: string | null) {
    const b = await api.bundles.create({ name, sku, notes: '', features: [] })
    setBundles(prev => [...prev, b])
    setActiveId(b.id)
    setNewBundleOpen(false)
    toast.success('Bundle created')
  }

  async function handleUpdate(patch: Partial<Pick<Bundle, 'name' | 'sku' | 'notes' | 'features'>>) {
    if (!activeId) return
    const updated = await api.bundles.update(activeId, patch)
    setBundles(prev => prev.map(b => b.id === activeId ? updated : b))
  }

  async function handleToggleFeature(key: string) {
    if (!activeBundle) return
    const features = activeBundle.features.includes(key)
      ? activeBundle.features.filter(k => k !== key)
      : [...activeBundle.features, key]
    const updated = await api.bundles.update(activeBundle.id, { features })
    setBundles(prev => prev.map(b => b.id === activeBundle.id ? updated : b))
  }

  async function handleDelete() {
    if (!activeId) return
    setDeleteOpen(true)
  }

  async function handleDeleteConfirm() {
    if (!activeId) return
    await api.bundles.delete(activeId)
    const remaining = bundles.filter(b => b.id !== activeId)
    setBundles(remaining)
    setActiveId(remaining[0]?.id ?? null)
    setDeleteOpen(false)
    toast.success('Bundle deleted')
  }

  function handleSelect(id: number) {
    setActiveId(id)
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Blue top bar */}
      <header
        className="shrink-0 flex items-center px-12"
        style={{ backgroundColor: 'var(--colors-foreground-fg-brand-primary-600-light-mode, #0069dc)', height: 64 }}
      >
        <img src="/denticonadmin.png" alt="Denticon Admin" className="h-9 w-auto" />
      </header>

      {/* Page header */}
      <div className="bg-white shrink-0 border-b border-[#d5d7da]">
        <div className="px-12 pt-6 pb-0 flex items-center justify-between">
          <div className="text-2xl font-semibold text-primary">Site Feature Registry</div>
          <div className="flex items-center gap-3">
            {activeTab === 'access-review' && (
              <Button
                color="secondary"
                size="sm"
                iconLeading={DownloadCloud01}
                isDisabled={accessReviewSelectionCount === 0}
                onPress={() => accessReviewExportRef.current?.()}
              >
                {accessReviewSelectionCount > 0 ? `Export ${accessReviewSelectionCount} selected` : 'Export'}
              </Button>
            )}
            <Button color="primary" size="sm" iconLeading={Plus} isDisabled={isBundleEditing} onPress={() => setNewBundleOpen(true)}>New bundle</Button>
          </div>
        </div>
        <div className="px-12 mt-4 pb-3">
          <Tabs selectedKey={activeTab} onSelectionChange={k => setActiveTab(k as string)}>
            <TabList type="button-brand" size="sm" aria-label="App sections">
              <Tab id="plans" label="Plans" />
              <Tab id="access-review" label="Access review" />
            </TabList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {activeTab === 'plans' ? (
          <>
            <BundleSidebar
              bundles={bundles}
              activeId={activeId}
              onSelect={handleSelect}
              onNew={() => setNewBundleOpen(true)}
            />

            <div className="flex flex-1 overflow-hidden">
              {activeBundle ? (
                <BundleDetail
                  bundle={activeBundle}
                  onOpenCatalog={() => setCatalogOpen(true)}
                  onDeploy={() => setDeployOpen(true)}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                  onEditingChange={setIsBundleEditing}
                  onSaved={() => setShowSaved(true)}
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-3">
                  <Package size={40} className="text-quaternary" />
                  <div className="text-sm font-semibold text-secondary">Select or create a bundle</div>
                  <div className="text-sm text-tertiary">Bundles capture institutional knowledge — what gets enabled when a SKU is sold.</div>
                </div>
              )}
            </div>

            <CatalogPanel
              open={catalogOpen}
              activeFeatures={activeBundle?.features ?? []}
              onSave={async (features) => {
                if (!activeBundle) return
                const updated = await api.bundles.update(activeBundle.id, { features })
                setBundles(prev => prev.map(b => b.id === activeBundle.id ? updated : b))
                setCatalogOpen(false)
                setShowSaved(true)
              }}
              onClose={() => setCatalogOpen(false)}
            />
          </>
        ) : (
          <AccessReview
            onSelectionChange={setAccessReviewSelectionCount}
            exportRef={accessReviewExportRef}
          />
        )}
      </div>

      <NewBundleModal
        open={newBundleOpen}
        onClose={() => setNewBundleOpen(false)}
        onCreate={handleCreate}
      />

      <DeployModal
        open={deployOpen}
        bundle={activeBundle}
        onClose={() => setDeployOpen(false)}
        onDeployed={() => setShowDeployed(true)}
      />

      <DeleteBundleModal
        open={deleteOpen}
        bundle={activeBundle}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      {showSaved && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)]">
          <IconNotification
            color="success"
            title="Bundle saved"
            description="Your changes have been saved successfully."
            hideDismissLabel
            onClose={() => setShowSaved(false)}
          />
        </div>
      )}

      {showDeployed && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)]">
          <IconNotification
            color="success"
            title="Bundle enabled"
            description="The bundle has been enabled for the selected PGID."
            hideDismissLabel
            onClose={() => setShowDeployed(false)}
          />
        </div>
      )}

      <Toaster />
    </div>
  )
}
