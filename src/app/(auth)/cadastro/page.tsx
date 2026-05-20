"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Eye, EyeOff } from "lucide-react";
import { auth, db } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const schema = z
  .object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "Mínimo de 6 caracteres"),
    confirm: z.string().min(6, "Mínimo de 6 caracteres"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "As senhas não conferem",
    path: ["confirm"],
  });

type FormValues = z.infer<typeof schema>;

export default function CadastroPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const togglePasswords = () => setShowPasswords((s) => !s);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, values.email, values.password);
      await setDoc(doc(db, "users", cred.user.uid), {
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      router.replace("/dashboard");
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : "";
      const msg =
        code === "auth/email-already-in-use"
          ? "Já existe uma conta com este e-mail."
          : code === "auth/weak-password"
            ? "Senha muito fraca. Use ao menos 6 caracteres."
            : "Não foi possível criar a conta. Tente novamente.";
      toast.error(msg);
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Criar conta</h1>
        <p className="text-sm text-muted-foreground">É rápido — só e-mail e senha.</p>
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
              type={showPasswords ? "text" : "password"}
              autoComplete="new-password"
              className="pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={togglePasswords}
              aria-label={showPasswords ? "Ocultar senhas" : "Mostrar senhas"}
              aria-pressed={showPasswords}
              aria-controls="password confirm"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {showPasswords ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && (
            <p role="alert" className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirmar senha</Label>
          <div className="relative">
            <Input
              id="confirm"
              type={showPasswords ? "text" : "password"}
              autoComplete="new-password"
              className="pr-10"
              {...register("confirm")}
            />
            <button
              type="button"
              onClick={togglePasswords}
              aria-label={showPasswords ? "Ocultar senhas" : "Mostrar senhas"}
              aria-pressed={showPasswords}
              aria-controls="password confirm"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {showPasswords ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.confirm && (
            <p role="alert" className="text-xs text-destructive">
              {errors.confirm.message}
            </p>
          )}
        </div>
        <Button type="submit" disabled={submitting} className="w-full rounded-full">
          {submitting ? "Criando..." : "Criar conta"}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Entrar
        </Link>
      </p>
    </div>
  );
}
