import { Reveal } from "@/components/features/landing/reveal"
import { SectionIntro } from "@/components/features/landing/section-intro"

interface Stat {
  figure: string
  label: string
}

const STATS: Stat[] = [
  { figure: "29", label: "years in Nigerian capital markets" },
  {
    figure: "CBN",
    label: "regulated infrastructure — not a compliance wrapper",
  },
  {
    figure: "2",
    label: "consumer apps, Afrinvestor and PlutusNeo, run on this platform",
  },
]

interface Reason {
  number: string
  heading: string
  body: string
}

const REASONS: Reason[] = [
  {
    number: "01",
    heading: "Regulated foundation",
    body: "Built on Afrinvest's CBN-regulated infrastructure. Compliance, custody, and ledgering handled by an institution with a 29-year track record in Nigerian financial markets.",
  },
  {
    number: "02",
    heading: "Sandbox-first, always",
    body: "Your test environment is live before your business verification completes. Integration and approval happen in parallel — not sequentially.",
  },
  {
    number: "03",
    heading: "Configurable, not rigid",
    body: "KYC tiers, wallet products, and verification providers are all configurable to your product's requirements — not locked to a single opinionated setup.",
  },
  {
    number: "04",
    heading: "Built to scale with you",
    body: "Multi-tenant architecture means your infrastructure grows without re-platforming. Add products, adjust tiers, and onboard new customer segments from the same dashboard.",
  },
]

/** The differentiation section — the senior person in the room speaks. */
export function WhySection() {
  return (
    <section
      id="why-afrinvest"
      className="relative scroll-mt-20 overflow-hidden bg-(--ink)"
    >
      <div
        aria-hidden="true"
        className="landing-noise absolute inset-0 opacity-[0.045]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <SectionIntro
            tone="dark"
            label="Why Afrinvest Connect"
            headline={
              <>
                Infrastructure you can{" "}
                <em className="font-serif font-normal italic">trust</em> at
                scale
              </>
            }
            subheading="We're not a startup building financial infrastructure on top of another startup. Afrinvest Connect is built on 29 years of capital markets experience, with compliance and custody already solved."
          />
        </Reveal>

        {/* Track-record band — the numbers do the talking */}
        <Reveal delay={90}>
          <dl className="mt-14 grid grid-cols-1 gap-8 border-y border-white/12 py-10 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-white/12">
            {STATS.map((stat) => (
              <div
                key={stat.figure}
                className="sm:px-10 sm:first:pl-0 sm:last:pr-0"
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-serif text-5xl text-(--gold) tabular-nums">
                  {stat.figure}
                </dd>
                <dd className="mt-2 max-w-52 text-sm text-pretty text-white/60">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-12 sm:grid-cols-2">
          {REASONS.map((reason, index) => (
            <Reveal key={reason.number} delay={index * 90}>
              <div className="flex gap-5">
                <span className="font-mono text-xs font-medium text-(--gold) tabular-nums">
                  {reason.number}
                </span>
                <div className="border-l border-white/12 pl-5">
                  <h3 className="text-lg font-semibold tracking-tight text-white">
                    {reason.heading}
                  </h3>
                  <p className="mt-2 text-sm text-pretty text-white/65">
                    {reason.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
