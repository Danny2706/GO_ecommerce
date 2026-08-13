export function formatETB(amount: number): string {
  return new Intl.NumberFormat("en-ET", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + " ETB";
}

export function discount(original: number, current: number): number {
  return Math.round(((original - current) / original) * 100);
}

export function clsx(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
