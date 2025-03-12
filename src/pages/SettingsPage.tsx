
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserProfile, getUserProfile } from "@/lib/firebase";
import { Loader2, User } from "lucide-react";

const profileFormSchema = z.object({
  displayName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) < 120,
    { message: "Please enter a valid age between 1-119." }
  ),
  gender: z.enum(["male", "female", "other", "prefer not to say"], {
    required_error: "Please select a gender.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const SettingsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: "",
      age: "",
      gender: "prefer not to say",
    },
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (currentUser) {
          const userProfile = await getUserProfile(currentUser.uid);
          if (userProfile) {
            form.reset({
              displayName: userProfile.displayName || "",
              age: userProfile.age ? String(userProfile.age) : "",
              gender: userProfile.gender || "prefer not to say",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile. Please try again.",
          variant: "destructive",
        });
      } finally {
        setInitializing(false);
      }
    };

    fetchUserProfile();
  }, [currentUser, form, toast]);

  async function onSubmit(data: ProfileFormValues) {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      await updateUserProfile(currentUser.uid, {
        displayName: data.displayName,
        age: Number(data.age),
        gender: data.gender,
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container py-8 max-w-md animate-fade-in">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Settings
            </CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {initializing ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input placeholder="25" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer not to say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/dashboard")}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SettingsPage;
