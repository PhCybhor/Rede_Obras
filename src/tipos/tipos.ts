import type { LucideIcon } from "lucide-react";

export interface NavLink {
  label: string;
  href: string;
}

export interface Partner {
  name: string;
}

export interface Feature {
  icon: LucideIcon;

  color: string;

  bg: string;
  title: string;
  description: string;
}

export interface Stat {

  value: number;

  suffix: string;

  prefix?: string;
  label: string;
  description: string;
}

export interface Step {

  number: string;
  icon: LucideIcon;
  color: string;
  title: string;
  description: string;
}

export interface Testimonial {
  name: string;
  role: string;

  avatar: string;

  color: string;
  rating: number;
  text: string;
}

export interface FormField {
  label: string;
  placeholder: string;
  type: string;
}

export interface FooterLinkGroup {
  category: string;
  links: string[];
}

export interface ContactItem {
  icon: LucideIcon;
  text: string;
}
