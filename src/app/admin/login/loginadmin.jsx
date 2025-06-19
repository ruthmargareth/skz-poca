"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export default function AdminLogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/admin/cards");
    } else {
      let message = "Login gagal";
      try {
        const data = await res.json();
        message = data.message || message;
      } catch (error) {
        console.error("Gagal parsing JSON:", error);
      }
      setError(message);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      {/* Form login */}
      <form
        className="relative z-10 bg-white bg-opacity-90 backdrop-blur p-8 rounded-2xl shadow-lg w-full max-w-sm"
        onSubmit={handleLogin}
      >
        <div className="flex justify-center mb-4">
          <img
            src="/skz.svg"
            alt="Stray Kids Logo"
            className="w-56 h-20 object-contain cursor-pointer"
          />
        </div>

        <h1 className="text-2xl font-bold text-center mb-6">
          Log In to your account
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <Button
          type="submit"
          className="w-full bg-[#A3A9DB] text-white p-3 hover:bg-[#9198cc] rounded transition"
        >
        <LogIn/>
          Log In
        </Button>
      </form>
    </div>
  );
}
