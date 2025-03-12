
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock } from "lucide-react";
import { Request } from "@/lib/firebase";
import { formatDistanceToNow } from "date-fns";

interface RequestCardProps {
  request: Request;
}

export const RequestCard: React.FC<RequestCardProps> = ({ request }) => {
  return (
    <Card className={`w-full ${request.isUrgent ? 'border-urgent border-2 animate-scale-in' : 'animate-fade-in'}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{request.userEmail.split('@')[0]}</CardTitle>
          {request.isUrgent && (
            <Badge variant="destructive" className="bg-urgent hover:bg-urgent/90">
              Urgent
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
    </Card>
  );
};
