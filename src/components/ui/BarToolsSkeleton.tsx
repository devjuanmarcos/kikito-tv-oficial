"use client";

import React from "react";

import { Skeleton } from "./skeleton";

const BarToolsSkeleton = () => {
  return (
    <div className="w-full dark:bg-[hsl(var(--brand-primary-dark))] bg-[hsl(var(--brand-primary-mid))]">
      <div className="h-10 overflow-y-hidden relative flex justify-center md:justify-start gap-4 items-center w-full px-4 py-1 my-0 mx-auto text-white">
        <div className="flex gap-4 items-center max-md:mx-auto mr-auto w-full">
          <div className="hidden lg:flex gap-1 items-center text-end max-h-[3.125rem] overflow-hidden">
            <Skeleton className="w-[2.8125rem] h-[1.625rem]" />
          </div>
          <Skeleton className="w-32 h-6" />
          <Skeleton className="w-7 h-7 rounded-full" />
          <Skeleton className="w-[10.375rem] h-7" />
        </div>
      </div>
    </div>
  );
};

export default BarToolsSkeleton;
