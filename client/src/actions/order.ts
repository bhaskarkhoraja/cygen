"use server"

import { formSchema } from "@/components/order/add-order"
import { myFetch } from "@/types/api"
import { revalidateTag } from "next/cache"
import z from "zod"

const addOrders = async (values: z.infer<typeof formSchema>) => {
  const response = await myFetch(`${process.env.API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  })

  if (response.status) {
    revalidateTag("orders")
  }

  return response
}

export { addOrders }
