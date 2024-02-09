import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { FullfillColumn } from "./components/columns"
import { FullfillClient } from "./components/client";

const FullfillPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const fullfill = await prismadb.fullfill.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      user: true,
      orderItem: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedFullfill: FullfillColumn[] = fullfill.map((item) => ({
    id: item.id,
    user: item.user.externalId,
    orderItem: item.orderItem.productId,
    status: item.status,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <FullfillClient data={formattedFullfill} />
      </div>
    </div>
  );
};

export default FullfillPage;
