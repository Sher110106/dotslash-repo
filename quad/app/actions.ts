"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
// Type definitions for better type safety


export const signUpAction = async (formData: FormData) => {
  const supabase = await createClient();
  
  try {
    // Extract form data
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();
    const fullName = formData.get("fullName")?.toString().trim();
    const role = formData.get("role")?.toString();
    const age = formData.get("age")?.toString();
    const grade = formData.get("grade")?.toString()?.trim();
    const school = formData.get("school")?.toString()?.trim();

    console.log("Starting signup process with data:", {
      email,
      role,
      fullName,
      hasAge: !!age,
      hasGrade: !!grade,
      hasSchool: !!school
    });

    // Validation
    if (!email || !password || !fullName || !role) {
      return encodedRedirect(
        "error",
        "/sign-up",
        "All fields are required"
      );
    }

    if (role === 'student' && (!age || !grade || !school)) {
      return encodedRedirect(
        "error",
        "/sign-up",
        "All student fields are required"
      );
    }

    // Get base URL for email verification
    const headersList = await headers();
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = headersList.get("host");
    const baseUrl = `${protocol}://${host}`;

    // Create user account
    console.log("Creating user account...");
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${baseUrl}/auth/callback`,
        data: {
          full_name: fullName,
          role: role
        }
      }
    });

    if (signUpError) {
      console.error("Signup error:", signUpError);
      return encodedRedirect("error", "/sign-up", signUpError.message);
    }

    if (!signUpData.user) {
      console.error("No user data returned");
      return encodedRedirect("error", "/sign-up", "Failed to create account");
    }

    const { user } = signUpData;
    console.log("User created successfully with ID:", user.id);

    // Create base profile with explicit schema check
    const baseProfile = {
      id: user.id,
      full_name: fullName,
      role: role,
      email: email,  // Adding email to profile for easier querying
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log("Attempting to create base profile:", baseProfile);
    
    // First, check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (existingProfile) {
      console.log("Profile already exists for user:", user.id);
    } else {
      // Create new profile with error logging
      const { error: profileError, data: profileData } = await supabase
        .from('profiles')
        .insert([baseProfile])
        .select()
        .single();

      if (profileError) {
        console.error("Detailed profile creation error:", {
          code: profileError.code,
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint
        });
        
        // Cleanup: Sign out user since profile creation failed
        await supabase.auth.signOut();
        return encodedRedirect("error", "/sign-up", `Profile creation failed: ${profileError.message || 'Unknown error'}`);
      }

      console.log("Base profile created successfully:", profileData);
    }

    // Create role-specific profile
    if (role === 'student') {
      const studentProfile = {
        id: user.id,
        full_name: fullName,
        age: age ? parseInt(age, 10) : null,
        grade: grade,
        school: school,
        created_at: new Date().toISOString()
      };

      console.log("Creating student profile:", studentProfile);
      
      const { error: studentError } = await supabase
        .from('student_profiles')
        .insert([studentProfile]);

      if (studentError) {
        console.error("Student profile creation error:", studentError);
        return encodedRedirect("error", "/sign-up", `Student profile creation failed: ${studentError.message}`);
      }
    } else if (role === 'counsellor') {
      const counsellorProfile = {
        id: user.id,
        full_name: fullName,
        created_at: new Date().toISOString()
      };

      console.log("Creating counsellor profile:", counsellorProfile);
      
      const { error: counsellorError } = await supabase
        .from('counsellor_profiles')
        .insert([counsellorProfile]);

      if (counsellorError) {
        console.error("Counsellor profile creation error:", counsellorError);
        return encodedRedirect("error", "/sign-up", `Counsellor profile creation failed: ${counsellorError.message}`);
      }
    }

    console.log("Signup process completed successfully");
    return encodedRedirect(
      "success",
      "/sign-in",
      "Thanks for signing up! Please check your email for a verification link."
    );

  } catch (error) {
    console.error("Unexpected error during signup:", error);
    return encodedRedirect(
      "error", 
      "/sign-up", 
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
};
export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
