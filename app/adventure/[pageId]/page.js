import { getPageData } from '../../../lib/pageService';
// import { recordPageVisit } from '../../../lib/progressService';
// import { auth } from '../../../lib/firebase';
import PageClient from './pageClient';
import { notFound } from 'next/navigation';

export default async function AdventurePage({ params }) {
  const pageId = params.pageId;
  const page = await getPageData(pageId);

  if (!page) {
    notFound();
    // return (
    //   <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
    //     <div className="text-center">
    //       <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
    //       <p className="text-gray-400 mb-6">The page "{pageId}" does not exist.</p>
    //       <a href="/adventure/page_1" className="bg-blue-600 px-6 py-3 rounded-lg">
    //         Return to Start
    //       </a>
    //     </div>
    //   </div>
    // );
  }

  // const user = auth.currentUser;
  // if (user) {
  //   await recordPageVisit(user.uid, pageId);
  // }
  
  // Pass data to client component
  return <PageClient page={page} pageId={pageId} />;
}
