// NestJS's ValidationPipe returns `message` as a string[] (one entry per
// failed rule); other errors (auth, conflicts) return a single string.
export function formatErrorMessage(data: unknown): string {
  if (data && typeof data === "object" && "message" in data) {
    const message = (data as { message: unknown }).message;

    if (Array.isArray(message)) {
      return message.join(" ");
    }

    if (typeof message === "string") {
      return message;
    }
  }

  return "Something went wrong. Please try again.";
}
