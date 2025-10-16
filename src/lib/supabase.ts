import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SteelType = {
  id: string;
  code: string;
  name: string;
  category: string;
  composition: Record<string, any>;
  properties: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export type WorkInstruction = {
  id: string;
  it_code: string;
  title: string;
  description: string;
  treatment_type: string;
  temperature_min: number | null;
  temperature_max: number | null;
  duration_min: number | null;
  duration_max: number | null;
  cooling_method: string;
  applicable_steels: string[];
  hardness_input_min: number | null;
  hardness_input_max: number | null;
  hardness_output_min: number | null;
  hardness_output_max: number | null;
  special_notes: string;
  file_url: string;
  is_active: boolean;
  version: string;
  created_at: string;
  updated_at: string;
};

export type Recommendation = {
  id: string;
  steel_type_id: string;
  work_instruction_id: string;
  input_hardness: number | null;
  desired_hardness: number | null;
  client_requirements: Record<string, any>;
  recommendation_reason: string;
  confidence_score: number;
  user_name: string;
  client_name: string;
  piece_description: string;
  created_at: string;
};

export type Feedback = {
  id: string;
  recommendation_id: string;
  was_successful: boolean;
  actual_hardness: number | null;
  comments: string;
  user_name: string;
  created_at: string;
};

export type KnowledgeBase = {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  related_its: string[];
  upvotes: number;
  created_at: string;
  updated_at: string;
};
