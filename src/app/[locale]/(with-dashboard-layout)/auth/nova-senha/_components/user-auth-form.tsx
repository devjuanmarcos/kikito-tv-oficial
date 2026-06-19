"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { getSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";

const formSchema = z
  .object({
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(6, "A confirmação deve ter pelo menos 6 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

export default function UserNewPasswordForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Erro ao logar no sistema", {
          description: result.error,
          duration: 10000,
        });
      } else {
        toast("Login realizado com sucesso!");
        const session = await getSession();
        if (session?.user?.role === process.env.NEXT_PUBLIC_ADMIN_USER_ROLE) {
          window.location.href = "/gestao-dashboard/alunos-cst";
        }
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="Insira sua senha" disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmação de senha</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="Confirme sua senha" disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading} className="ml-auto w-full mt-4" type="submit">
          Finalizar criação da conta
        </Button>
      </form>
    </Form>
  );
}
