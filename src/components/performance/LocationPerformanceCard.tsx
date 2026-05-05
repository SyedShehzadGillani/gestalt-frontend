import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TrendingUp, TrendingDown, ChevronRight, X, Link, Unlink, GripVertical, Minus, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RoleFilter } from './RoleFilter';
import { BarChart, Bar, XAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CLINIC_NAMES } from "@/lib/clinics";
import SortableEmployeeDetailCard from './SortableEmployeeDetailCard';

// Clinic exterior images - modern medical buildings
const CLINIC_IMAGES = [
  "/lovable-uploads/4aff239e-621a-4a89-a8a5-6d2e1931b19a.png",
  "/lovable-uploads/2a989aff-8d8f-4cdc-a680-145e300520ea.png",
  "/lovable-uploads/fe775171-19f1-4c84-839c-e0d8b4a6d021.png",
  "/lovable-uploads/e47e1bc6-5a65-40f6-bde6-bd7ca5ba948d.png",
  "/lovable-uploads/bc0c3d76-90f3-4988-824b-ae06c50ec719.png",
  "/lovable-uploads/442a1bdf-7f75-4e6d-aaa7-2946749712e7.png",
  "/lovable-uploads/32e50dff-6785-43f7-93e3-1d2de5c3a88a.png",
  "/lovable-uploads/e47c45ca-9324-4e6a-ae3f-faf36e9b2246.png",
  "/lovable-uploads/d51249fc-cace-45a7-9b81-5561a703ba85.png"
];

const VGH_MAIN_IMAGE = "/lovable-uploads/ffed1afe-3cf1-45ec-9f7d-fcee57c6ad89.png"; // Exclusive architectural image for VGH Medical Center

// Function to get clinic image by index
const getClinicImage = (index: number) => {
  return CLINIC_IMAGES[index % CLINIC_IMAGES.length];
};

interface LocationMetrics {
  current: number;
  past: number;
  target: number;
  unit?: string;
}

interface QuadrantData {
  name: "Personal" | "Patient" | "Staff" | "Knowledge";
  value: number;
  color: string;
}

interface Employee {
  id: string;
  name: string;
  role: string;
  gender?: 'male' | 'female';
  image?: string | null;
  quadrants: QuadrantData[];
  trend: number;
  homeClinicId?: string;
  productivityScore: number;
  previousReviewChange: number;
}

interface Clinic {
  id: string;
  name: string;
  score: number;
  previousScore?: number;
  trend: number;
  scoreHistory?: number[];
  quadrants: QuadrantData[];
  employees: Employee[];
  growthOpportunity: number;
}

interface LocationPerformance {
  id: string;
  name: string;
  image: string;
  overallScore: number;
  growthOpportunity: number;
  status: "excellent" | "good" | "warning" | "poor";
  metrics: {
    revenue: LocationMetrics;
    employees: LocationMetrics;
    satisfaction: LocationMetrics;
    capacity: LocationMetrics;
  };
  quadrants: QuadrantData[];
  trend: number;
}

interface LocationPerformanceCardProps {
  location: LocationPerformance;
}

// Static employee-clinic mapping with persistent identities
interface EmployeeTemplate {
  name: string;
  role: string;
  gender: 'male' | 'female';
  image: string;
  clinicName: string;
}

