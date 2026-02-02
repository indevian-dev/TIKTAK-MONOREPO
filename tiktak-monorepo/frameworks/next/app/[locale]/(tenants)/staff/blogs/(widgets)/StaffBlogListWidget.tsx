"use client";

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';

import {
  useEffect,
  useState
} from 'react';
import Link
  from 'next/link';
import { apiFetchHelper }
  from '@/lib/helpers/apiCallForSpaHelper';
import { useParams }
  from 'next/navigation';
import Image
  from 'next/image';
import { StaffSwitchButtonTile }
  from '@/app/[locale]/(tenants)/staff/(tiles)/StaffSwitchButtonTile';
import { toast }
  from 'react-toastify';
import { routing }
  from '@/i18n/routing';

// API response type for staff blog data
interface StaffBlogApiResponse {
  id: number;
  title?: {
    content: string;
  };
  cover?: string;
  published: boolean;
  home_page: boolean;
  [key: string]: unknown;
}

export default function StaffBlogListWidget() {
  const [blogsList, setblogsList] = useState<StaffBlogApiResponse[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const params = useParams();
  const locale = (params?.locale as string) || routing.defaultLocale;


  useEffect(() => {
    async function fetchblogs() {
      try {
        const response = await apiFetchHelper({
          method: 'GET',
          url: '/api/staff/blogs',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status !== 200) {
          ConsoleLogger.log('error', response.data);
          return;
        }

        const data = response.data;
        setblogsList(data.blogs?.data || data.blogs || []);

      } catch (error) {
        ConsoleLogger.log(error);
      }
    }

    fetchblogs();
  }, [locale]);

  const handleDelete = async (blogId: number) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      setIsDeleting(true);
      try {
        const response = await apiFetchHelper({
          method: 'DELETE',
          url: `/api/staff/blogs/${blogId}`,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        setIsDeleting(false);

        if (response.status === 200) {
          setblogsList((prevblogs) =>
            prevblogs.filter((blog) => blog.id !== blogId));
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

  const isPublished = (blog: StaffBlogApiResponse) => {
    return blog.published === true;
  };

  const handlePublishToggle = async (blog: StaffBlogApiResponse) => {
    try {
      const response = await apiFetchHelper({
        method: 'PUT',
        url: `/api/staff/blogs/${blog.id}/publish`,
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
            prevblog.id === blog.id ? { ...prevblog, published: !isPublished(blog) } : prevblog
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

  const isHomePage = (blog: StaffBlogApiResponse) => {
    return blog.home_page === true;
  };

  const handleHomePageToggle = async (blog: StaffBlogApiResponse) => {
    try {
      const response = await apiFetchHelper({
        method: 'PUT',
        url: `/api/staff/blogs/${blog.id}/home-page`,
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
            prevblog.id === blog.id ? { ...prevblog, home_page: !isHomePage(blog) } : prevblog
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
    <section className="bg-gray-200 text-sm text-black flex flex-wrap  justify-start items">
      <Link href="/admin/blogs/create" className='p-5 w-full'>
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
        <div key={blog.id} className="w-full px-6 grid grid-cols-11">
          <div className="flex col-span-1 flex-col w-full justify-center items-start px-6 tracking-wide">
            <p>{blog.id}</p>
          </div>
          <div className="flex col-span-5 flex-col w-full justify-center items-start px-6 tracking-wide">
            <p>{blog.title?.content}</p>
          </div>
          <div className="flex relative col-span-1 py-10 flex-col w-full justify-center items-start px-6 tracking-wide">
            <Image className='rounded-2xl' style={{ objectFit: 'cover' }} src={blog?.cover ? `${Bun.env.NEXT_PUBLIC_BLOG_COVER_URL_PREFIX + '/' + blog?.id + '/' + blog.cover}` : '/pg.webp'} width={150} height={150} alt={blog?.title?.content ? blog.title?.content : 'blog title'} />
          </div>
          <div className="flex col-span-1 flex-col w-full justify-center items-start px-6 tracking-wide">
            <StaffSwitchButtonTile checked={isPublished(blog)} onChange={() => handlePublishToggle(blog)} />
          </div>
          <div className="flex col-span-1 flex-col w-full justify-center items-start px-6 tracking-wide">
            <StaffSwitchButtonTile checked={isHomePage(blog)} onChange={() => handleHomePageToggle(blog)} />
          </div>
          <div className="flex col-span-1 flex-col w-full justify-center items-start px-6 tracking-wide">
            <button>
              <Link href={`/admin/blogs/${blog.id}/edit`}>
                Edit
              </Link>
            </button>
          </div>
          <div className="flex col-span-1 flex-col w-full justify-center items-start px-6 tracking-wide">
            <button onClick={() => handleDelete(blog.id)} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>          </div>
        </div>
      ))}
    </section>
  )
}
