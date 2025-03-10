export interface Experience {
  id: string;
  title: string;
  location?: string;
  year?: string;
  slides: {
    image: string;
    title: string;
    description: string;
  }[];
}

export const experiences: Record<string, Experience> = {
  busright: {
    id: 'busright',
    title: 'BusRight',
    location: 'Boston, MA',
    year: '2018-2023',
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
    location: 'Boston, MA',
    year: '2016-2018',
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
    location: 'Boston, MA',
    year: '2014-2018',
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