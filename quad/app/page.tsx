import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Mail, MapPin, Phone } from "lucide-react";
import React from "react";
import Image from "next/image";
import g8 from "@/app/g8.png";
import first from "@/app/first.png";

const navItems = [
  { label: "Home", href: "#" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact Us", href: "#contact" },
];

const stats = [
  { label: "Experienced", value: "8+" },
  { label: "Teams", value: "122+" },
  { label: "Clients", value: "563+" },
  { label: "Project Done", value: "232+" },
];

const services = [
  {
    title: "Mental Counseling",
    description: "Lorem ipsum dolor sit amet consectetur Convallis est",
  },
  {
    title: "Psychotherapy",
    description: "Lorem ipsum dolor sit amet consectetur Convallis est",
  },
  {
    title: "Support Groups",
    description: "Lorem ipsum dolor sit amet consectetur Convallis est",
  },
];

const faqs = [
  {
    question: "What is a mental health consultant?",
    answer: "Lorem ipsum dolor sit amet consectetur. Convallis est urna adipiscing fringilla nulla diam lorem non mauris.",
  },
  {
    question: "What services do you offer as a mental health consultant?",
    answer: "Lorem ipsum dolor sit amet consectetur. Convallis est urna adipiscing fringilla nulla diam lorem non mauris.",
  },
  {
    question: "How can I benefit from working with a mental health consultant?",
    answer: "Lorem ipsum dolor sit amet consectetur. Convallis est urna adipiscing fringilla nulla diam lorem non mauris.",
  },
  {
    question: "What types of issues can a mental health consultant help with?",
    answer: "Lorem ipsum dolor sit amet consectetur. Convallis est urna adipiscing fringilla nulla diam lorem non mauris.",
  },
];

export default function Page() {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="min-h-screen bg-bg">
              {/* Navigation */}
              <header className="container mx-auto py-5">
                <nav className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Image src={g8} alt="Logo" width={40} height={40} />
                    <div className="text-3xl font-bold text-[#5BE38B]">QUAD</div>
                  </div>
                  <NavigationMenu>
                    <NavigationMenuList>
                      {navItems.map((item) => (
                        <NavigationMenuItem key={item.label}>
                          <NavigationMenuLink
                            href={item.href}
                            className="px-4 py-2 text-txt hover:text-x-2 transition-colors"
                          >
                            {item.label}
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      ))}
                    </NavigationMenuList>
                  </NavigationMenu>
                  <Button className="bg-x-2 text-white hover:bg-x-2/90">
                    Login/Sign Up
                  </Button>
                </nav>
              </header>

              {/* Hero Section */}
              <section className="container mx-auto py-20">
                <div className="grid grid-cols-2 gap-20">
                  <div className="flex flex-col gap-8">
                    <h1 className="font-h1 text-[68px] leading-tight">
                      Healthy Minds, Happy Lives,{" "}
                      <span className="text-x-2">Mental Health</span> Solutions
                    </h1>
                    <p className="font-body1-light text-txt max-w-xl">
                      "It's perfectly okay to feel sad, angry, annoyed, frustrated,
                      scared, or anxious. Having feelings doesn't make you a 'negative
                      person.' It makes you human".
                      <br />~ Lori Deschene
                    </p>
                    <Button className="bg-x-2 text-white hover:bg-x-2/90 w-fit">
                      Get started
                    </Button>
                  </div>
                  <div>
                    <Image src={first} alt="Hero image" width={800} height={800} />
                  </div>
                </div>
              </section>

              {/* Stats Section */}
              <section className="bg-gradient-to-r from-[#007D6E] to-[#5EB476] py-12">
                <div className="container mx-auto">
                  <div className="grid grid-cols-4 gap-8">
                    {stats.map((stat) => (
                      <div key={stat.label} className="text-center text-white">
                        <p className="font-h6 mb-2">{stat.label}</p>
                        <p className="font-h1">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Services Section */}
              <section className="container mx-auto py-20">
                <div className="text-center mb-16">
                  <p className="font-h6 text-black mb-4">Services</p>
                  <h2 className="font-h2 text-black">
                    Empowering Minds Our Mental Health Consulting Services
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-8">
                  {services.map((service) => (
                    <Card key={service.title} className="rounded-[30px] overflow-hidden">
                      <CardContent className="p-8">
                        <CardTitle className="font-h5 text-white text-center mb-4">
                          {service.title}
                        </CardTitle>
                        <p className="text-white text-center font-body1-light">
                          {service.description}
                        </p>
                        <Button className="bg-x-2 text-white hover:bg-x-2/90 mt-8 mx-auto block">
                          See detail
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* FAQ Section */}
              <section className="container mx-auto py-20">
                <div className="text-center mb-16">
                  <p className="font-h6 text-white mb-4">FAQ</p>
                  <h2 className="font-h2 text-white">
                    Navigating Mental Health Consultation Commonly Asked Questions
                  </h2>
                </div>

                <Accordion
                  type="single"
                  collapsible
                  className="w-full max-w-3xl mx-auto"
                >
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="font-h5 text-white">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="font-body1-light text-white">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>

              {/* Footer */}
              <footer className="bg-gradient-to-r from-[#007D6E] to-[#5EB476] text-white py-20">
                <div className="container mx-auto">
                  <div className="grid grid-cols-5 gap-8">
                    <div className="col-span-2">
                      <div className="text-3xl font-bold mb-6">Mindfulcare</div>
                      <p className="font-body1-light max-w-sm">
                        Lorem ipsum dolor sit amet consectetur. Convallis est urna.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-h5 mb-6">Contact</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Phone className="w-6 h-6" />
                          <span>+14 5464 8272</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="w-6 h-6" />
                          <span>rona@domain.com</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-6 h-6" />
                          <span>Lazyy Tower 192, Burn Swiss</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-h5 mb-6">Newsletter</h3>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Your email"
                          className="bg-transparent border-white text-white placeholder:text-white"
                        />
                        <Button className="bg-x-2 text-white hover:bg-x-2/90">
                          Subscribe
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-20 text-center font-body1-light">
                    copyright 2023 @mindfulcare all right reserved
                  </div>
                </div>
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
