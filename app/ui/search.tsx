"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // function handleSearch(term: string) {
  //   console.log(`Searching... ${term}`);
  //   // give URLSearchParams params the default value of the current url search params
  //   const params = new URLSearchParams(searchParams);
  //   if (term) {
  //     params.set("query", term);
  //     // params.set("page", "1");
  //     // params.set("limit", "10");
  //   } else {
  //     params.delete("query");
  //   }
  //   console.log("params : ", params.toString()); // include the query string only >> query=search-value || query=ssss&page=1&limit=10
  //   console.log("pathname : ", pathname); // 'dashboard/invoices' not inclode the base url or domain also not include the query
  //   replace(`${pathname}?${params.toString()}`);
  // }


  // using debouncing
  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`);
    //**URLSearchParams is a JavaScript API for working with query strings in URLs. It allows easy manipulation (reading, adding, updating, and deleting) of query parameters.
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  console.log("searchParams : ", searchParams);
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
