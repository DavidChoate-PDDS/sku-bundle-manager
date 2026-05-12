import { useState, useEffect, useRef } from 'react'
import { Table, Badge, Input, Select, SelectItem, Toggle, CheckboxBase } from '@planetdds/ui'
import { SearchMd, ChevronDown, ChevronRight, MarkerPin01, XCircle } from '@untitledui/icons'
import { MOCK_PGIDS } from '../lib/skus'
import PgidDetailPanel from './PgidDetailPanel'

type OfficeRecord = {
  name: string
  locationLive: boolean
  integratedPayments: boolean
  aiVoicePerio: boolean
  aiVoiceRestorative: boolean
  twilioApproved: boolean
}

export type AccessRecord = {
  pgid: string
  name: string
  skus: string[]
  owner: string
  gupId: string | null
  globalId: string | null
  features: string[]
  offices: OfficeRecord[]
}

const OWNERS = new Set(['Sarah Mitchell', 'James Okafor', 'Priya Desai', 'Tyler Brooks'])

function OwnerCell({ name }: { name: string }) {
  if (!OWNERS.has(name)) return <span className="text-tertiary">—</span>
  return <span className="text-secondary truncate">{name}</span>
}

function makeOffices(pgidId: string, flags: Partial<OfficeRecord>[]): OfficeRecord[] {
  const pgid = MOCK_PGIDS.find(p => p.id === pgidId)!
  return pgid.offices.map((name, i) => ({
    name,
    locationLive: false,
    integratedPayments: false,
    aiVoicePerio: false,
    aiVoiceRestorative: false,
    twilioApproved: false,
    ...flags[i],
  }))
}

