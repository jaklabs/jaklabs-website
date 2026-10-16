import { Hero, Services, Industries, WhyChooseUs, CTA, ProductStrip } from '@/components/sections'

/**
 * ⚠️ SERVICES SITS ABOVE INDUSTRIES, AND THE ORDER IS THE POINT.
 *
 * It ran Hero → Industries → Services until 2026-10-15, which put the offers
 * and the prices — the thing a visitor came to find — in the third section,
 * behind a full-screen hero and a whole section about who else I work with.
 * Industries is reassurance; Services is the answer. A reader in a Facebook
 * group put it plainly: "if I have to scroll more than 3-4 times to get what
 * I'm looking for you've already lost me."
 *
 * The CTA stays last of the selling sections, and ProductStrip stays below it —
 * see ProductStrip for why that placement is deliberate rather than leftover.
 */
export default function Home() {
    return (
        <>
            <Hero />
            <Services />
            <Industries />
            <WhyChooseUs />
            <CTA />
            <ProductStrip />
        </>
    )
}
