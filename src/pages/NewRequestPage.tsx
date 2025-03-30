
import { Header } from "@/components/Header";
import { RequestForm } from "@/components/RequestForm";

const NewRequestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container py-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-6">Disaster Aid</h1>
        <RequestForm />
      </main>
    </div>
  );
};

export default NewRequestPage;
