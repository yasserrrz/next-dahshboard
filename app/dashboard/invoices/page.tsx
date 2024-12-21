import Pagination from "@/app/ui/invoices/pagination";
import Search from "@/app/ui/search";
import Table from "@/app/ui/invoices/table";
import { CreateInvoice } from "@/app/ui/invoices/buttons";
import { lusitana } from "@/app/ui/fonts";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchInvoicesPages } from "@/app/lib/data";

//  const props = {
//    searchParams? : Promise<{
//      query?: string;
//      page?: string;

//    }>
//  }
/*
Yes, you’re correct! The type Promise<{ query?: string; page?: string; }> is indeed using TypeScript's generic type syntax.

Breakdown of Promise<{ query?: string; page?: string; }>:
Promise<...>: This is a generic type that represents a Promise in TypeScript. The Promise type takes a generic type parameter that specifies the type of value the Promise will resolve to when it completes successfully.

{ query?: string; page?: string; }: This is an object type specifying the shape of the data expected when the Promise resolves. It’s defining that the resolved value of this Promise will be an object with two optional properties:

query: an optional string
page: an optional string
Putting It Together:

By writing Promise<{ query?: string; page?: string; }>, you're telling TypeScript that searchParams is a Promise that, once resolved, will provide an object with the query and page properties, both of which are optional and of type string.
If searchParams is resolved, it will yield an object that matches { query?: string; page?: string }.
Why Use a Generic Type with Promise?
Using Promise as a generic type is a powerful feature in TypeScript that allows us to define the exact shape of the data we’re working with. Here’s why it’s helpful:

Type Safety: You get full type safety and autocompletion for the object’s properties (query and page) after await.
Error Prevention: TypeScript will alert you if you try to access searchParams.query or searchParams.page without awaiting searchParams first.
Documentation: It’s a clear, self-documenting way to define what data the component expects, making it more maintainable and readable for other developers.
Example Without a Generic Type
*/




// if we dont want to use api end point we can make it like this :
/***
 * 
 * async function fetchInvoices(query: string, page: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/invoices?query=${query}&page=${page}`,
    { cache: 'no-store' } // Ensures the data is always fresh for each request
  );

  if (!res.ok) {
    throw new Error('Failed to fetch invoices');
  }

  return res.json(); // Parse JSON response
}
 */
export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  console.log(searchParams);
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  // The fetchInvoicesPages function uses a database query (sql), meaning it executes at runtime on the server (SSR).
  const totalPages = await fetchInvoicesPages(query);
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        {/* Your search functionality will span the client and the server. When a user searches for an invoice on the client, the URL params will be updated, data will be fetched on the server, and the table will re-render on the server with the new data. */}
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
