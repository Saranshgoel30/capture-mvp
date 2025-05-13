
import React, { useState, useRef } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { addPortfolioItem } from '@/lib/supabase/portfolio';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  type: z.string().min(1, { message: "Project type is required" }),
  role: z.string().min(1, { message: "Your role is required" }),
  date: z.string().min(1, { message: "Project date is required" }),
  description: z.string().optional(),
  collaborators: z.string().optional(),
  mediaType: z.enum(['image', 'video', 'link']),
  mediaUrl: z.string().min(1, { message: "Please provide a media URL" })
});

interface AddPortfolioItemFormProps {
  onSuccess?: () => void;
}

const AddPortfolioItemForm: React.FC<AddPortfolioItemFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "",
      role: "",
      date: "",
      description: "",
      collaborators: "",
      mediaType: "link",
      mediaUrl: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to add portfolio items",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Format collaborators as an array
      const collaboratorsArray = values.collaborators 
        ? values.collaborators.split(',').map(item => item.trim()).filter(Boolean) 
        : [];

      const result = await addPortfolioItem({
        profileId: user.id,
        title: values.title,
        type: values.type,
        role: values.role,
        date: values.date,
        description: values.description || "",
        collaborators: collaboratorsArray,
        mediaType: values.mediaType,
        thumbnail: values.mediaUrl
      });

      if (result) {
        toast({
          title: "Portfolio item added",
          description: "Your project has been added to your portfolio"
        });
        form.reset();
        setDialogOpen(false);
        if (onSuccess) onSuccess();
      } else {
        throw new Error("Failed to add portfolio item");
      }
    } catch (error: any) {
      console.error("Error adding portfolio item:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add portfolio item",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button id="portfolio-dialog-trigger" ref={triggerButtonRef} className="hidden">
            Add Portfolio Item
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add to Portfolio</DialogTitle>
            <DialogDescription>
              Showcase your work by adding a project to your portfolio
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Short Film, Documentary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Role</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Director, Cinematographer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Date</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., June 2023" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="collaborators"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Collaborators (comma-separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Doe, Jane Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of the project" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mediaType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Media Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="image" />
                          </FormControl>
                          <FormLabel className="font-normal">Image</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="video" />
                          </FormControl>
                          <FormLabel className="font-normal">Video</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="link" />
                          </FormControl>
                          <FormLabel className="font-normal">External Link</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mediaUrl"
                render={({ field }) => {
                  const mediaType = form.watch("mediaType");
                  
                  let placeholder = "Enter URL";
                  if (mediaType === "image") {
                    placeholder = "Enter image URL or upload";
                  } else if (mediaType === "video") {
                    placeholder = "Enter YouTube, Vimeo URL or direct video link";
                  } else if (mediaType === "link") {
                    placeholder = "Enter website or project link";
                  }
                  
                  return (
                    <FormItem>
                      <FormLabel>
                        {mediaType === "image" ? "Image URL" : 
                         mediaType === "video" ? "Video URL" : "External Link"}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={placeholder} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add to Portfolio
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddPortfolioItemForm;
