import { createClient } from "@/lib/supabase/client";

/**
 * Check if user has completed the onboarding tour
 */
export async function checkOnboardingStatus(userId: string): Promise<{
  hasCompleted: boolean;
  completedAt: string | null;
}> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_profiles")
    .select("has_completed_onboarding, onboarding_completed_at")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Failed to check onboarding status:", error);
    // Return default if profile doesn't exist yet
    return { hasCompleted: false, completedAt: null };
  }

  return {
    hasCompleted: data?.has_completed_onboarding ?? false,
    completedAt: data?.onboarding_completed_at ?? null,
  };
}

/**
 * Mark onboarding tour as completed
 */
export async function completeOnboarding(userId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("user_profiles")
    .update({
      has_completed_onboarding: true,
      onboarding_completed_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("Failed to complete onboarding:", error);
    throw new Error("Failed to save onboarding completion");
  }
}

/**
 * Reset onboarding status (allows user to replay tour)
 */
export async function resetOnboarding(userId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("user_profiles")
    .update({
      has_completed_onboarding: false,
      onboarding_completed_at: null,
    })
    .eq("id", userId);

  if (error) {
    console.error("Failed to reset onboarding:", error);
    throw new Error("Failed to reset onboarding status");
  }
}

