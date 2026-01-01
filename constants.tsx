
import React from 'react';
import { Youtube, Instagram, Twitter, MessageCircle, Send } from 'lucide-react';
import { Project, Edit, AboutContent } from './types';

export const INITIAL_ABOUT: AboutContent = {
  bio: "Hi! I'm LuhvReuben. I love guinea pigs 🐹, playing Roblox, Minecraft, and GTA 🎮, and creating edits ✂️.",
  age: "16",
  orientation: "Bisexual 🌈",
  hobbies: ["Guinea Pigs 🐹", "Roblox", "Minecraft", "GTA 🎮", "Edits ✂️"],
  foods: ["Pizza 🍕", "Sushi 🍣"],
  drink: "Monster Energy 🥤"
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    name: "Jack's Awesome Sword Fight Update",
    description: "Adding secret teleport block and new weapon skins.",
    status: 'In Progress'
  },
  {
    id: '2',
    name: "New Edit Compilation",
    description: "YouTube & TikTok shorts featuring my best GTA stunts.",
    status: 'Planned'
  },
  {
    id: '3',
    name: "Minecraft Mod Pack",
    description: "Custom guinea pig themed modpack for my community.",
    status: 'Completed'
  }
];

export const INITIAL_EDITS: Edit[] = [
  {
    id: '1',
    title: "Gaming Vibes 2026",
    thumbnail: "https://picsum.photos/seed/edit1/600/400",
    videoUrl: "https://youtube.com"
  },
  {
    id: '2',
    title: "GTA Neon Night",
    thumbnail: "https://picsum.photos/seed/edit2/600/400",
    videoUrl: "https://tiktok.com"
  },
  {
    id: '3',
    title: "Minecraft Aesthetics",
    thumbnail: "https://picsum.photos/seed/edit3/600/400",
    videoUrl: "https://youtube.com"
  },
  {
    id: '4',
    title: "The Guinea Pig Edit",
    thumbnail: "https://picsum.photos/seed/edit4/600/400",
    videoUrl: "https://tiktok.com"
  }
];

export const SOCIAL_LINKS = [
  { name: 'YouTube', icon: <Youtube className="w-6 h-6" />, url: '#' },
  { name: 'TikTok', icon: <MessageCircle className="w-6 h-6" />, url: '#' },
  { name: 'Instagram', icon: <Instagram className="w-6 h-6" />, url: '#' },
  { name: 'Snapchat', icon: <Send className="w-6 h-6" />, url: '#' }
];
