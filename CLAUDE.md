# SKU Bundle Manager

Internal tool for codifying institutional knowledge — which Denticon site features get enabled when a Salesforce SKU is sold. Replaces tribal knowledge with a structured, queryable source of truth that can eventually drive automated provisioning.

## Stack

- **Frontend**: Vite + React 19 + TypeScript + Tailwind CSS
- **Backend**: Express on port 3001 (proxied via Vite)
- **Database**: SQLite via `better-sqlite3` — file lives at `data/bundles.db`
- **Component library**: `@planetdds/ui`
- **Icons**: `@untitledui/icons`

## Dev

```bash
npm install
npm run dev        # starts both Vite (5173) and Express API (3001)
npm run dev:client # frontend only
npm run dev:api    # backend only
```

## Project structure

```
src/
  pages/       # Route-level page components
  components/  # Shared UI components
  lib/         # api.ts (typed fetch wrapper), shared utilities
server/
  routes/      # Express route handlers
  db/          # database.ts (SQLite init + connection)
data/           # bundles.db lives here (gitignored)
```

## Data model

```ts
type Bundle = {
  id: number
  name: string
  sku: string | null        // links to Salesforce SKU catalog
  notes: string | null      // institutional knowledge, edge cases, dependencies
  features: string[]        // Denticon site feature keys
  created_at: string
  updated_at: string
}
```

Features are stored as a JSON array of key strings matching Denticon's admin panel feature keys.

## API routes

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/bundles | List all bundles |
| GET | /api/bundles/:id | Get single bundle |
| POST | /api/bundles | Create bundle |
| PATCH | /api/bundles/:id | Update bundle |
| DELETE | /api/bundles/:id | Delete bundle |

---

## Planet UI — Build Gate (Non-Negotiable)

This project uses `@planetdds/ui` as its React component library and `@untitledui/icons` for all iconography. Before writing any UI element, follow this checklist:

### Before writing ANY element:
1. Does `@planetdds/ui` have this component? → Import and use it. Never hand-roll it.
2. Does `@untitledui/icons` have this icon? → Import and use it. Never write a custom SVG.
3. Am I about to write a `<svg>` tag? → STOP. Find the Untitled UI icon instead.
4. Am I about to write a styled `<div>` that acts as a component? → STOP. Check Planet UI first.

### Hard rules:
- No custom SVG icons — ever
- No hand-rolled icon containers — use `FeaturedIcon` from `@planetdds/ui`
- No custom button, badge, tab, table, or input implementations
- No hardcoded color values for UI states — use design tokens or Planet UI component props
- Always `import { X } from '@planetdds/ui'` before considering a custom implementation
- Always `import { X } from '@untitledui/icons'` for every icon, every time

If Planet UI doesn't have what you need, state it explicitly:
"Planet UI doesn't have [X], so I'm building a custom implementation because..."

### Key components available in @planetdds/ui:
Button, Badge, BadgeWithIcon, Tabs, Select, SelectItem, Input, TextArea, Toggle,
Checkbox, ComboBox, FeaturedIcon, PageHeaderSimple, Breadcrumbs, BreadcrumbItem,
ProgressBarBase, RadioButtonBase, SlideoutMenu, VideoPlayer, ButtonGroup, ButtonGroupItem

### Key icon imports from @untitledui/icons:
All icons follow PascalCase naming (e.g. ArrowRight, CheckCircle, Settings01, HomeLine).
Always check the library before assuming an icon doesn't exist.

### Tailwind + CSS patterns:
- Use Tailwind utility classes for layout, spacing, and typography
- For hover states on cards that need a border + shadow treatment, use a CSS class
  in `src/index.css` rather than inline Tailwind hover variants:

  ```css
  .my-card {
    border: 1px solid #e4e7ec;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    transition: border-color 150ms ease, box-shadow 150ms ease;
  }
  .my-card:hover {
    border-color: #c8d0da;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
  ```

- For hover-reveal patterns, use Tailwind's `group` / `group-hover` utilities:
  ```tsx
  <div className="group ...">
    <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
  </div>
  ```

### Segmented toggle pattern:
```tsx
<div className="flex rounded-full p-1 w-full h-[42px]" style={{ backgroundColor: '#f2f4f7' }}>
  {options.map((option) => (
    <button
      key={option.id}
      type="button"
      onClick={() => setSelected(option.id)}
      className="flex-1 h-full rounded-full text-sm font-semibold transition-all duration-150"
      style={selected === option.id
        ? { backgroundColor: '#ffffff', color: '#2563eb', boxShadow: '0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)' }
        : { backgroundColor: 'transparent', color: '#667085' }
      }
    >
      {option.label}
    </button>
  ))}
</div>
```

### FeaturedIcon usage:
```tsx
<FeaturedIcon size="md" color="brand" icon={SomeIcon} />
```
Valid colors: `'brand' | 'success' | 'warning' | 'error' | 'gray'`

### Design token colors:
- Text primary:    `#101828`
- Text secondary:  `#344054`
- Text tertiary:   `#667085`
- Border default:  `#e4e7ec`
- Border hover:    `#c8d0da`
- Brand blue:      `#2563eb`
- Success green:   `#17b26a`
- Background page: `#f8f9fb`
- Background card: `#ffffff`
