import { Navbar } from "../components/Navbar";
import { ThemeToggle } from "../components/ThemeToggle";
import { StarBackground } from "@/components/StarBackground";

import { Footer } from "../components/Footer";
import  Home2  from "../components/Home2";

export const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Theme Toggle */}


      {/* Background Effects */}
      {/* <StarBackground /> */}

      {/* Navbar */}
    
      {/* Main Content */}
      <main>
        <Home2 />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
