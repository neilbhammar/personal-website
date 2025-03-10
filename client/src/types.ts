
export interface Experience {
  title: string;
  company?: string;
  period?: string;
  description: string;
  image?: string;
  items?: {
    title: string;
    description: string;
    image?: string;
  }[];
}