// Static employee data with specific clinic assignments
const STATIC_EMPLOYEES: EmployeeTemplate[] = [
  // PALM CITY Clinic - Joseph X. Johnson is here (12 employees)
  { name: 'Joseph X. Johnson', role: 'PHYSICIAN', gender: 'male', image: '/lovable-uploads/david-johnson.png', clinicName: 'PALM CITY' },
  { name: 'Sarah M. Wilson', role: 'NURSE', gender: 'female', image: '/lovable-uploads/75473734-e5e2-4661-acce-6f16706dadef.png', clinicName: 'PALM CITY' },
  { name: 'Michael R. Davis', role: 'SURGEON', gender: 'male', image: '/lovable-uploads/michael-anderson.png', clinicName: 'PALM CITY' },
  { name: 'Emily K. Brown', role: 'RECEPTION', gender: 'female', image: '/lovable-uploads/aabea5a3-1876-4b8a-9760-ffa13a5807c3.png', clinicName: 'PALM CITY' },
  { name: 'David T. Miller', role: 'TECH', gender: 'male', image: '/lovable-uploads/daniel-miller.png', clinicName: 'PALM CITY' },
  { name: 'Jennifer L. Garcia', role: 'THERAPIST', gender: 'female', image: '/lovable-uploads/7d233a7b-4c54-4b46-bad5-fe3a55304c56.png', clinicName: 'PALM CITY' },
  { name: 'Christopher A. Rodriguez', role: 'SPECIALIST', gender: 'male', image: '/lovable-uploads/christopher-brown.png', clinicName: 'PALM CITY' },
  { name: 'Amanda S. Williams', role: 'COORDINATOR', gender: 'female', image: '/lovable-uploads/e0b5a137-a953-4146-9249-a1d3d3366b19.png', clinicName: 'PALM CITY' },
  { name: 'Robert E. Harrison', role: 'PHYSICIAN', gender: 'male', image: '/lovable-uploads/robert-davis.png', clinicName: 'PALM CITY' },
  { name: 'Maria C. Torres', role: 'NURSE', gender: 'female', image: '/lovable-uploads/e54dce2e-0546-4afd-af4c-ff46b53ef0e4.png', clinicName: 'PALM CITY' },
  { name: 'Gregory P. Collins', role: 'ADMIN', gender: 'male', image: '/lovable-uploads/tom-zimmermann.png', clinicName: 'PALM CITY' },
  { name: 'Patricia J. Morgan', role: 'PHARMACIST', gender: 'female', image: '/lovable-uploads/aabea5a3-1876-4b8a-9760-ffa13a5807c3.png', clinicName: 'PALM CITY' },
  
  // ST LUCIE PARK Clinic (12 employees)
  { name: 'Tom B. Zimmermann', role: 'SURGEON', gender: 'male', image: '/lovable-uploads/tom-zimmermann.png', clinicName: 'ST LUCIE PARK' },
  { name: 'Marcus F. Stone', role: 'PHYSICIAN', gender: 'male', image: '/lovable-uploads/marcus-stone.png', clinicName: 'ST LUCIE PARK' },
  { name: 'Lisa H. Thompson', role: 'NURSE', gender: 'female', image: '/lovable-uploads/75473734-e5e2-4661-acce-6f16706dadef.png', clinicName: 'ST LUCIE PARK' },
  { name: 'Robert C. Martinez', role: 'TECH', gender: 'male', image: '/lovable-uploads/robert-davis.png', clinicName: 'ST LUCIE PARK' },
  { name: 'Michelle D. Anderson', role: 'RECEPTION', gender: 'female', image: '/lovable-uploads/aabea5a3-1876-4b8a-9760-ffa13a5807c3.png', clinicName: 'ST LUCIE PARK' },
  { name: 'James G. Wilson', role: 'SPECIALIST', gender: 'male', image: '/lovable-uploads/james-wilson.png', clinicName: 'ST LUCIE PARK' },
  { name: 'Karen P. Taylor', role: 'ADMIN', gender: 'female', image: '/lovable-uploads/7d233a7b-4c54-4b46-bad5-fe3a55304c56.png', clinicName: 'ST LUCIE PARK' },
  { name: 'Benjamin F. Cooper', role: 'PHYSICIAN', gender: 'male', image: '/lovable-uploads/andrew-garcia.png', clinicName: 'ST LUCIE PARK' },
  { name: 'Diana L. Reed', role: 'NURSE', gender: 'female', image: '/lovable-uploads/e0b5a137-a953-4146-9249-a1d3d3366b19.png', clinicName: 'ST LUCIE PARK' },
  { name: 'Timothy R. Bailey', role: 'THERAPIST', gender: 'male', image: '/lovable-uploads/kevin-williams.png', clinicName: 'ST LUCIE PARK' },
  { name: 'Janet K. Rivera', role: 'COORDINATOR', gender: 'female', image: '/lovable-uploads/e54dce2e-0546-4afd-af4c-ff46b53ef0e4.png', clinicName: 'ST LUCIE PARK' },
  { name: 'Alexander M. Campbell', role: 'OD', gender: 'male', image: '/lovable-uploads/brian-martinez.png', clinicName: 'ST LUCIE PARK' },
  
  // JENSEN BEACH Clinic (12 employees)
  { name: 'Andrew J. Garcia', role: 'PHYSICIAN', gender: 'male', image: '/lovable-uploads/andrew-garcia.png', clinicName: 'JENSEN BEACH' },
  { name: 'Matthew Q. Rodriguez', role: 'SURGEON', gender: 'male', image: '/lovable-uploads/matthew-rodriguez.png', clinicName: 'JENSEN BEACH' },
  { name: 'Jessica N. Clark', role: 'NURSE', gender: 'female', image: '/lovable-uploads/e0b5a137-a953-4146-9249-a1d3d3366b19.png', clinicName: 'JENSEN BEACH' },
  { name: 'Kevin V. Williams', role: 'THERAPIST', gender: 'male', image: '/lovable-uploads/kevin-williams.png', clinicName: 'JENSEN BEACH' },
  { name: 'Amy R. Lewis', role: 'RECEPTION', gender: 'female', image: '/lovable-uploads/75473734-e5e2-4661-acce-6f16706dadef.png', clinicName: 'JENSEN BEACH' },
  { name: 'Brian W. Martinez', role: 'TECH', gender: 'male', image: '/lovable-uploads/brian-martinez.png', clinicName: 'JENSEN BEACH' },
  { name: 'Catherine H. Stewart', role: 'PHYSICIAN', gender: 'female', image: '/lovable-uploads/aabea5a3-1876-4b8a-9760-ffa13a5807c3.png', clinicName: 'JENSEN BEACH' },
  { name: 'Joseph A. Morris', role: 'SPECIALIST', gender: 'male', image: '/lovable-uploads/christopher-brown.png', clinicName: 'JENSEN BEACH' },
  { name: 'Susan D. Ward', role: 'NURSE', gender: 'female', image: '/lovable-uploads/7d233a7b-4c54-4b46-bad5-fe3a55304c56.png', clinicName: 'JENSEN BEACH' },
  { name: 'Roger T. Foster', role: 'ADMIN', gender: 'male', image: '/lovable-uploads/daniel-miller.png', clinicName: 'JENSEN BEACH' },
  { name: 'Rachel S. Hughes', role: 'COORDINATOR', gender: 'female', image: '/lovable-uploads/e54dce2e-0546-4afd-af4c-ff46b53ef0e4.png', clinicName: 'JENSEN BEACH' },
  { name: 'Nicholas B. Price', role: 'PHARMACIST', gender: 'male', image: '/lovable-uploads/michael-anderson.png', clinicName: 'JENSEN BEACH' },
  
  // STUART Clinic (12 employees)
  { name: 'Daniel E. Miller', role: 'OD', gender: 'male', image: '/lovable-uploads/daniel-miller.png', clinicName: 'STUART' },
  { name: 'Nancy O. Lee', role: 'NURSE', gender: 'female', image: '/lovable-uploads/aabea5a3-1876-4b8a-9760-ffa13a5807c3.png', clinicName: 'STUART' },
  { name: 'William I. Walker', role: 'PHYSICIAN', gender: 'male', image: '/lovable-uploads/michael-anderson.png', clinicName: 'STUART' },
  { name: 'Sandra U. Hall', role: 'COORDINATOR', gender: 'female', image: '/lovable-uploads/7d233a7b-4c54-4b46-bad5-fe3a55304c56.png', clinicName: 'STUART' },
  { name: 'Richard Y. Allen', role: 'SPECIALIST', gender: 'male', image: '/lovable-uploads/christopher-brown.png', clinicName: 'STUART' },
  { name: 'Donna Z. Young', role: 'RECEPTION', gender: 'female', image: '/lovable-uploads/e0b5a137-a953-4146-9249-a1d3d3366b19.png', clinicName: 'STUART' },
  { name: 'Charles L. King', role: 'TECH', gender: 'male', image: '/lovable-uploads/james-wilson.png', clinicName: 'STUART' },
  { name: 'Angela M. Peterson', role: 'PHYSICIAN', gender: 'female', image: '/lovable-uploads/75473734-e5e2-4661-acce-6f16706dadef.png', clinicName: 'STUART' },
  { name: 'Harold G. Griffin', role: 'SURGEON', gender: 'male', image: '/lovable-uploads/robert-davis.png', clinicName: 'STUART' },
  { name: 'Brenda F. Simmons', role: 'NURSE', gender: 'female', image: '/lovable-uploads/e54dce2e-0546-4afd-af4c-ff46b53ef0e4.png', clinicName: 'STUART' },
  { name: 'Peter J. Coleman', role: 'THERAPIST', gender: 'male', image: '/lovable-uploads/tom-zimmermann.png', clinicName: 'STUART' },
  { name: 'Laura K. Jenkins', role: 'ADMIN', gender: 'female', image: '/lovable-uploads/aabea5a3-1876-4b8a-9760-ffa13a5807c3.png', clinicName: 'STUART' },
  
  // PORT ST LUCIE Clinic (12 employees)
  { name: 'Anthony M. Wright', role: 'SURGEON', gender: 'male', image: '/lovable-uploads/robert-davis.png', clinicName: 'PORT ST LUCIE' },
  { name: 'Ashley K. Lopez', role: 'NURSE', gender: 'female', image: '/lovable-uploads/75473734-e5e2-4661-acce-6f16706dadef.png', clinicName: 'PORT ST LUCIE' },
  { name: 'Mark N. Hill', role: 'PHYSICIAN', gender: 'male', image: '/lovable-uploads/kevin-williams.png', clinicName: 'PORT ST LUCIE' },
  { name: 'Kimberly S. Scott', role: 'THERAPIST', gender: 'female', image: '/lovable-uploads/aabea5a3-1876-4b8a-9760-ffa13a5807c3.png', clinicName: 'PORT ST LUCIE' },
  { name: 'Donald T. Green', role: 'ADMIN', gender: 'male', image: '/lovable-uploads/brian-martinez.png', clinicName: 'PORT ST LUCIE' },
  { name: 'Victoria L. Henderson', role: 'PHYSICIAN', gender: 'female', image: '/lovable-uploads/e0b5a137-a953-4146-9249-a1d3d3366b19.png', clinicName: 'PORT ST LUCIE' },
  { name: 'Edward R. Barnes', role: 'SPECIALIST', gender: 'male', image: '/lovable-uploads/andrew-garcia.png', clinicName: 'PORT ST LUCIE' },
  { name: 'Joyce W. Powell', role: 'NURSE', gender: 'female', image: '/lovable-uploads/7d233a7b-4c54-4b46-bad5-fe3a55304c56.png', clinicName: 'PORT ST LUCIE' },
  { name: 'Terry S. Washington', role: 'TECH', gender: 'male', image: '/lovable-uploads/marcus-stone.png', clinicName: 'PORT ST LUCIE' },
  { name: 'Cheryl D. Butler', role: 'RECEPTION', gender: 'female', image: '/lovable-uploads/e54dce2e-0546-4afd-af4c-ff46b53ef0e4.png', clinicName: 'PORT ST LUCIE' },
  { name: 'Wayne C. Sanders', role: 'OD', gender: 'male', image: '/lovable-uploads/daniel-miller.png', clinicName: 'PORT ST LUCIE' },
  { name: 'Stephanie H. Russell', role: 'COORDINATOR', gender: 'female', image: '/lovable-uploads/aabea5a3-1876-4b8a-9760-ffa13a5807c3.png', clinicName: 'PORT ST LUCIE' },
  
  // WHITING Clinic (12 employees)
  { name: 'Steven P. Adams', role: 'PHYSICIAN', gender: 'male', image: '/lovable-uploads/tom-zimmermann.png', clinicName: 'WHITING' },
  { name: 'Deborah B. Baker', role: 'NURSE', gender: 'female', image: '/lovable-uploads/7d233a7b-4c54-4b46-bad5-fe3a55304c56.png', clinicName: 'WHITING' },
  { name: 'Paul F. Gonzalez', role: 'TECH', gender: 'male', image: '/lovable-uploads/andrew-garcia.png', clinicName: 'WHITING' },
  { name: 'Lisa J. Evans', role: 'PHYSICIAN', gender: 'female', image: '/lovable-uploads/75473734-e5e2-4661-acce-6f16706dadef.png', clinicName: 'WHITING' },
  { name: 'Carl M. Turner', role: 'SURGEON', gender: 'male', image: '/lovable-uploads/christopher-brown.png', clinicName: 'WHITING' },
  { name: 'Dorothy N. Phillips', role: 'NURSE', gender: 'female', image: '/lovable-uploads/e0b5a137-a953-4146-9249-a1d3d3366b19.png', clinicName: 'WHITING' },
  { name: 'George V. Parker', role: 'SPECIALIST', gender: 'male', image: '/lovable-uploads/james-wilson.png', clinicName: 'WHITING' },
  { name: 'Helen W. Edwards', role: 'RECEPTION', gender: 'female', image: '/lovable-uploads/aabea5a3-1876-4b8a-9760-ffa13a5807c3.png', clinicName: 'WHITING' },
  { name: 'Larry X. Collins', role: 'THERAPIST', gender: 'male', image: '/lovable-uploads/robert-davis.png', clinicName: 'WHITING' },
  { name: 'Betty Y. Stewart', role: 'ADMIN', gender: 'female', image: '/lovable-uploads/e54dce2e-0546-4afd-af4c-ff46b53ef0e4.png', clinicName: 'WHITING' },
  { name: 'Frank Z. Morris', role: 'COORDINATOR', gender: 'male', image: '/lovable-uploads/kevin-williams.png', clinicName: 'WHITING' },
  { name: 'Ruth A. Ward', role: 'PHARMACIST', gender: 'female', image: '/lovable-uploads/7d233a7b-4c54-4b46-bad5-fe3a55304c56.png', clinicName: 'WHITING' },
  
  // HOBE SOUND Clinic (12 employees)
  { name: 'Joshua C. Nelson', role: 'SURGEON', gender: 'male', image: '/lovable-uploads/marcus-stone.png', clinicName: 'HOBE SOUND' },
  { name: 'Laura G. Carter', role: 'RECEPTION', gender: 'female', image: '/lovable-uploads/e0b5a137-a953-4146-9249-a1d3d3366b19.png', clinicName: 'HOBE SOUND' },
  { name: 'Patrick B. Torres', role: 'PHYSICIAN', gender: 'male', image: '/lovable-uploads/brian-martinez.png', clinicName: 'HOBE SOUND' },
  { name: 'Grace C. Peterson', role: 'NURSE', gender: 'female', image: '/lovable-uploads/75473734-e5e2-4661-acce-6f16706dadef.png', clinicName: 'HOBE SOUND' },
  { name: 'Curtis D. Flores', role: 'TECH', gender: 'male', image: '/lovable-uploads/daniel-miller.png', clinicName: 'HOBE SOUND' },
  { name: 'Martha E. Gray', role: 'SPECIALIST', gender: 'female', image: '/lovable-uploads/aabea5a3-1876-4b8a-9760-ffa13a5807c3.png', clinicName: 'HOBE SOUND' },
  { name: 'Gerald F. James', role: 'PHYSICIAN', gender: 'male', image: '/lovable-uploads/tom-zimmermann.png', clinicName: 'HOBE SOUND' },
  { name: 'Carolyn G. Watson', role: 'THERAPIST', gender: 'female', image: '/lovable-uploads/7d233a7b-4c54-4b46-bad5-fe3a55304c56.png', clinicName: 'HOBE SOUND' },
  { name: 'Vincent H. Brooks', role: 'ADMIN', gender: 'male', image: '/lovable-uploads/andrew-garcia.png', clinicName: 'HOBE SOUND' },
  { name: 'Beverly I. Kelly', role: 'NURSE', gender: 'female', image: '/lovable-uploads/e54dce2e-0546-4afd-af4c-ff46b53ef0e4.png', clinicName: 'HOBE SOUND' },
  { name: 'Roy J. Sanders', role: 'OD', gender: 'male', image: '/lovable-uploads/christopher-brown.png', clinicName: 'HOBE SOUND' },
  { name: 'Shirley K. Price', role: 'COORDINATOR', gender: 'female', image: '/lovable-uploads/e0b5a137-a953-4146-9249-a1d3d3366b19.png', clinicName: 'HOBE SOUND' },
  
  // VERO BEACH Clinic (12 employees)
  { name: 'Kenneth H. Mitchell', role: 'SPECIALIST', gender: 'male', image: '/lovable-uploads/matthew-rodriguez.png', clinicName: 'VERO BEACH' },
  { name: 'Cynthia J. Perez', role: 'PHARMACIST', gender: 'female', image: '/lovable-uploads/75473734-e5e2-4661-acce-6f16706dadef.png', clinicName: 'VERO BEACH' },
  { name: 'Frank D. Roberts', role: 'PHYSICIAN', gender: 'male', image: '/lovable-uploads/daniel-miller.png', clinicName: 'VERO BEACH' },
  { name: 'Janice L. Wood', role: 'SURGEON', gender: 'female', image: '/lovable-uploads/aabea5a3-1876-4b8a-9760-ffa13a5807c3.png', clinicName: 'VERO BEACH' },
  { name: 'Howard M. Bennett', role: 'PHYSICIAN', gender: 'male', image: '/lovable-uploads/james-wilson.png', clinicName: 'VERO BEACH' },
  { name: 'Diane N. Cox', role: 'NURSE', gender: 'female', image: '/lovable-uploads/7d233a7b-4c54-4b46-bad5-fe3a55304c56.png', clinicName: 'VERO BEACH' },
  { name: 'Ralph O. Bell', role: 'TECH', gender: 'male', image: '/lovable-uploads/robert-davis.png', clinicName: 'VERO BEACH' },
  { name: 'Joan P. Ward', role: 'RECEPTION', gender: 'female', image: '/lovable-uploads/e0b5a137-a953-4146-9249-a1d3d3366b19.png', clinicName: 'VERO BEACH' },
  { name: 'Eugene Q. Murphy', role: 'THERAPIST', gender: 'male', image: '/lovable-uploads/kevin-williams.png', clinicName: 'VERO BEACH' },
  { name: 'Virginia R. Cooper', role: 'ADMIN', gender: 'female', image: '/lovable-uploads/e54dce2e-0546-4afd-af4c-ff46b53ef0e4.png', clinicName: 'VERO BEACH' },
  { name: 'Arthur S. Richardson', role: 'SPECIALIST', gender: 'male', image: '/lovable-uploads/michael-anderson.png', clinicName: 'VERO BEACH' },
  { name: 'Gloria T. Reed', role: 'COORDINATOR', gender: 'female', image: '/lovable-uploads/75473734-e5e2-4661-acce-6f16706dadef.png', clinicName: 'VERO BEACH' },
  
  // SEBASTIAN Clinic (12 employees)
  { name: 'Scott R. Smith', role: 'OD', gender: 'male', image: '/lovable-uploads/christopher-brown.png', clinicName: 'SEBASTIAN' },
  { name: 'Nicole X. Taylor', role: 'NURSE', gender: 'female', image: '/lovable-uploads/aabea5a3-1876-4b8a-9760-ffa13a5807c3.png', clinicName: 'SEBASTIAN' },
  { name: 'Bruce U. Bailey', role: 'PHYSICIAN', gender: 'male', image: '/lovable-uploads/tom-zimmermann.png', clinicName: 'SEBASTIAN' },
  { name: 'Pamela V. Rivera', role: 'SURGEON', gender: 'female', image: '/lovable-uploads/7d233a7b-4c54-4b46-bad5-fe3a55304c56.png', clinicName: 'SEBASTIAN' },
  { name: 'Keith W. Campbell', role: 'TECH', gender: 'male', image: '/lovable-uploads/brian-martinez.png', clinicName: 'SEBASTIAN' },
  { name: 'Phyllis X. Alexander', role: 'SPECIALIST', gender: 'female', image: '/lovable-uploads/e0b5a137-a953-4146-9249-a1d3d3366b19.png', clinicName: 'SEBASTIAN' },
  { name: 'Louis Y. Griffin', role: 'PHYSICIAN', gender: 'male', image: '/lovable-uploads/andrew-garcia.png', clinicName: 'SEBASTIAN' },
  { name: 'Evelyn Z. Diaz', role: 'NURSE', gender: 'female', image: '/lovable-uploads/75473734-e5e2-4661-acce-6f16706dadef.png', clinicName: 'SEBASTIAN' },
  { name: 'Adam A. Hayes', role: 'RECEPTION', gender: 'male', image: '/lovable-uploads/daniel-miller.png', clinicName: 'SEBASTIAN' },
  { name: 'Norma B. Myers', role: 'THERAPIST', gender: 'female', image: '/lovable-uploads/e54dce2e-0546-4afd-af4c-ff46b53ef0e4.png', clinicName: 'SEBASTIAN' },
  { name: 'Dennis C. Ford', role: 'ADMIN', gender: 'male', image: '/lovable-uploads/marcus-stone.png', clinicName: 'SEBASTIAN' },
  { name: 'Marie D. Hamilton', role: 'COORDINATOR', gender: 'female', image: '/lovable-uploads/aabea5a3-1876-4b8a-9760-ffa13a5807c3.png', clinicName: 'SEBASTIAN' },
  
  // MELBOURNE Clinic (12 employees)
  { name: 'Eric Q. Clark', role: 'TECHNICIAN', gender: 'male', image: '/lovable-uploads/michael-anderson.png', clinicName: 'MELBOURNE' },
  { name: 'Samantha W. Lewis', role: 'COORDINATOR', gender: 'female', image: '/lovable-uploads/7d233a7b-4c54-4b46-bad5-fe3a55304c56.png', clinicName: 'MELBOURNE' },
  { name: 'Dale E. Graham', role: 'PHYSICIAN', gender: 'male', image: '/lovable-uploads/robert-davis.png', clinicName: 'MELBOURNE' },
  { name: 'Tina F. Sullivan', role: 'SURGEON', gender: 'female', image: '/lovable-uploads/75473734-e5e2-4661-acce-6f16706dadef.png', clinicName: 'MELBOURNE' },
  { name: 'Oscar G. Wallace', role: 'SPECIALIST', gender: 'male', image: '/lovable-uploads/james-wilson.png', clinicName: 'MELBOURNE' },
  { name: 'Robin H. West', role: 'NURSE', gender: 'female', image: '/lovable-uploads/e0b5a137-a953-4146-9249-a1d3d3366b19.png', clinicName: 'MELBOURNE' },
  { name: 'Ivan I. Cole', role: 'TECH', gender: 'male', image: '/lovable-uploads/kevin-williams.png', clinicName: 'MELBOURNE' },
  { name: 'Megan J. Howard', role: 'RECEPTION', gender: 'female', image: '/lovable-uploads/aabea5a3-1876-4b8a-9760-ffa13a5807c3.png', clinicName: 'MELBOURNE' },
  { name: 'Lance K. Fisher', role: 'PHYSICIAN', gender: 'male', image: '/lovable-uploads/christopher-brown.png', clinicName: 'MELBOURNE' },
  { name: 'Crystal L. Marshall', role: 'THERAPIST', gender: 'female', image: '/lovable-uploads/e54dce2e-0546-4afd-af4c-ff46b53ef0e4.png', clinicName: 'MELBOURNE' },
  { name: 'Jeremy M. Webb', role: 'ADMIN', gender: 'male', image: '/lovable-uploads/tom-zimmermann.png', clinicName: 'MELBOURNE' },
  { name: 'Connie N. Wheeler', role: 'PHARMACIST', gender: 'female', image: '/lovable-uploads/7d233a7b-4c54-4b46-bad5-fe3a55304c56.png', clinicName: 'MELBOURNE' },
  
  // COCOA Clinic (12 employees)
  { name: 'Stephen A. Lee', role: 'CALL CENTER', gender: 'male', image: '/lovable-uploads/james-wilson.png', clinicName: 'COCOA' },
  { name: 'Ruth E. Walker', role: 'ADMIN', gender: 'female', image: '/lovable-uploads/e0b5a137-a953-4146-9249-a1d3d3366b19.png', clinicName: 'COCOA' },
  { name: 'Glenn O. Stone', role: 'PHYSICIAN', gender: 'male', image: '/lovable-uploads/brian-martinez.png', clinicName: 'COCOA' },
  { name: 'Lois P. Owen', role: 'SURGEON', gender: 'female', image: '/lovable-uploads/75473734-e5e2-4661-acce-6f16706dadef.png', clinicName: 'COCOA' },
  { name: 'Travis Q. Lynch', role: 'NURSE', gender: 'male', image: '/lovable-uploads/andrew-garcia.png', clinicName: 'COCOA' },
  { name: 'Melanie R. Dean', role: 'TECH', gender: 'female', image: '/lovable-uploads/aabea5a3-1876-4b8a-9760-ffa13a5807c3.png', clinicName: 'COCOA' },
  { name: 'Arnold S. Rose', role: 'SPECIALIST', gender: 'male', image: '/lovable-uploads/daniel-miller.png', clinicName: 'COCOA' },
  { name: 'Gail T. Freeman', role: 'RECEPTION', gender: 'female', image: '/lovable-uploads/7d233a7b-4c54-4b46-bad5-fe3a55304c56.png', clinicName: 'COCOA' },
  { name: 'Mitchell U. Palmer', role: 'PHYSICIAN', gender: 'male', image: '/lovable-uploads/marcus-stone.png', clinicName: 'COCOA' },
  { name: 'Stella V. George', role: 'THERAPIST', gender: 'female', image: '/lovable-uploads/e54dce2e-0546-4afd-af4c-ff46b53ef0e4.png', clinicName: 'COCOA' },
  { name: 'Claude W. Simpson', role: 'COORDINATOR', gender: 'male', image: '/lovable-uploads/robert-davis.png', clinicName: 'COCOA' },
  { name: 'Irene X. Jordan', role: 'OD', gender: 'female', image: '/lovable-uploads/e0b5a137-a953-4146-9249-a1d3d3366b19.png', clinicName: 'COCOA' },
  
  // TITUSVILLE Clinic (12 employees)
  { name: 'Raymond I. Hall', role: 'STAFF', gender: 'male', image: '/lovable-uploads/robert-davis.png', clinicName: 'TITUSVILLE' },
  { name: 'Sharon O. Allen', role: 'RECEPTION', gender: 'female', image: '/lovable-uploads/75473734-e5e2-4661-acce-6f16706dadef.png', clinicName: 'TITUSVILLE' },
  { name: 'Clyde Y. Gibson', role: 'PHYSICIAN', gender: 'male', image: '/lovable-uploads/kevin-williams.png', clinicName: 'TITUSVILLE' },
  { name: 'Velma Z. Hunt', role: 'SURGEON', gender: 'female', image: '/lovable-uploads/aabea5a3-1876-4b8a-9760-ffa13a5807c3.png', clinicName: 'TITUSVILLE' },
  { name: 'Felix A. Bishop', role: 'NURSE', gender: 'male', image: '/lovable-uploads/tom-zimmermann.png', clinicName: 'TITUSVILLE' },
  { name: 'Alma B. Oliver', role: 'TECH', gender: 'female', image: '/lovable-uploads/7d233a7b-4c54-4b46-bad5-fe3a55304c56.png', clinicName: 'TITUSVILLE' },
  { name: 'Preston C. Lane', role: 'SPECIALIST', gender: 'male', image: '/lovable-uploads/christopher-brown.png', clinicName: 'TITUSVILLE' },
  { name: 'Maxine D. Burton', role: 'THERAPIST', gender: 'female', image: '/lovable-uploads/e0b5a137-a953-4146-9249-a1d3d3366b19.png', clinicName: 'TITUSVILLE' },
  { name: 'Jared E. Carroll', role: 'PHYSICIAN', gender: 'male', image: '/lovable-uploads/james-wilson.png', clinicName: 'TITUSVILLE' },
  { name: 'Rosemary F. Arnold', role: 'ADMIN', gender: 'female', image: '/lovable-uploads/e54dce2e-0546-4afd-af4c-ff46b53ef0e4.png', clinicName: 'TITUSVILLE' },
  { name: 'Rodney G. Pierce', role: 'COORDINATOR', gender: 'male', image: '/lovable-uploads/brian-martinez.png', clinicName: 'TITUSVILLE' },
  { name: 'Gladys H. Elliott', role: 'PHARMACIST', gender: 'female', image: '/lovable-uploads/75473734-e5e2-4661-acce-6f16706dadef.png', clinicName: 'TITUSVILLE' },
  
  // PALM BAY Clinic (12 employees)
  { name: 'Thomas U. Young', role: 'PHYSICIAN', gender: 'male', image: '/lovable-uploads/kevin-williams.png', clinicName: 'PALM BAY' },
  { name: 'Carol Y. King', role: 'NURSE', gender: 'female', image: '/lovable-uploads/aabea5a3-1876-4b8a-9760-ffa13a5807c3.png', clinicName: 'PALM BAY' },
  { name: 'Clifford I. Burke', role: 'SURGEON', gender: 'male', image: '/lovable-uploads/andrew-garcia.png', clinicName: 'PALM BAY' },
  { name: 'Wendy J. Holmes', role: 'SPECIALIST', gender: 'female', image: '/lovable-uploads/7d233a7b-4c54-4b46-bad5-fe3a55304c56.png', clinicName: 'PALM BAY' },
  { name: 'Lorenzo K. Hopkins', role: 'TECH', gender: 'male', image: '/lovable-uploads/daniel-miller.png', clinicName: 'PALM BAY' },
  { name: 'Dolores L. Walton', role: 'RECEPTION', gender: 'female', image: '/lovable-uploads/e0b5a137-a953-4146-9249-a1d3d3366b19.png', clinicName: 'PALM BAY' },
  { name: 'Stuart M. Spencer', role: 'PHYSICIAN', gender: 'male', image: '/lovable-uploads/robert-davis.png', clinicName: 'PALM BAY' },
  { name: 'Amber N. Gardner', role: 'NURSE', gender: 'female', image: '/lovable-uploads/75473734-e5e2-4661-acce-6f16706dadef.png', clinicName: 'PALM BAY' },
  { name: 'Darrell O. Stone', role: 'THERAPIST', gender: 'male', image: '/lovable-uploads/marcus-stone.png', clinicName: 'PALM BAY' },
  { name: 'Kathryn P. Webb', role: 'ADMIN', gender: 'female', image: '/lovable-uploads/e54dce2e-0546-4afd-af4c-ff46b53ef0e4.png', clinicName: 'PALM BAY' },
  { name: 'Dustin Q. Fields', role: 'COORDINATOR', gender: 'male', image: '/lovable-uploads/christopher-brown.png', clinicName: 'PALM BAY' },
  { name: 'Elaine R. Cross', role: 'OD', gender: 'female', image: '/lovable-uploads/aabea5a3-1876-4b8a-9760-ffa13a5807c3.png', clinicName: 'PALM BAY' },
  
  // ROCKLEDGE Clinic (12 employees)
  { name: 'John Z. Wright', role: 'SURGEON', gender: 'male', image: '/lovable-uploads/brian-martinez.png', clinicName: 'ROCKLEDGE' },
  { name: 'Betty L. Lopez', role: 'THERAPIST', gender: 'female', image: '/lovable-uploads/7d233a7b-4c54-4b46-bad5-fe3a55304c56.png', clinicName: 'ROCKLEDGE' },
  { name: 'Herman S. Newman', role: 'PHYSICIAN', gender: 'male', image: '/lovable-uploads/tom-zimmermann.png', clinicName: 'ROCKLEDGE' },
  { name: 'Violet T. Castro', role: 'NURSE', gender: 'female', image: '/lovable-uploads/75473734-e5e2-4661-acce-6f16706dadef.png', clinicName: 'ROCKLEDGE' },
  { name: 'Moses U. Ortega', role: 'SPECIALIST', gender: 'male', image: '/lovable-uploads/james-wilson.png', clinicName: 'ROCKLEDGE' },
  { name: 'Peggy V. Hansen', role: 'TECH', gender: 'female', image: '/lovable-uploads/e0b5a137-a953-4146-9249-a1d3d3366b19.png', clinicName: 'ROCKLEDGE' },
  { name: 'Marshall W. Crawford', role: 'PHYSICIAN', gender: 'male', image: '/lovable-uploads/kevin-williams.png', clinicName: 'ROCKLEDGE' },
  { name: 'Leah X. Blake', role: 'RECEPTION', gender: 'female', image: '/lovable-uploads/aabea5a3-1876-4b8a-9760-ffa13a5807c3.png', clinicName: 'ROCKLEDGE' },
  { name: 'Sidney Y. Mann', role: 'ADMIN', gender: 'male', image: '/lovable-uploads/daniel-miller.png', clinicName: 'ROCKLEDGE' },
  { name: 'Maxine Z. Floyd', role: 'COORDINATOR', gender: 'female', image: '/lovable-uploads/e54dce2e-0546-4afd-af4c-ff46b53ef0e4.png', clinicName: 'ROCKLEDGE' },
  { name: 'Earnest A. Medina', role: 'PHARMACIST', gender: 'male', image: '/lovable-uploads/christopher-brown.png', clinicName: 'ROCKLEDGE' },
  { name: 'Inez B. Walsh', role: 'SURGEON', gender: 'female', image: '/lovable-uploads/7d233a7b-4c54-4b46-bad5-fe3a55304c56.png', clinicName: 'ROCKLEDGE' },
  
  // MERRITT ISLAND Clinic (12 employees)
  { name: 'William M. Hill', role: 'TECH', gender: 'male', image: '/lovable-uploads/andrew-garcia.png', clinicName: 'MERRITT ISLAND' },
  { name: 'Helen N. Scott', role: 'STAFF', gender: 'female', image: '/lovable-uploads/e0b5a137-a953-4146-9249-a1d3d3366b19.png', clinicName: 'MERRITT ISLAND' },
  { name: 'Clarence C. Robbins', role: 'PHYSICIAN', gender: 'male', image: '/lovable-uploads/robert-davis.png', clinicName: 'MERRITT ISLAND' },
  { name: 'Doris D. Powers', role: 'SURGEON', gender: 'female', image: '/lovable-uploads/75473734-e5e2-4661-acce-6f16706dadef.png', clinicName: 'MERRITT ISLAND' },
  { name: 'Salvador E. Aguilar', role: 'NURSE', gender: 'male', image: '/lovable-uploads/marcus-stone.png', clinicName: 'MERRITT ISLAND' },
  { name: 'Blanche F. Curtis', role: 'SPECIALIST', gender: 'female', image: '/lovable-uploads/aabea5a3-1876-4b8a-9760-ffa13a5807c3.png', clinicName: 'MERRITT ISLAND' },
  { name: 'Forrest G. Welch', role: 'PHYSICIAN', gender: 'male', image: '/lovable-uploads/brian-martinez.png', clinicName: 'MERRITT ISLAND' },
  { name: 'Olive H. Fowler', role: 'RECEPTION', gender: 'female', image: '/lovable-uploads/7d233a7b-4c54-4b46-bad5-fe3a55304c56.png', clinicName: 'MERRITT ISLAND' },
  { name: 'Lonnie I. Vargas', role: 'THERAPIST', gender: 'male', image: '/lovable-uploads/tom-zimmermann.png', clinicName: 'MERRITT ISLAND' },
  { name: 'Joanne J. Caldwell', role: 'ADMIN', gender: 'female', image: '/lovable-uploads/e54dce2e-0546-4afd-af4c-ff46b53ef0e4.png', clinicName: 'MERRITT ISLAND' },
  { name: 'Roderick K. Garrett', role: 'COORDINATOR', gender: 'male', image: '/lovable-uploads/james-wilson.png', clinicName: 'MERRITT ISLAND' },
  { name: 'Geneva L. Payne', role: 'OD', gender: 'female', image: '/lovable-uploads/e0b5a137-a953-4146-9249-a1d3d3366b19.png', clinicName: 'MERRITT ISLAND' }
];

