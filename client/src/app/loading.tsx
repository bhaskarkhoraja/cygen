import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Loader } from "lucide-react"

export default function HomeLoading() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>List of users</CardTitle>
        <CardDescription>
          Chose a user to view or add orders on their behalf.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Loader className="animate-spin mx-auto text-muted-foreground"/>
      </CardContent>
    </Card>
  )
}
