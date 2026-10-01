export const initialVideos = [
  {
    id: "vid-cyberpunk-future",
    title: "Cyberpunk 2077: Phantom Liberty 4K Ray Tracing Overdrive Benchmark & Analysis",
    description: "Deep dive into the technological marvel of path tracing and neural rendering in Night City. We analyze frame pacing, VRAM consumption, and DLSS 3.5 ray reconstruction on modern hardware.\n\nTimestamps:\n0:00 - Introduction\n2:15 - Ray Tracing vs Path Tracing\n5:40 - Benchmark Results 4K\n9:20 - Conclusion & Verdict",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1280&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    hlsUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    duration: 734,
    durationFormatted: "12:14",
    views: 482190,
    likes: 34200,
    dislikes: 412,
    category: "Gaming",
    tags: ["Cyberpunk", "RTX", "Gaming", "Benchmark", "Tech"],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    channel: {
      id: "ch-hardware-nexus",
      name: "Nexus Hardware Lab",
      handle: "@nexushardware",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80",
      subscribers: "890K",
      verified: true
    },
    monetization: {
      enabled: true,
      adFormats: ["banner", "in_stream"]
    },
    resolutions: ["1080p", "720p", "480p", "360p"],
    comments: [
      {
        id: "c-101",
        author: "DevAlex",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80",
        content: "The path tracing improvements are insane. Fantastic breakdown as always!",
        createdAt: "1 day ago",
        likes: 124
      },
      {
        id: "c-102",
        author: "Sarah_Gamer",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
        content: "Can you do an in-depth frame time analysis on mid-tier GPUs next?",
        createdAt: "18 hours ago",
        likes: 42
      }
    ]
  },
  {
    id: "vid-ai-agents-2026",
    title: "Building Autonomous Agentic AI Systems from Scratch in TypeScript",
    description: "In this comprehensive masterclass, explore how to architect production-grade autonomous agentic workflows using tool-calling, reflection loops, and persistent vector memory.\n\nCode repository and architecture diagrams linked in the video sensor resources.",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1280&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    hlsUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    duration: 1845,
    durationFormatted: "30:45",
    views: 129400,
    likes: 11800,
    dislikes: 85,
    category: "Tech",
    tags: ["AI", "TypeScript", "Coding", "Software Architecture", "Agents"],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    channel: {
      id: "ch-code-architect",
      name: "Sunny Architect",
      handle: "@sunnyarchitect",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
      subscribers: "312K",
      verified: true
    },
    monetization: {
      enabled: true,
      adFormats: ["banner"]
    },
    resolutions: ["1080p", "720p", "480p"],
    comments: [
      {
        id: "c-201",
        author: "Marcus Vance",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
        content: "Best explanation of cognitive loop mechanics I've seen all year. Subscribed!",
        createdAt: "2 days ago",
        likes: 89
      }
    ]
  },
  {
    id: "vid-deep-cosmos-4k",
    title: "Cosmos Laundromat: The First Free Open Source Animated Film in 4K HDR",
    description: "On a desolate windswept island, a suicidal sheep named Franck meets his fate in the form of a quirky salesman who offers him the gift of a lifetime. A cinematic tour-de-force rendered entirely in open-source Blender.",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1280&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    hlsUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    duration: 728,
    durationFormatted: "12:08",
    views: 893120,
    likes: 67200,
    dislikes: 310,
    category: "Movies & Shows",
    tags: ["Blender", "Animation", "Film", "Open Source", "CGI"],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    channel: {
      id: "ch-open-cinema",
      name: "Open Cinema Project",
      handle: "@opencinema",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80",
      subscribers: "1.2M",
      verified: true
    },
    monetization: {
      enabled: true,
      adFormats: ["banner", "in_stream"]
    },
    resolutions: ["1080p", "720p", "480p", "360p"],
    comments: [
      {
        id: "c-301",
        author: "Elena Rostova",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&q=80",
        content: "The fur simulation and lighting are beyond breathtaking.",
        createdAt: "3 days ago",
        likes: 210
      }
    ]
  },
  {
    id: "vid-synthwave-odyssey",
    title: "Neon Horizon - 1-Hour Synthwave & Cyberpunk Chill Mix for Deep Focus",
    description: "Relax, study, or code to this continuous retro-futuristic synthwave journey. Featuring warm analog synths, gated reverbs, and driving basslines.",
    thumbnail: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1280&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    hlsUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    duration: 3600,
    durationFormatted: "1:00:00",
    views: 3412000,
    likes: 184500,
    dislikes: 1200,
    category: "Music",
    tags: ["Synthwave", "Music", "Cyberpunk", "Coding Music", "Lofi"],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    channel: {
      id: "ch-retro-records",
      name: "RetroWave Odyssey",
      handle: "@retrowaveodyssey",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
      subscribers: "740K",
      verified: true
    },
    monetization: {
      enabled: true,
      adFormats: ["banner"]
    },
    resolutions: ["1080p", "720p", "480p"],
    comments: []
  },
  {
    id: "vid-aurora-drone-4k",
    title: "Chasing the Northern Lights in Arctic Norway: Cinematic FPV Drone 4K",
    description: "An unbelievable 7-day winter expedition across Lofoten and Tromsø filming the aurora borealis with custom low-light camera sensors and high-speed acrobatic drones.",
    thumbnail: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1280&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    hlsUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    duration: 482,
    durationFormatted: "8:02",
    views: 652000,
    likes: 49300,
    dislikes: 154,
    category: "Nature",
    tags: ["Norway", "Aurora", "Drone", "4K", "Travel"],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    channel: {
      id: "ch-arctic-explorers",
      name: "Arctic Lens",
      handle: "@arcticlens",
      avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=160&q=80",
      subscribers: "450K",
      verified: false
    },
    monetization: {
      enabled: true,
      adFormats: ["banner", "in_stream"]
    },
    resolutions: ["1080p", "720p", "480p", "360p"],
    comments: []
  },
  {
    id: "vid-fullstack-cloud-vps",
    title: "Zero-Cost Cloudflare R2 Video Delivery & Self-Hosting on VPS Tutorial",
    description: "How to eliminate cloud bandwidth fees using Cloudflare R2's zero-egress object storage for video streaming platforms. Complete configuration guide for S3 API keys, CNAME custom domains, and HLS caching rules.",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1280&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    hlsUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    duration: 980,
    durationFormatted: "16:20",
    views: 245000,
    likes: 19400,
    dislikes: 92,
    category: "Education",
    tags: ["Cloudflare", "R2", "DevOps", "VPS", "SelfHosting"],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    channel: {
      id: "ch-devops-master",
      name: "Cloud Architect Guide",
      handle: "@cloudarchitect",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80",
      subscribers: "520K",
      verified: true
    },
    monetization: {
      enabled: true,
      adFormats: ["banner"]
    },
    resolutions: ["1080p", "720p", "480p"],
    comments: []
  }
];
