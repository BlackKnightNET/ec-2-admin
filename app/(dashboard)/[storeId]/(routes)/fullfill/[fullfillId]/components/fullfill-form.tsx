"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { Order, Fullfill, OrderItem,User,Product } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert.modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  order: z.string().min(1),
  product: z.string().min(1),
  user: z.string().min(1),
  trackingNumber: z.string().min(1),
  status: z.string().min(1),
});

type FullfillFormValues = z.infer<typeof formSchema>

interface FullfillFormProps {
  initialData: Fullfill | null;
  order: Order[];
  orderItem: OrderItem[];
  user: User[]
  product: Product[]
};

export const FullfillForm: React.FC<FullfillFormProps> = ({
  initialData,
  order,
  orderItem,
  user,
 product
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit fullfill' : 'Create fullfill';
  const description = initialData ? 'Edit a fullfill.' : 'Add a new fullfill';
  const toastMessage = initialData ? 'Fullfill updated.' : 'Fullfill created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<FullfillFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      order: '',
      product: '',
      user: '',
      trackingNumber: '',
      status: '',
    }
  });

  const onSubmit = async (data: FullfillFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/fullfill/${params.categoryId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/fullfill`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/fullfill`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/fullfill/${params.categoryId}`);
      router.refresh();
      router.push(`/${params.storeId}/fullfill`);
      toast.success('Fullfill deleted.');
    } catch (error: any) {
      toast.error('Make sure you removed all products using this fullfill first.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
    <AlertModal 
      isOpen={open} 
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
    />
     <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="md:grid md:grid-cols-3 gap-8">
          <FormField
              control={form.control}
              name="user"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a User"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {user.map((user) => (
                        <SelectItem key={user.id} value={user.externalId}>
                          {user.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select an Order"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {order.map((order) => (
                        <SelectItem key={order.id} value={order.id}>
                         {order.address}-{order.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
                 
            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a Product"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {product.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          
              <FormField
              control={form.control}
              name="trackingNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TrackingNumber</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="TrackingNumber"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

<FormField
  control={form.control}
  name="status"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Status</FormLabel>
      <Select
        disabled={loading}
        onValueChange={field.onChange}
        value={field.value}
        defaultValue={field.value}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue
              defaultValue={field.value}
              placeholder="Select Status"
            />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="Shipped">Shipped</SelectItem>
          <SelectItem value="Transit">Transit</SelectItem>
          <SelectItem value="Delivered">Delivered</SelectItem>
          <SelectItem value="Returned">Returned</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>


           
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
