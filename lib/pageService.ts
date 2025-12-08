import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function getPageData(pageId: string) {
  try {
    const pageRef = doc(db, 'pages', pageId);
    const pageSnap = await getDoc(pageRef);
    
    if (pageSnap.exists()) {
      return {
        id: pageSnap.id,
        ...pageSnap.data()
      };
    } else {
      console.error(`Page ${pageId} not found`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}
