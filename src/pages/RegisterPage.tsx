
import { RegisterForm } from "@/components/RegisterForm";

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Emergency Response</h1>
          <p className="text-muted-foreground mt-2">Create an account to get started</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
