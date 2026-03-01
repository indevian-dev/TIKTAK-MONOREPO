"use client";

import { ConsoleLogger } from '@/lib/logging/Console.logger';

import {
  useEffect,
  useState
} from 'react';
import Link
  from 'next/link';
import { apiCall } from '@/lib/utils/Http.FetchApiSPA.util';
import { useParams }
  from 'next/navigation';
import Image
  from 'next/image';
import { StaffSwitchButtonTile }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/(tiles)/StaffSwitchButton.tile';
import { toast }
  from 'react-toastify';
import { SectionPrimitive } from '@/app/primitives/Section.primitive';
import { fetchBlogsAdmin, sanityImageUrl } from '@/lib/integrations/Cms.Sanity.read';

// Sanity blog type
interface SanityBlog {
  _id: string;
  title?: string;
  slug?: { current: string };
  cover?: unknown;
  isActive?: boolean;
  isFeatured?: boolean;
  _createdAt?: string;
}

export default function StaffBlogListWidget() {
  const [blogsList, setblogsList] = useState<SanityBlog[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const params = useParams();
  const workspaceId = params?.workspaceId as string;

  useEffect(() => {
    // Read from Sanity directly
    fetchBlogsAdmin()
      .then((blogs: SanityBlog[]) => setblogsList(blogs || []))
      .catch((err: unknown) => ConsoleLogger.error('Error fetching blogs:', err));
  }, [workspaceId]);

  const handleDelete = async (blogId: string) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      setIsDeleting(true);
      try {
        const response = await apiCall({
          method: 'DELETE',
          url: `/api/workspaces/staff/${workspaceId}/blogs/${blogId}`,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        setIsDeleting(false);

        if (response.status === 200) {
          setblogsList((prevblogs) =>
            prevblogs.filter((blog) => blog._id !== blogId));
          toast.success('Blog deleted successfully!');
          return;
        }
        toast.error('Failed to delete blog');
      } catch (error) {
        setIsDeleting(false);
        ConsoleLogger.log('Failed to delete blog', error);
        toast.error('Failed to delete blog');
      }
    }
  };

  const isPublished = (blog: SanityBlog) => {
    return blog.isActive === true;
  };

  const handlePublishToggle = async (blog: SanityBlog) => {
    try {
      const response = await apiCall({
        method: 'PUT',
        url: `/api/workspaces/staff/${workspaceId}/blogs/${blog._id}/publish`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: { isPublished: !isPublished(blog) },
      });

      if (response.status === 200) {
        toast.success('Blog publish status updated!');
        // Update the blog's published status in the local state
        setblogsList((prevblogs) =>
          prevblogs.map((prevblog) =>
            prevblog._id === blog._id ? { ...prevblog, isActive: !isPublished(blog) } : prevblog
          )
        );
        return;
      }
      toast.error('Failed to update publish status');
    } catch (error) {
      ConsoleLogger.log(error);
      toast.error('Failed to update publish status');
    }
  };

  const isHomePage = (blog: SanityBlog) => {
    return blog.isFeatured === true;
  };

  const handleHomePageToggle = async (blog: SanityBlog) => {
    try {
      const response = await apiCall({
        method: 'PUT',
        url: `/api/workspaces/staff/${workspaceId}/blogs/${blog._id}/home-page`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: { isHomePage: !isHomePage(blog) },
      });

      if (response.status === 200) {
        toast.success('Blog homepage status updated!');
        // Update the blog's home_page status in the local state
        setblogsList((prevblogs) =>
          prevblogs.map((prevblog) =>
            prevblog._id === blog._id ? { ...prevblog, isFeatured: !isHomePage(blog) } : prevblog
          )
        );
        return;
      }
      toast.error('Failed to update homepage status');
    } catch (error) {
      ConsoleLogger.log(error);
      toast.error('Failed to update homepage status');
    }
  };

  return (
    <SectionPrimitive variant='full'>
      <Link href={`/workspaces/staff/${workspaceId}/blogs/create`} className='p-5 w-full'>
        <button className='bg-emerald-500 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded'>Create blog</button>
      </Link>
      <div className="w-full px-6 grid grid-cols-11 my-5">
        <div className="flex col-span-1 flex-col w-full justify-center items-start px-6 tracking-wide">
          <p>id</p>
        </div>
        <div className="flex col-span-5 flex-col w-full justify-center items-start px-6 tracking-wide">
          <p>title</p>
        </div>
        <div className="flex col-span-1 flex-col w-full justify-center items-start px-6 tracking-wide">
          <p>Photo</p>
        </div>
        <div className="flex col-span-1 flex-col w-full justify-center items-start px-6 tracking-wide">
          <p>Publish</p>
        </div>
        <div className="flex col-span-1 flex-col w-full justify-center items-start px-6 tracking-wide">
          <p>HomePage</p>
        </div>
        <div className="flex col-span-1 flex-col w-full justify-center items-start px-6 tracking-wide">
          <p>Edit</p>
        </div>
        <div className="flex col-span-1 flex-col w-full justify-center items-start px-6 tracking-wide">
          <p>Delete</p>
        </div>
      </div>
      {blogsList.map((blog) => (
        <div key={blog._id} className="w-full px-6 grid grid-cols-11">
          <div className="flex col-span-1 flex-col w-full justify-center items-start px-6 tracking-wide">
            <p>{blog._id.slice(0, 6)}</p>
          </div>
          <div className="flex col-span-5 flex-col w-full justify-center items-start px-6 tracking-wide">
            <p>{blog.title}</p>
          </div>
          <div className="flex relative col-span-1 py-10 flex-col w-full justify-center items-start px-6 tracking-wide">
            <Image className='rounded-2xl' style={{ objectFit: 'cover' }} src={blog?.cover ? sanityImageUrl(blog.cover).width(150).url() : '/pg.webp'} width={150} height={150} alt={blog?.title || 'blog title'} />
          </div>
          <div className="flex col-span-1 flex-col w-full justify-center items-start px-6 tracking-wide">
            <StaffSwitchButtonTile checked={isPublished(blog)} onChange={() => handlePublishToggle(blog)} />
          </div>
          <div className="flex col-span-1 flex-col w-full justify-center items-start px-6 tracking-wide">
            <StaffSwitchButtonTile checked={isHomePage(blog)} onChange={() => handleHomePageToggle(blog)} />
          </div>
          <div className="flex col-span-1 flex-col w-full justify-center items-start px-6 tracking-wide">
            <button>
              <Link href={`/workspaces/staff/${workspaceId}/blogs/${blog._id}/edit`}>
                Edit
              </Link>
            </button>
          </div>
          <div className="flex col-span-1 flex-col w-full justify-center items-start px-6 tracking-wide">
            <button onClick={() => handleDelete(blog._id)} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>          </div>
        </div>
      ))}
    </SectionPrimitive>
  )
}
