import { db } from '../lib/firebase';
import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { pages as pagesData } from '../lib/pages';

export async function migratePages() {
  try {
    console.log('Starting migration...');
    
    // Use batch writes for efficiency (up to 500 documents per batch)
    const batch = writeBatch(db);
    let count = 0;
    
    for (const [pageId, pageData] of Object.entries(pagesData)) {
      const pageRef = doc(db, 'pages', pageId);
      batch.set(pageRef, pageData);
      count++;
      
      // Firestore batch limit is 500
      if (count % 500 === 0) {
        await batch.commit();
        console.log(`Migrated ${count} pages...`);
      }
    }
    
    // Commit remaining documents
    await batch.commit();
    
    console.log(`✅ Successfully migrated ${count} pages to Firestore!`);
    return { success: true, count };
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return { success: false, error };
  }
}

// For adding a single new page programmatically
export async function addPageToFirestore(pageId: string, pageData: any) {
  try {
    const pageRef = doc(db, 'pages', pageId);
    await setDoc(pageRef, pageData);
    console.log(`✅ Added page: ${pageId}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Failed to add page ${pageId}:`, error);
    return { success: false, error };
  }
}
