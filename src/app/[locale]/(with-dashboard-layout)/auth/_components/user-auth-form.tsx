"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { getSession, signIn } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().min(1, { message: "Este campo é obrigatório" }),
  password: z.string(),
});

type FormData = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "pt";
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
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
      const result = await signIn("credentials", {
        email: values.email,
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
          window.location.href = "/dashboard/admin/lugares";
        } else {
          toast.error("Usuário sem permissão de acesso no momento");
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
        <Button disabled={isLoading} className="ml-auto w-full mt-4" type="submit">
          Continue com Email
        </Button>
        <Link
          href={`/${locale}/auth/enviar-codigo?email=${form.getValues("email")}`}
          className={`${buttonVariants({ variant: "link" })} w-fit mx-auto`}
        >
          Esqueci minha senha
        </Link>
      </form>
    </Form>
  );
}
