import { NextResponse } from "next/server";
import { songs } from "@/data/songs"; 

export async function GET() {

  return NextResponse.json(songs, { status: 200 });
}
