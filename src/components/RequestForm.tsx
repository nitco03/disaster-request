
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { addRequest, getCurrentUser } from "@/lib/firebase";
import { classifyRequest } from "@/lib/gemini";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." })
    .max(500, { message: "Description must be less than 500 characters." }),
  location: z.string().min(3, { message: "Location is required." }),
  phoneNumber: z
    .string()
    .min(10, { message: "Please enter a valid phone number." })
    .regex(/^\+?[0-9\s\-()]+$/, { message: "Invalid phone number format." }),
});

export const RequestForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      location: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      console.log("Submitting request with description:", values.description);
      
      // Classify the request using Gemini AI
      const isUrgent = await classifyRequest(values.description);
      console.log("Request classification result:", isUrgent);

      // Add the request to Firestore
      await addRequest({
        userId: currentUser.uid,
        userEmail: currentUser.email || "unknown@email.com",
        description: values.description,
        location: values.location,
        phoneNumber: values.phoneNumber,
        isUrgent,
      });

      toast({
        title: "Request Submitted",
        description: isUrgent 
          ? "Your request has been classified as urgent and submitted successfully."
          : "Your request has been submitted successfully.",
      });
      
      form.reset();
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error submitting request:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your request.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto glass">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Submit a Request</CardTitle>
        <CardDescription>Enter the details of your request</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your situation in detail..." 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Your current location..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <Button variant="outline" onClick={() => navigate("/dashboard")} disabled={isLoading}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
};
