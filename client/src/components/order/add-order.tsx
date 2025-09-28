"use client"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { ApiResponse } from "@/types/api"
import { Product } from "@/types/data"
import { Checkbox } from "../ui/checkbox"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { addOrders } from "@/actions/order"
import { useState } from "react"
import { LoaderCircle } from "lucide-react"

export const formSchema = z.object({
  userId: z.string(),
  data: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number(),
    }),
  ),
})

const AddOrder = ({
  products,
  userId,
}: {
  products: ApiResponse<Product[]>
  userId: string
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: userId,
      data: [],
    },
  })
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.data.length == 0) {
      toast.warning("Failed to add order", {
        description: "Please select at least one product",
      })
      return
    }

    setLoading(true)

    const response = await addOrders(values)

    if (response.status) {
      toast.success("Orders added successfully", {
        description: "Your orders have been added successfully",
      })
      setOpen(false)
      form.reset()
    } else {
      console.log(response)
      toast.error("Something went wrong", {
        description: "Failed to add orders",
      })
    }
    setLoading(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          type="submit"
          className="ml-auto cursor-pointer"
        >
          Add Orders
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Order</DialogTitle>
          <DialogDescription>
            Choose products and add the orders
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="myform"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {products.data.map((product) => (
              <FormField
                key={product.id}
                control={form.control}
                name={"data"}
                render={({ field }) => {
                  return (
                    <FormItem
                      key={product.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex flex-row items-center gap-2">
                        <FormControl>
                          <div>
                            <Checkbox
                              id={product.id}
                              checked={
                                field.value.find(
                                  (p) => p.productId === product.id,
                                ) !== undefined
                              }
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([
                                    ...field.value,
                                    {
                                      productId: product.id,
                                      quantity: 1,
                                    },
                                  ])
                                } else {
                                  field.onChange(
                                    field.value.filter(
                                      (value) => value.productId !== product.id,
                                    ),
                                  )
                                }
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormLabel
                          htmlFor={product.id}
                          className="text-sm font-normal"
                        >
                          {product.name}
                        </FormLabel>
                      </div>
                      <div className="flex gap-2 items-center justify-between">
                        <p className="text-sm text-muted-foreground">Qty:</p>
                        <Input
                          placeholder="0"
                          type="number"
                          disabled={
                            field.value.find(
                              (p) => p.productId === product.id,
                            ) === undefined
                          }
                          className="w-14"
                          value={
                            field.value.find((p) => p.productId === product.id)
                              ?.quantity ?? 0
                          }
                          onChange={(e) => {
                            field.onChange(
                              field.value.map((value) => {
                                if (value.productId === product.id) {
                                  return {
                                    ...value,
                                    quantity: Number(e.target.value),
                                  }
                                }
                                return value
                              }),
                            )
                          }}
                        />
                      </div>
                    </FormItem>
                  )
                }}
              />
            ))}
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="submit"
            form="myform"
            className="cursor-pointer"
            disabled={loading}
          >
            {loading ? <LoaderCircle className="animate-spin" /> : "Add order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddOrder
