import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  recruiterId: string; // Links to User._id
  title: string;
  description: string;
  parsed_text?: string;
  requirements: {
    skills: string[];
    preferred_skills?: string[];
    experience_years: number;
    education_level: string;
    certifications?: string[];
    keywords: string[];
    responsibilities?: string[];
  };
}

const JobSchema: Schema = new Schema({
  recruiterId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  parsed_text: { type: String },
  requirements: {
    skills: [String],
    preferred_skills: [String],
    experience_years: Number,
    education_level: String,
    certifications: [String],
    keywords: [String],
    responsibilities: [String]
  }
}, { timestamps: true });

export default mongoose.model<IJob>('Job', JobSchema);
