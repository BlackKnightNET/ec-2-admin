"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";


import { columns, FullfillColumn } from "./columns";
import { ApiList } from "@/components/ui/api-list";

interface FullfillClientProps {
  data: FullfillColumn[];
}

export const FullfillClient: React.FC<FullfillClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Fullfill (${data.length})`} description="Manage fullfill for your store" />
        <Button onClick={() => router.push(`/${params.storeId}/fullfill/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Fullfill" />
      <Separator />
      <ApiList entityName="fullfill" entityIdName="fullfillId" />
    </>
  );
};
