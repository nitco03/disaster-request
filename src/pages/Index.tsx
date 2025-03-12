
import { Navigate } from "react-router-dom";

const Index: React.FC = () => {
  // Redirect from root to login page
  return <Navigate to="/login" />;
};

export default Index;
