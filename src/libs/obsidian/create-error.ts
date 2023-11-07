export function createError(message: string) {
  new Notice(message, 5000);
  return new Error(message);
}