// Create employees from static templates
const createEmployeeFromTemplate = (template: EmployeeTemplate, clinicId: string): Employee => {
  // Generate consistent quadrant values based on name hash for consistency
  const nameHash = template.name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const personal = (nameHash % 15) + 10; // 10-24
  const staff = ((nameHash * 2) % 15) + 10; // 10-24  
  const client = ((nameHash * 3) % 15) + 10; // 10-24
  const knowledge = ((nameHash * 4) % 15) + 10; // 10-24
  
  // Calculate productivity score as overall average
  const productivityScore = Math.round((personal + staff + client + knowledge) / 4);
  
  // Generate previous review change (-10 to +10)
  const previousReviewChange = ((nameHash * 5) % 21) - 10;
  
  return {
    id: `${clinicId}-${template.name.replace(/\s+/g, '-').toLowerCase()}`,
    name: template.name,
    role: template.role,
    gender: template.gender,
    image: template.image,
    quadrants: [
      { name: "Personal" as const, value: personal, color: "#FFFFFF" },
      { name: "Staff" as const, value: staff, color: "#FFD700" },
      { name: "Patient" as const, value: client, color: "#FF8C00" },
      { name: "Knowledge" as const, value: knowledge, color: "#4169E1" }
    ],
    trend: ((nameHash % 40) - 20), // -20 to +20
    productivityScore,
    previousReviewChange
  };
};

