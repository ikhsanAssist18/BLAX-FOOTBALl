export interface Policy {
  id: string;
  company: string;
  title: string;
  url: string;
  riskLevel: "safe" | "moderate" | "high";
  lastUpdated: string;
  summary: string;
  riskScore: number;
  dataTypes: string[];
  verified: boolean;
}

export interface User {
  id: string;
  username: string;
  name: string;
  contributions: number;
  verified: number;
  accuracy: number;
  badge: "bronze" | "silver" | "gold" | "diamond";
  joinDate: string;
  avatar: string;
  specialties: string[];
  rank: number;
  points: number;
}

export interface BadgeInfo {
  color: string;
  bgColor: string;
  textColor: string;
  icon: any;
  name: string;
}

export interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  icon: any;
  features: string[];
  buttonText: string;
  buttonStyle: string;
  popular: boolean;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

export interface Step {
  icon: any;
  title: string;
  description: string;
  color: string;
}

export interface UserType {
  icon: any;
  title: string;
  description: string;
  features: string[];
  color: string;
  bgColor: string;
  textColor: string;
}

export interface Feature {
  icon: any;
  title: string;
  description: string;
  highlight: string;
}
