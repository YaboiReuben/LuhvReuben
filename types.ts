
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'In Progress' | 'Completed' | 'Planned';
}

export interface Edit {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

export interface AboutContent {
  bio: string;
  age: string;
  orientation: string;
  hobbies: string[];
  foods: string[];
  drink: string;
}
