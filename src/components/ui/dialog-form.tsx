import type { ElementType } from "react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type DialogFormType = {
  buttonTitle: string;
  title: string;
  subTitle: string;
  Form: ElementType;
  row?: any;
  notButton?: boolean;
  open: boolean;
  setOpen: any;
  maxWidth?: string;
  formProps?: any;
};

export const DialogComponent: React.FC<DialogFormType> = ({
  buttonTitle,
  subTitle,
  title,
  Form,
  notButton,
  open,
  setOpen,
  maxWidth,
  row,
  formProps = {},
}) => {
  const Content = Form;

  function closeDialog() {
    setOpen((prev: any) => !prev);
  }

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      {!notButton && (
        <DialogTrigger asChild>
          <Button size={"default"} className="cursor-pointer" onClick={(state) => setOpen(!state)}>
            {buttonTitle}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className={`${maxWidth} max-h-[80vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle tabIndex={0}>{title}</DialogTitle>
          <DialogDescription>{subTitle}</DialogDescription>
        </DialogHeader>
        {row ? <Content setOpen={setOpen} row={row} {...formProps} /> : <Content setOpen={setOpen} {...formProps} />}
      </DialogContent>
    </Dialog>
  );
};
