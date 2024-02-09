import prismadb from "@/lib/prismadb";

import { FullfillForm } from "./components/fullfill-form";

const FullfillPage = async ({
  params
}: {
  params: { fullfillId: string, orderId:string, productId:String, orderItemId:string, user:string, storeId: string }
}) => {
  const fullfill = await prismadb.fullfill.findUnique({
    where: {
      id: params.fullfillId
    }
  });

  const order = await prismadb.order.findMany({
    where: {
      storeId: params.storeId
    }
  });

  
  const orderItem = await prismadb.orderItem.findMany({
    where: {
      orderId: params.orderId
    }, include: {
      product: true
    }

  });

  const user = await prismadb.user.findMany({
  });

  const product = await prismadb.product.findMany({
    where: {
      orderItems: {
        some: {
          id: params.orderItemId
        }
      }
    }
  });


  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <FullfillForm order={order} orderItem={orderItem} product={product} user={user} initialData={fullfill} />
      </div>
    </div>
  );
}

export default FullfillPage;
