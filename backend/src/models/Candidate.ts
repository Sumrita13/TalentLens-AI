import mongoose, { Schema, Document } from 'mongoose';

export interface ICandidate extends Document {
  candidate_id: string;
  profile: {
    anonymized_name: string;
    headline: string;
    summary: string;
    location: string;
    country: string;
    years_of_experience: number;
    current_title: string;
    current_company: string;
    current_company_size: string;
    current_industry: string;
  };
  career_history: {
    company: string;
    title: string;
    start_date: string;
    end_date?: string | null;
    duration_months: number;
    is_current: boolean;
    industry: string;
    company_size: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    field_of_study: string;
    start_year: number;
    end_year: number;
    grade?: string | null;
    tier: "tier_1" | "tier_2" | "tier_3" | "tier_4" | "unknown";
  }[];
  skills: {
    name: string;
    proficiency: "beginner" | "intermediate" | "advanced" | "expert";
    endorsements: number;
    duration_months: number;
  }[];
  certifications?: {
    name: string;
    issuer: string;
    year: number;
  }[];
  languages?: {
    language: string;
    proficiency: "basic" | "conversational" | "professional" | "native";
  }[];
  redrob_signals: {
    profile_completeness_score: number;
    signup_date: string;
    last_active_date: string;
    open_to_work_flag: boolean;
    profile_views_received_30d: number;
    applications_submitted_30d: number;
    recruiter_response_rate: number;
    avg_response_time_hours: number;
    skill_assessment_scores: Record<string, number>;
    connection_count: number;
    endorsements_received: number;
    notice_period_days: number;
    expected_salary_range_inr_lpa: { min: number; max: number };
    preferred_work_mode: "remote" | "hybrid" | "onsite" | "flexible";
    willing_to_relocate: boolean;
    github_activity_score: number;
    search_appearance_30d: number;
    saved_by_recruiters_30d: number;
    interview_completion_rate: number;
    offer_acceptance_rate: number;
    verified_email: boolean;
    verified_phone: boolean;
    linkedin_connected: boolean;
  };
}

const CandidateSchema: Schema = new Schema({
  candidate_id: { type: String, required: true, unique: true },
  profile: {
    anonymized_name: String,
    headline: String,
    summary: String,
    location: String,
    country: String,
    years_of_experience: Number,
    current_title: String,
    current_company: String,
    current_company_size: String,
    current_industry: String
  },
  career_history: [{
    company: String,
    title: String,
    start_date: String,
    end_date: String,
    duration_months: Number,
    is_current: Boolean,
    industry: String,
    company_size: String,
    description: String
  }],
  education: [{
    institution: String,
    degree: String,
    field_of_study: String,
    start_year: Number,
    end_year: Number,
    grade: String,
    tier: { type: String, enum: ["tier_1", "tier_2", "tier_3", "tier_4", "unknown"] }
  }],
  skills: [{
    name: String,
    proficiency: { type: String, enum: ["beginner", "intermediate", "advanced", "expert"] },
    endorsements: Number,
    duration_months: Number
  }],
  certifications: [{
    name: String,
    issuer: String,
    year: Number
  }],
  languages: [{
    language: String,
    proficiency: { type: String, enum: ["basic", "conversational", "professional", "native"] }
  }],
  redrob_signals: {
    profile_completeness_score: Number,
    signup_date: String,
    last_active_date: String,
    open_to_work_flag: Boolean,
    profile_views_received_30d: Number,
    applications_submitted_30d: Number,
    recruiter_response_rate: Number,
    avg_response_time_hours: Number,
    skill_assessment_scores: { type: Map, of: Number },
    connection_count: Number,
    endorsements_received: Number,
    notice_period_days: Number,
    expected_salary_range_inr_lpa: { min: Number, max: Number },
    preferred_work_mode: { type: String, enum: ["remote", "hybrid", "onsite", "flexible"] },
    willing_to_relocate: Boolean,
    github_activity_score: Number,
    search_appearance_30d: Number,
    saved_by_recruiters_30d: Number,
    interview_completion_rate: Number,
    offer_acceptance_rate: Number,
    verified_email: Boolean,
    verified_phone: Boolean,
    linkedin_connected: Boolean
  }
}, { timestamps: true });

export default mongoose.model<ICandidate>('Candidate', CandidateSchema);
