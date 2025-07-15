"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { cardEra, groups, cardMember, cardType } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Footer from "@/components/Footer";

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function getAlbumBySlug(slug) {
  return cardEra.find((era) => slugify(era.label) === slug);
}

export default function AlbumPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cards, setCards] = useState([]);
  const [activeTab, setActiveTab] = useState("Album");
  const [flippedCards, setFlippedCards] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState(null);
  const [animationKey, setAnimationKey] = useState(0); // Untuk trigger ulang animasi
  const [cardRect, setCardRect] = useState(null);

  const params = useParams();
  const slug = params?.slug;
  const album = getAlbumBySlug(slug);
  const image = album ? groups[album.label] : null;

  useEffect(() => {
    fetch("/api/cards")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setCards(data);
        } else {
          console.error("API tidak mengembalikan array:", data);
          setCards([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal fetch data:", err);
        setCards([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (cardRect && activeCard) {
      const popup = document.querySelector(".popup-card");
      if (!popup) return;

      popup.classList.remove("animate");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          popup.classList.add("animate");
        });
      });
    }

     if (activeCard) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
  return () => {
    document.body.style.overflow = "";
  };
  }, [cardRect, activeCard]);

  const toggleFlip = (id, type) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCardClick = (card, event) => {
    if (card.type === "Benefit") {
      const rect = event.currentTarget.getBoundingClientRect();

      setCardRect({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });

      setActiveCard(card);
      setAnimationKey((prev) => prev + 1);
    }
  };

  const closeActiveCard = () => {
    setActiveCard(null);
  };

  if (!album) {
    return (
      <div className="p-10 text-center text-black-500">
        <h1 className="text-2xl font-bold pb-5">Album not found :(</h1>
        <div className="flex items-center justify-center">
          <img src="/haje.jpg" className="max-w-full h-[400px]" />
        </div>{" "}
      </div>
    );
  }

  const cardRefs = useRef({});

  const handleMouseMove = (e, id) => {
    const card = cardRefs.current[id];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // efek glossy
    card.style.setProperty("--gloss-x", `${100 - (x / rect.width) * 100}%`);
    card.style.setProperty("--gloss-y", `${100 - (y / rect.height) * 100}%`);
    const rotateX = -(y - rect.height / 2) / 15;
    const rotateY = (x - rect.width / 2) / 15;

    card.style.transition = "transform 0.1s ease-out";
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = (id) => {
    const card = cardRefs.current[id];
    if (!card) return;

    card.style.transition = "transform 0.5s ease-out";
    card.style.transform = "rotateX(0deg) rotateY(0deg)";
  };

  function normalize(text) {
    return text
      ?.toLowerCase()
      .replace(/\./g, "") // hilangkan titik
      .replace(/\s+/g, " ") // normalize spasi
      .trim();
  }

  const normalizedSearch = normalize(searchTerm);
  const filteredCards = (Array.isArray(cards) ? cards : []).filter((card) => {
    if (card.era !== album.label || card.type !== activeTab) return false;

    return [card.name, card.title].some((field) => {
      const normalizedField = normalize(field);
      if (!normalizedField) return false;

      const regex = new RegExp(`${normalizedSearch}`, "i");
      return regex.test(normalizedField);
    });
  });

  const groupedCards = {};
  filteredCards.forEach((card) => {
    if (!groupedCards[card.title]) {
      groupedCards[card.title] = [];
    }
    groupedCards[card.title].push(card);
  });

  const availableTypes = cardType.filter((type) =>
    cards.some((card) => card.era === album.label && card.type === type.value)
  );

  // Jika tab yang sekarang tidak tersedia, set ke tab pertama yang tersedia
  useEffect(() => {
    if (!availableTypes.find((type) => type.value === activeTab)) {
      setActiveTab(availableTypes[0]?.value || "");
    }
  }, [cards, album.label]);

  return (
    <>
      <Navbar />
      {/* hero */}
      <div className="flex items-center justify-center pb-22 pt-15 px-4">
        <div className="max-w-screen-xl w-full mx-auto grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8 items-center">
          {/* Teks Nama Member */}
          <div className="lg:pr-15 my-6 text-center lg:text-right">
            <h1 className="text-3xl mb-5 sm:text-4xl md:text-5xl font-bold">
              {album.label}
            </h1>
            {[
              "Bangchan",
              "Lee Know",
              "Changbin",
              "Hyunjin",
              "HAN",
              "Felix",
              "Seungmin",
              "I.N",
            ].map((name) => (
              <p key={name} className="m-1 text-lg">
                {name}
              </p>
            ))}
          </div>

          {/* Gambar Album */}
          <div className="w-full h-[300px] sm:h-[400px] md:h-[475px] rounded-xl overflow-hidden flex items-center justify-center bg-black">
            <img
              src={`/${image}`}
              alt={album.label}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* tabs */}
      <div className="flex justify-center p-6 pb-10">
        <div className="w-full max-w-4xl inline-flex items-center bg-gray-100 p-1 rounded-lg shadow-inner">
          {availableTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setActiveTab(type.value)}
              className={`flex-1 px-5 py-2.5 text-sm md:text-base font-medium rounded-md transition text-center ${
                activeTab === type.value
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* search */}
      <div className="flex items-center gap-2 py-4 max-w-7xl mx-auto px-6">
        <div className="relative max-w-sm w-full">
          <Input
            placeholder="Search photocard ..."
            className="pl-10 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* content */}
      <div className="max-w-7xl mx-auto p-6">
        {Object.keys(groupedCards).length === 0 ? (
          <p className="text-gray-500 text-lg">Loading Photocards</p>
        ) : (
          Object.entries(groupedCards).map(([title, cards]) => {
            const sortedCards = cardMember
              .map((member) => cards.find((card) => card.name === member.label))
              .filter(Boolean); // buang yang undefined (kalau ada member yang tidak punya kartu)

            return (
              <div key={title} className="mb-10">
                <h2 className="text-3xl font-semibold mb-4 text-black text-center">
                  {title}
                </h2>
                <div className="grid grid-cols-2 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 justify-items-center">
                  {sortedCards.map((card) => {
                    const isFlipped = flippedCards[card.id];
                    return (
                      <div
                        key={card.id}
                        className={`relative w-full aspect-[2/3] max-w-[260px] perspective cursor-pointer`}
                        onClick={(e) =>
                          card.type === "Benefit"
                            ? handleCardClick(card, e)
                            : card.type === "Album"
                            ? toggleFlip(card.id, card.type)
                            : null
                        }
                        onMouseMove={(e) => handleMouseMove(e, card.id)}
                        onMouseLeave={() => handleMouseLeave(card.id)}
                      >
                        <div
                          ref={(el) => (cardRefs.current[card.id] = el)}
                          className="relative w-full h-full"
                          style={{ transition: "transform 0.2s ease-out" }}
                        >
                          <div
                            className="relative w-full h-full"
                            style={{
                              transformStyle: "preserve-3d",
                              transition: "transform 0.5s ease-in-out",
                              transform:
                                // card.type === "Benefit"
                                //   ? "rotateY(0deg)" // tidak bisa dibalik
                                isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                            }}
                          >
                            {/* Front */}
                            <div className="card-front absolute inset-0 backface-hidden glossy-overlay-container">
                              <img
                                src={card.imageUrlFront}
                                alt={card.name}
                                className="w-full h-full object-cover rounded-xl"
                              />
                              <div className="glossy-overlay pointer-events-none" />
                            </div>
                            {/* Back */}
                            <div className="card-back absolute inset-0 backface-hidden transform rotate-y-180">
                              <img
                                src={card.imageUrlBack}
                                alt={`${card.name} back`}
                                className="w-full h-full object-cover rounded-xl"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {activeCard && activeCard.type === "Benefit" && cardRect && (
        <div
          className="fixed inset-0 z-40 backdrop-blur"
          onClick={closeActiveCard}
        >
          <div
            key={animationKey}
            className="popup-card"
            style={{
              top: `${cardRect.top}px`,
              left: `${cardRect.left}px`,
              width: `${cardRect.width}px`,
              height: `${cardRect.height}px`,
            }}
          >
            <img
              src={activeCard.imageUrlFront}
              alt={activeCard.name}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
