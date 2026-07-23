import { Reveal } from "@/components/features/landing/reveal"
import { SectionIntro } from "@/components/features/landing/section-intro"

interface IntegrationStep {
  number: string
  heading: string
  body: string
}

const STEPS: IntegrationStep[] = [
  {
    number: "01",
    heading: "Register your organisation",
    body: "Create an account, and your sandbox environment is provisioned immediately — no waiting, no approval.",
  },
  {
    number: "02",
    heading: "Configure your product",
    body: "Set your KYC tiers, choose wallet products, register your webhook, and generate API keys — all from the dashboard.",
  },
  {
    number: "03",
    heading: "Integrate and test",
    body: "Your developers build against the sandbox API. Full reference documentation, real event webhooks, and a working cURL example on day one.",
  },
  {
    number: "04",
    heading: "Verify your business and go live",
    body: "Submit your business verification documents. Once approved, your live environment is provisioned automatically — no engineering effort required.",
  },
]

/** Four steps from signup to production — makes the integration feel achievable. */
export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 bg-linear-to-b from-white to-(--wash)"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <SectionIntro
            label="How it works"
            headline={
              <>
                From signup to production in{" "}
                <em className="font-serif font-normal italic">four steps</em>
              </>
            }
            subheading="Your sandbox is live the moment you register. Go-live follows your timeline — not ours."
          />
        </Reveal>
        <ol className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.number}>
              <Reveal delay={index * 90} className="relative pt-6">
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-0 h-px w-full bg-linear-to-r from-(--brand)/50 via-(--line) to-transparent"
                />
                <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 font-mono text-xs font-medium text-(--brand) shadow-sm ring-1 ring-(--brand)/20">
                  {step.number}
                </span>
                <h3 className="mt-4 text-base font-semibold tracking-tight text-(--ink)">
                  {step.heading}
                </h3>
                <p className="mt-2 text-sm text-pretty text-(--ink-soft)">
                  {step.body}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
