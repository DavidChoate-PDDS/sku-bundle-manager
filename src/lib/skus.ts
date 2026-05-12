export type SkuCat = 'core' | 'suite' | 'addon' | 'usage' | 'services'

export type SkuData = {
  cat: SkuCat
  catLabel: string
  price: string
  floor: string
  desc: string
  includes: string[]
  year1?: string
  pricing_detail?: string
}

export const SF_SKUS: Record<string, SkuData> = {
  'Denticon': { cat:'core', catLabel:'Core Product', price:'$1,179/mo', floor:'Floor (20% off): $943.20/mo', desc:'General Practice Management Software — required for all Denticon locations.', includes:['Scheduling','Patient Record','Treatment Planning','Progress Notes','Referral Management','Basic RCM','Tooth & Perio Charting','2-Way Text (3,000 seg/mo)','Claims (Qty 500)','ERA','Real-Time Eligibility','Basic Imaging (1TB)','DPA Morning Huddle'] },
  'Cloud 9': { cat:'core', catLabel:'Core Product', price:'$800/mo', floor:'Floor (20% off): $640/mo', desc:'Orthodontic and Specialty Practice Management Software.', includes:['Scheduling','Patient Record','Treatment Planning','Progress Notes','Referral Management','Basic RCM','2-Way Text (3,000 seg/mo)','Basic Imaging (1TB)','Claims (Qty 500)','ERA'] },
  'Patient+': { cat:'suite', catLabel:'Add-on Suite', price:'$499/mo', floor:'Floor (20% off): $399.20/mo', desc:'Engagement and communications suite. Buy once, applies across all core locations.', includes:['Automated Text/Email (+ 3,000 seg/mo)','MyTooth Patient Portal','Treatment Plan Presentation','Consent Forms','Patient Portal'], year1:'Cloud 9 Year 1 discount: $450/mo (floor $360/mo) while features roll out.' },
  'Clinical Voice+': { cat:'suite', catLabel:'Add-on Suite', price:'$549/mo', floor:'Floor: $449/mo', desc:'AI Voice charting suite. Buy once, applies across all core locations.', includes:['AI Voice Perio','AI Voice Restorative','AI Voice Treatment Plan','AI Voice Progress Notes (soon)','Ambient Voice (soon)'], year1:'Year 1 discount: $329/mo (floor $263.20/mo) while voice features complete rollout.' },
  'Imaging+': { cat:'suite', catLabel:'Add-on Suite', price:'$150/mo', floor:'Floor (20% off): $120/mo', desc:'Enhanced imaging storage and analytics.', includes:['Extra 2D Image Storage (1TB)','XVWeb 3D Module (100GB)','XVWeb Analytics'] },
  'Payment+': { cat:'suite', catLabel:'Add-on Suite', price:'$100/mo + fees', floor:'Floor (20% off): $80/mo + fees', desc:'Payments and capital suite. PDDS Pay required on Launchpad deals.', includes:['PDDS Pay','Processing Volume','Surcharge','PDDS Capital (soon)'], pricing_detail:'Per transaction: $0.25 | ACH: $0.50 | Discount rate: 1.29% | Chargebacks: $25' },
  'DPA – Dashboard Bundle': { cat:'addon', catLabel:'Add-on Product', price:'$278/mo', floor:'Floor (20% off): $222.40/mo', desc:'Full DPA analytics dashboard beyond the Morning Huddle in core.', includes:['Full Analytics Dashboard','Production & Collection Reports','Multi-location Consolidation'] },
  'Denticon Data Share / BCP': { cat:'addon', catLabel:'Add-on Product', price:'$50/mo', floor:'Floor (20% off): $40/mo', desc:'Denticon data share and Business Continuity Planning export.', includes:['Data Share Access','BCP Export'] },
  'Cloud 9 Data Share': { cat:'addon', catLabel:'Add-on Product', price:'$50/mo', floor:'Floor (20% off): $40/mo', desc:'Cloud 9 data share integration.', includes:['Cloud 9 Data Share Access'] },
  'Ortho Suite': { cat:'addon', catLabel:'Add-on Product', price:'$50/mo', floor:'Floor (20% off): $40/mo', desc:'Orthodontic workflow features inside Denticon for mixed-practice offices.', includes:['Ortho Module','Aligner Tracking','Ortho Contract Management'] },
  'AutoEligibility': { cat:'addon', catLabel:'Add-on Product', price:'$300/mo', floor:'Floor (20% off): $240/mo', desc:'Batch automated eligibility beyond the real-time check in core.', includes:['Batch Auto-Eligibility','Overage: $0.55/check'] },
  'eClaims Unlimited': { cat:'addon', catLabel:'Add-on Product', price:'Included in Denticon Pro Package', floor:'', desc:'Removes the 500 claim/mo cap. Unlimited electronic claim submission.', includes:['Unlimited eClaims (no cap)'] },
  'XVWeb Pro Unlimited': { cat:'addon', catLabel:'Add-on Product', price:'$249/mo', floor:'', desc:'XVWeb Pro 3D imaging — unlimited module access.', includes:['XVWeb 3D Unlimited','XVWeb Analytics'] },
  'Real-Time Eligibility': { cat:'addon', catLabel:'Add-on Product', price:'$21/mo', floor:'', desc:'Per-location real-time insurance eligibility verification.', includes:['Real-Time Eligibility Check'] },
  'DXC Attachments': { cat:'addon', catLabel:'Add-on Product', price:'$21/mo', floor:'', desc:'DXC electronic claim attachment integration per location.', includes:['Electronic Claim Attachments via DXC'] },
  'Patient Communication 2-Way SMS': { cat:'addon', catLabel:'Add-on Product', price:'$99/mo', floor:'', desc:'Two-way SMS. Overages: $0.0087/seg beyond 3,000 included.', includes:['2-Way SMS','3,000 segments/mo'] },
  'AI Confirmation Agent': { cat:'usage', catLabel:'Usage-Based', price:'$3.00/result', floor:'Billed monthly per outcome', desc:'Charged per confirmed, cancelled, rescheduled, or transferred appointment.', includes:['Automated confirmation outreach','Outcome-based billing'] },
  'AI Scheduling Agent': { cat:'usage', catLabel:'Usage-Based', price:'Usage-based — TBD', floor:'', desc:'Proactively fills schedule via recall, unscheduled tx, and cancellation outreach. Charged per booked appointment.', includes:['Recall outreach','Unscheduled tx follow-up','Cancellation fill'] },
  'Patient Statements': { cat:'usage', catLabel:'Usage-Based', price:'$0.05–$0.95/statement', floor:'Billed per statement sent', desc:'Electronic patient statement processing.', includes:['E-statement generation','Mailed statement option'] },
  'Standard Conversion': { cat:'services', catLabel:'Professional Services', price:'$2,000/location', floor:'No discount', desc:'Standard data conversion from legacy PMS.', includes:['Data migration','Mapping & validation','Post-conversion verification'] },
  'PGID Split': { cat:'services', catLabel:'Professional Services', price:'$3,500/split', floor:'No discount', desc:'Split an existing PGID into two or more separate sites.', includes:['PGID split provisioning','Data separation'] },
  'Implementation – Hourly': { cat:'services', catLabel:'Professional Services', price:'$175/hr', floor:'No discount', desc:'Hourly implementation services beyond the standard package.', includes:['Remote configuration & setup'] },
  'Remote Training – Hourly': { cat:'services', catLabel:'Professional Services', price:'$175/hr', floor:'No discount', desc:'Hourly remote training sessions for staff.', includes:['Remote staff training'] },
  'Onsite Training': { cat:'services', catLabel:'Professional Services', price:'$1,500/day + T&E', floor:'No discount', desc:'Onsite training at the practice. Min 2 days.', includes:['On-site trainer','Travel & expenses billed separately'] },
  'Master Trainer Certification': { cat:'services', catLabel:'Professional Services', price:'$2,995 one-time', floor:'No discount', desc:'Certifies an internal staff member as a qualified Denticon trainer for their organization.', includes:['2-day intensive training','Certification exam','Trainer resource kit'] },
  'DentalOS Platform': { cat:'core', catLabel:'Core Platform', price:'Included', floor:'', desc:'DentalOS Layer 1 — always included with every Denticon subscription. The foundational cloud platform layer required for DentalOS features.', includes:['DentalOS cloud infrastructure','Platform access'] },
  'Texting Overages': { cat:'usage', catLabel:'Usage-Based', price:'$0.0087/segment', floor:'Billed monthly', desc:'SMS overage charges beyond the 3,000 segments/mo included in core Denticon and Patient Communication 2-Way SMS.', includes:['Per-segment overage billing'] },
  'Per Claim Usage Beyond Package Limit': { cat:'usage', catLabel:'Usage-Based', price:'$0.046/claim', floor:'Billed monthly', desc:'Per-claim overage for electronic claim submission beyond the 500 claims/mo included in core Denticon.', includes:['Per-claim overage billing'] },
  'Additional Image Storage': { cat:'usage', catLabel:'Usage-Based', price:'$89/1TB', floor:'Billed monthly', desc:'Additional 2D image storage beyond the 1TB included in core Denticon and Imaging+.', includes:['1TB increments','Billed per TB added'] },
  'AutoEligibility Overage': { cat:'usage', catLabel:'Usage-Based', price:'$0.55/check', floor:'Billed monthly', desc:'Per-check overage for batch automated eligibility beyond the AutoEligibility package limit.', includes:['Per-check overage billing'] },
}

