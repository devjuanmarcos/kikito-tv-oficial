"use client";

import type { ElementType } from "react";
import React from "react";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";

type DrawerFormType = {
  title: string;
  subTitle: string;
  Form: ElementType;
  row?: any;
  open: boolean;
  setOpen: (open: boolean) => void;
  maxWidth?: string;
};

export const DrawerFormComponent: React.FC<DrawerFormType> = ({
  subTitle,
  title,
  Form,
  open,
  setOpen,
  maxWidth = "max-w-md",
  row,
}) => {
  const Content = Form;

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerContent className={`flex flex-col ${maxWidth}`}>
        <DrawerHeader className="border-b shrink-0">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{subTitle}</DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 p-6 overflow-y-auto w-full min-w-0">
          {row ? <Content setOpen={setOpen} row={row} /> : <Content setOpen={setOpen} />}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
