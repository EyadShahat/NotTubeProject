import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "../src/config/db.js";
import User from "../src/models/User.js";
import Video from "../src/models/Video.js";

// Load .env
dotenv.config({ path: new URL("../.env", import.meta.url).pathname });
dotenv.config();

const SEED_VIDEOS = [
  {
    title: "Big Buck Bunny",
    description: "Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself...",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumb: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
  },
  {
    title: "Elephant Dream",
    description: "The first Blender Open Movie from 2006.",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumb: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
  },
  {
    title: "For Bigger Blazes",
    description: "HBO GO now works with Chromecast — enjoy online video on your TV.",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumb: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
  },
  {
    title: "For Bigger Escape",
    description: "Introducing Chromecast. Enjoy online video and music on your TV.",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumb: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg",
  },
  {
    title: "For Bigger Fun",
    description: "Introducing Chromecast. Enjoy online video and music on your TV.",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumb: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg",
  },
  {
    title: "For Bigger Joyrides",
    description: "Chromecast for the times that call for bigger joyrides.",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    thumb: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg",
  },
  {
    title: "For Bigger Meltdowns",
    description: "Chromecast for when you want to make meltdowns even bigger.",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    thumb: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg",
  },
  {
    title: "Sintel",
    description: "Independently produced short film by the Blender Foundation.",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    thumb: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg",
  },
  {
    title: "Subaru Outback On Street And Dirt",
    description: "Outback goes off-road and on-road for a stress test.",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    thumb: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/SubaruOutbackOnStreetAndDirt.jpg",
  },
  {
    title: "Tears of Steel",
    description: "Sci-fi short film realized with open source tools.",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    thumb: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg",
  },
  {
    title: "Volkswagen GTI Review",
    description: "Track test of the 2010 Volkswagen GTI.",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    thumb: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/VolkswagenGTIReview.jpg",
  },
  {
    title: "We Are Going On Bullrun",
    description: "Daily rally videos from the Bullrun Live Rally.",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    thumb: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/WeAreGoingOnBullrun.jpg",
  },
  {
    title: "What car can you get for a grand?",
    description: "How far $1,000 can go when looking for a car.",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
    thumb: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/WhatCarCanYouGetForAGrand.jpg",
  },
  {
    title: "For Bigger Escape 2 (Chromecast)",
    description: "Chromecast escape spot.",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumb: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg",
  },
  {
    title: "For Bigger Joyrides 2 (Chromecast)",
    description: "Chromecast joyrides spot.",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    thumb: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg",
  },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing in .env");

  await connectDB(uri);

  let admin = await User.findOne({ email: "admin@nottube.com" });
  if (!admin) {
    const passwordHash = await bcrypt.hash("password", 10);
    admin = await User.create({
      email: "admin@nottube.com",
      name: "Admin",
      avatarUrl: "https://raw.githubusercontent.com/identicons/jasonlong/gh-pages/images/octocat.png",
      passwordHash,
      role: "admin",
      likedVideos: [],
      savedVideos: [],
      watchedVideos: [],
      subscriptions: [],
    });
    console.log("Created admin user admin@nottube.com / password");
  }

  await Video.deleteMany({});

  const videos = SEED_VIDEOS.map((v, i) => ({
    ...v,
    owner: admin._id,
    channelName: "Administrator",
    views: 5000 + i * 73,
  }));

  await Video.insertMany(videos);
  console.log(`Seeded ${videos.length} videos.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
