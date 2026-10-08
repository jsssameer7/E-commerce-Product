import { Review } from '../types';

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'phone-1',
    author: 'Alex Rivera',
    rating: 5,
    date: '2024-10-01',
    title: 'Unbelievable camera and battery performance',
    comment: 'Upgraded from an 11 Pro and the difference is night and day. The 5x lens produces crisp portraits and the battery easily lasts me 1.5 days of heavy work and camera usage.',
    verified: true,
    helpfulCount: 42
  },
  {
    id: 'rev-2',
    productId: 'phone-1',
    author: 'Elena Rostova',
    rating: 5,
    date: '2024-09-28',
    title: 'Titanium feel is sublime',
    comment: 'The reduced weight compared to previous stainless steel models makes a huge ergonomic difference. 4K 120fps video is super smooth.',
    verified: true,
    helpfulCount: 19
  },
  {
    id: 'rev-3',
    productId: 'phone-2',
    author: 'Marcus Vance',
    rating: 5,
    date: '2025-01-20',
    title: 'S-Pen and anti-glare screen are game changers',
    comment: 'Using this outdoors in direct sunlight without reflection is pure magic. 200MP photos have insane detail when zooming in.',
    verified: true,
    helpfulCount: 35
  },
  {
    id: 'rev-4',
    productId: 'laptop-1',
    author: 'David K.',
    rating: 5,
    date: '2024-11-15',
    title: 'Renders 8K ProRes video effortlessly',
    comment: 'I exported a 45-minute 8K timeline in 4 minutes flat while on battery power. Fans did not even spin up. Absolutely astounding engineering.',
    verified: true,
    helpfulCount: 88
  },
  {
    id: 'rev-5',
    productId: 'audio-1',
    author: 'Sarah Chen',
    rating: 5,
    date: '2024-06-10',
    title: 'Silences noisy flights completely',
    comment: 'Took these on a 14 hour flight to Tokyo and slept like a baby. The noise cancelling is unmatched.',
    verified: true,
    helpfulCount: 63
  }
];
