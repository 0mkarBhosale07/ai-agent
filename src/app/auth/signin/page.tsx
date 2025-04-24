"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import LoginForm from "@/components/login-form";
import Image from "next/image";
import Link from "next/link";

// onClick={() => signIn("google", { callbackUrl })}

export default function SignIn() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status } = useSession();
  const callbackUrl = searchParams.get("callbackUrl")
    ? decodeURIComponent(searchParams.get("callbackUrl")!)
    : "/chat";

  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  return (
    <div className="flex min-h-screen">
      {/* Left side with image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#4a3b7c]">
        <div className="absolute inset-0">
          <Image
            src="/ai1.webp"
            alt="Desert landscape"
            fill
            className="object-cover opacity-70"
            priority
          />
        </div>
        <div className="absolute top-6 left-6">
          <h1 className="text-xl font-bold text-white">ReAct Agent</h1>
        </div>
        <div className="absolute top-6 right-6">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-sm text-white transition rounded-full bg-white/20 hover:bg-white/30"
          >
            Back to website
            <span className="text-lg">→</span>
          </Link>
        </div>
        <div className="absolute left-0 right-0 text-center text-white bottom-20">
          <h2 className="mb-2 text-3xl font-bold">Powerful</h2>
          <h2 className="text-3xl font-bold">AI Agent</h2>
          <div className="flex justify-center gap-2 mt-8">
            <div className="w-6 h-1 rounded-full bg-white/40"></div>
            <div className="w-6 h-1 rounded-full bg-white/40"></div>
            <div className="w-6 h-1 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#1e1a29]">
        <LoginForm callbackUrl={callbackUrl} />
      </div>
    </div>
  );
}