export const MOCK_ACCESS: AccessRecord[] = [
  {
    pgid: '46', name: 'Nicholas J. VanDeMoortel, D.D.S.', skus: ['Denticon'], owner: 'Sarah Mitchell',
    gupId: '00134549', globalId: '00129214',
    features: ['CKEDITOR5UPGRADE', 'UNSIGNEDPROGRESSNOTESNEWUI', 'RCM_PREAUTHREQUIRED', 'ENABLEAGENTMESSAGE'],
    offices: makeOffices('46', [
      { locationLive: true, twilioApproved: true },
      { locationLive: true, twilioApproved: true },
    ]),
  },
  {
    pgid: '49', name: 'Central Ohio Endodontics', skus: ['Denticon'], owner: 'Priya Desai',
    gupId: '00198231', globalId: '00187654',
    features: ['CKEDITOR5UPGRADE', 'UNSIGNEDPROGRESSNOTESNEWUI', 'RCM_PREAUTHREQUIRED', 'ENABLE_TOPNAV_PRIMARY', 'ENABLE_TOPNAV_SECONDARY', 'ENABLEAGENTMESSAGE', 'RCM_Transfer_Credit'],
    offices: makeOffices('49', [
      { locationLive: true, twilioApproved: true, integratedPayments: true },
      { locationLive: true, twilioApproved: true },
      { locationLive: true, twilioApproved: true },
    ]),
  },
  {
    pgid: '60', name: 'Brian J. Iannaccone, DDS', skus: ['Denticon'], owner: 'Sarah Mitchell',
    gupId: '00243872', globalId: '00238901',
    features: ['CKEDITOR5UPGRADE', 'UNSIGNEDPROGRESSNOTESNEWUI', 'RCM_PREAUTHREQUIRED', 'ENABLE_TOPNAV_PRIMARY', 'ENABLE_TOPNAV_SECONDARY', 'ENABLEAIPERIOVOICE', 'ENABLEAIRESTVOICE', 'ENABLEAGENTMESSAGE', 'RCM_Transfer_Credit', 'CREATEPROGRESSNOTESNEWUI', 'ENABLENEWTOPNAVIGATION', 'LEDGERMODALSNEWUI'],
    offices: makeOffices('60', [
      { locationLive: true, twilioApproved: true, integratedPayments: true, aiVoicePerio: true, aiVoiceRestorative: true },
    ]),
  },
  {
    pgid: '61', name: 'Kahana Family Dental Center', skus: ['Patient+'], owner: 'Priya Desai',
    gupId: '00267341', globalId: '00251902',
    features: ['CKEDITOR5UPGRADE', 'ENABLETREATMENTPLANPRESENTATION'],
    offices: makeOffices('61', [
      { locationLive: false },
      { locationLive: false },
    ]),
  },
  {
    pgid: '65', name: 'Rock Dental Brands', skus: ['Denticon', 'Clinical Voice+', 'Patient+'], owner: 'James Okafor',
    gupId: '00312458', globalId: '00298763',
    features: ['CKEDITOR5UPGRADE', 'UNSIGNEDPROGRESSNOTESNEWUI', 'RCM_PREAUTHREQUIRED', 'ENABLE_TOPNAV_PRIMARY', 'ENABLE_TOPNAV_SECONDARY', 'ENABLEAIPERIOVOICE', 'ENABLEAIRESTVOICE', 'ENABLEAGENTMESSAGE', 'RCM_Transfer_Credit', 'CREATEPROGRESSNOTESNEWUI', 'ENABLENEWTOPNAVIGATION', 'LEDGERMODALSNEWUI', 'REFERRALLETTERAUTOMATION', 'NewBatchClaimScreen_EnhanceForDSO', 'RCM_EstEngine_CodeBundling', 'ECLAIM_AUTOMATION', 'REDUCEDATADENSITY_PATIENTRECALL', 'ENABLETREATMENTPLANPRESENTATION'],
    offices: makeOffices('65', [
      { locationLive: true, twilioApproved: true, integratedPayments: true, aiVoicePerio: true, aiVoiceRestorative: true },
      { locationLive: true, twilioApproved: true, integratedPayments: true, aiVoicePerio: true, aiVoiceRestorative: true },
      { locationLive: true, twilioApproved: true, integratedPayments: true, aiVoicePerio: true, aiVoiceRestorative: true },
      { locationLive: true, twilioApproved: true, integratedPayments: true, aiVoicePerio: true, aiVoiceRestorative: true },
      { locationLive: true, twilioApproved: true, integratedPayments: true, aiVoicePerio: true, aiVoiceRestorative: true },
      { locationLive: true, twilioApproved: true, integratedPayments: true, aiVoicePerio: true, aiVoiceRestorative: false },
      { locationLive: true, twilioApproved: true, integratedPayments: true, aiVoicePerio: true, aiVoiceRestorative: false },
      { locationLive: true, twilioApproved: true, integratedPayments: false, aiVoicePerio: true, aiVoiceRestorative: true },
      { locationLive: true, twilioApproved: true, integratedPayments: false, aiVoicePerio: true, aiVoiceRestorative: true },
      { locationLive: true, twilioApproved: true, integratedPayments: false, aiVoicePerio: true, aiVoiceRestorative: true },
      { locationLive: true, twilioApproved: true, integratedPayments: false, aiVoicePerio: true, aiVoiceRestorative: false },
      { locationLive: true, twilioApproved: true, integratedPayments: false, aiVoicePerio: true, aiVoiceRestorative: false },
    ]),
  },
  {
    pgid: '67', name: 'American Mobile Dental Corp', skus: [], owner: 'Sarah Mitchell',
    gupId: null, globalId: null,
    features: [],
    offices: makeOffices('67', [{}, {}, {}]),
  },
  {
    pgid: '72', name: 'Heartland Dental – Region 5', skus: ['Denticon', 'Payment+'], owner: 'James Okafor',
    gupId: '00489213', globalId: '00471836',
    features: ['CKEDITOR5UPGRADE', 'UNSIGNEDPROGRESSNOTESNEWUI', 'RCM_PREAUTHREQUIRED', 'ENABLE_TOPNAV_PRIMARY', 'ENABLE_TOPNAV_SECONDARY', 'ENABLEAIPERIOVOICE', 'ENABLEAGENTMESSAGE', 'RCM_Transfer_Credit', 'CREATEPROGRESSNOTESNEWUI', 'ENABLENEWTOPNAVIGATION', 'LEDGERMODALSNEWUI', 'NewBatchClaimScreen_EnhanceForDSO', 'RCM_EstEngine_CodeBundling', 'ENABLETREATMENTPLANPRESENTATION'],
    offices: makeOffices('72', [
      { locationLive: true, twilioApproved: true, integratedPayments: true, aiVoicePerio: true },
      { locationLive: true, twilioApproved: true, integratedPayments: true, aiVoicePerio: true },
      { locationLive: true, twilioApproved: true, integratedPayments: true },
      { locationLive: true, twilioApproved: true, integratedPayments: true },
      { locationLive: true, twilioApproved: true, integratedPayments: true },
    ]),
  },
  {
    pgid: '88', name: 'Pacific Dental Services – Pacific NW', skus: ['Denticon', 'Clinical Voice+'], owner: 'James Okafor',
    gupId: '00523847', globalId: '00509124',
    features: ['CKEDITOR5UPGRADE', 'UNSIGNEDPROGRESSNOTESNEWUI', 'RCM_PREAUTHREQUIRED', 'ENABLE_TOPNAV_PRIMARY', 'ENABLE_TOPNAV_SECONDARY', 'ENABLEAIPERIOVOICE', 'ENABLEAIRESTVOICE', 'ENABLEAGENTMESSAGE', 'RCM_Transfer_Credit', 'CREATEPROGRESSNOTESNEWUI', 'ENABLENEWTOPNAVIGATION', 'LEDGERMODALSNEWUI', 'REFERRALLETTERAUTOMATION', 'NewBatchClaimScreen_EnhanceForDSO', 'RCM_EstEngine_CodeBundling', 'ECLAIM_AUTOMATION', 'REDUCEDATADENSITY_PATIENTRECALL', 'ENABLETREATMENTPLANPRESENTATION', 'RCM_MovePatient_Phase1', 'OVERJETINTEGRATION', 'REFPORTALENHANCEMENTS'],
    offices: makeOffices('88', [
      { locationLive: true, twilioApproved: true, integratedPayments: true, aiVoicePerio: true, aiVoiceRestorative: true },
      { locationLive: true, twilioApproved: true, integratedPayments: true, aiVoicePerio: true, aiVoiceRestorative: true },
      { locationLive: true, twilioApproved: true, integratedPayments: true, aiVoicePerio: true, aiVoiceRestorative: true },
      { locationLive: true, twilioApproved: true, integratedPayments: true, aiVoicePerio: true, aiVoiceRestorative: true },
      { locationLive: true, twilioApproved: true, integratedPayments: false, aiVoicePerio: true, aiVoiceRestorative: true },
      { locationLive: true, twilioApproved: true, integratedPayments: false, aiVoicePerio: true, aiVoiceRestorative: true },
    ]),
  },
  {
    pgid: '91', name: 'Aspen Dental – Colorado Group', skus: ['Payment+'], owner: 'Priya Desai',
    gupId: '00634521', globalId: '00618934',
    features: ['CKEDITOR5UPGRADE', 'UNSIGNEDPROGRESSNOTESNEWUI', 'RCM_PREAUTHREQUIRED', 'ENABLE_TOPNAV_PRIMARY', 'ENABLE_TOPNAV_SECONDARY', 'ENABLEAGENTMESSAGE', 'RCM_Transfer_Credit', 'CREATEPROGRESSNOTESNEWUI', 'ENABLETREATMENTPLANPRESENTATION'],
    offices: makeOffices('91', [
      { locationLive: true, twilioApproved: true, integratedPayments: true },
      { locationLive: true, twilioApproved: true, integratedPayments: true },
      { locationLive: true, twilioApproved: true, integratedPayments: true },
      { locationLive: true, twilioApproved: true, integratedPayments: true },
      { locationLive: true, twilioApproved: true, integratedPayments: true },
      { locationLive: true, twilioApproved: true, integratedPayments: true },
      { locationLive: true, twilioApproved: true, integratedPayments: true },
      { locationLive: true, twilioApproved: true, integratedPayments: true },
    ]),
  },
  {
    pgid: '103', name: 'Smile Brands – Southwest', skus: ['Patient+'], owner: 'Tyler Brooks',
    gupId: '00712384', globalId: '00698541',
    features: ['CKEDITOR5UPGRADE', 'UNSIGNEDPROGRESSNOTESNEWUI', 'RCM_PREAUTHREQUIRED', 'ENABLEAGENTMESSAGE', 'ENABLETREATMENTPLANPRESENTATION', 'LEDGERMODALSNEWUI'],
    offices: makeOffices('103', [
      { locationLive: true, twilioApproved: true, integratedPayments: true },
      { locationLive: true, twilioApproved: true, integratedPayments: true },
      { locationLive: true, twilioApproved: true, integratedPayments: true },
      { locationLive: true, twilioApproved: false, integratedPayments: true },
      { locationLive: true, twilioApproved: false, integratedPayments: true },
      { locationLive: true, twilioApproved: false, integratedPayments: false },
      { locationLive: true, twilioApproved: false, integratedPayments: false },
      { locationLive: true, twilioApproved: false, integratedPayments: false },
    ]),
  },
  {
    pgid: '118', name: 'Deca Dental Group', skus: ['Denticon', 'Clinical Voice+', 'Imaging+'], owner: 'Tyler Brooks',
    gupId: '00834967', globalId: '00821345',
    features: ['CKEDITOR5UPGRADE', 'UNSIGNEDPROGRESSNOTESNEWUI', 'RCM_PREAUTHREQUIRED', 'ENABLE_TOPNAV_PRIMARY', 'ENABLE_TOPNAV_SECONDARY', 'ENABLEAIPERIOVOICE', 'ENABLEAIRESTVOICE', 'ENABLEAGENTMESSAGE', 'RCM_Transfer_Credit', 'CREATEPROGRESSNOTESNEWUI', 'ENABLENEWTOPNAVIGATION', 'LEDGERMODALSNEWUI', 'REFERRALLETTERAUTOMATION', 'NewBatchClaimScreen_EnhanceForDSO', 'RCM_EstEngine_CodeBundling', 'ECLAIM_AUTOMATION', 'REDUCEDATADENSITY_PATIENTRECALL', 'ENABLETREATMENTPLANPRESENTATION', 'RCM_MovePatient_Phase1', 'OVERJETINTEGRATION', 'REFPORTALENHANCEMENTS', 'ESIGNUNSIGNEDPROGRESSNOTES'],
    offices: makeOffices('118', [
      { locationLive: true, twilioApproved: true, integratedPayments: true, aiVoicePerio: true, aiVoiceRestorative: true },
      { locationLive: true, twilioApproved: true, integratedPayments: true, aiVoicePerio: true, aiVoiceRestorative: true },
      { locationLive: true, twilioApproved: true, integratedPayments: true, aiVoicePerio: true, aiVoiceRestorative: true },
      { locationLive: true, twilioApproved: true, integratedPayments: true, aiVoicePerio: true, aiVoiceRestorative: true },
      { locationLive: true, twilioApproved: true, integratedPayments: true, aiVoicePerio: true, aiVoiceRestorative: true },
      { locationLive: true, twilioApproved: true, integratedPayments: true, aiVoicePerio: true, aiVoiceRestorative: true },
      { locationLive: true, twilioApproved: true, integratedPayments: true, aiVoicePerio: true, aiVoiceRestorative: true },
      { locationLive: true, twilioApproved: true, integratedPayments: true, aiVoicePerio: true, aiVoiceRestorative: true },
    ]),
  },
  {
    pgid: '124', name: 'SmilesForever Orthodontics', skus: ['Cloud 9'], owner: 'Tyler Brooks',
    gupId: '00923814', globalId: '00911203',
    features: ['CKEDITOR5UPGRADE', 'UNSIGNEDPROGRESSNOTESNEWUI', 'ENABLETREATMENTPLANPRESENTATION'],
    offices: makeOffices('124', [
      { locationLive: true, twilioApproved: true },
      { locationLive: true, twilioApproved: true },
      { locationLive: true, twilioApproved: true },
      { locationLive: true, twilioApproved: true },
      { locationLive: true, twilioApproved: true },
      { locationLive: true, twilioApproved: true },
    ]),
  },
]

