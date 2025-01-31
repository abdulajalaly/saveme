"use client";

import { PlaceholdersAndVanishInput } from "./ui/PlaceholderInput";
import { useState } from "react";
import axios from "axios";
import { Loader2, Download } from "lucide-react";

export function InputDemo() {
  const placeholders = [
    "Download from Youtube",
    "Download from Instagram",
    "Download from TikTok",
    "Enter video URL...",
  ];

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [videoData, setVideoData] = useState(null);

  const handleChange = (e) => {
    setUrl(e.target.value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) {
      setError("Please enter a valid URL");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink",
        { url },
        {
          headers: {
            "x-rapidapi-key": import.meta.env.VITE_API_KEY,
            "x-rapidapi-host": "social-download-all-in-one.p.rapidapi.com",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.error) {
        throw new Error("Failed to fetch video information");
      }

      setVideoData(response.data);
    } catch (err) {
      setError("Failed to fetch video. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    } catch (error) {
      setError("Failed to download the file. Please try again.");
    }
  };
  return (
    <div className="h-[100vh] flex flex-col justify-center items-center px-4 bg-black">
      <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl text-white">
        Download Anything
      </h2>

      <div className="w-full max-w-2xl">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />

        {loading && (
          <div className="mt-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}

        {error && <div className="mt-8 text-center text-red-500">{error}</div>}

        {videoData && (
          <div className="mt-12 space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                {videoData.title}
              </h3>
              <img
                src={videoData.thumbnail}
                alt="Video thumbnail"
                className="mx-auto rounded-lg w-64 h-36 object-cover"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videoData.medias.map((media, index) => (
                <a
                  key={index}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDownload(
                      media.url,
                      `${videoData.title}.${media.extension}`
                    );
                  }}
                  className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-between group"
                >
                  <div>
                    <span className="text-white font-medium">
                      {media.quality.replace(/_/g, " ").toUpperCase()}
                    </span>
                    <span className="block text-gray-400 text-sm mt-1">
                      {media.type} ({media.extension})
                    </span>
                  </div>
                  <Download className="h-5 w-5 text-white group-hover:text-blue-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