export const SF_SKU_GROUPS: { group: string; items: string[] }[] = [
  { group: 'Core', items: ['DentalOS Platform', 'Denticon', 'Cloud 9'] },
  { group: 'Add-on Suites', items: ['Patient+', 'Clinical Voice+', 'Imaging+', 'Payment+'] },
  { group: 'Add-on Products', items: ['DPA – Dashboard Bundle', 'Denticon Data Share / BCP', 'Cloud 9 Data Share', 'Ortho Suite', 'AutoEligibility', 'eClaims Unlimited', 'XVWeb Pro Unlimited', 'Real-Time Eligibility', 'DXC Attachments', 'Patient Communication 2-Way SMS'] },
  { group: 'Usage-Based', items: ['AI Confirmation Agent', 'AI Scheduling Agent', 'Patient Statements', 'Texting Overages', 'Per Claim Usage Beyond Package Limit', 'Additional Image Storage', 'AutoEligibility Overage'] },
  { group: 'Professional Services', items: ['Standard Conversion', 'PGID Split', 'Implementation – Hourly', 'Remote Training – Hourly', 'Onsite Training', 'Master Trainer Certification'] },
]

export const SKU_CAT_COLORS: Record<SkuCat, string> = {
  core: '#1F3864',
  suite: '#117a65',
  addon: '#2E75B6',
  usage: '#7d3c98',
  services: '#b45309',
}

