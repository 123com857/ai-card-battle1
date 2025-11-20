export interface ResumeProfile {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  summary: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
}

export interface ResumeData {
  profile: ResumeProfile;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
}

export type TemplateId = 
  | 'classic' 
  | 'modern' 
  | 'minimal' 
  | 'sidebar' 
  | 'tech' 
  | 'creative' 
  | 'elegant' 
  | 'bold';

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  description: string;
  thumbnailColor: string;
}