function count(offices: OfficeRecord[], key: keyof OfficeRecord) {
  return offices.filter(o => o[key]).length
}

function needsAction(o: OfficeRecord) {
  return !o.locationLive || !o.integratedPayments || !o.aiVoicePerio || !o.aiVoiceRestorative || !o.twilioApproved
}

function Flag({ enabled }: { enabled: boolean }) {
  return (
    <div className="flex items-center justify-center">
      {enabled
        ? <Badge type="pill-color" color="success" size="sm">Enabled</Badge>
        : <XCircle size={16} className="text-[#d0d5dd]" />}
    </div>
  )
}

function Fraction({ yes, total }: { yes: number; total: number }) {
  const none = yes === 0
  return (
    <div className="flex justify-center">
      <span className={total === 0 ? 'text-tertiary' : none ? 'text-[#d0d5dd]' : 'text-secondary'}>
        {total === 0 ? '—' : `${yes}/${total}`}
      </span>
    </div>
  )
}

function GupIdCell({ gupId, globalId }: { gupId: string | null; globalId: string | null }) {
  if (!gupId) return <span className="text-sm text-[#d0d5dd]">—</span>
  return (
    <div className="flex flex-col">
      <span className="text-sm font-medium text-[#181d27]">{gupId}</span>
      <span className="text-xs font-normal text-[#667085]">{globalId ?? '—'}</span>
    </div>
  )
}

