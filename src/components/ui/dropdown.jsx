"use client";

import { useState, useRef, useEffect } from "react";

const Dropdown = ({ name, label, placeholder, options, value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

 const filteredOptions = options.filter((option) =>
  option.label.toLowerCase().startsWith(searchTerm.toLowerCase())
);


  // Close dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full relative" ref={wrapperRef}>
      {/* Trigger */}
      <div
        className="border rounded px-3 py-2 bg-white cursor-pointer w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value ? options.find((opt) => opt.value === value)?.label : placeholder}
        <span className="float-right">&#x25BC;</span>
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border shadow-lg rounded max-h-64 overflow-y-auto z-50">
          <input
            type="text"
            placeholder={`Search ${label.toLowerCase()}`}
            className="w-full px-3 py-2 border-b focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul>
            {filteredOptions.map((option) => (
              <li
                key={option.value}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  onChange({ target: { name, value: option.value } });
                  setIsOpen(false);
                  setSearchTerm("");
                }}
              >
                {option.label}
              </li>
            ))}
            {filteredOptions.length === 0 && (
              <li className="px-4 py-2 text-gray-400">Tidak ditemukan</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
