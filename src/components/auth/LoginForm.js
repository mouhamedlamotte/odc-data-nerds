"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { kdebug } from "@/constants";
import { LoginWithEmailAndPassword } from "@/db/auth/login";
import { AlertCircle, Loader } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

export const LoginForm = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (event) => {
    setUser({ ...user, [event.target.id]: event.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (!UserFormValidation(user, setError)) return;
      const userCredential = await LoginWithEmailAndPassword(user);
      if (userCredential) {
        setCookie("token", userCredential.accessToken);
        router.replace("/");
      } else {
        setError({ title: "Invalide", message: "identifiants invalides" });
      }
    } catch (error) {
      kdebug(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      {error && (
        <Alert className="w-full" variant="destructive">
          <AlertCircle />
          <AlertTitle>{error?.title}</AlertTitle>
          <AlertDescription>{error?.message}</AlertDescription>
        </Alert>
      )}
      <div className="grid w-full items-center gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          className="py-5 dark:border-slate-700 focus:border-cyan-400"
          type="email"
          id="email"
          placeholder="Email"
          onChange={handleChange}
        />
      </div>
      <div className="grid w-full items-center gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          className="py-5 dark:border-slate-700 focus:border-cyan-400"
          type="password"
          id="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <Button className="justify-self-end p-0" variant="link">
          Forgot password?
        </Button>
      </div>
      <Button
        type="submit"
        className="w-full py-6 bg-cyan-500 hover:bg-cyan-400"
      >
        {isLoading ? <Loader className="animate-spin" /> : "Log in"}
      </Button>
    </form>
  );
};

const UserFormValidation = (user, setError) => {
  const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (!user.email || !user.password) {
    setError({ title: "Requis", message: "Veuillez remplir tous les champs" });
    return false;
  }
  if (!user.email.match(emailPattern)) {
    setError({
      title: "Invalide",
      message: "Veuillez entrer une adresse email valide",
    });
    return false;
  }
  if (user.password.length < 6) {
    setError({
      title: "Invalide",
      message: "Le mot de passe doit contenir au moins 6 caractères",
    });
    return false;
  }
  return true;
};
