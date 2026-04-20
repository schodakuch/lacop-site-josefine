import HomeClient from "./HomeClient";
import { getProfile, getCategories, getAllMedia } from "@/lib/lacop";

export const revalidate = 10;

export default async function Home() {
  const [profile, categories, media] = await Promise.all([
    getProfile(),
    getCategories(),
    getAllMedia(),
  ]);
  return <HomeClient profile={profile} categories={categories} media={media} />;
}
