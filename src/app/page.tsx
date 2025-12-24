"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

//* Main page component for invoking a background job using TRPC and React Query.
const Page = () => {
  const [value, setValue] = useState("");

  const trpc = useTRPC();
  const {data: messages} = useQuery(trpc.messages.getMany.queryOptions());
  const createMessage = useMutation(trpc.messages.create.mutationOptions({
    onSuccess: () => {
      toast.success("Message Created!")
    }
  }))

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Input value={value} onChange={(e)=> setValue(e.target.value)}/>
      <Button disabled={createMessage.isPending} onClick={()=> createMessage.mutate({value: value})}>
        Invoke background job
      </Button>
      {JSON.stringify(messages, null, 2)}
    </div>
  );
}

export default Page;