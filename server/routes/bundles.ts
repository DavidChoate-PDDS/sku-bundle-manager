import { Router } from 'express'
import { db } from '../db/database.js'

const router = Router()

type BundleRow = {
  id: number
  name: string
  sku: string | null
  notes: string | null
  features: string
  created_at: string
  updated_at: string
}

function parse(row: BundleRow) {
  return { ...row, features: JSON.parse(row.features) as string[] }
}

router.get('/', (_req, res) => {
  const rows = db.prepare('SELECT * FROM bundles ORDER BY name ASC').all() as BundleRow[]
  res.json(rows.map(parse))
})

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM bundles WHERE id = ?').get(req.params.id) as BundleRow | undefined
  if (!row) return res.status(404).json({ error: 'Not found' })
  res.json(parse(row))
})

router.post('/', (req, res) => {
  const { name, sku = null, notes = null, features = [] } = req.body as Partial<{ name: string; sku: string; notes: string; features: string[] }>
  if (!name) return res.status(400).json({ error: 'name is required' })
  const result = db.prepare(
    'INSERT INTO bundles (name, sku, notes, features) VALUES (?, ?, ?, ?)'
  ).run(name, sku, notes, JSON.stringify(features))
  const row = db.prepare('SELECT * FROM bundles WHERE id = ?').get(result.lastInsertRowid) as BundleRow
  res.status(201).json(parse(row))
})

router.patch('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM bundles WHERE id = ?').get(req.params.id) as BundleRow | undefined
  if (!row) return res.status(404).json({ error: 'Not found' })
  const { name, sku, notes, features } = req.body as Partial<{ name: string; sku: string | null; notes: string | null; features: string[] }>
  db.prepare(`
    UPDATE bundles SET
      name       = ?,
      sku        = ?,
      notes      = ?,
      features   = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `).run(
    name ?? row.name,
    sku !== undefined ? sku : row.sku,
    notes !== undefined ? notes : row.notes,
    features !== undefined ? JSON.stringify(features) : row.features,
    req.params.id
  )
  const updated = db.prepare('SELECT * FROM bundles WHERE id = ?').get(req.params.id) as BundleRow
  res.json(parse(updated))
})

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM bundles WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

export default router
