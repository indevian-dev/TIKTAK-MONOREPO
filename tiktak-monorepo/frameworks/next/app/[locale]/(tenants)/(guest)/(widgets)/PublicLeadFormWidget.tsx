'use client'

import { useState } from 'react';
import nookies from 'nookies';
import { useRouter } from '@/i18n/routing';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
interface PublicLeadFormWidgetProps {
    onClose: () => void | Promise<void>;
}

export function PublicLeadFormWidget({ onClose }: PublicLeadFormWidgetProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        comment: '',
        type: 'Form Lead'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const cookies = nookies.get(null);
        const utmData = {
            addSrc: cookies.addSrc || 'none',
            addType: cookies.addType || 'none',
            addLocation: cookies.addLocation || 'none',
            addTag: cookies.addTag || 'none'
        };

        try {
            const response = await fetch('/api/leads/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    utm_src: JSON.stringify(utmData),
                    domain: 'Lion-Windows',
                }),
            });

            if (response.status !== 200) {
                ConsoleLogger.error('Error submitting form:', response.statusText, response.status);
                return;
            }

            await response.json();
            await onClose();

            router.push('/thanks');

        } catch (error) {
            ConsoleLogger.error('Unexpected error:', error);
        }
    };

    return (
        <div className="w-full bg-white-900 rounded-lg p-4">
            <h2 className="text-3xl font-bold mb-4 text-neutral-950">Request a Callback</h2>
            <form className="grid grid-cols-1 lg:grid-cols-3 gap-4" onSubmit={handleSubmit}>
                <div className='col-span-1 flex items-center'>
                    <input
                        className="p-2 block w-full border border-neutral-600 rounded"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder='Name'
                    />
                </div>
                <div className='col-span-1 flex items-center'>
                    <input
                        className="p-2 block w-full border border-neutral-600 rounded"
                        type="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder='+1 758 642 56 68'
                    />
                </div>
                <div className='col-span-1 flex items-center'>
                    <input
                        className="p-2 block w-full border border-neutral-600 rounded"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder='mail@example.com'
                    />
                </div>
                <div className='col-span-1 lg:col-span-2 flex items-center'>
                    <textarea
                        className="p-2 block w-full border border-neutral-600 rounded"
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        placeholder='Fell free to as any question'
                    />
                </div>
                <button
                    className="w-full py-3 px-4 border border-transparent rounded shadow-sm text-lg font-bold bg-bg_primary_gradient text-neutral-950 col-span-1"
                >
                    Send Request
                </button>
            </form>
        </div>
    );
}