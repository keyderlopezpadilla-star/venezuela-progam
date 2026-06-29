import { redirect } from 'next/navigation';

// Redirige / a /es (locale por defecto).
export default function RootIndex() {
  redirect('/es');
}