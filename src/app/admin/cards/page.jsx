"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Pencil, Trash2, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Page = () => {
  const [cards, setCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const router = useRouter();

  useEffect(() => {
    fetch("/api/cards")
      .then((res) => res.json())
      .then((data) => setCards(data))
      .catch((err) => console.error("Gagal mengambil data kartu:", err));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Yakin ingin menghapus kartu ini?");
    if (!confirm) return;

    try {
      const res = await fetch(`/api/cards/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCards(cards.filter((card) => card.id !== id));
      }
    } catch (err) {
      console.error("Gagal menghapus kartu:", err);
    }
  };

  const handleEdit = (id) => {
    router.push(`/admin/cards/${id}`);
  };

  const handleAddCard = () => {
    router.push("/admin/cards/add");
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const filteredCards = cards.filter((card) =>
    [card.name, card.era, card.title, card.type].some((field) =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCards = filteredCards.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredCards.length / itemsPerPage);

  const renderPageButtons = () => {
    const pageButtons = [];
    const blockSize = 10;

    // Hitung blok saat ini
    const currentBlock = Math.floor((currentPage - 1) / blockSize);
    const startPage = currentBlock * blockSize + 1;
    const endPage = Math.min(startPage + blockSize - 1, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Button>
      );
    }

    return pageButtons;
  };

  return (
    <div className="w-full pt-15">
      <div className="flex items-center justify-between max-w-7xl mx-auto mb-4">
        <h1 className="text-2xl font-bold">PHOTOCARD TABLE</h1>
        <Button
          onClick={handleLogout}
          className="gap-2 bg-[#f54242] hover:bg-[#d63434] text-white rounded-md"
        >
          <LogOut />
          LOGOUT
        </Button>
      </div>

      {/* Filter + Button */}
      <div className="flex items-center gap-2 py-4 max-w-7xl mx-auto">
        <div className="relative max-w-sm w-full">
          <Input
            placeholder="Filter photocard ..."
            className="pl-10 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        <Button
          onClick={handleAddCard}
          className="gap-2 bg-[#A3A9DB] hover:bg-[#9198cc] text-white rounded-md"
        >
          <Plus className="w-4 h-4" />
          Add Photocard
        </Button>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-6">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>

          {renderPageButtons()}

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-xl overflow-hidden shadow max-w-7xl mx-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#A3A9DB]">
              <TableHead className="pl-4 text-white">No</TableHead>
              <TableHead className="text-white">Member</TableHead>
              <TableHead className="text-white">Era</TableHead>
              <TableHead className="text-white">Title</TableHead>
              <TableHead className="text-white">Type</TableHead>
              <TableHead className="text-white">Front</TableHead>
              <TableHead className="text-white">Back</TableHead>
              <TableHead className="text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentCards.map((card, index) => (
              <TableRow key={card.id} className="odd:bg-muted/50">
                <TableCell className="pl-4">{startIndex + index + 1}</TableCell>
                <TableCell>{card.name}</TableCell>
                <TableCell>{card.era}</TableCell>
                <TableCell>{card.title}</TableCell>
                <TableCell>{card.type}</TableCell>
                <TableCell>
                  <div className="w-[110px] h-[170px] relative overflow-hidden rounded-md">
                    <Image
                      src={card.imageUrlFront}
                      alt={`${card.name} front`}
                      fill
                      sizes="110px"
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="w-[110px] h-[170px] relative overflow-hidden rounded-md">
                    <Image
                      src={card.imageUrlBack}
                      alt={`${card.name} back`}
                      fill
                      sizes="110px"
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(card.id)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(card.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {currentCards.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-4 text-gray-500"
                >
                  Loading Photocard...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-6">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>

          {renderPageButtons()}

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Page;
