
import { LoginForm } from "@/components/LoginForm";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Disaster Aid</h1>
          <p className="text-muted-foreground mt-2">Connect and request assistance</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
