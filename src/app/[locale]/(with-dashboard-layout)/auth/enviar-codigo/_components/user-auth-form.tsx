"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { resetPasswordSolicitationAction } from "@/app/actions/auth/recover-password/resetPasswordSolicitation";

const formSchema = z.object({
  email: z.string().min(1, { message: "Este campo é obrigatório" }),
});

type FormData = z.infer<typeof formSchema>;

export default function UserSendCodeForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "pt";
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const router = useRouter();

  useEffect(() => {
    const email = searchParams.get("email");
    if (email) {
      form.setValue("email", email);
    }
  }, [searchParams, form]);

  async function onSubmit(values: FormData) {
    setIsLoading(true);

    try {
      const result = await resetPasswordSolicitationAction(values.email);
      if (result.success) {
        toast.success(result.message);
        router.push(`/${locale}/auth/trocar-senha`);
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      console.error("Erro ao submeter o formulário:", error);
      toast("Erro inesperado ao processar a solicitação", {
        description: error.message || "Verifique os detalhes e tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="text" placeholder="Insira seu email" disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isLoading} className="ml-auto w-full mt-4" type="submit">
          Enviar código
        </Button>
      </form>
    </Form>
  );
}
