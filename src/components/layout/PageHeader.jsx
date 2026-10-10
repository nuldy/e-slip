import { cn } from "cn"

/**
 * Reusable page header banner component.
 * Renders a dark red banner with title and optional subtitle,
 * matching the mobile app's header design.
 *
 * @param {object} props
 * @param {string} props.title - Primary heading text
 * @param {string} [props.subtitle] - Secondary description text
 * @param {string} [props.className] - Additional CSS classes
 */
function PageHeader({ title, subtitle, className }) {
  return (
    <div
      className={cn(
        "w-full rounded-b-xl bg-brand px-6 py-5 text-brand-foreground",
        className
      )}
    >
      <h1 className="text-xl font-bold">{title}</h1>
      {subtitle && (
        <p className="mt-1 text-sm text-brand-foreground/80">{subtitle}</p>
      )}
    </div>
  )
}

export { PageHeader }

