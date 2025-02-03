import { AppGrid } from "@/components/AppGrid";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <AppGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Index;