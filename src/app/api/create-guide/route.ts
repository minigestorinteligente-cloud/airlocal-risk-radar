import { saveGuide } from "@/lib/guidesStore"
import { nanoid } from "nanoid"

export async function POST(req: Request) {

  const body = await req.json()

  const id = nanoid(6)

  const guide = {
    id,
    ...body
  }

  saveGuide(guide)

  return Response.json({
    id
  })
}