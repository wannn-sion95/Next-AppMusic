import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // Import client yang kita buat tadi

export async function GET() {
  // 1. Query ke Database Supabase (Tabel 'songs')
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("id", { ascending: true }); // Urutkan sesuai ID

  // 2. Error Handling (Kalau database down/salah)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 3. Kirim Data Asli ke Frontend
  return NextResponse.json(data, { status: 200 });
}
