
type Slide = {
  image: string;
  title: string;
  description: string;
};

export interface Experience {
  id: string;
  title: string;
  slides: Slide[];
}

export const experiences: Record<string, Experience> = {
  busright: {
    id: 'busright',
    title: 'BusRight',
    slides: [
      {
        image: '/images/experiences/placeholder1.jpg',
        title: 'Customer Success Stories',
        description: 'That time a customer got a tattoo of our logo because they loved the product so much!'
      },
      {
        image: '/images/experiences/placeholder2.jpg',
        title: 'Building From Scratch',
        description: 'Joined as employee #1 with no customers to Series B with nationwide impact.'
      },
      {
        image: '/images/experiences/placeholder3.jpg',
        title: 'Team Growth',
        description: 'Growing our team from 3 to 30+ amazing people across multiple departments.'
      }
    ]
  },
  dormRoomFund: {
    id: 'dormRoomFund',
    title: 'Dorm Room Fund',
    slides: [
      {
        image: '/images/experiences/placeholder2.jpg',
        title: 'Investing in Student Founders',
        description: 'Helping allocate capital from our $12.5M pre-seed fund to promising student entrepreneurs.'
      },
      {
        image: '/images/experiences/placeholder3.jpg',
        title: 'Portfolio Success',
        description: 'Our portfolio companies have gone on to raise over $2B in follow-on funding.'
      },
      {
        image: '/images/experiences/placeholder1.jpg',
        title: 'Community Events',
        description: 'Organizing pitch competitions and networking events for student entrepreneurs.'
      }
    ]
  },
  northeastern: {
    id: 'northeastern',
    title: 'Northeastern University',
    slides: [
      {
        image: '/images/experiences/placeholder3.jpg',
        title: 'Classes & Projects',
        description: 'Studying Computer Science and Business Administration with a focus on entrepreneurship.'
      },
      {
        image: '/images/experiences/placeholder1.jpg',
        title: 'Co-op Experience',
        description: 'Working at technology startups through Northeastern\'s renowned co-op program.'
      },
      {
        image: '/images/experiences/placeholder2.jpg',
        title: 'Campus Involvement',
        description: 'Leading student organizations and participating in hackathons and entrepreneurship competitions.'
      }
    ]
  }
};
import { Experience } from '../types';

export const experiences: Experience[] = [
  {
    id: 'dormroomfund',
    title: 'Dorm Room Fund',
    subtitle: 'Student-run venture fund backing student entrepreneurs',
    description: 'I helped build the next generation of entrepreneurs.',
    location: 'Boston, MA',
    date: '2020-2022',
    link: 'https://www.dormroomfund.com',
    stories: [
      {
        title: 'That time a founder sold their company for $20M',
        description: 'We invested early and saw this incredible journey from dorm room to acquisition in just 18 months.',
        image: '/images/drf.jpg'
      },
      {
        title: 'Building a student founder community',
        description: 'We created a network that supported over 300 student founders across the country with mentorship and resources.',
        image: '/images/drf2.jpg'
      }
    ]
  },
  {
    id: 'northeastern',
    title: 'Northeastern',
    subtitle: 'Computer Science & Business Administration',
    description: 'I studied CS and business while working on co-ops.',
    location: 'Boston, MA',
    date: '2018-2022',
    stories: [
      {
        title: 'That one final project that took 3 all-nighters',
        description: 'The distributed systems project seemed impossible until we had that breakthrough moment at 4am.',
        image: '/images/neu.jpg'
      },
      {
        title: 'Building the Husky startup challenge',
        description: 'Helped 50+ student teams launch their first startups through an accelerator program I co-created.',
        image: '/images/neu2.jpg'
      }
    ]
  }
];
