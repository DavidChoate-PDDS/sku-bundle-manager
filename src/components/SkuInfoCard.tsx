import { Badge } from '@planetdds/ui'
import { SF_SKUS } from '../lib/skus'

type Props = { skuKey: string; nested?: boolean }

export default function SkuInfoCard({ skuKey, nested }: Props) {
  const sku = SF_SKUS[skuKey]
  if (!sku) return null

  const inner = (
    <>
      <div className="bg-white px-4 py-3 flex flex-col gap-2">
        <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wide">What's Included</div>
        <div className="flex flex-wrap gap-1.5">
          {sku.includes.map(item => (
            <Badge key={item} type="pill-color" color="gray" size="sm">{item}</Badge>
          ))}
        </div>
        <p className="text-[11px] text-[#667085] leading-relaxed">{sku.desc}</p>
        {sku.year1 && (
          <div className="bg-amber-50 border border-amber-200 rounded-md px-3 py-2 text-[10px] text-amber-800 leading-relaxed">
            {sku.year1}
          </div>
        )}
        {sku.pricing_detail && (
          <div className="bg-[#f8f9fb] rounded-md px-3 py-2 text-[10px] text-[#667085]">
            {sku.pricing_detail}
          </div>
        )}
      </div>
    </>
  )

  if (nested) return inner
  return <div className="rounded-xl overflow-hidden border border-[#e4e7ec]">{inner}</div>
}
