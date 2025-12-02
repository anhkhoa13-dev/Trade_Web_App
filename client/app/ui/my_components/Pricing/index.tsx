import { Button } from '@/app/ui/shadcn/button'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { pricingPlans } from './pricingData'

export default function Pricing() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-4">
                <div className="mx-auto max-w-2xl space-y-6 text-center">
                    <h1 className="text-center text-4xl font-semibold lg:text-5xl">
                        Pricing that Scales with You
                    </h1>
                    <p>
                        Choose the plan that fits your trading style — from basic tools to AI-powered insights.
                    </p>
                </div>

                <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-5 md:gap-0">
                    {pricingPlans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`rounded-(--radius) flex flex-col justify-between space-y-8 border p-6 lg:p-10
                ${plan.id === 'free'
                                    ? 'md:col-span-2 md:my-2 md:rounded-r-none md:border-r-0'
                                    : 'md:col-span-3 dark:bg-muted shadow-lg shadow-gray-950/5 dark:[--color-muted:var(--color-zinc-900)]'
                                }`}
                        >
                            <div className={plan.highlight ? 'grid gap-6 sm:grid-cols-2' : 'space-y-4'}>
                                {/* Left Section */}
                                <div className="space-y-4">
                                    <div>
                                        <h2 className="font-medium">{plan.name}</h2>
                                        <span className="my-3 block text-2xl font-semibold">
                                            {plan.price}
                                        </span>
                                        <p className="text-muted-foreground text-sm">{plan.billing}</p>
                                    </div>

                                    <Button
                                        asChild
                                        variant={plan.id === 'free' ? 'outline' : 'default'}
                                        className="w-full"
                                    >
                                        <Link href="">Get Started</Link>
                                    </Button>

                                    {!plan.highlight && <hr className="border-dashed" />}
                                </div>

                                {/* Features */}
                                <div>
                                    {plan.highlight && (
                                        <div className="text-sm font-medium">
                                            Everything in Free plus:
                                        </div>
                                    )}
                                    <ul className={`mt-4 list-outside space-y-3 text-sm ${!plan.highlight && 'mt-0'}`}>
                                        {plan.features.map((item, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                                <Check className="size-3" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