// Generate employees for a specific clinic
const generateEmployeesForClinic = (clinicName: string, clinicId: string): Employee[] => {
  const clinicEmployees = STATIC_EMPLOYEES
    .map(e => ({ ...e, clinicName: e.clinicName || 'PALM CITY' }))
    .filter(emp => emp.clinicName === clinicName);
  return clinicEmployees.map(template => createEmployeeFromTemplate(template, clinicId));
};

// Calculate clinic quadrants based on employee data
const calculateClinicQuadrantsFromEmployees = (employees: Employee[]): QuadrantData[] => {
  if (employees.length === 0) {
    return [
      { name: "Personal" as const, value: 0, color: "#FFFFFF" },
      { name: "Staff" as const, value: 0, color: "#FFD700" },
      { name: "Patient" as const, value: 0, color: "#FF8C00" },
      { name: "Knowledge" as const, value: 0, color: "#4169E1" }
    ];
  }

  // Calculate average for each quadrant across all employees
  const personalSum = employees.reduce((sum, emp) => sum + (emp.quadrants.find(q => q.name === "Personal")?.value || 0), 0);
  const staffSum = employees.reduce((sum, emp) => sum + (emp.quadrants.find(q => q.name === "Staff")?.value || 0), 0);
  const patientSum = employees.reduce((sum, emp) => sum + (emp.quadrants.find(q => q.name === "Patient")?.value || 0), 0);
  const knowledgeSum = employees.reduce((sum, emp) => sum + (emp.quadrants.find(q => q.name === "Knowledge")?.value || 0), 0);

  const employeeCount = employees.length;

  return [
    { name: "Personal" as const, value: Math.round(personalSum / employeeCount), color: "#FFFFFF" },
    { name: "Staff" as const, value: Math.round(staffSum / employeeCount), color: "#FFD700" },
    { name: "Patient" as const, value: Math.round(patientSum / employeeCount), color: "#FF8C00" },
    { name: "Knowledge" as const, value: Math.round(knowledgeSum / employeeCount), color: "#4169E1" }
  ];
};

// Calculate clinic score based on employee data
const calculateClinicScoreFromEmployees = (employees: Employee[]): number => {
  if (employees.length === 0) return 0;

  // Calculate each employee's total score (sum of their 4 quadrants)
  const employeeTotalScores = employees.map(emp => 
    emp.quadrants.reduce((sum, quadrant) => sum + quadrant.value, 0)
  );

  // Return the average of all employee total scores
  const totalSum = employeeTotalScores.reduce((sum, score) => sum + score, 0);
  return Math.round(totalSum / employees.length);
};

// Calculate company-wide quadrants from all clinics
const calculateLocationQuadrantsFromClinics = (clinics: Clinic[]): QuadrantData[] => {
  if (clinics.length === 0) return [
    { name: "Personal" as const, value: 0, color: "#FFFFFF" },
    { name: "Staff" as const, value: 0, color: "#FFD700" },
    { name: "Patient" as const, value: 0, color: "#FF8C00" },
    { name: "Knowledge" as const, value: 0, color: "#4169E1" }
  ];
  
  // Sum up each quadrant across all clinics
  const personalSum = clinics.reduce((sum, clinic) => sum + (clinic.quadrants.find(q => q.name === "Personal")?.value || 0), 0);
  const staffSum = clinics.reduce((sum, clinic) => sum + (clinic.quadrants.find(q => q.name === "Staff")?.value || 0), 0);
  const patientSum = clinics.reduce((sum, clinic) => sum + (clinic.quadrants.find(q => q.name === "Patient")?.value || 0), 0);
  const knowledgeSum = clinics.reduce((sum, clinic) => sum + (clinic.quadrants.find(q => q.name === "Knowledge")?.value || 0), 0);
  
  const clinicCount = clinics.length;
  
  return [
    { name: "Personal" as const, value: Math.round(personalSum / clinicCount), color: "#FFFFFF" },
    { name: "Staff" as const, value: Math.round(staffSum / clinicCount), color: "#FFD700" },
    { name: "Patient" as const, value: Math.round(patientSum / clinicCount), color: "#FF8C00" },
    { name: "Knowledge" as const, value: Math.round(knowledgeSum / clinicCount), color: "#4169E1" }
  ];
};

// Calculate company-wide overall score from all clinics
const calculateLocationScoreFromClinics = (clinics: Clinic[]): number => {
  if (clinics.length === 0) return 0;
  
  const totalScores = clinics.reduce((sum, clinic) => sum + clinic.score, 0);
  return Math.round(totalScores / clinics.length);
};

// Generate mock data for VGH's 15 clinics with quadrant composition based on employee data
const generateVGHClinics = (): Clinic[] => {
  return CLINIC_NAMES.map((name, index) => {
    const clinicId = `clinic-${index + 1}`;
    
    // Generate employees first
    const employees = generateEmployeesForClinic(name, clinicId).map(emp => ({
      ...emp,
      homeClinicId: clinicId
    }));

    // Calculate quadrants and score based on employee data
    const quadrants = calculateClinicQuadrantsFromEmployees(employees);
    const totalScore = calculateClinicScoreFromEmployees(employees);
    
    const growthOpportunity = 100 - totalScore; // Calculate growth opportunity
    const previousScore = Math.max(20, totalScore + Math.floor((Math.random() - 0.5) * 30)); // Generate previous score

    // Build a simple 12-period history trending from previousScore to totalScore with slight noise
    const steps = 12;
    const scoreHistory = Array.from({ length: steps }, (_, i) => {
      const t = i / (steps - 1);
      const interp = previousScore + (totalScore - previousScore) * t;
      const noise = (Math.random() - 0.5) * 4; // small jitter
      return Math.max(0, Math.min(100, Math.round(interp + noise)));
    });
    
    return {
      id: clinicId,
      name,
      score: totalScore,
      previousScore, // Add previous score
      trend: (Math.random() - 0.5) * 20,
      scoreHistory,
      quadrants,
      employees,
      growthOpportunity // Add growth opportunity to clinic data
    };
  });
};

