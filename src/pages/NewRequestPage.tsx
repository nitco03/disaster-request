
import { Header } from "@/components/Header";
import { RequestForm } from "@/components/RequestForm";

const NewRequestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container py-8 animate-fade-in">
        <RequestForm />
      </main>
    </div>
  );
};

export default NewRequestPage;
