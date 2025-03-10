
export interface Experience {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  period?: string;
  company?: string;
  items?: ExperienceItem[];
}

export interface ExperienceItem {
  title: string;
  description: string;
  image?: string;
}
