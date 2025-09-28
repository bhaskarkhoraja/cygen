import { cookies } from "next/headers"
import "server-only"

export type WithPagination<T> = {
  count: number
  next: null | string
  previous: null | string
  results: T[]
}

export type ApiResponse<T> =
  | {
    status: true
    message: string
    data: T
    errors: { [key: string]: string | string[] } | null
  }
  | {
    status: false
    message: string
    data: Record<PropertyKey, never>
    errors: { [key: string]: string | string[] } | null
  }

export const myFetch = async <T>(
  url: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> => {
  let out: ApiResponse<T> = {
    status: false,
    message: "Something went wrong!",
    data: {},
    errors: null,
  }
  const status = {
    code: 200,
    ok: true,
  }

  try {
    const response = await fetch(url, options)
    status.code = response.status
    status.ok = response.ok

    out = await response.json()
  } catch (error) {
    console.log(error)
    console.log("Fetch failed", JSON.stringify(error))
  }
  return out
}

export async function getToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  return token
}
