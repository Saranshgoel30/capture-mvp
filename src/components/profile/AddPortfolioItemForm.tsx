
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Link as LinkIcon, Image as ImageIcon, FileVideo } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { addPortfolioItem } from '@/lib/supabase/portfolio';
import { uploadPortfolioMedia } from '@/lib/supabase/storage';

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.string().min(1, "Project type is required"),
  role: z.string().min(1, "Your role is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().min(1, "Description is required"),
  mediaUrl: z.string().optional(),
  mediaType: z.enum(['link', 'image', 'video']).default('link'),
  collaborators: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const AddPortfolioItemForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaTab, setMediaTab] = useState<'link' | 'image' | 'video'>('link');
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      type: '',
      role: '',
      date: '',
      description: '',
      mediaUrl: '',
      mediaType: 'link',
      collaborators: ''
    }
  });

  const handleSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to add portfolio items",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      let finalMediaUrl = values.mediaUrl || '';

      // If there's a file upload, process it first
      if (mediaFile) {
        try {
          finalMediaUrl = await uploadPortfolioMedia(user.id, mediaFile);
        } catch (error) {
          console.error('Error uploading media:', error);
          toast({
            title: "Upload failed",
            description: "Failed to upload media file. Please try again.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
      }

      const portfolioData = {
        title: values.title,
        type: values.type,
        role: values.role,
        date: values.date,
        description: values.description,
        mediaUrl: finalMediaUrl,
        mediaType: values.mediaType,
        collaborators: values.collaborators ? values.collaborators.split(',').map(c => c.trim()) : []
      };

      await addPortfolioItem(user.id, portfolioData);
      
      toast({
        title: "Portfolio item added",
        description: "Your portfolio item has been successfully added"
      });
      
      form.reset();
      setMediaFile(null);
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      toast({
        title: "Error",
        description: "Failed to add portfolio item. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setMediaFile(files[0]);
    }
  };

  const projectTypes = [
    "Short Film",
    "Music Video",
    "Photography",
    "Documentary",
    "Commercial",
    "Marketing",
    "Podcast",
    "Art Installation",
    "Animation",
    "Other"
  ];

  const commonRoles = [
    "Director",
    "Producer",
    "Cinematographer",
    "Editor",
    "Writer",
    "Sound Designer",
    "Actor/Actress",
    "Photographer",
    "Art Director",
    "Composer",
    "VFX Artist",
    "Set Designer",
    "Costume Designer",
    "Makeup Artist",
    "Gaffer",
    "Production Assistant",
    "Other"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button id="portfolio-dialog-trigger" className="hidden">Add Portfolio</button>
      </DialogTrigger>
      <Button variant="outline" className="w-full h-36 border-dashed flex flex-col gap-2" id="add-portfolio-button" onClick={() => setIsOpen(true)}>
        <Plus size={24} />
        <span>Add Portfolio Project</span>
      </Button>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Portfolio Project</DialogTitle>
          <DialogDescription>
            Showcase your work to potential collaborators
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Type*</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                      defaultValue=""
                    >
                      <option value="" disabled>Select a project type</option>
                      {projectTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
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
                  <FormLabel>Your Role*</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                      defaultValue=""
                    >
                      <option value="" disabled>Select your role</option>
                      {commonRoles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date*</FormLabel>
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description*</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your project" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Project Media</FormLabel>
              <Tabs 
                defaultValue="link" 
                value={mediaTab}
                onValueChange={(value) => {
                  setMediaTab(value as 'link' | 'image' | 'video');
                  form.setValue('mediaType', value as 'link' | 'image' | 'video');
                }}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="link">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Link
                  </TabsTrigger>
                  <TabsTrigger value="image">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Image
                  </TabsTrigger>
                  <TabsTrigger value="video">
                    <FileVideo className="h-4 w-4 mr-2" />
                    Video
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="link">
                  <FormField
                    control={form.control}
                    name="mediaUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            placeholder="Enter URL to your project (e.g., YouTube, Vimeo)" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="image">
                  <div className="space-y-2">
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {mediaFile && (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground mb-2">
                          Selected: {mediaFile.name}
                        </p>
                        {mediaFile.type.startsWith('image/') && (
                          <div className="relative w-full h-32 bg-secondary/20 rounded-md overflow-hidden">
                            <img 
                              src={URL.createObjectURL(mediaFile)} 
                              alt="Preview" 
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="video">
                  <div className="space-y-2">
                    <Input 
                      type="file" 
                      accept="video/*"
                      onChange={handleFileChange}
                    />
                    {mediaFile && (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground mb-2">
                          Selected: {mediaFile.name}
                        </p>
                        {mediaFile.type.startsWith('video/') && (
                          <div className="relative w-full h-32 bg-secondary/20 rounded-md overflow-hidden">
                            <video 
                              src={URL.createObjectURL(mediaFile)} 
                              controls
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : "Add to Portfolio"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPortfolioItemForm;
