import { validateRequest } from "@/lib/auth/lucia";

export async function GET(request: Request) {
  const session = await validateRequest();
  if (session.session === null) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json({ ...session }, { status: 200 });
}
