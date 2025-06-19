"use client";

import { useState, useRef, useEffect } from "react";
import { cardEra, albums } from "@/lib/constants";
import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const mergedAlbums = cardEra.map((era) => ({
    title: era.label,
    image: albums[era.label],
  }));

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // hapus karakter selain huruf, angka, spasi, dan dash
      .replace(/\s+/g, "-") // ubah spasi jadi -
      .replace(/-+/g, "-") // ganti multiple dash jadi satu
      .trim();
  }

  return (
    <nav className="sticky top-0 z-50 bg-white shadow pl-6 flex justify-between items-center">

      <div className="text-2xl font-bold font-mono">
        <img
          src="/skz.svg"
          alt="Stray Kids Logo"
          className="w-[114px] h-[50px] cursor-pointer"
          onClick={() => router.push("/")}
        />
      </div>

      <div className="relative" ref={dropdownRef}>
        <Button
          onClick={() => setShowDropdown((prev) => !prev)}
          className="text-lg text-black p-10 mr-6 font-semibold gap-2 bg-[#ffffff] hover:bg-gray-100 cursor-pointer"
        >
          Photocard collection
          <ChevronDown
            className={`w-6 h-6 transform transition-transform duration-300 ${
              showDropdown ? "rotate-180" : ""
            }`}
          />{" "}
        </Button>

        {/* Full width dropdown positioned absolutely from nav */}
        {showDropdown && (
          <div className="absolute right-0 top-full w-screen bg-white border-t border-gray-200 shadow-lg z-50">
            <div className="max-w-7xl mx-auto px-3 py-6 grid grid-cols-3 gap-6">
              {mergedAlbums.map((album, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 text-base hover:bg-gray-100 p-1 rounded cursor-pointer"
                  onClick={() => router.push(`/albums/${slugify(album.title)}`)}
                >
                  <img
                    src={`/${album.image}`}
                    alt={album.title}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <span className="font-medium">{album.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
