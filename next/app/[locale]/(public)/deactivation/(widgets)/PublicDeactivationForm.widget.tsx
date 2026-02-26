"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { apiCall } from '@/lib/utils/Http.FetchApiSPA.util';
import { PublicSectionTitleTile } from '@/app/[locale]/(public)/(tiles)/PublicSectionTitle.tile';
import { ConsoleLogger } from '@/lib/logging/Console.logger';

export default function PublicDeactivationFormWidget() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        comment: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await apiCall({
                method: 'POST',
                url: '/api/deactivation',
                body: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    comment: formData.comment,
                },
            });

            const message = response.data?.message || 'Request submitted successfully!';
            toast.success(message);

            setTimeout(() => {
                router.push('/');
            }, 2500);
        } catch (error) {
            const err = error as Error;
            ConsoleLogger.error('Deactivation submit error:', err);
            toast.error(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="w-full">
            <div className='container max-w-7xl mx-auto grid grid-cols-12 p-4 md:p-8 lg:p-12 gap-6 md:gap-8'>
                <div className='col-span-12'>
                    <PublicSectionTitleTile sectionTitle="Account Deactivation" />
                </div>
                <div className="col-span-12 lg:col-span-7">
                    <h2 className="text-xl font-semibold">Deactivate Your Account</h2>
                    <p className="text-lg text-gray-600 mt-4">
                        When you deactivate your account, all your contact information such as email and phone numbers will be removed. However, data related to transactions, completed tasks, and offers will remain, as this information is also related to other parties if you are a client, provider, or executor. This ensures that historical data integrity is maintained.
                    </p>
                </div>
                <div className="col-span-12 lg:col-span-5 border border-primary rounded-lg">
                    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                Name
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                                Phone
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                id="phone"
                                type="tel"
                                name="phone"
                                placeholder="+994 XX XXX XX XX"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comment">
                                Comment
                            </label>
                            <textarea
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="comment"
                                name="comment"
                                placeholder="Reason for deactivation (optional)"
                                value={formData.comment}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}