"use client";

import {
  useState
} from 'react';
import Link
  from 'next/link';
import { toast }
  from 'react-toastify';
import { useRouter, useParams }
  from 'next/navigation';
import { apiCallForSpaHelper } from '@/lib/helpers/apiCallForSpaHelper';

type BlogFormData = {
  title?: { content: string };
  meta_title?: { content: string };
  meta_description?: { content: string };
  description?: { content: string };
};

export default function StaffBlogCreateWidget() {
  const [formData, setFormData] = useState<BlogFormData>({});

  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: { content: value } });
  };

  const handleChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: { content: value } });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiCallForSpaHelper({
        method: 'POST',
        url: '/api/staff/blogs/create',
        headers: {
          'Content-Type': 'application/json',
        },
        body: formData,
      });

      toast.success('Blog Created!');
      router.push(`/${locale}/staff/blogs`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Error: ' + error.message);
      } else {
        toast.error('An unknown error occurred');
      }
    }
  };

  return (
    <div className="px-4 py-8 my-20 mx-5 text-gray-900 bg-white shadow-md rounded-md">
      <h1 className="text-indigo-700 text-xl font-bold mb-4">Create a new blog post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="text-indigo-700 block font-medium">Title:</label>
          <input
            type="text"
            id="title"
            name='title'
            value={formData.title?.content ? formData.title.content : ''}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="meta_title" className="text-indigo-700 block font-medium">Meta Title:</label>
          <input
            type="text"
            id="meta_title"
            name='meta_title'
            value={formData.meta_title?.content ? formData.meta_title.content : ''}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="meta_description" className="text-indigo-700 block font-medium">Meta Description:</label>
          <textarea
            rows={3}
            id="meta_description"
            name='meta_description'
            value={formData.meta_description?.content ? formData.meta_description.content : ''}
            onChange={handleChangeText}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="description" className="text-indigo-700 block font-medium">Description:</label>
          <textarea
            rows={3}
            id="description"
            name="description"
            value={formData.description?.content ? formData.description.content : ''}
            onChange={handleChangeText}
            className="block p-2.5 w-full text-sm text-gray-900 border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>
        <button type="submit" className="w-full bg-indigo-800 text-white font-medium py-2 rounded-md hover:bg-indigo-600 transition duration-300">Submit</button>
      </form>
      <Link href="/admin/blogs/content" className="block mt-4 text-sm text-indigo-500 hover:text-indigo-600 transition duration-300">Edit Content</Link>
    </div>

  );
}