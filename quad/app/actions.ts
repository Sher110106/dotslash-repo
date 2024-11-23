"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import {redirect} from "next/navigation"

export const signUpAction = async (formData: FormData) => {
  const supabase = await createClient();

  const age = formData.get("age")?.toString();
  const grade = formData.get("grade")?.toString()?.trim();
  const school = formData.get("school")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const role = formData.get("role")?.toString();
  const fullName = formData.get("fullName")?.toString();

  if (!email || !password || !fullName || !role) {
    return encodedRedirect("error", "/sign-up", "All fields are required.");
  }

  if (role === "student" && (!age || !grade || !school)) {
    return encodedRedirect("error", "/sign-up", "All student fields are required.");
  }

  if (role !== "student" && role !== "counsellor") {
    return encodedRedirect("error", "/sign-up", "Invalid role provided.");
  }

  const headersList = await headers();
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const host = headersList.get("host");
  const baseUrl = `${protocol}://${host}`;

  // Create Supabase user account
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${baseUrl}/auth/callback`,
    },
  });

  if (signUpError) {
    console.error("Signup error:", signUpError);
    return encodedRedirect("error", "/sign-up", signUpError.message);
  }

  const { user } = signUpData;

  if (!user) {
    console.error("No user data returned from Supabase.");
    return encodedRedirect("error", "/sign-up", "Failed to create account.");
  }

  const userId = user.id;

  // Insert into Users table
  const baseProfile = {
    id: userId,
    role,
    email,
    created_at: new Date().toISOString(),
  };

  const { error: profileError } = await supabase.from("users").insert(baseProfile).select();

  if (profileError) {
    console.error("Base profile creation error:", profileError);
    await supabase.auth.signOut();
    return encodedRedirect(
      "error",
      "/sign-up",
      `User profile creation failed: ${profileError.message}`
    );
  }

  // Insert into role-specific table
  if (role === "student") {
    const studentProfile = {
      userid:userId,
      fullname:fullName,
      email,
      age: age ? parseInt(age, 10) : null,
      grade,
      school,
      created_at: new Date().toISOString(),
    };

    const { error: studentError } = await supabase
      .from("students")
      .insert(studentProfile)
      .select();

    if (studentError) {
      console.error("Student profile creation error:", studentError);
      return encodedRedirect(
        "error",
        "/sign-up",
        `Student profile creation failed: ${studentError.message}`
      );
    }
  } else if (role === "counsellor") {
    const counsellorProfile = {
      userid:userId,
      fullname:fullName,
      email,
      created_at: new Date().toISOString(),
    };

    const { error: counsellorError } = await supabase
      .from("counsellors")
      .insert(counsellorProfile)
      .select();

    if (counsellorError) {
      console.error("Counsellor profile creation error:", counsellorError);
      return encodedRedirect(
        "error",
        "/sign-up",
        `Counsellor profile creation failed: ${counsellorError.message}`
      );
    }
  }

  console.log("Signup process completed successfully for user:", userId);
  return encodedRedirect(
    "success",
    "/sign-in",
    "Thanks for signing up! Please check your email for a verification link."
  );
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
export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) {
    return encodedRedirect("error", "/sign-in", "User not found");
  }
  
  const metadata = user.user_metadata;
  const role = metadata.role;

if (role === 'counsellor') {
  return redirect("/protected/counsellor/dashboard");
} else if (role === 'student') {
  return redirect("/protected/student/dashboard");
} else {
  return encodedRedirect("error", "/sign-in", "User not found");
}


};

