
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

export interface NotificationDB {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  related_id: string;
  related_type: string;
  created_at: string;
}
