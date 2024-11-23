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
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchSearchParams() {
      try {
        const params = await props.searchParams;
        setSearchParams(params);
      } catch (error) {
        console.error("Error fetching search params:", error);
        setFormError("Failed to load form data");
      }
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

  const validateForm = (formData: FormData): string | null => {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const fullName = formData.get("fullName")?.toString();
    
    if (!email || !password || !fullName || !selectedRole) {
      return "All fields are required";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }

    if (selectedRole === 'student') {
      const age = formData.get("age")?.toString();
      const grade = formData.get("grade")?.toString();
      const school = formData.get("school")?.toString();
      
      if (!age || !grade || !school) {
        return "All student fields are required";
      }
      
      const ageNum = parseInt(age);
      if (isNaN(ageNum) || ageNum < 5 || ageNum > 22) {
        return "Age must be between 5 and 22";
      }
    }

    return null;
  };

  const handleRoleChange = (value: 'counsellor' | 'student') => {
    setSelectedRole(value);
    setFormError(null); // Clear any existing errors
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      const formElement = event.target as HTMLFormElement;
      const formData = new FormData(formElement);
      
      // Client-side validation
      const validationError = validateForm(formData);
      if (validationError) {
        setFormError(validationError);
        setIsSubmitting(false);
        return;
      }

      // Add the selected role to form data
      if (selectedRole) {
        formData.set('role', selectedRole);
      }

      const result = await signUpAction(formData);
      
      // Log the result for debugging
      console.log("Signup result:", result);
      
    } catch (error) {
      console.error("An error occurred during sign-up:", error);
      setFormError(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
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
          
          {formError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {formError}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-lg">Email</Label>
              <Input 
                name="email" 
                type="email"
                placeholder="you@example.com" 
                className="mt-1" 
                required 
                onChange={() => setFormError(null)}
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
                onChange={() => setFormError(null)}
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
              <input type="hidden" name="role" value={selectedRole || ''} required />
            </div>

            {selectedRole === 'counsellor' && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="fullName" className="text-lg">Full Name</Label>
                  <Input 
                    name="fullName" 
                    placeholder="Dr. Jane Smith" 
                    required 
                    onChange={() => setFormError(null)}
                  />
                </div>
              </div>
            )}

            {selectedRole === 'student' && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="fullName" className="text-lg">Full Name</Label>
                  <Input 
                    name="fullName" 
                    placeholder="Your full name" 
                    required 
                    onChange={() => setFormError(null)}
                  />
                </div>

                <div>
                  <Label htmlFor="age" className="text-lg">Age</Label>
                  <Input 
                    name="age" 
                    placeholder="Age" 
                    type="number" 
                    min="5" 
                    max="22" 
                    required 
                    onChange={() => setFormError(null)}
                  />
                </div>

                <div>
                  <Label htmlFor="grade" className="text-lg">Grade</Label>
                  <Input 
                    name="grade" 
                    placeholder="Your current grade" 
                    required 
                    onChange={() => setFormError(null)}
                  />
                </div>

                <div>
                  <Label htmlFor="school" className="text-lg">School</Label>
                  <Input 
                    name="school" 
                    placeholder="Your school name" 
                    required 
                    onChange={() => setFormError(null)}
                  />
                </div>
              </div>
            )}

            <SubmitButton 
              pendingText="Creating your account..."
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90"
              disabled={!selectedRole || isSubmitting}
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