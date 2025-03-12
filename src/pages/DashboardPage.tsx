
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { RequestCard } from "@/components/RequestCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getAllRequests, Request } from "@/lib/firebase";
import { PlusCircle, RefreshCw } from "lucide-react";

const DashboardPage: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      const fetchedRequests = await getAllRequests();
      setRequests(fetchedRequests);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast({
        title: "Error",
        description: "Failed to load requests. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRequests();
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container py-6 max-w-4xl animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Request Feed</h1>
            <p className="text-muted-foreground">
              View and respond to community requests
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-2 hidden sm:inline">Refresh</span>
            </Button>
            <Button asChild>
              <Link to="/new-request">
                <PlusCircle className="h-4 w-4 mr-2" />
                New Request
              </Link>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
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
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        ) : (
          <div className="text-center p-12 rounded-lg border border-dashed">
            <h3 className="font-medium text-lg">No requests yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to create a request for assistance
            </p>
            <Button asChild>
              <Link to="/new-request">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Request
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
