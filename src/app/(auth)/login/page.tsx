"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { Eye, EyeOff } from "lucide-react";
import { auth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      router.replace("/dashboard");
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : "";
      const msg =
        code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found"
          ? "E-mail ou senha incorretos."
          : "Não foi possível entrar. Tente novamente.";
      toast.error(msg);
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Entrar</h1>
        <p className="text-sm text-muted-foreground">Acesse sua conta.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
          {errors.email && (
            <p role="alert" className="text-xs text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className="pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              aria-pressed={showPassword}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && (
            <p role="alert" className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button type="submit" disabled={submitting} className="w-full rounded-full">
          {submitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Não tem conta?{" "}
        <Link
          href="/cadastro"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
