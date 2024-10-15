import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const token = request.headers.get("Authorization")?.split(" ")[1];

  const response = await fetch("http://localhost:3001/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    const profileData = await response.json();
    return NextResponse.json(profileData);
  } else {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 400 });
  }
}
