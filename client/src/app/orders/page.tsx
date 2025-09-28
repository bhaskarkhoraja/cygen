import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog"
import { myFetch } from "@/types/api"
import { Order } from "@/types/data"
import { redirect } from "next/navigation"

export default async function Orders({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams

  if (!params.user || Array.isArray(params.user)) {
    redirect("/")
  }

  const queryParams = new URLSearchParams()
  queryParams.append("userId", params.user)

  if (params.page) {
    queryParams.append(
      "page",
      Array.isArray(params.page) ? params.page[0] : params.page,
    )
  }
  if (params.limit) {
    queryParams.append(
      "pageSize",
      Array.isArray(params.limit) ? params.limit[0] : params.limit,
    )
  }
  if (params.search) {
    queryParams.append(
      "search",
      Array.isArray(params.search) ? params.search[0] : params.search,
    )
  }

  const orders = await myFetch<Order[]>(
    `${process.env.API_URL}/orders?${queryParams.toString()}`,
  )

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>List of order</CardTitle>
        <CardDescription>
          Chose a user to view or add orders on their behalf.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {orders.status ? (
          <div>
            {orders.data.length > 0 ? (
              orders.data.map((order) => (
                <Dialog key={order.id}>
                  <DialogTrigger asChild>
                    <Button
                      key={order.id}
                      variant={"outline"}
                      className="flex items-center justify-between hover:bg-muted px-4 py-2 rounded-md border w-full h-fit cursor-pointer"
                    >
                      <div className="space-y-1 w-full">
                        <div className="flex items-center justify-between w-full">
                          <p className="text-sm">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              },
                            )}
                          </p>
                          <p className="text-sm">
                            $
                            {order.orderItems.reduce(
                              (acc, o) => acc + o.quantity * o.product.price,
                              0,
                            )}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground text-left">
                          Items: {order.orderItems.length}{" "}
                        </p>
                      </div>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Order Details</DialogTitle>
                      <DialogDescription>
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          weekday: "short",
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                      {order.orderItems.map((orderItem) => (
                        <div className="rounded-sm border px-4 py-2" key={orderItem.id}>
                          <div className="flex items-center justify-between ">
                            <p className="text-sm">{orderItem.product.name}</p>
                            <p className="text-sm">
                              ${orderItem.product.price * orderItem.quantity}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Qty: {orderItem.quantity}
                          </p>
                        </div>
                      ))}
                    </div>
                    <DialogFooter>
                      <p>
                        <span className="text-muted-foreground text-xs">
                          Sub Total:
                        </span>{" "}
                        $
                        {order.orderItems.reduce(
                          (acc, o) => acc + o.quantity * o.product.price,
                          0,
                        )}
                      </p>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ))
            ) : (
              <>No orders found</>
            )}
          </div>
        ) : (
          <>Something went wrong.</>
        )}
      </CardContent>
    </Card>
  )
}
