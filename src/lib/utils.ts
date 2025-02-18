import { type ClassValue, clsx } from "clsx";
import { differenceInDays } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formaterDate(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  // Ajoute 1 car getMonth() retourne un index de 0 à 11
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(days: number): Date | undefined {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + days);
  return currentDate;
}

export function daysRemaining(dueOfDay: Date, today: Date) {
  const d = differenceInDays(dueOfDay, today);
  if (d == 0) return "today";
  if (d == 1) return "tomorrow";
  if (d == -1) return "yesterday";
  if (d > 1) return `${d} days`;
  if (d < -1) return "outdated";
}

export function reducer(data: number[]) {
  const init = 0;
  return data.reduce((acc, curr) => acc + curr, init);
}

export function generateTaskIdentifier(taskIdentifier: string): string {
  // Generate a random number between 0 and 9999
  // const randomNumber = Math.floor(Math.random() * 10000);
  const lastTaskIdentifierNumber = parseInt(taskIdentifier.split('-')[1]);
  const newIdentifierNumber = lastTaskIdentifierNumber + 1;
  // Format the number to have 4 digits
  const formattedNumber = newIdentifierNumber.toString().padStart(4, '0');

  // Add the prefix "TASK-"
  return `TASK-${formattedNumber}`;
}

export const slugify = (title: string) => {
  return title
    .toLowerCase()
    .normalize("NFD") // Décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .replace(/[^a-z0-9\s-]/g, "") // Garde uniquement les lettres, chiffres, espaces et tirets
    .replace(/\s+/g, "-") // Remplace les espaces par des tirets
    .replace(/-+/g, "-") // Évite les tirets multiples
    .trim(); // Supprime les espaces au début et à la fin
};

export function convertBase64ToBlob(base64: string) {
  const arr = base64.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}