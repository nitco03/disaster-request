
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, User, Trash2, AlertTriangle } from "lucide-react";
import { Request, deleteRequest } from "@/lib/firebase";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface RequestCardProps {
  request: Request;
  onDelete?: () => void;
  showDeleteButton?: boolean;
}

export const RequestCard: React.FC<RequestCardProps> = ({ request, onDelete, showDeleteButton = false }) => {
  // Display email username since userName is no longer available
  const displayName = request.userEmail.split('@')[0];
  
  const handleDelete = async () => {
    try {
      if (request.id) {
        await deleteRequest(request.id);
        toast({
          title: "Aid request deleted",
          description: "Your aid request has been successfully deleted.",
        });
        if (onDelete) onDelete();
      }
    } catch (error) {
      console.error("Error deleting request:", error);
      toast({
        title: "Error",
        description: "Failed to delete aid request. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className={`w-full ${request.isUrgent ? 'border-urgent border-2 animate-scale-in' : 'animate-fade-in'}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold flex items-center gap-1">
            <User className="h-4 w-4" />
            {displayName}
          </CardTitle>
          {request.isUrgent && (
            <Badge variant="destructive" className="bg-urgent hover:bg-urgent/90">
              <AlertTriangle className="h-3 w-3 mr-1" /> Urgent
            </Badge>
          )}
        </div>
        <CardDescription className="flex items-center text-sm gap-1">
          <Clock className="h-3.5 w-3.5" />
          {formatDistanceToNow(request.createdAt.toDate(), { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm md:text-base mb-4">{request.description}</p>
        <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{request.location}</span>
          </div>
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2" />
            <span>{request.phoneNumber}</span>
          </div>
        </div>
      </CardContent>
      {showDeleteButton && (
        <CardFooter className="pt-0 justify-end">
          <Button variant="outline" size="sm" onClick={handleDelete} className="text-destructive hover:text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
