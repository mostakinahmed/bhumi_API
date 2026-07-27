import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { ThemeToggle } from "./ThemeToggle";
import { StarBackground } from "@/components/StarBackground";
import { useState } from "react";

const Video = () => {
  const fileId = "1WzLiFxCtnplFRLVTYg-jPGa0K7RlvmZb";

  return (
    <>
      {/* Background Effects */}
      <StarBackground />

      {/* UI Controls */}
      <ThemeToggle />
      <Navbar />

      {/* Main Content (Clean Background) */}
      <div className="relative z-10 min-h-screen w-full bg-white dark:bg-background flex flex-col items-center justify-center px-4">
        <h1 className="md:text-3xl text-2xl mt-5 font-bold md:mb-6 mb-3 text-center">
          Social Work Video
        </h1>

        {/* Video Card */}
        <div className="bg-white dark:bg-background md:p-2  rounded shadow-xl border max-w-4xl w-full">
          {/* Video */}
          <div className="w-full p-1 aspect-video rounded overflow-hidden">
            <iframe
              className="w-full h-full"
              src={`https://drive.google.com/file/d/${fileId}/preview`}
              title="Social Work Video"
              allow="autoplay"
              allowFullScreen
            ></iframe>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex p-5 mx-1 md:p-0 flex-col md:flex-row gap-4 justify-center">
            {/* Download Button */}
            <a
              href={`https://drive.google.com/uc?export=download&id=${fileId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="
      md:w-1/3 py-2 rounded
      bg-primary text-primary-foreground
      font-medium shadow
      hover:bg-primary/90
      focus:outline-none focus:ring-2 focus:ring-primary/50
      transition text-center
    "
            >
              Download Video
            </a>

            {/* Open Video Button */}
            <a
              href={`https://drive.google.com/file/d/${fileId}/view`}
              target="_blank"
              rel="noopener noreferrer"
              className="
      md:w-1/3 py-2 rounded
      bg-primary text-primary-foreground
      font-medium shadow
      hover:bg-primary/90
      focus:outline-none focus:ring-2 focus:ring-primary/50
      transition text-center
    "
            >
              Video Open in Google Drive
            </a>

            {/* All Photos & Videos */}
            <a
              href={`https://drive.google.com/drive/folders/1esKj--YQk1U0aKzxuukihUTi14YN_Uur?usp=sharing`}
              target="_blank"
              rel="noopener noreferrer"
              className="
      md:w-1/3 py-2 px-4 rounded
      bg-primary text-primary-foreground
      font-medium shadow
      hover:bg-primary/90
      focus:outline-none focus:ring-2 focus:ring-primary/50
      transition
      flex items-center justify-center gap-2
    "
            >
              {/* Google Drive Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="w-5 h-5"
              >
                <path
                  fill="currentColor"
                  d="M17.6 6.1L4.1 29.4l6.8 11.8L24.4 18z"
                />
                <path
                  fill="currentColor"
                  d="M30.4 6.1L24.4 18l13.5 23.3 6.8-11.8z"
                />
                <path fill="currentColor" d="M10.9 41.2h26.2l6.8-11.8H17.7z" />
              </svg>

              <span>All Photos &amp; Videos</span>
            </a>
          </div>

          {/* Description */}
          <p className="mt-6 mb-2 text-center text-muted-foreground max-w-2xl mx-auto">
            This video highlights our efforts to support Korail slum fire
            victims in 2025. Together, we stand for humanity, care, and social
            responsibility.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Video;
