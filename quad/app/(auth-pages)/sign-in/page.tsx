import React from "react";
import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { Mail, MapPin, Phone } from "lucide-react";

const navItems = ["Home", "About", "Services", "Contact Us"];
const services = ["Psychotherapy", "Mental Counseling", "Support Groups", "Case Management"];
const contactInfo = [
  { icon: Phone, text: "+14 5464 8272" },
  { icon: Mail, text: "rona@domain.com" },
  { icon: MapPin, text: "Lazyy Tower 192, Burn Swiss" },
];
const links = ["Privacy Policy", "Term Of Use"];

export default async function LoginScreen(props: { searchParams: Promise<Message> }): Promise<JSX.Element> {
  const searchParams = await props.searchParams;

  return (
    <div className="w-full min-h-screen bg-primary-bg">
      <div className="max-w-[1440px] mx-auto relative">
        {/* Navigation */}
        <nav className="flex items-center justify-between py-10 px-8">
          <div className="flex items-center gap-4">
            <div className="w-[50px] h-[50px] bg-white rounded-full" />
            <span className="text-[#ffffff4c] font-h5">QUAD</span>
          </div>

          <NavigationMenu>
            <NavigationMenuList className="flex gap-12">
              {navItems.map((item) => (
                <NavigationMenuItem key={item}>
                  <NavigationMenuLink className="text-txt text-lg">{item}</NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <Button className="bg-x-2 rounded-full px-12 py-4">Login / Signup</Button>
        </nav>

        {/* Main Content */}
        <main className="flex justify-between px-8 mt-16">
          <div className="flex items-center gap-4">
            <div className="w-48 h-[191px] bg-white rounded-xl" />
            <h1 className="text-white text-[90px] font-bold">QUAD</h1>
          </div>

          <Card className="w-[477px] bg-secondary-bg shadow-lg">
            <CardContent className="p-12 space-y-6">
              <form className="space-y-6" action={signInAction}>
                <Label htmlFor="email">Email</Label>
                <Input name="email" placeholder="you@example.com" required className="h-[50px] border-[#8a8d91]" />

                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link className="text-xs text-foreground underline" href="/forgot-password">
                    Forgot Password?
                  </Link>
                </div>
                <Input type="password" name="password" placeholder="Your password" required className="h-[50px] border-[#8a8d91]" />

                <SubmitButton pendingText="Signing In..." className="w-full h-[50px] bg-[#007d6e]">
                  Login
                </SubmitButton>
                <FormMessage message={searchParams} />
              </form>

              <Separator />
              <Button className="w-full h-[50px] bg-[#43a42f]">Create new account</Button>
            </CardContent>
          </Card>
        </main>

        {/* Footer */}
        <footer className="mt-32 bg-gradient-to-b from-[#007D6E] to-[#5EB47C] text-white p-16">
          <div className="max-w-[980px] mx-auto grid grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-20 h-20 bg-white rounded-full" />
                <span className="text-2xl font-bold">Mindfulcare</span>
              </div>
              <p className="text-lg">
                Lorem ipsum dolor sit amet consectetur. Convallis est urna.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-8">Services</h3>
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service} className="text-lg">
                    {service}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-8">Contact</h3>
              <div className="space-y-5">
                {contactInfo.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-5">
                    <Icon size={32} />
                    <span className="text-lg">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-8">Links</h3>
              <div className="space-y-4">
                {links.map((link) => (
                  <div key={link} className="text-lg">
                    {link}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator className="my-16" />
          <div className="text-center text-lg">
            copyright 2023 @mindfulcare all right reserved
          </div>
        </footer>
      </div>
    </div>
  );
}
