import { Hero, Services, Industries, WhyChooseUs, CTA, HoodDev, Verdikt } from '@/components/sections'

export default function Home() {
    return (
        <>
            <Hero />
            <Industries />
            <Services />
            <WhyChooseUs />
            <CTA />
            {/* The two products, mirrored — Hood Dev left, Verdikt right.
                Both sit after the CTA on purpose; see ProductSpotlight for why. */}
            <HoodDev />
            <Verdikt />
        </>
    )
}