export const LocationPerformanceCard = ({ location }: LocationPerformanceCardProps) => {
  const [selectedClinics, setSelectedClinics] = useState<string[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [globalEmployeeOrder, setGlobalEmployeeOrder] = useState<string[]>([]); // Track global click order
  const [employeeClinicLinks, setEmployeeClinicLinks] = useState<Record<string, string>>({});
  const [clinics] = useState(() => location.name === 'VGH Medical Center' ? generateVGHClinics() : []);
  const [animatingClinic, setAnimatingClinic] = useState<string | null>(null);
  const [animatingEmployee, setAnimatingEmployee] = useState<string | null>(null);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [clinicToClose, setClinicToClose] = useState<string | null>(null);
  const [initialAnimationComplete, setInitialAnimationComplete] = useState(false);
  const [employeeOrders, setEmployeeOrders] = useState<Record<string, string[]>>({});
  const [showClearUnlinkedDialog, setShowClearUnlinkedDialog] = useState(false);
  
  // New states for rollover and selection
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [hoveredEmployee, setHoveredEmployee] = useState<string | null>(null);
  
  // Role filtering states
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [clinicRoleFilters, setClinicRoleFilters] = useState<Record<string, string[]>>({});
  const [availableLocationRoles, setAvailableLocationRoles] = useState<string[]>(['STAFF', 'TECH', 'OD', 'SURGEON', 'RECEPTION', 'CALL CENTER']);
  const [availableClinicRoles, setAvailableClinicRoles] = useState<Record<string, string[]>>({});
  const [minimizedClinics, setMinimizedClinics] = useState<Set<string>>(new Set());
  const [isLocationBarMinimized, setIsLocationBarMinimized] = useState(false);

  // Registry to ensure bars animate only once across remounts
  const animatedBarsRef = React.useRef<Set<string>>(new Set());

  // Setup drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Complete initial animation after 15 seconds (after intro sequence)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setInitialAnimationComplete(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  // Initialize employee orders and clinic roles when clinics change
  React.useEffect(() => {
    if (clinics.length > 0) {
      const initialOrders: Record<string, string[]> = {};
      const initialClinicRoles: Record<string, string[]> = {};
      
      clinics.forEach(clinic => {
        if (!employeeOrders[clinic.id]) {
          initialOrders[clinic.id] = clinic.employees.map(emp => emp.id);
        }
        if (!availableClinicRoles[clinic.id]) {
          const clinicRoles = Array.from(new Set(clinic.employees.map(emp => emp.role)));
          initialClinicRoles[clinic.id] = clinicRoles;
        }
      });
      
      if (Object.keys(initialOrders).length > 0) {
        setEmployeeOrders(prev => ({ ...prev, ...initialOrders }));
      }
      if (Object.keys(initialClinicRoles).length > 0) {
        setAvailableClinicRoles(prev => ({ ...prev, ...initialClinicRoles }));
      }
    }
  }, [clinics, availableClinicRoles]);

  // Drag end handler for employee reordering in clinics
  const handleDragEnd = (event: DragEndEvent, clinicId: string) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const clinic = clinics.find(c => c.id === clinicId);
    if (!clinic) return;

    const currentOrder = employeeOrders[clinicId] || clinic.employees.map(emp => emp.id);
    const oldIndex = currentOrder.indexOf(active.id as string);
    const newIndex = currentOrder.indexOf(over.id as string);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newOrder = arrayMove(currentOrder, oldIndex, newIndex);
      setEmployeeOrders(prev => ({
        ...prev,
        [clinicId]: newOrder
      }));
    }
  };

  // Drag end handler for main employee cards
  const handleMainEmployeeDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const currentOrder = globalEmployeeOrder.filter(id => selectedEmployees.includes(id));
    const oldIndex = currentOrder.indexOf(active.id as string);
    const newIndex = currentOrder.indexOf(over.id as string);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newOrder = arrayMove(currentOrder, oldIndex, newIndex);
      // Update the global order by replacing the selected employees with new order
      const nonSelectedEmployees = globalEmployeeOrder.filter(id => !selectedEmployees.includes(id));
      setGlobalEmployeeOrder([...newOrder, ...nonSelectedEmployees]);
    }
  };

  // Filter employees by selected roles
  const filterEmployeesByRoles = (employees: Employee[], roles: string[]) => {
    if (roles.length === 0) return employees;
    return employees.filter(emp => roles.includes(emp.role));
  };

  // Handle role management for location-level filtering
  const handleLocationRoleAdd = (role: string) => {
    setAvailableLocationRoles(prev => [...prev, role]);
  };

  const handleLocationRoleRemove = (role: string) => {
    setAvailableLocationRoles(prev => prev.filter(r => r !== role));
    setSelectedRoles(prev => prev.filter(r => r !== role));
  };

  // Handle role filter changes for location-level filtering
  const handleLocationRoleFilterChange = (roles: string[]) => {
    setSelectedRoles(roles);
    
    // Clear auto-selected employees when roles are cleared
    if (roles.length === 0) {
      // Remove all employees that were auto-selected due to role filtering
      setSelectedEmployees(prev => {
        // Get all employees from all clinics to check which ones to clear
        const allEmployees = clinics.flatMap(clinic => clinic.employees);
        const allEmployeeIds = allEmployees.map(emp => emp.id);
        
        // Remove employees that are from role filtering (not manually selected)
        // This clears the unlinked employees that appeared due to role filtering
        return prev.filter(empId => !allEmployeeIds.includes(empId));
      });
    } else {
      // Instantly show employee cards for filtered roles
      const filteredEmployees = getFilteredEmployees;
      const employeeIds = filteredEmployees.map(emp => emp.id);
      
      // Add filtered employees to selection if not already selected
      setSelectedEmployees(prev => {
        const newSelection = [...new Set([...prev, ...employeeIds])];
        return newSelection;
      });
      
      // Update global order for newly selected employees
      setGlobalEmployeeOrder(prev => {
        const newEmployees = employeeIds.filter(id => !prev.includes(id));
        return [...prev, ...newEmployees];
      });
    }
  };

  // Handle role management for clinic-level filtering
  const handleClinicRoleAdd = (clinicId: string, role: string) => {
    setAvailableClinicRoles(prev => ({
      ...prev,
      [clinicId]: [...(prev[clinicId] || []), role]
    }));
  };

  const handleClinicRoleRemove = (clinicId: string, role: string) => {
    setAvailableClinicRoles(prev => ({
      ...prev,
      [clinicId]: (prev[clinicId] || []).filter(r => r !== role)
    }));
    setClinicRoleFilters(prev => ({
      ...prev,
      [clinicId]: (prev[clinicId] || []).filter(r => r !== role)
    }));
  };

  // Handle role filter changes for clinic-level filtering
  const handleClinicRoleFilterChange = (clinicId: string, roles: string[]) => {
    setClinicRoleFilters(prev => ({
      ...prev,
      [clinicId]: roles
    }));
    
    // Clear auto-selected employees when roles are cleared for this clinic
    if (roles.length === 0) {
      const clinic = clinics.find(c => c.id === clinicId);
      if (clinic) {
        const clinicEmployeeIds = clinic.employees.map(emp => emp.id);
        
        // Remove employees from this clinic that were auto-selected due to role filtering
        setSelectedEmployees(prev => {
          return prev.filter(empId => !clinicEmployeeIds.includes(empId));
        });
      }
    } else {
      // Instantly show employee cards for filtered roles
      const clinic = clinics.find(c => c.id === clinicId);
      if (clinic) {
        const filteredEmployees = filterEmployeesByRoles(clinic.employees, roles);
        const employeeIds = filteredEmployees.map(emp => emp.id);
        
        // Add filtered employees to selection if not already selected
        setSelectedEmployees(prev => {
          const newSelection = [...new Set([...prev, ...employeeIds])];
          return newSelection;
        });
        
        // Update global order for newly selected employees
        setGlobalEmployeeOrder(prev => {
          const newEmployees = employeeIds.filter(id => !prev.includes(id));
          return [...prev, ...newEmployees];
        });
      }
    }
  };

  // Get available roles from all employees
  const getAllAvailableRoles = useMemo(() => {
    const allEmployees = clinics.flatMap(clinic => clinic.employees);
    const uniqueRoles = Array.from(new Set(allEmployees.map(emp => emp.role)));
    return uniqueRoles.sort();
  }, [clinics]);

  // Get filtered employees for location view
  const getFilteredEmployees = useMemo(() => {
    const allEmployees = clinics.flatMap(clinic => clinic.employees);
    return filterEmployeesByRoles(allEmployees, selectedRoles);
  }, [clinics, selectedRoles]);

  // Get filtered employees for a specific clinic
  const getFilteredClinicEmployees = (clinic: Clinic) => {
    const clinicRoles = clinicRoleFilters[clinic.id] || [];
    return filterEmployeesByRoles(clinic.employees, clinicRoles);
  };

  // Helper function to create pie chart data with growth opportunity
  const createChartDataWithGrowth = (quadrants: QuadrantData[], overallScore: number) => {
    const growthOpportunity = 100 - overallScore;
    
    // Scale quadrant values proportionally to fit within the overall score
    const quadrantSum = quadrants.reduce((sum, q) => sum + q.value, 0);
    const scaleFactor = quadrantSum > 0 ? overallScore / quadrantSum : 0;
    
    return [
      ...quadrants.map(q => ({ 
        name: q.name, 
        value: q.value * scaleFactor, 
        color: q.color 
      })),
      { 
        name: "Growth Opportunity", 
        value: growthOpportunity, 
        color: "#000000" 
      }
    ];
  };

