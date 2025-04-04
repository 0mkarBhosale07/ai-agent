"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, Search, ChevronRight, Sun, Moon, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AnimatedText } from "../animated-text";
import { ThemeSwitcher } from "../theme-switcher";
import Tools from "./Tools";
import { useSession, signIn, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function EnhancedHome() {
  const { data: session, status } = useSession();
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex justify-between items-center h-16">
          <div className="flex gap-2 items-center">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-black dark:text-white">
              ReAct Agent
            </span>
          </div>
          <nav className="flex gap-4 items-center">
            <ThemeSwitcher />
            {status === "loading" ? (
              <div className="w-8 h-8 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
            ) : session ? (
              <div className="flex items-center gap-4">
                <Link href="/chat">
                  <Button className="flex gap-2 items-center text-black bg-white border border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:border-gray-600">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512,15.042,3,13.574,3,12c0-4.418,4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    Visit Chat
                  </Button>
                </Link>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative w-8 h-8 rounded-full"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={session?.user?.image || ""}
                          alt={session?.user?.name || ""}
                        />
                        <AvatarFallback>
                          {session?.user?.name?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 p-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={session?.user?.image || ""}
                            alt={session?.user?.name || ""}
                          />
                          <AvatarFallback>
                            {session?.user?.name?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {session?.user?.name}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        className="justify-start w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => signOut()}
                      >
                        Log out
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <Button
                onClick={() => signIn("google")}
                className="flex gap-2 items-center text-black bg-white border border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:border-gray-600"
              >
                <svg
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width="48px"
                  height="48px"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
                Login with Google
              </Button>
            )}
          </nav>
        </div>
      </header>

      <main className="container px-4 py-8 md:py-12">
        {/* Intro Card */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mb-12"
        >
          <Link href="#">
            <Card className="inline-flex gap-2 items-center px-4 py-2 transition-colors bg-muted/40 hover:bg-muted/60">
              <span className="text-lg">🧠</span>
              <span>Introducing AI Agent Template</span>
              <ChevronRight className="w-4 h-4" />
            </Card>
          </Link>
        </motion.div>

        {/* Hero Section */}
        <div className="mb-16 max-w-4xl">
          <div className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            <AnimatedText
              text={
                <>
                  <span className="text-black dark:text-white">A </span>
                  <span className="text-black dark:text-white"> powerful </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600">
                    "AI Agent"
                  </span>
                  <span className="italic text-black dark:text-white">
                    {" "}
                    for you!
                  </span>
                </>
              }
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-6 text-xl text-muted-foreground"
          >
            Mistral AI is a powerful AI agent that can help you with your tasks.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mb-10 text-xl text-muted-foreground"
          >
            Save hours by using the power of AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="space-y-4"
          ></motion.div>
        </div>

        {/* Tools Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mt-24"
        >
          <Tools />
        </motion.div>
      </main>

      <footer className="py-6 border-t">
        <div className="container flex flex-col gap-4 justify-between items-center px-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ReAct Agent. All rights reserved.
          </p>
          <div className="flex gap-4 items-center text-black dark:text-white">
            <h1>
              Developed by <span className="font-bold">Shweta</span>,{" "}
              <span className="font-bold">Prayas</span> &{" "}
              <span className="font-bold">Omkar</span>
            </h1>
          </div>
        </div>
      </footer>
    </div>
  );
}
