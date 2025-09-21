//import { Background, Companies, Connect, Container, CTA, Features, Hero, Perks, Pricing, Reviews, Wrapper } from "@/components";
//import { Spotlight } from "@/components/ui/spotlight";
import Background from "@/components/Background";
import Wrapper from "@/components/Wrapper";
import Container from "@/components/Container";
import Hero from "@/components/Hero";
import Companies from "@/components/Companies";
import Connect from "@/components/Connect";
import Features from "@/components/Features";
import Perks from "@/components/Perks";
import Pricing from "@/components/Pricing";
import Reviews from "@/components/Reviews";
import CTA from "@/components/CTA";
import { Spotlight } from "@/components/ui/spotlight";
import Waitlist from "@/components/Waitlist";

export default function Home() {
  return (
    <Background>
            {<Wrapper className="py-20 relative">
                <Container className="relative">
                    <Spotlight
                        className="-top-40 left-0 md:left-60 md:-top-20"
                        fill="rgba(255, 255, 255, 0.5)"
                    />
                    <Hero />
                </Container>
                {/*<Container className="py-8 lg:py-20">
                    <Companies />
                </Container>*/}
                <Connect />
                <Features />
                <Perks />
                {/*<Pricing />*/}
                {/*<Reviews />*/}
                <CTA />
                <Waitlist />
            </Wrapper>}
    </Background>
  );
}