const SparkLine = ({ trend, size = 'sm', color: customColor, seed, data }: { trend: number; size?: 'sm' | 'xs'; color?: string; seed?: string | number; data?: number[] }) => {
  const generateYOYData = (trendValue: number, seedVal?: string | number) => {
    const baseValue = 50;
    const points: number[] = [];

    // Create deterministic RNG if seed provided; fallback to Math.random otherwise
    let rand = Math.random;
    if (seedVal !== undefined) {
      const seedNum =
        typeof seedVal === 'number'
          ? seedVal
          : seedVal.split('').reduce((a, b) => a + b.charCodeAt(0), 0);

      const mulberry32 = (a: number) => {
        return () => {
          let t = (a += 0x6D2B79F5);
          t = Math.imul(t ^ (t >>> 15), t | 1);
          t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
      };
      rand = mulberry32(seedNum);
    }

    for (let i = 0; i < 12; i++) {
      const seasonality = Math.sin((i / 12) * Math.PI * 2) * 5;
      const trendEffect = (Math.abs(trendValue) / 100) * i * 3;
      const noise = (rand() - 0.5) * 4;
      const direction = trendValue >= 0 ? trendEffect : -trendEffect;
      const value = Math.max(10, Math.min(90, baseValue + seasonality + direction + noise));
      points.push(value);
    }
    return points;
  };

  const points = (data && data.length > 0 ? data : generateYOYData(trend, seed)).map(v => Math.max(0, Math.min(100, v)));
  const color = customColor || (trend >= 0 ? '#4ade80' : '#f87171');
  const width = size === 'sm' ? 48 : 32;
  const height = size === 'sm' ? 20 : 16;
  const lastIndex = Math.max(1, points.length - 1);

  return (
    <svg width={width} height={height} className="inline-block">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        points={points.map((y, x) => `${(x / lastIndex) * (width - 4) + 2},${height - (y / 100) * (height - 4) - 2}`).join(' ') }
      />
    </svg>
  );
};
  

  const QuadrantBar = ({ quadrants, fullWidth = false, shouldAnimate = false, isSelected = true, animationKey, animatedRegistry }: { 
    quadrants: QuadrantData[]; 
    fullWidth?: boolean;
    shouldAnimate?: boolean;
    isSelected?: boolean;
    animationKey?: string;
    animatedRegistry?: React.MutableRefObject<Set<string>>;
  }) => {
    const totalScore = quadrants.reduce((sum, q) => sum + q.value, 0);
    const maxTotal = 100; // 4 quadrants × 25 max points each
    const animationDuration = (totalScore / maxTotal) * 2; // Scale to max 2 seconds
    
    // Run the bar-grow animation only once per reveal, persisted via registry
    const [hasAnimated, setHasAnimated] = useState(false);
    const alreadyAnimated = !!(animationKey && animatedRegistry?.current.has(animationKey));
    const runInitialAnimation = shouldAnimate && !(hasAnimated || alreadyAnimated);
    
    return (
      <div 
        className="h-3 bg-transparent rounded-[1px] flex gap-0.5 overflow-hidden flex-1 transition-opacity duration-200 relative z-30 group"
      >
        {quadrants.map((quadrant, index) => {
          const width = (quadrant.value / maxTotal) * 100;
          return (
            <div
              key={index}
              className={`h-full transition-all duration-300 rounded-[1px] relative z-30 ${runInitialAnimation ? 'bar-grow' : ''}`}
              style={{
                '--target-width': `${width}%`,
                '--animation-duration': `${animationDuration}s`,
                backgroundColor: quadrant.color,
                width: runInitialAnimation ? undefined : `${width}%`,
                zIndex: 30
              } as React.CSSProperties & { '--target-width': string; '--animation-duration': string }}
              data-color={quadrant.color}
              onAnimationEnd={() => {
                if (runInitialAnimation) {
                  setHasAnimated(true);
                  if (animationKey && animatedRegistry) {
                    animatedRegistry.current.add(animationKey);
                  }
                }
              }}
              title={`${quadrant.name}: ${quadrant.value.toFixed(1)}`}
            />
          );
        })}
        {/* Black space represents growth opportunity - bars don't reach the end */}
      </div>
    );
  };

  // Sortable Employee Item Component (for main employee view with drag)
  const SortableEmployeeItem = ({ employee, clinicId, showDragHandle = true }: { 
    employee: Employee; 
    clinicId: string;
    showDragHandle?: boolean;
  }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: employee.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    const isHovered = hoveredEmployee === employee.id;
    const isSelected = selectedEmployees.includes(employee.id);

    // Consolidated row metrics
    const current = Math.round(employee.quadrants.reduce((s, q) => s + q.value, 0));
    const prev = Math.max(0, Math.min(100, current - employee.previousReviewChange));
    const delta = current - prev;

    const trendClass =
      employee.previousReviewChange > 0
        ? 'text-[hsl(var(--chart-success))]'
        : employee.previousReviewChange < 0
          ? 'text-[hsl(var(--chart-error))]'
          : 'text-[hsl(var(--chart-muted))]';

    const perfColor =
      delta > 0
        ? 'text-[hsl(var(--chart-success))]'
        : delta < 0
          ? 'text-[hsl(var(--chart-error))]'
          : 'text-[hsl(var(--chart-muted))]';

    const sparkColor =
      delta > 0
        ? 'hsl(var(--chart-success))'
        : delta < 0
          ? 'hsl(var(--chart-error))'
          : 'hsl(var(--chart-muted))';

    const sparkData = (() => {
      const steps = 12;
      return Array.from({ length: steps }, (_, i) => {
        const t = i / (steps - 1);
        const interp = prev + (current - prev) * t;
        return Math.max(0, Math.min(100, Math.round(interp)));
      });
    })();

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="group flex items-center gap-3 cursor-pointer transition-all duration-200 h-4"
        onMouseEnter={() => setHoveredEmployee(employee.id)}
        onMouseLeave={() => setHoveredEmployee(null)}
      >
        {/* Drag Handle - only show if enabled */}
        {showDragHandle ? (
          <div
            {...attributes}
            {...listeners}
            className="w-8 flex-shrink-0 flex items-center justify-center text-gray-400 hover:text-white cursor-grab active:cursor-grabbing"
          >
            <GripVertical size={12} />
          </div>
        ) : (
          <div className="w-8 flex-shrink-0" />
        )}

        {/* Employee Row Content - clickable area */}
        <div 
          className="flex items-center gap-3 flex-1 px-2 h-full"
          onClick={() => handleEmployeeClick(employee, clinicId)}
        >
          {/* Employee Name */}
          <div className={`w-32 text-[10px] truncate text-right transition-all duration-200 ${
            isHovered || isSelected ? 'text-white font-medium opacity-100' : 'text-gray-300'
          }`}>
            {employee.name}
          </div>
          
          {/* Quadrant Horizontal Bar */}
          <div className={`flex-1 transition-all duration-200 ${isSelected ? 'opacity-100' : 'opacity-50 group-hover:opacity-75'}`}>
            <QuadrantBar 
              quadrants={employee.quadrants}
              fullWidth 
              shouldAnimate={false}
              isSelected={isSelected}
              animationKey={`emp-row:${clinicId}:${employee.id}`}
              animatedRegistry={animatedBarsRef}
            />
          </div>
          
          {/* PREVIOUS Score */}
          <div className={`w-16 text-[10px] tabular-nums text-left transition-all duration-200 font-medium ${
            isHovered || isSelected ? 'text-white opacity-100' : 'text-[hsl(var(--chart-muted))] opacity-80'
          }`}>
            {prev}
          </div>

          {/* TREND */}
          <div className={`w-16 text-[10px] tabular-nums text-left transition-all duration-200 font-medium ${
            isHovered || isSelected ? 'opacity-100' : 'opacity-80'
          } ${trendClass}`}>
            {employee.previousReviewChange > 0 ? '+' : ''}{employee.previousReviewChange}
          </div>
          
          {/* PERFORMANCE Score and Trend Sparkline */}
          <div className={`w-24 flex items-center gap-2 transition-all duration-200 ${isHovered || isSelected ? 'opacity-100' : ''}`}>
            <span className={`text-xs font-medium tabular-nums w-8 text-left ${perfColor}`}>
              {current}
            </span>
            <div className="hover:scale-110 transition-transform duration-200">
              <SparkLine
                trend={delta}
                size="xs"
                color={sparkColor}
                data={sparkData}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleEmployeeClick = (employee: Employee, clinicId: string) => {
    setAnimatingEmployee(employee.id);
    
    if (selectedEmployees.includes(employee.id)) {
      // Employee already selected, deselect them
      setSelectedEmployees(prev => prev.filter(id => id !== employee.id));
      setGlobalEmployeeOrder(prev => prev.filter(id => id !== employee.id));
      return;
    }
    
    // Add to selected employees and link to clinic
    setSelectedEmployees(prev => [...prev, employee.id]);
    // Add to global order (maintain current position, don't move to top)
    setGlobalEmployeeOrder(prev => prev.includes(employee.id) ? prev : [...prev, employee.id]);
    
    // Keep employee in their current position in the clinic order (don't move to top)
    setEmployeeOrders(prev => {
      const currentOrder = prev[clinicId] || [];
      if (currentOrder.includes(employee.id)) {
        return prev; // Keep current position
      }
      return {
        ...prev,
        [clinicId]: [...currentOrder, employee.id] // Add to end if not already in order
      };
    });
    // Link employee to their home clinic (use homeClinicId if available, otherwise the clicked clinic)
    const homeClinic = employee.homeClinicId || clinicId;
    setEmployeeClinicLinks(prev => ({ ...prev, [employee.id]: homeClinic }));
    
    // Reset animation state after animation completes
    setTimeout(() => setAnimatingEmployee(null), 400);
  };

  const handleEmployeeClose = (employeeId: string) => {
    setSelectedEmployees(prev => prev.filter(id => id !== employeeId));
    setGlobalEmployeeOrder(prev => prev.filter(id => id !== employeeId));
    setEmployeeClinicLinks(prev => {
      const newLinks = { ...prev };
      delete newLinks[employeeId];
      return newLinks;
    });
    
    // Reset any animation state for the closed employee
    if (animatingEmployee === employeeId) {
      setAnimatingEmployee(null);
    }
  };

  const handleEmployeeUnlink = (employeeId: string) => {
    setEmployeeClinicLinks(prev => {
      const newLinks = { ...prev };
      delete newLinks[employeeId];
      return newLinks;
    });
  };

  const handleClinicClose = (clinicId: string) => {
    // Check if any employees from this clinic are open
    const linkedEmployees = Object.entries(employeeClinicLinks)
      .filter(([_, linkedClinicId]) => linkedClinicId === clinicId)
      .map(([employeeId]) => employeeId);
    
    const openLinkedEmployees = linkedEmployees.filter(employeeId => 
      selectedEmployees.includes(employeeId)
    );

    if (openLinkedEmployees.length > 0) {
      // Show dialog to ask what to do with linked employees
      setClinicToClose(clinicId);
      setShowCloseDialog(true);
    } else {
      // No linked employees, close normally
      setSelectedClinics(prev => prev.filter(id => id !== clinicId));
    }
  };

  const handleDialogKeepEmployees = () => {
    if (clinicToClose) {
      // Remove clinic from selected
      setSelectedClinics(prev => prev.filter(id => id !== clinicToClose));
      
      // Unlink all employees from this clinic
      const linkedEmployees = Object.entries(employeeClinicLinks)
        .filter(([_, linkedClinicId]) => linkedClinicId === clinicToClose)
        .map(([employeeId]) => employeeId);
      
      setEmployeeClinicLinks(prev => {
        const newLinks = { ...prev };
        linkedEmployees.forEach(employeeId => {
          delete newLinks[employeeId];
        });
        return newLinks;
      });
    }
    
    setShowCloseDialog(false);
    setClinicToClose(null);
  };

  const handleDialogCloseEmployees = () => {
    if (clinicToClose) {
      // Remove clinic from selected
      setSelectedClinics(prev => prev.filter(id => id !== clinicToClose));
      
      // Close all linked employees
      const linkedEmployees = Object.entries(employeeClinicLinks)
        .filter(([_, linkedClinicId]) => linkedClinicId === clinicToClose)
        .map(([employeeId]) => employeeId);
      
      setSelectedEmployees(prev => prev.filter(id => !linkedEmployees.includes(id)));
      
      // Remove links
      setEmployeeClinicLinks(prev => {
        const newLinks = { ...prev };
        linkedEmployees.forEach(employeeId => {
          delete newLinks[employeeId];
        });
        return newLinks;
      });
    }
    
    setShowCloseDialog(false);
    setClinicToClose(null);
  };

  const handleClinicMinimize = (clinicId: string) => {
    setMinimizedClinics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(clinicId)) {
        newSet.delete(clinicId);
      } else {
        newSet.add(clinicId);
      }
      return newSet;
    });
  };

  const handleLocationBarMinimize = () => {
    setIsLocationBarMinimized(prev => !prev);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#22c55e';
    if (score >= 80) return '#3b82f6';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  // Calculate dynamic location data from all clinics
  const locationQuadrantsFromClinics = useMemo(() => {
    if (location.name === 'VGH Medical Center' && clinics.length > 0) {
      // Filter clinics based on role filters if any are selected
      const filteredClinics = selectedRoles.length > 0 
        ? clinics.map(clinic => ({
            ...clinic,
            quadrants: calculateClinicQuadrantsFromEmployees(
              clinic.employees.filter(emp => selectedRoles.includes(emp.role))
            ),
            score: calculateClinicScoreFromEmployees(
              clinic.employees.filter(emp => selectedRoles.includes(emp.role))
            )
          }))
        : clinics;
      
      return calculateLocationQuadrantsFromClinics(filteredClinics);
    }
    return location.quadrants;
  }, [clinics, selectedRoles, location]);

  const locationScoreFromClinics = useMemo(() => {
    if (location.name === 'VGH Medical Center' && clinics.length > 0) {
      // Filter clinics based on role filters if any are selected
      const filteredClinics = selectedRoles.length > 0 
        ? clinics.map(clinic => ({
            ...clinic,
            score: calculateClinicScoreFromEmployees(
              clinic.employees.filter(emp => selectedRoles.includes(emp.role))
            )
          }))
        : clinics;
      
      return calculateLocationScoreFromClinics(filteredClinics);
    }
    return location.overallScore;
  }, [clinics, selectedRoles, location]);

  // Memoize location donut data and gate animation
  const locationDonutData = useMemo(
    () => createChartDataWithGrowth(locationQuadrantsFromClinics, locationScoreFromClinics),
    [locationQuadrantsFromClinics, locationScoreFromClinics]
  );
  const locationPieAnimatedRef = React.useRef(false);
  const shouldAnimateLocationPie = !initialAnimationComplete && !locationPieAnimatedRef.current;
  React.useEffect(() => {
    if (shouldAnimateLocationPie) {
      locationPieAnimatedRef.current = true;
    }
  }, [shouldAnimateLocationPie]);

  return (
    <div className="space-y-4">
      {/* Main VGH Card */}
      <Card className="bg-black/25 border-0 text-white w-full hover:bg-black/35 hover:shadow-lg">
         <CardHeader className="pb-4">
           <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center">
             <div className="flex items-center gap-3">
               <div className="w-20 h-20 bg-gray-700 rounded-lg overflow-hidden">
                 <img 
                   src={VGH_MAIN_IMAGE} 
                   alt="VGH Medical Center" 
                   className="w-full h-full object-cover"
                 />
               </div>
               <div>
                 <h3 className="font-semibold text-lg text-white">{location.name}</h3>
                 <div className="flex items-center gap-2">
                   <span className="text-xs text-gray-400">
                     {location.name === 'VGH Medical Center' ? '15 Locations' : 'Single Location'}
                   </span>
                 </div>
               </div>
             </div>
            
           {/* Culture Composition Donut Chart with Labels and Growth Opportunity */}
             <div className="flex items-start gap-6">
             <div className="relative w-[114px] h-[114px] flex-shrink-0">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={locationDonutData}
                     cx="50%"
                     cy="50%"
                     innerRadius={30}
                     outerRadius={52}
                     startAngle={90}
                     endAngle={-270}
                     dataKey="value"
                     stroke="none"
                     isAnimationActive={shouldAnimateLocationPie}
                     animationBegin={0}
                     animationDuration={shouldAnimateLocationPie ? 2000 : 0}
                   >
                     {locationDonutData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                     ))}
                   </Pie>
                 </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-[28px] font-semibold text-white">
                   {locationScoreFromClinics}
                 </span>
               </div>
             </div>
             
             {/* Labels */}
             <div className="space-y-[1.2px] flex-1">
               <div className="flex items-center gap-10">
                 <div className="flex items-center gap-2">
                   <span className="text-[12px] text-white uppercase tracking-wide">PERSONAL</span>
                 </div>
                 <span className="ml-auto text-right tabular-nums text-[14px] text-white font-medium">
                   {(locationQuadrantsFromClinics.find(q => q.name === "Personal")?.value ?? 0).toFixed(1)}
                 </span>
               </div>
               <div className="flex items-center gap-10">
                 <div className="flex items-center gap-2">
                   <span className="text-[12px] text-yellow-400 uppercase tracking-wide">STAFF</span>
                 </div>
                 <span className="ml-auto text-right tabular-nums text-[14px] text-yellow-400 font-medium">
                   {(locationQuadrantsFromClinics.find(q => q.name === "Staff")?.value ?? 0).toFixed(1)}
                 </span>
               </div>
               <div className="flex items-center gap-10">
                 <div className="flex items-center gap-2">
                   <span className="text-[12px] text-orange-500 uppercase tracking-wide">PATIENT or CLIENT</span>
                 </div>
                 <span className="ml-auto text-right tabular-nums text-[14px] text-orange-500 font-medium">
                   {(locationQuadrantsFromClinics.find(q => q.name === "Patient")?.value ?? 0).toFixed(1)}
                 </span>
               </div>
               <div className="flex items-center gap-10">
                 <div className="flex items-center gap-2">
                   <span className="text-[12px] text-blue-500 uppercase tracking-wide">KNOWLEDGE</span>
                 </div>
                 <span className="ml-auto text-right tabular-nums text-[14px] text-blue-500 font-medium">
                   {(locationQuadrantsFromClinics.find(q => q.name === "Knowledge")?.value ?? 0).toFixed(1)}
                 </span>
               </div>
               <div className="flex items-center gap-10">
                 <div className="flex items-center gap-2">
                   <span className="text-[12px] text-gray-400 uppercase tracking-wide">GROWTH OPPORTUNITY</span>
                 </div>
                 <span className="ml-auto text-right tabular-nums text-[14px] text-gray-400 font-medium">
                   {(100 - locationScoreFromClinics).toFixed(1)}
                 </span>
               </div>
              </div>
            </div>

            {/* Reserved space for button alignment */}
            <div className="w-8"></div>
           </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {isLocationBarMinimized ? (
            <div className="animate-fade-in">
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center">
                <div></div>
                <div className="w-8"></div>
                <div className="flex justify-center w-8">
                  <button 
                    onClick={handleLocationBarMinimize}
                    className="text-gray-400 hover:text-white transition-transform duration-300 hover:scale-110"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in space-y-4">
              {/* Location-Level Role Filter */}
              <div className="border-b border-gray-700 pb-4">
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center">
                  <RoleFilter
                    onFilterChange={handleLocationRoleFilterChange}
                    availableRoles={availableLocationRoles}
                    onRoleAdd={handleLocationRoleAdd}
                    onRoleRemove={handleLocationRoleRemove}
                    className="text-xs"
                  />
                  <div className="w-8"></div>
                  <div className="flex justify-center w-8">
                    <button 
                      onClick={handleLocationBarMinimize}
                      className="text-gray-400 hover:text-white transition-transform duration-300"
                    >
                      <Minus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* VGH Clinics */}
              {location.name === 'VGH Medical Center' && clinics.length > 0 && (
            <div className="space-y-3">
              {/* Column Headers */}
              <div className="flex items-center gap-3 px-2 pb-2 border-b border-gray-700/30">
                <div className="w-8 flex-shrink-0"></div>
                <div className="w-32 text-[8px] text-dashboard-text-muted uppercase tracking-wide text-right">
                  LOCATIONS
                </div>
                <div className="flex-1 text-[8px] text-dashboard-text-muted uppercase tracking-wide text-center"></div>
                <div className="w-16 text-[8px] text-dashboard-text-muted uppercase tracking-wide text-left">PREVIOUS</div>
                <div className="w-16 text-[8px] text-dashboard-text-muted uppercase tracking-wide text-left">TREND</div>
                <div className="w-24 text-[8px] text-dashboard-text-muted uppercase tracking-wide text-left">PERFORMANCE</div>
              </div>

              <div className="space-y-0">
                {clinics.map((clinic, index) => (
                   <div 
                     key={clinic.id} 
                     className="group flex items-center gap-3 cursor-pointer transition-all duration-200 h-4 relative"
                     onClick={() => {
                       // Handle location selection
                       setSelectedLocation(selectedLocation === clinic.id ? null : clinic.id);
                       
                       // Handle clinic expansion
                       if (selectedClinics.includes(clinic.id)) {
                         setSelectedClinics(prev => prev.filter(id => id !== clinic.id));
                       } else {
                         setAnimatingClinic(clinic.id);
                         setSelectedClinics(prev => [...prev, clinic.id]);
                         // Reset animation state after animation completes
                         setTimeout(() => setAnimatingClinic(null), 400);
                       }
                     }}
                   >
                     {/* Clinic Row Content - clickable area */}
                      <div className="flex items-center gap-3 flex-1 px-2 h-full relative z-0">
                        <div className="w-8 flex-shrink-0"></div>
                        {/* Clinic Name */}
                        <div className={`w-32 text-[10px] text-gray-300 truncate text-right transition-all duration-200 hover:text-white hover:font-medium relative z-0 ${
                          selectedLocation === clinic.id || selectedClinics.includes(clinic.id) ? 'opacity-100 text-white font-medium' : ''
                       }`}>
                         {clinic.name}
                       </div>
                     
                       {/* Quadrant Horizontal Bar with enhanced visibility and z-index */}
                       <div className={`flex-1 transition-all duration-200 relative z-20 ${(selectedLocation === clinic.id || selectedClinics.includes(clinic.id)) ? 'opacity-100' : 'opacity-50 group-hover:opacity-75'}`}>
                        <QuadrantBar 
                          quadrants={clinic.quadrants} 
                          fullWidth 
                          shouldAnimate={!initialAnimationComplete}
                          isSelected={selectedClinics.includes(clinic.id)}
                          animationKey={`clinic-row:${clinic.id}`}
                          animatedRegistry={animatedBarsRef}
                        />
                      </div>

                       {/* Previous Score (replacing Growth Opportunity) */}
                       <div className={`w-16 text-[10px] tabular-nums text-left transition-all duration-200 group-hover:opacity-100 relative z-0 ${
                         selectedLocation === clinic.id || selectedClinics.includes(clinic.id) ? 'opacity-100 text-white font-medium' : 'opacity-80 text-[hsl(var(--chart-muted))]'
                       }`}>
                         {(() => {
                           const history = clinic.scoreHistory;
                           const prev = history && history.length > 1 ? history[history.length - 2] : (clinic.previousScore ?? clinic.score - 5);
                           return prev;
                         })()}
                       </div>

                       {/* TREND - show delta vs previous score with color coding */}
                        {(() => {
                          const history = clinic.scoreHistory;
                          const current = history && history.length > 0 ? history[history.length - 1] : clinic.score;
                          const prev = history && history.length > 1 ? history[history.length - 2] : (clinic.previousScore ?? clinic.score - 5);
                          const delta = current - prev;
                          const colorClass = delta > 0 ? 'text-[hsl(var(--chart-success))]' : delta < 0 ? 'text-[hsl(var(--chart-error))]' : 'text-[hsl(var(--chart-muted))]';
                          return (
                            <div className={`w-16 text-[10px] tabular-nums text-left transition-all duration-200 group-hover:opacity-100 relative z-0 ${
                              (selectedLocation === clinic.id || selectedClinics.includes(clinic.id)) ? 'opacity-100' : 'opacity-80'
                            } font-medium ${colorClass}`}>
                              {delta > 0 ? '+' : ''}{delta}
                            </div>
                          );
                        })()}

                       {/* Score and Trend Sparkline with enhanced visibility */}
                         <div className={`w-24 flex items-center gap-2 transition-all duration-200 group-hover:opacity-100 hover:opacity-105 relative z-0 ${
                           selectedLocation === clinic.id || selectedClinics.includes(clinic.id) ? 'opacity-100' : 'opacity-80'
                         }`}>
                           <span className={`text-xs font-medium tabular-nums w-8 text-left hover:font-bold ${(() => {
                             const history = clinic.scoreHistory;
                             const current = history && history.length > 0 ? history[history.length - 1] : clinic.score;
                             const prev = history && history.length > 1 ? history[history.length - 2] : (clinic.previousScore ?? clinic.score - 5);
                             const delta = current - prev;
                             return delta > 0
                               ? 'text-[hsl(var(--chart-success))]'
                               : delta < 0
                                 ? 'text-[hsl(var(--chart-error))]'
                                 : 'text-[hsl(var(--chart-muted))]';
                           })()}`}>
                             {(() => {
                               const history = clinic.scoreHistory;
                               const current = history && history.length > 0 ? history[history.length - 1] : clinic.score;
                               return current;
                             })()}
                           </span>
                           <div className="hover:scale-110 transition-transform duration-200">
                             <SparkLine
                               trend={(() => {
                                 const history = clinic.scoreHistory;
                                 const current = history && history.length > 0 ? history[history.length - 1] : clinic.score;
                                 const prev = history && history.length > 1 ? history[history.length - 2] : (clinic.previousScore ?? clinic.score - 5);
                                 return current - prev;
                               })()}
                               size="xs"
                               color={(() => {
                                 const history = clinic.scoreHistory;
                                 const current = history && history.length > 0 ? history[history.length - 1] : clinic.score;
                                 const prev = history && history.length > 1 ? history[history.length - 2] : (clinic.previousScore ?? clinic.score - 5);
                                 const delta = current - prev;
                                 return delta > 0
                                   ? 'hsl(var(--chart-success))'
                                   : delta < 0
                                     ? 'hsl(var(--chart-error))'
                                     : 'hsl(var(--chart-muted))';
                               })()}
                               data={clinic.scoreHistory}
                             />
                           </div>
                         </div>
                     </div>
                   </div>
                ))}
              </div>
              
            </div>
           )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location-Level Filtered Employee Cards - shown when location role filters are active */}
      {selectedRoles.length > 0 && (
        <div className="ml-4 space-y-2 border-l-2 border-gray-700 pl-4">
          <div className="text-sm font-medium text-gray-400 uppercase tracking-wide">
            Filtered Staff ({getFilteredEmployees.length})
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleMainEmployeeDragEnd}
          >
            <SortableContext
              items={getFilteredEmployees.filter(emp => selectedEmployees.includes(emp.id)).map(emp => emp.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {getFilteredEmployees
                  .filter(emp => selectedEmployees.includes(emp.id))
                  .sort((a, b) => globalEmployeeOrder.indexOf(a.id) - globalEmployeeOrder.indexOf(b.id))
                  .map(employee => {
                    // Find which clinic this employee belongs to
                    const employeeClinic = clinics.find(clinic => 
                      clinic.employees.some(emp => emp.id === employee.id)
                    );
                    
                    return (
                        <SortableEmployeeDetailCard 
                          key={employee.id}
                          employee={employee} 
                          clinicId={employeeClinic?.id}
                          onRemove={() => handleEmployeeClose(employee.id)}
                          onUnlink={() => handleEmployeeUnlink(employee.id)}
                        />
                    );
                  })}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {selectedClinics.map((clinicId, clinicIndex) => {
        const clinic = clinics.find(c => c.id === clinicId);
        if (!clinic) return null;

        const linkedEmployeeIds = Object.entries(employeeClinicLinks)
          .filter(([_, linkedClinicId]) => linkedClinicId === clinicId)
          .map(([employeeId]) => employeeId)
          .filter(id => selectedEmployees.includes(id));

        // Calculate dynamic clinic data based on filtered employees
        const filteredClinicEmployees = getFilteredClinicEmployees(clinic);
        const dynamicQuadrants = calculateClinicQuadrantsFromEmployees(filteredClinicEmployees);
        const dynamicScore = calculateClinicScoreFromEmployees(filteredClinicEmployees);
        const clinicDonutData = createChartDataWithGrowth(dynamicQuadrants, dynamicScore);

        return (
          <div key={clinicId} className="space-y-2">
            <Card 
              className={`bg-black/25 border-0 text-white w-full cursor-move transition-all duration-200 hover:bg-black/35 hover:shadow-lg ${
                animatingClinic === clinicId ? 'clinic-card-slide-in' : ''
              }`}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', clinicId);
              }}
            >
              <CardHeader className="pb-4 relative min-h-[114px]">
                {/* Absolute positioned buttons - aligned with main location card */}
                <button 
                  onClick={() => handleClinicClose(clinicId)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-white z-10"
                >
                  <X size={16} />
                </button>
                
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-20 rounded-lg overflow-hidden">
                      <img 
                        src={getClinicImage(clinicIndex)} 
                        alt={`${clinic.name} Clinic`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-white">
                        {clinic.name} Clinic
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {clinic.employees.length} Staff Members
                        </span>
                        {linkedEmployeeIds.length > 0 && (
                          <span className="text-xs text-blue-400">
                            • {linkedEmployeeIds.length} open
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                 {/* Culture Composition Donut Chart with Labels and Growth Opportunity */}
                 <div className="flex items-start gap-6">
                    <div className="relative w-[114px] h-[114px] flex-shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={clinicDonutData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={52}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                            stroke="none"
                            isAnimationActive={false}
                          >
                            {clinicDonutData.map((entry, index) => (
                              <Cell key={`clinic-cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[28px] font-semibold text-white">
                          {dynamicScore}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-[1.2px] flex-1">
                      <div className="flex items-center gap-10">
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-white uppercase tracking-wide">PERSONAL</span>
                        </div>
                        <span className="ml-auto text-right tabular-nums text-[14px] text-white font-medium">
                          {(clinic.quadrants[0]?.value ?? 0).toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-10">
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-yellow-400 uppercase tracking-wide">STAFF</span>
                        </div>
                        <span className="ml-auto text-right tabular-nums text-[14px] text-yellow-400 font-medium">
                          {(clinic.quadrants[1]?.value ?? 0).toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-10">
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-orange-500 uppercase tracking-wide">PATIENT or CLIENT</span>
                        </div>
                        <span className="ml-auto text-right tabular-nums text-[14px] text-orange-500 font-medium">
                          {(clinic.quadrants[2]?.value ?? 0).toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-10">
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-blue-500 uppercase tracking-wide">KNOWLEDGE</span>
                        </div>
                        <span className="ml-auto text-right tabular-nums text-[14px] text-blue-500 font-medium">
                          {(clinic.quadrants[3]?.value ?? 0).toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-10">
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-gray-400 uppercase tracking-wide">GROWTH OPPORTUNITY</span>
                        </div>
                        <span className="ml-auto text-right tabular-nums text-[14px] text-gray-400 font-medium">
                          {(100 - dynamicScore).toFixed(1)}
                        </span>
                      </div>
                     </div>
                   </div>

                   {/* Reserved space for button alignment */}
                   <div className="w-8"></div>
                </div>
                
                {/* Clinic-Level Role Filter - Always visible */}
                <div className="px-6 pb-4">
                  <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center">
                    <RoleFilter
                      onFilterChange={(roles) => handleClinicRoleFilterChange(clinic.id, roles)}
                      availableRoles={availableClinicRoles[clinic.id] || []}
                      onRoleAdd={(role) => handleClinicRoleAdd(clinic.id, role)}
                      onRoleRemove={(role) => handleClinicRoleRemove(clinic.id, role)}
                      className="text-xs"
                    />
                    <div className="w-8"></div>
                    <div className="flex justify-center w-8">
                      <button 
                        onClick={() => handleClinicMinimize(clinic.id)}
                        className="text-gray-400 hover:text-white transition-transform duration-300"
                      >
                        {minimizedClinics.has(clinic.id) ? <Plus size={16} /> : <Minus size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </CardHeader>

              {!minimizedClinics.has(clinicId) && (
                <CardContent className="space-y-4">

                {/* Employee Bars */}
                <div className="space-y-3">
                  {/* Column Headers - STAFF moved into header row to share baseline and style */}
                  <div className="flex items-center gap-3 px-2 pb-2 border-b border-gray-700/30">
                    <div className="w-8 flex-shrink-0"></div> {/* Space for drag handle */}
                    <div className="w-32 text-[8px] text-dashboard-text-muted uppercase tracking-wide text-right">STAFF</div>
                    <div className="flex-1 text-[8px] text-dashboard-text-muted uppercase tracking-wide text-center"></div>
                    <div className="w-16 text-[8px] text-dashboard-text-muted uppercase tracking-wide text-left">PREVIOUS</div>
                    <div className="w-16 text-[8px] text-dashboard-text-muted uppercase tracking-wide text-left">TREND</div>
                    <div className="w-24 text-[8px] text-dashboard-text-muted uppercase tracking-wide text-left">PERFORMANCE</div>
                  </div>
                  
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(event) => handleDragEnd(event, clinicId)}
                  >
                    <SortableContext
                      items={employeeOrders[clinicId] || getFilteredClinicEmployees(clinic).map(emp => emp.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-0">{/* No spacing between employee rows */}
                        {(employeeOrders[clinicId] || getFilteredClinicEmployees(clinic).map(emp => emp.id)).map((employeeId) => {
                          const employee = getFilteredClinicEmployees(clinic).find(emp => emp.id === employeeId);
                          if (!employee) return null;
                          
                          return (
                            <SortableEmployeeItem
                              key={employee.id}
                              employee={employee}
                              clinicId={clinicId}
                              showDragHandle={false}
                            />
                          );
                        })}
                      </div>
                    </SortableContext>
                  </DndContext>
                  </div>
                </CardContent>
              )}
            </Card>
            
            {/* Clinic-Level Filtered Employee Cards - shown when clinic role filters are active and not minimized */}
            {!minimizedClinics.has(clinicId) && (() => {
              const clinicRoles = clinicRoleFilters[clinic.id] || [];
              const filteredEmployees = getFilteredClinicEmployees(clinic);
              const filteredSelectedEmployees = filteredEmployees.filter(emp => selectedEmployees.includes(emp.id));
              
              if (clinicRoles.length === 0 || filteredSelectedEmployees.length === 0) return null;
              
              return (
                <div className="ml-4 space-y-2 border-l-2 border-gray-700 pl-4">
                  <div className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                    Filtered Staff ({filteredEmployees.length})
                  </div>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleMainEmployeeDragEnd}
                  >
                    <SortableContext
                      items={filteredSelectedEmployees.map(emp => emp.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {filteredSelectedEmployees
                          .sort((a, b) => globalEmployeeOrder.indexOf(a.id) - globalEmployeeOrder.indexOf(b.id))
                          .map(employee => (
                            <SortableEmployeeDetailCard 
                              key={employee.id}
                              employee={employee} 
                              clinicId={clinic.id}
                              onRemove={() => handleEmployeeClose(employee.id)}
                              onUnlink={() => handleEmployeeUnlink(employee.id)}
                            />
                          ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              );
            })()}

            {/* Employee Detail Cards for this clinic - positioned directly beneath clinic card */}
            {linkedEmployeeIds.length > 0 && (
              <div className="ml-4 space-y-2 border-l-2 border-gray-700 pl-4">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleMainEmployeeDragEnd}
                >
                  <SortableContext
                    items={linkedEmployeeIds.filter(id => globalEmployeeOrder.includes(id)).sort((a, b) => 
                      globalEmployeeOrder.indexOf(a) - globalEmployeeOrder.indexOf(b)
                    )}
                    strategy={verticalListSortingStrategy}
                  >
                    {linkedEmployeeIds
                      .filter(id => globalEmployeeOrder.includes(id))
                      .sort((a, b) => globalEmployeeOrder.indexOf(a) - globalEmployeeOrder.indexOf(b))
                      .map((employeeId, idx) => {
                        const employee = clinic.employees.find(emp => emp.id === employeeId);
                        if (!employee) return null;
                        
                        return (
                          <SortableEmployeeDetailCard 
                            key={employeeId}
                            employee={employee} 
                            clinicId={clinicId}
                            index={idx + 1}
                            onRemove={() => handleEmployeeClose(employeeId)}
                            onUnlink={() => handleEmployeeUnlink(employeeId)}
                          />
                        );
                      })}
                  </SortableContext>
                </DndContext>
              </div>
            )}
          </div>
        );
      })}

      {/* Unlinked Employee Detail Cards - shown separately */}
      {(() => {
        const unlinkedEmployeeIds = globalEmployeeOrder.filter(id => 
          selectedEmployees.includes(id) && !employeeClinicLinks[id]
        );
        
        if (unlinkedEmployeeIds.length === 0) return null;
        
        return (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-400 uppercase tracking-wide">
              Unlinked Employees
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleMainEmployeeDragEnd}
            >
              <SortableContext
                items={unlinkedEmployeeIds}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {unlinkedEmployeeIds.map((employeeId, idx) => {
                    // Find employee in any clinic (using filtered employees)
                    let employee: Employee | undefined;
                    
                    for (const clinic of clinics) {
                      const filteredEmployees = getFilteredEmployees;
                      const foundEmployee = filteredEmployees.find(emp => emp.id === employeeId);
                      if (foundEmployee) {
                        employee = foundEmployee;
                        break;
                      }
                    }
                    
                    if (!employee) return null;
                    
                       return (
                         <SortableEmployeeDetailCard 
                           key={employeeId}
                           employee={employee} 
                           clinicId={undefined}
                           index={idx + 1}
                           onRemove={() => handleEmployeeClose(employeeId)}
                           onUnlink={() => handleEmployeeUnlink(employeeId)}
                         />
                       );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        );
      })()}

      {/* Close Clinic Dialog */}
      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent className="bg-black/90 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Close Clinic</DialogTitle>
            <DialogDescription className="text-gray-400">
              This clinic has open employee cards. What would you like to do with them?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={handleDialogKeepEmployees}
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              Keep Employees Open
            </Button>
            <Button 
              onClick={handleDialogCloseEmployees}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Close Employees Too
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LocationPerformanceCard;