export const MOCK_PGIDS = [
  { id: '46', name: 'Nicholas J. VanDeMoortel, D.D.S., P.C.', offices: ['Main Office – Toledo, OH', 'Westside Location – Toledo, OH'] },
  { id: '49', name: 'Central Ohio Endodontics', offices: ['Columbus – Polaris', 'Columbus – Easton', 'Dublin Location'] },
  { id: '60', name: 'Brian J. Iannaccone, DDS', offices: ['Primary Practice – Pittsburgh, PA'] },
  { id: '61', name: 'Kahana Family Dental Center', offices: ['Kahana Main – Maui, HI', 'Lahaina Satellite – Maui, HI'] },
  { id: '65', name: 'Rock Dental Brands', offices: ['Benton, AR', 'Bryant, AR', 'Conway, AR', 'Fayetteville, AR', 'Fort Smith, AR', 'Hot Springs, AR', 'Jonesboro, AR', 'Little Rock – Chenal', 'Little Rock – Maumelle', 'Rogers, AR', 'Searcy, AR', 'Springdale, AR'] },
  { id: '67', name: 'American Mobile Dental Corp', offices: ['Mobile Unit 1', 'Mobile Unit 2', 'Mobile Unit 3'] },
  { id: '72', name: 'Heartland Dental – Region 5', offices: ['Bloomington, IL', 'Champaign, IL', 'Decatur, IL', 'Peoria, IL', 'Springfield, IL'] },
  { id: '88', name: 'Pacific Dental Services – Pacific NW', offices: ['Bellevue, WA', 'Kirkland, WA', 'Redmond, WA', 'Seattle – Capitol Hill', 'Seattle – SLU', 'Tacoma, WA'] },
  { id: '91', name: 'Aspen Dental – Colorado Group', offices: ['Aurora, CO', 'Boulder, CO', 'Colorado Springs, CO', 'Denver – LoDo', 'Denver – Stapleton', 'Englewood, CO', 'Fort Collins, CO', 'Lakewood, CO'] },
  { id: '103', name: 'Smile Brands – Southwest', offices: ['Albuquerque, NM', 'El Paso, TX', 'Las Vegas – Henderson', 'Las Vegas – Summerlin', 'Phoenix – Ahwatukee', 'Phoenix – Chandler', 'Scottsdale, AZ', 'Tucson, AZ'] },
  { id: '118', name: 'Deca Dental Group', offices: ['Dallas – Deep Ellum', 'Dallas – Uptown', 'Fort Worth, TX', 'Garland, TX', 'Grand Prairie, TX', 'Irving, TX', 'McKinney, TX', 'Plano, TX'] },
  { id: '124', name: 'SmilesForever Orthodontics', offices: ['Asheville, NC', 'Charlotte – Ballantyne', 'Charlotte – SouthPark', 'Greensboro, NC', 'Raleigh – Brier Creek', 'Raleigh – North Hills'] },
]
