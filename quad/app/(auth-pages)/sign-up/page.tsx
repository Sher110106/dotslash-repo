'use client'
import { useState, useEffect } from "react";
import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default function Signup(props: { searchParams: Promise<Message>; }) {
  const [searchParams, setSearchParams] = useState<Message | null>(null);
  const [selectedRole, setSelectedRole] = useState<'counsellor' | 'student' | null>(null);

  useEffect(() => {
    async function fetchSearchParams() {
      const params = await props.searchParams;
      setSearchParams(params);
    }
    fetchSearchParams();
  }, [props.searchParams]);

  if (searchParams && "message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  const handleRoleChange = (value: 'counsellor' | 'student') => {
    setSelectedRole(value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.target as HTMLFormElement);
      await signUpAction(formData);
    } catch (error) {
      console.error("An error occurred during sign-up:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-800 to-white">
      <div className="container mx-auto px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto"
        >
          <h1 className="text-3xl font-bold text-primary mb-2 text-black">Welcome!</h1>
          <p className="text-gray-600 mb-8">
            Join our mental wellness community
          </p>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-lg">Email</Label>
              <Input 
                name="email" 
                placeholder="you@example.com" 
                className="mt-1" 
                required 
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-lg">Password</Label>
              <Input
                type="password"
                name="password"
                placeholder="Create a secure password"
                className="mt-1"
                minLength={6}
                required
              />
            </div>

            <div>
              <Label className="text-lg">I am a...</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => handleRoleChange('student')}
                  className={`p-4 rounded-lg border-2 ${
                    selectedRole === 'student'
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200'
                  }`}
                >
                  <h3 className="font-semibold">Student</h3>
                  <p className="text-sm text-gray-600">Get support and guidance</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('counsellor')}
                  className={`p-4 rounded-lg border-2 ${
                    selectedRole === 'counsellor'
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200'
                  }`}
                >
                  <h3 className="font-semibold">Counsellor</h3>
                  <p className="text-sm text-gray-600">Provide support</p>
                </button>
              </div>
            </div>

            {selectedRole === 'counsellor' && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="fullName" className="text-lg">Full Name</Label>
                  <Input name="fullName" placeholder="Dr. Jane Smith" required />
                </div>
              </div>
            )}

            {selectedRole === 'student' && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="fullName" className="text-lg">Full Name</Label>
                  <Input name="fullName" placeholder="Your full name" required />
                </div>

                <div>
                  <Label htmlFor="age" className="text-lg">Age</Label>
                  <Input name="age" placeholder="Age" type="number" min="5" max="22" required />
                </div>

                <div>
                  <Label htmlFor="grade" className="text-lg">Grade</Label>
                  <Input name="grade" placeholder="Your current grade" required />
                </div>

                <div>
                  <Label htmlFor="school" className="text-lg">School</Label>
                  <Input name="school" placeholder="Your school name" required />
                </div>
              </div>
            )}

            <SubmitButton 
              pendingText="Creating your account..."
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90"
            >
              Create Account
            </SubmitButton>

            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
      <SmtpMessage />
    </div>
  );
}