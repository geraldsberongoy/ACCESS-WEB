// allows passing status codes from Services to API
export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 400) {
    super(message);
    this.name = "AppError";
  }
}

type SupabaseErrorLike = {
  message?: string;
  details?: string;
  hint?: string;
  code?: string;
};

export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (error instanceof Error) return error.message;

  if (error && typeof error === "object" && "message" in error) {
    const supabaseError = error as SupabaseErrorLike;
    if (typeof supabaseError.message === "string" && supabaseError.message.length > 0) {
      return supabaseError.message;
    }
  }

  return fallback;
}

export function throwSupabaseError(error: SupabaseErrorLike | null): asserts error is null {
  if (error) {
    throw new Error(error.message ?? "Database request failed");
  }
}
