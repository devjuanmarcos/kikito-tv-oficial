"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { getSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { useRouter } from "next/navigation";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { resetPasswordAction } from "@/app/actions/auth/recover-password/resetPassword";

const REGEXP_ONLY_DIGITS_AND_CHARS = "^[0-9A-Za-z]+$";

const formSchema = z
  .object({
    otp: z.string().length(6, "O código deve ter 6 dígitos"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(6, "A confirmação deve ter pelo menos 6 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

export default function UserPasswordChangeForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "pt";
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });
  const router = useRouter();

  async function onSubmit(values: FormData) {
    setIsLoading(true);

    try {
      const code = values.otp;
      const newPassword = values.password;
      const result = await resetPasswordAction(code, newPassword);
      if (result.success) {
        toast.success(result.message);
        router.push(`/${locale}/auth`);
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
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
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código de verificação</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                  {...field}
                  value={field.value}
                  onChange={field.onChange}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
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
          Trocar senha
        </Button>
      </form>
    </Form>
  );
}
