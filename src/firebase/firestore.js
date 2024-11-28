import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";

export const fetchBlogPosts = async () => {
  try {
    const user = getAuth().currentUser;
    if (!user) throw new Error("User not authenticated.");

    const userId = user.uid;
    const querySnapshot = await getDocs(collection(db, "users", userId, "blogPosts"));

    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return posts;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    throw error;
  }
};
