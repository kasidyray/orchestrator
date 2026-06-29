interface StepSectionProps {
  title: string
  description?: string
  children: React.ReactNode
}

/**
 * Secondary section within a wizard step — the "Next, …" headings that group a
 * follow-on set of fields under the step's primary heading.
 */
export function StepSection({ title, description, children }: StepSectionProps) {
  return (
    <section className="flex flex-col gap-5 border-t border-border pt-7">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h3>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}
