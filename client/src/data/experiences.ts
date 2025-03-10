import { Experience } from '../types';

type Slide = {
  image: string;
  title: string;
  description: string;
};

export const experiences: Record<string, Experience> = {
  busright: {
    id: 'busright',
    title: 'BusRight',
    subtitle: 'Revolutionizing student transportation',
    link: 'https://busright.com',
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
  dormroomfund: {
    id: 'dormroomfund',
    title: 'Dorm Room Fund',
    subtitle: 'Student-run venture fund backing student entrepreneurs',
    link: 'https://www.dormroomfund.com',
    slides: [
      {
        image: '/images/drf.jpg',
        title: 'That time a founder sold their company for $20M',
        description: 'We invested early and saw this incredible journey from dorm room to acquisition in just 18 months.'
      },
      {
        image: '/images/experiences/placeholder2.jpg',
        title: 'Investing in Student Founders',
        description: 'Helping allocate capital from our $12.5M pre-seed fund to promising student entrepreneurs.'
      },
      {
        image: '/images/drf2.jpg',
        title: 'Building a student founder community',
        description: 'We created a network that supported over 300 student founders across the country with mentorship and resources.'
      }
    ]
  },
  northeastern: {
    id: 'northeastern',
    title: 'Northeastern University',
    subtitle: 'Computer Science & Business Administration',
    slides: [
      {
        image: '/images/neu.jpg',
        title: 'That one final project that took 3 all-nighters',
        description: 'The distributed systems project seemed impossible until we had that breakthrough moment at 4am.'
      },
      {
        image: '/images/experiences/placeholder3.jpg',
        title: 'Classes & Projects',
        description: 'Studying Computer Science and Business Administration with a focus on entrepreneurship.'
      },
      {
        image: '/images/experiences/placeholder2.jpg',
        title: 'Campus Involvement',
        description: 'Leading student organizations and participating in hackathons and entrepreneurship competitions.'
      }
    ]
  }
};