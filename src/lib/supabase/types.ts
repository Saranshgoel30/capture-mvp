
// Define the Application type that was missing
export interface Application {
  id: string;
  project_id: string;
  applicant_id: string;
  status: string;
  motivation?: string;
  created_at: string;
  applicant_profile?: {
    avatar_url?: string;
    full_name?: string;
  };
}
