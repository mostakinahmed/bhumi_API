import { StarBackground } from "@/components/StarBackground";

import Footer from "../components/Footer";
import Home2 from "../components/Home2";

export const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* <StarBackground /> */}

      <main>
        <Home2 />
      </main>

      <Footer />
    </div>
  );
};