type AccessReviewProps = {
  onSelectionChange?: (count: number) => void
  exportRef?: React.MutableRefObject<(() => void) | null>
}

export default function AccessReview({ onSelectionChange, exportRef }: AccessReviewProps) {
  const [query, setQuery] = useState('')
  const [ownerFilter, setOwnerFilter] = useState<string>('all')
  const [actionOnly, setActionOnly] = useState(false)
  const [selectedPgid, setSelectedPgid] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

  function toggleRow(pgid: string) {
    setSelectedRows(prev => {
      const next = new Set(prev)
      next.has(pgid) ? next.delete(pgid) : next.add(pgid)
      return next
    })
  }

  // Keep a ref to selectedRows so the export fn passed to the parent is always fresh
  const selectedRowsRef = useRef(selectedRows)
  selectedRowsRef.current = selectedRows

  function handleExport() {
    const rows = MOCK_ACCESS.filter(r => selectedRowsRef.current.has(r.pgid))
    const lines = [
      ['PGID', 'Practice Group', 'SKUs', 'Owner', 'Live', 'GUP ID', 'Global ID'].join(','),
      ...rows.map(r => [
        r.pgid, `"${r.name}"`, `"${r.skus.join('; ')}"`, `"${r.owner}"`,
        r.offices.filter(o => o.locationLive).length,
        r.gupId ?? '', r.globalId ?? '',
      ].join(',')),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'access-review.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  // Sync selection count and export fn to parent
  useEffect(() => {
    onSelectionChange?.(selectedRows.size)
    if (exportRef) exportRef.current = handleExport
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRows])

  function toggleExpanded(pgid: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(pgid) ? next.delete(pgid) : next.add(pgid)
      return next
    })
  }

  const filtered = MOCK_ACCESS.filter(r => {
    const matchesQuery =
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.pgid.includes(query) ||
      r.skus.some(s => s.toLowerCase().includes(query.toLowerCase()))
    const matchesOwner = ownerFilter === 'all' || r.owner === ownerFilter
    const matchesAction = !actionOnly || r.offices.some(needsAction)
    return matchesQuery && matchesOwner && matchesAction
  })

  const allFilteredSelected = filtered.length > 0 && filtered.every(r => selectedRows.has(r.pgid))
  const someFilteredSelected = filtered.some(r => selectedRows.has(r.pgid))

  function toggleSelectAll() {
    if (allFilteredSelected) {
      setSelectedRows(prev => { const next = new Set(prev); filtered.forEach(r => next.delete(r.pgid)); return next })
    } else {
      setSelectedRows(prev => { const next = new Set(prev); filtered.forEach(r => next.add(r.pgid)); return next })
    }
  }

  const selectedRecord = selectedPgid ? MOCK_ACCESS.find(r => r.pgid === selectedPgid) ?? null : null
  const selectedPgidData = selectedPgid ? MOCK_PGIDS.find(p => p.id === selectedPgid) ?? null : null

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto px-12 py-6" style={{ backgroundColor: '#f8f9fb' }}>
        <div className="bg-white border border-[#e4e7ec] rounded-xl">

          <div className="px-5 py-4 border-b border-[#e4e7ec] flex items-center justify-between gap-6 min-w-0">
            <div className="shrink-0">
              <div className="text-base font-semibold text-primary">Access review</div>
              <div className="text-sm text-tertiary mt-0.5">Which orgs have which features and SKUs enabled</div>
            </div>
            <div className="flex items-center shrink-0" style={{ gap: 12 }}>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <Toggle isSelected={actionOnly} onChange={setActionOnly} size="sm" />
                <span className="text-sm text-secondary whitespace-nowrap">Action needed</span>
              </label>
              <div className="w-px self-stretch bg-[#e4e7ec]" />
              <Select
                size="sm"
                selectedKey={ownerFilter}
                onSelectionChange={key => setOwnerFilter(key as string)}
                aria-label="Filter by account manager"
              >
                <SelectItem id="all">All account managers</SelectItem>
                {Array.from(OWNERS).map(name => (
                  <SelectItem key={name} id={name}>{name}</SelectItem>
                ))}
              </Select>
              <div style={{ width: 260, flexShrink: 0 }}>
                <Input size="sm" icon={SearchMd} placeholder="Search…" value={query} onChange={setQuery} />
              </div>
            </div>
          </div>

          <Table aria-label="Access review" size="sm" className="font-sans">
            <Table.Header>
              <Table.Head label="" className="!pr-2">
                <label className="flex items-center cursor-pointer" onClick={toggleSelectAll}>
                  <CheckboxBase
                    isSelected={allFilteredSelected}
                    isIndeterminate={!allFilteredSelected && someFilteredSelected}
                    size="sm"
                  />
                </label>
              </Table.Head>
              <Table.Head label="Practice group" className="!pl-2" />
              <Table.Head label="PGID" />
              <Table.Head label="SKU / plan" />
              <Table.Head label="Account manager" />
              <Table.Head label="Live" className="[&>div]:justify-center" />
              <Table.Head label="Payments" className="[&>div]:justify-center" />
              <Table.Head label="AI Perio" className="[&>div]:justify-center" />
              <Table.Head label="AI Rest." className="[&>div]:justify-center" />
              <Table.Head label="Twilio" className="[&>div]:justify-center" />
              <Table.Head label="GUP ID · Global ID" />
            </Table.Header>
            <Table.Body>
              {filtered.flatMap(r => {
                const isExpanded = expanded.has(r.pgid) || actionOnly
                const officesToShow = actionOnly ? r.offices.filter(needsAction) : r.offices
                const total = r.offices.length

                const parentRow = (
                  <Table.Row key={r.pgid} id={r.pgid}>
                    <Table.Cell className="!pr-2">
                      <label className="flex items-center cursor-pointer" onClick={e => { e.stopPropagation(); toggleRow(r.pgid) }}>
                        <CheckboxBase isSelected={selectedRows.has(r.pgid)} size="sm" />
                      </label>
                    </Table.Cell>
                    <Table.Cell className="text-primary max-w-[220px] !pl-2">
                      <div className="flex items-center gap-1">
                        <button onClick={() => toggleExpanded(r.pgid)} className="text-tertiary hover:text-secondary transition-colors shrink-0 p-0.5 -ml-0.5">
                          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                        <button onClick={() => setSelectedPgid(r.pgid)} className="truncate text-left font-medium hover:text-brand-600 transition-colors">
                          {r.name}
                        </button>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="text-tertiary">{r.pgid}</Table.Cell>
                    <Table.Cell>
                      {r.skus.length > 0
                        ? <div className="flex flex-wrap gap-1">{r.skus.map(s => <Badge key={s} type="pill-color" color="brand" size="sm">{s}</Badge>)}</div>
                        : <span className="text-tertiary italic">Not linked</span>}
                    </Table.Cell>
                    <Table.Cell><OwnerCell name={r.owner} /></Table.Cell>
                    <Table.Cell className="text-center">
                      <div className="flex justify-center">
                        <span className={count(r.offices, 'locationLive') === 0 ? 'text-[#d0d5dd]' : 'text-secondary'}>
                          {count(r.offices, 'locationLive')}
                        </span>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="text-center"><Fraction yes={count(r.offices, 'integratedPayments')} total={total} /></Table.Cell>
                    <Table.Cell className="text-center"><Fraction yes={count(r.offices, 'aiVoicePerio')} total={total} /></Table.Cell>
                    <Table.Cell className="text-center"><Fraction yes={count(r.offices, 'aiVoiceRestorative')} total={total} /></Table.Cell>
                    <Table.Cell className="text-center"><Fraction yes={count(r.offices, 'twilioApproved')} total={total} /></Table.Cell>
                    <Table.Cell>
                      <GupIdCell gupId={r.gupId} globalId={r.globalId} />
                    </Table.Cell>
                  </Table.Row>
                )

                const childRows = isExpanded
                  ? officesToShow.map((o, i) => (
                    <Table.Row key={`${r.pgid}-${i}`} id={`${r.pgid}-${i}`} className="bg-[#f9fafb]">
                      <Table.Cell>{' '}</Table.Cell>
                      <Table.Cell className="max-w-[220px] !pl-2">
                        <div className="flex items-center gap-1.5 pl-5">
                          <MarkerPin01 size={12} className="text-tertiary shrink-0" />
                          <span className="text-secondary truncate">{o.name}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>{' '}</Table.Cell>
                      <Table.Cell>{' '}</Table.Cell>
                      <Table.Cell>{' '}</Table.Cell>
                      <Table.Cell><Flag enabled={o.locationLive} /></Table.Cell>
                      <Table.Cell><Flag enabled={o.integratedPayments} /></Table.Cell>
                      <Table.Cell><Flag enabled={o.aiVoicePerio} /></Table.Cell>
                      <Table.Cell><Flag enabled={o.aiVoiceRestorative} /></Table.Cell>
                      <Table.Cell><Flag enabled={o.twilioApproved} /></Table.Cell>
                      <Table.Cell>{' '}</Table.Cell>
                    </Table.Row>
                  ))
                  : []

                return [parentRow, ...childRows]
              })}
            </Table.Body>
          </Table>

          {filtered.length === 0 && (
            <p className="text-center text-xs text-tertiary py-8">No results for "{query}"</p>
          )}

          <div className="px-5 py-3 border-t border-[#e4e7ec] text-xs text-tertiary">
            {filtered.length} of {MOCK_ACCESS.length} practice groups shown · Mock data for prototype
          </div>
        </div>
      </div>

      <PgidDetailPanel
        open={!!selectedRecord}
        record={selectedRecord}
        pgidData={selectedPgidData}
        onClose={() => setSelectedPgid(null)}
      />
    </div>
  )
}
