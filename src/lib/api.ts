export type Bundle = {
  id: number
  name: string
  sku: string | null
  notes: string | null
  features: string[]
  created_at: string
  updated_at: string
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json() as Promise<T>
}

export const api = {
  bundles: {
    list: () => request<Bundle[]>('/bundles'),
    get: (id: number) => request<Bundle>(`/bundles/${id}`),
    create: (data: Pick<Bundle, 'name' | 'sku' | 'notes' | 'features'>) =>
      request<Bundle>('/bundles', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Pick<Bundle, 'name' | 'sku' | 'notes' | 'features'>>) =>
      request<Bundle>(`/bundles/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: number) =>
      request<{ ok: boolean }>(`/bundles/${id}`, { method: 'DELETE' }),
  },
}
