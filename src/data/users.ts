import { User } from '../types';

export const DEMO_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@example.in',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    phone: '+91 98765 43210',
    address: '42 Marine Drive, Nariman Point',
    city: 'Mumbai',
    zipCode: '400001',
  },
  {
    id: 'user-2',
    name: 'Admin ElectroSeller',
    email: 'admin@electrocompare.in',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    phone: '+91 98989 89898',
    address: 'Tech Park, Electronic City',
    city: 'Bengaluru',
    zipCode: '560100',
  }
];
