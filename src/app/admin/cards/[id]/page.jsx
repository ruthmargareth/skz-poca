"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cardEra, cardMember, cardType } from "@/lib/constants";
import Dropdown from "@/components/ui/dropdown";

const uploadToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "photocard_skz");
  data.append("cloud_name", "dtdacwcw7");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dtdacwcw7/image/upload",
    {
      method: "POST",
      body: data,
    }
  );

  const json = await res.json();
  return json.secure_url;
};

export default function UpdateCard() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [form, setForm] = useState({
    name: "",
    era: "",
    title: "",
    type: "",
  });
  const [imageFront, setImageFront] = useState(null);
  const [imageBack, setImageBack] = useState(null);
  const [previewFront, setPreviewFront] = useState(null);
  const [previewBack, setPreviewBack] = useState(null);

  useEffect(() => {
    fetch(`/api/cards/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          name: data.name,
          era: data.era,
          title: data.title,
          type: data.type,
        });
        setPreviewFront(data.imageUrlFront);
        setPreviewBack(data.imageUrlBack);
      });
  }, [id]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "imageFront") {
      setImageFront(files[0]);
      setPreviewFront(URL.createObjectURL(files[0]));
    }
    if (name === "imageBack") {
      setImageBack(files[0]);
      setPreviewBack(URL.createObjectURL(files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.era || !form.title || !form.type) {
      alert("Semua field wajib diisi");
      return;
    }

    let imageUrlFront = previewFront;
    let imageUrlBack = previewBack;

    if (imageFront) imageUrlFront = await uploadToCloudinary(imageFront);
    if (imageBack) imageUrlBack = await uploadToCloudinary(imageBack);

    const res = await fetch(`/api/cards/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, imageUrlFront, imageUrlBack }),
    });

    if (res.ok) {
      router.push("/admin/cards");
    } else {
      alert("Gagal mengupdate kartu");
    }
  };

  return (
    <div className="w-full pt-15">
      <div className="max-w-7xl mx-auto rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-2 pl-5 pt-5">UPDATE PHOTOCARD</h1>

        <form onSubmit={handleSubmit} className="py-2 px-10">
          <div className="p-6 border rounded-md">
            <div className="space-y-4">
              <div>
                <label className="font-medium text-md">
                  Member Name<span className="text-red-500">*</span>
                </label>
                <Dropdown
                  name="name"
                  label="Member Name..."
                  placeholder="Select member..."
                  options={cardMember}
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="font-medium text-md">
                  Era<span className="text-red-500">*</span>
                </label>
                <Dropdown
                  name="era"
                  label="Era"
                  placeholder="Select era..."
                  options={cardEra}
                  value={form.era}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="font-medium text-md">
                  Photocard Title<span className="text-red-500">*</span>
                </label>
                <Input
                  name="title"
                  value={form.title}
                  placeholder="Select Photocard Title..."
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="font-medium text-md">
                  Photocard Type<span className="text-red-500">*</span>
                </label>
                <Dropdown
                  name="type"
                  label="Type"
                  placeholder="Select Photocard type..."
                  options={cardType}
                  value={form.type}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-between mt-6">
            {/* FRONT */}
            <div className="flex flex-col items-center w-[48%] border rounded-md p-5">
              <div className="w-[150px] h-[200px] border bg-gray-100 mb-2 rounded-md overflow-hidden">
                {previewFront ? (
                  <Image
                    src={previewFront}
                    alt="Front Preview"
                    width={150}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="text-sm text-gray-500 text-center">Preview</div>
                )}
              </div>
              <label className="bg-[#A3A9DB] text-white text-sm px-4 py-2 rounded-md flex items-center gap-2">
                Change Front Photocard
                <input
                  name="imageFront"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* BACK */}
            <div className="flex flex-col items-center w-[48%] border rounded-md p-5">
              <div className="w-[150px] h-[200px] border bg-gray-100 mb-2 rounded-md overflow-hidden">
                {previewBack ? (
                  <Image
                    src={previewBack}
                    alt="Back Preview"
                    width={150}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="text-sm text-gray-500 text-center">Preview</div>
                )}
              </div>
              <label className="bg-[#A3A9DB] text-white text-sm px-4 py-2 rounded-md flex items-center gap-2">
                Change Back Photocard
                <input
                  name="imageBack"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 my-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/cards")}
              className="bg-gray-200 text-gray-600 w-[25%]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#A3A9DB] hover:bg-[#9198cc] text-white w-[25%]"
            >
              Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
