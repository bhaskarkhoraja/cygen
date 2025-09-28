import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { myFetch } from "@/types/api"
import { User } from "@/types/data"
import { ChevronsRight } from "lucide-react"
import Link from "next/link"

export default async function Home() {
  const users = await myFetch<User[]>(`${process.env.API_URL}/users`)

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>List of users</CardTitle>
        <CardDescription>
          Chose a user to view or add orders on their behalf.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {users.status ? (
          <div className="space-y-2">
            {users.data.map((user) => (
              <Link
                key={user.id}
                href={`/orders?user=${user.id}`}
                className="flex items-center justify-between hover:bg-muted px-4 py-2 rounded-md border"
              >
                <div className="space-y-1">
                  <p className="text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.id}</p>
                </div>
                <ChevronsRight className="text-muted-foreground" />
              </Link>
            ))}
          </div>
        ) : (
          <>Something went wrong.</>
        )}
      </CardContent>
    </Card>
  )
}
