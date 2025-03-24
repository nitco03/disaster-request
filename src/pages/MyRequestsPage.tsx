
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { RequestCard } from "@/components/RequestCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getUserRequests, Request } from "@/lib/firebase";
import { PlusCircle } from "lucide-react";

const MyRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const fetchUserRequests = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const userRequests = await getUserRequests(currentUser.uid);
      setRequests(userRequests);
    } catch (error) {
      console.error("Error fetching user requests:", error);
      toast({
        title: "Error",
        description: "Failed to load your aid requests. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRequests();
  }, [currentUser, toast]);

  const handleRequestDelete = () => {
    fetchUserRequests();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container py-6 max-w-4xl animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Aid Requests</h1>
            <p className="text-muted-foreground">
              Manage your submitted disaster aid requests
            </p>
          </div>
          <Button asChild>
            <Link to="/new-request">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Aid Request
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg border p-4 h-48 flex flex-col justify-between"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="h-5 bg-muted rounded w-1/3"></div>
                  <div className="h-5 bg-muted rounded w-1/5"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                  <div className="h-4 bg-muted rounded w-4/6"></div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-2/6"></div>
                  <div className="h-4 bg-muted rounded w-2/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : requests.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {requests.map((request) => (
              <RequestCard 
                key={request.id} 
                request={request} 
                showDeleteButton={true}
                onDelete={handleRequestDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-12 rounded-lg border border-dashed">
            <h3 className="font-medium text-lg">No aid requests yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't created any disaster aid requests yet
            </p>
            <Button asChild>
              <Link to="/new-request">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Aid Request
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyRequestsPage;
