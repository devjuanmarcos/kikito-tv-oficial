"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

import * as Accordion from "@radix-ui/react-accordion";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  icon?: string;
  iconPosition?: string;
}

interface FaqSectionProps {
  data: FAQItem[];
}

export default function FaqSection({ data }: FaqSectionProps) {
  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <div className="mx-auto w-full rounded-lg bg-background p-4">
      <Accordion.Root type="single" collapsible value={openItem || ""} onValueChange={(value) => setOpenItem(value)}>
        {data.map((item) => (
          <Accordion.Item value={item.id.toString()} key={item.id} className="mb-2">
            <Accordion.Header>
              <Accordion.Trigger className="flex w-full items-center justify-start gap-x-4">
                <div
                  className={`relative flex items-center space-x-2 rounded-xl bg-foreground text-background p-3 hover:bg-foreground/90 transition-colors ${
                    openItem === item.id.toString() ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                  }`}
                >
                  {item.icon && (
                    <span
                      className={`absolute bottom-6 ${item.iconPosition === "right" ? "right-0" : "left-0"}`}
                      style={{
                        transform: item.iconPosition === "right" ? "rotate(7deg)" : "rotate(-4deg)",
                      }}
                    >
                      {item.icon}
                    </span>
                  )}
                  <span className="body-paragraph-medium">{item.question}</span>
                </div>

                <span
                  className={`cursor-pointer text-lg font-bold shrink-0 ${
                    openItem === item.id.toString() ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {openItem === item.id.toString() ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content asChild forceMount style={{ display: "block" }}>
              <motion.div
                initial="collapsed"
                animate={openItem === item.id.toString() ? "open" : "collapsed"}
                variants={{
                  open: { opacity: 1, height: "auto" },
                  collapsed: { opacity: 0, height: 0 },
                }}
                transition={{ duration: 0.4 }}
                style={{ width: "100%", overflow: "hidden" }}
              >
                <div className="mt-1 rounded-lg pl-3 py-3 ml-auto w-full flex justify-end">
                  <div className="relative max-w-[60%] rounded-2xl bg-primary text-primary-foreground px-4 py-2 body-paragraph">
                    {item.answer}
                    <div className="absolute bottom-0 right-[2.5px] h-0 w-0 border-l-10 border-t-10 border-l-transparent border-t-primary" />
                  </div>
                </div>
              </motion.div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
