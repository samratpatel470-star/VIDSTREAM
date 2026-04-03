export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  channelName: string;
  channelAvatar: string;
  views: string;
  postedAt: string;
  duration: string;
  description: string;
  category: string;
}

export interface Short {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  views: string;
  likes: string;
  comments: string;
  channelName: string;
  channelAvatar: string;
}

export const CATEGORIES = [
  "All",
  "Music",
  "Gaming",
  "Technology",
  "Programming",
  "Cooking",
  "Travel",
  "Nature",
  "Education"
];

export const MOCK_VIDEOS: Video[] = [
  {
    id: "1",
    title: "Exploring the Majestic Swiss Alps",
    thumbnail: "https://picsum.photos/seed/alps/640/360",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    channelName: "Nature Hub",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nature",
    views: "1.2M views",
    postedAt: "2 days ago",
    duration: "10:05",
    description: "Join us as we hike through the beautiful Swiss Alps, exploring hidden valleys and snowy peaks.",
    category: "Travel"
  },
  {
    id: "2",
    title: "The Future of Artificial Intelligence",
    thumbnail: "https://picsum.photos/seed/ai/640/360",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    channelName: "Tech Insider",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tech",
    views: "850K views",
    postedAt: "5 hours ago",
    duration: "15:20",
    description: "Deep dive into how AI is changing our world and what to expect in the next decade.",
    category: "Technology"
  },
  {
    id: "3",
    title: "Mastering React in 2024",
    thumbnail: "https://picsum.photos/seed/react/640/360",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    channelName: "Code Academy",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Code",
    views: "2.5M views",
    postedAt: "1 month ago",
    duration: "45:12",
    description: "Everything you need to know to become a React pro this year.",
    category: "Programming"
  },
  {
    id: "4",
    title: "Lofi Hip Hop Radio - Beats to Relax/Study to",
    thumbnail: "https://picsum.photos/seed/lofi/640/360",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    channelName: "Lofi Girl",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lofi",
    views: "10M views",
    postedAt: "Live",
    duration: "Live",
    description: "Relaxing beats for your daily tasks.",
    category: "Music"
  },
  {
    id: "5",
    title: "Epic Gaming Moments 2024",
    thumbnail: "https://picsum.photos/seed/gaming/640/360",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    channelName: "Pro Gamer",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gaming",
    views: "500K views",
    postedAt: "1 week ago",
    duration: "12:45",
    description: "The most insane plays from this year's biggest tournaments.",
    category: "Gaming"
  },
  {
    id: "6",
    title: "How to Cook the Perfect Steak",
    thumbnail: "https://picsum.photos/seed/steak/640/360",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    channelName: "Chef's Table",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chef",
    views: "3.1M views",
    postedAt: "3 days ago",
    duration: "08:30",
    description: "Learn the secrets to a restaurant-quality steak at home.",
    category: "Cooking"
  },
  {
    id: "7",
    title: "Deep Sea Exploration: The Unknown",
    thumbnail: "https://picsum.photos/seed/ocean/640/360",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    channelName: "Ocean Discovery",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ocean",
    views: "1.8M views",
    postedAt: "2 weeks ago",
    duration: "22:15",
    description: "Journey to the deepest parts of our oceans.",
    category: "Nature"
  },
  {
    id: "8",
    title: "SpaceX Starship Launch Highlights",
    thumbnail: "https://picsum.photos/seed/space/640/360",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    channelName: "Space News",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Space",
    views: "4.2M views",
    postedAt: "1 day ago",
    duration: "14:50",
    description: "The best moments from the latest Starship flight test.",
    category: "Technology"
  }
];

export const MOCK_SHORTS: Short[] = [
  {
    id: "s1",
    title: "How to make a perfect espresso ☕️",
    thumbnail: "https://picsum.photos/seed/coffee/400/700",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    views: "1.2M",
    likes: "45K",
    comments: "1.2K",
    channelName: "Barista Pro",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Coffee"
  },
  {
    id: "s2",
    title: "Insane parkour jump! 🏃‍♂️",
    thumbnail: "https://picsum.photos/seed/parkour/400/700",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    views: "5.4M",
    likes: "230K",
    comments: "8.5K",
    channelName: "Urban Explorer",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jump"
  },
  {
    id: "s3",
    title: "Coding a game in 60 seconds 💻",
    thumbnail: "https://picsum.photos/seed/code-short/400/700",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    views: "890K",
    likes: "67K",
    comments: "3.4K",
    channelName: "DevLife",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dev"
  },
  {
    id: "s4",
    title: "Beautiful sunset in Bali 🌅",
    thumbnail: "https://picsum.photos/seed/sunset/400/700",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    views: "2.1M",
    likes: "120K",
    comments: "5.6K",
    channelName: "Travel Vibes",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Travel"
  }
];
