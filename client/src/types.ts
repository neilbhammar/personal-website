export interface Story {
  title: string;
  description: string;
  image?: string;
}

export interface Experience {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  location: string;
  date: string;
  link?: string;
  stories?: Story[];
}