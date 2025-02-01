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
    <div className="h-[100vh] flex flex-col justify-center items-center px-4">
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
                  href={media.url}
                  download
                  className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 group"
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-between rounded-full bg-[rgb(24,24,27)] px-4 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {media.quality.replace(/_/g, " ").toUpperCase()}
                      </span>
                      <span className="block text-gray-400 text-xs mt-1">
                        {media.type} ({media.extension})
                      </span>
                    </div>
                    <Download className="h-5 w-5 text-white group-hover:text-blue-400 transition-colors" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
