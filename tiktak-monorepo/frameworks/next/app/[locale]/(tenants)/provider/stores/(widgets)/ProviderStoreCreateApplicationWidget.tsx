"use client"; // phone utility fix applied

import {
  useState
} from 'react';
import { toast }
  from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loadClientSideCoLocatedTranslations }
  from '@/i18n/i18nClientSide';
import { apiFetchHelper }
  from '@/lib/helpers/apiCallForSpaHelper';
import { formatPhoneNumber } from '@/lib/utils/phoneUtility';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
interface FormData {
  contact_name: string;
  phone: string;
  email: string;
  voen: string;
  store_name: string;
  store_address: string;
}

interface FormErrors {
  contact_name?: string;
  phone?: string;
  email?: string;
  voen?: string;
  store_name?: string;
  store_address?: string;
}

export default function ProviderStoreCreateApplicationWidget() {
  const { t } = loadClientSideCoLocatedTranslations('ProviderStoreCreateApplicationWidget');

  const [formData, setFormData] = useState<FormData>({
    contact_name: '',
    phone: '',
    email: '',
    voen: '',
    store_name: '',
    store_address: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Required fields validation
    if (!formData.contact_name.trim()) {
      newErrors.contact_name = t('required_field');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('required_field');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('required_field');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('invalid_email');
    }

    if (!formData.voen.trim()) {
      newErrors.voen = t('required_field');
    }

    if (!formData.store_name.trim()) {
      newErrors.store_name = t('required_field');
    }

    if (!formData.store_address.trim()) {
      newErrors.store_address = t('required_field');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    if (field === 'phone') {
      // Apply phone number formatting - follow register widget pattern
      const { formattedPhone } = formatPhoneNumber({ phone: value || '' });
      setFormData(prev => ({
        ...prev,
        [field]: formattedPhone
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t('error_message'));
      return;
    }

    setIsSubmitting(true);

    try {
      // Format phone number for API submission - follow register widget pattern
      const { formattedPhone } = formatPhoneNumber({ phone: formData.phone });
      const submissionData = {
        ...formData,
        phone: formattedPhone
      };

      const response = await apiFetchHelper({
        method: 'POST',
        url: '/api/provider/stores/applications/create',
        body: submissionData
      });

      if (response.status === 201) {
        toast.success(t('success_message'));
        // Reset form
        setFormData({
          contact_name: '',
          phone: '',
          email: '',
          voen: '',
          store_name: '',
          store_address: ''
        });
      } else {
        throw new Error(response.data?.error || 'Failed to submit application');
      }
    } catch (error) {
      ConsoleLogger.error('Error submitting store application:', error);
      toast.error(error instanceof Error ? error.message : t('error_message'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('title')}
        </h2>
        <p className="text-gray-600">
          {t('description')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Name */}
        <div>
          <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 mb-2">
            {t('contact_name')} *
          </label>
          <input
            type="text"
            id="contact_name"
            value={formData.contact_name}
            onChange={(e) => handleInputChange('contact_name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.contact_name ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder={t('contact_name')}
            disabled={isSubmitting}
          />
          {errors.contact_name && (
            <p className="mt-1 text-sm text-red-600">{errors.contact_name}</p>
          )}
        </div>

        {/* Phone with masking */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            {t('phone')} *
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="+(994)-12-345-67-89"
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            {t('email')} *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="your@email.com"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* VOEN */}
        <div>
          <label htmlFor="voen" className="block text-sm font-medium text-gray-700 mb-2">
            {t('voen')} *
          </label>
          <input
            type="text"
            id="voen"
            value={formData.voen}
            onChange={(e) => handleInputChange('voen', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.voen ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="1234567890"
            disabled={isSubmitting}
          />
          {errors.voen && (
            <p className="mt-1 text-sm text-red-600">{errors.voen}</p>
          )}
        </div>

        {/* Store Name */}
        <div>
          <label htmlFor="store_name" className="block text-sm font-medium text-gray-700 mb-2">
            {t('store_name')} *
          </label>
          <input
            type="text"
            id="store_name"
            value={formData.store_name}
            onChange={(e) => handleInputChange('store_name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.store_name ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder={t('store_name')}
            disabled={isSubmitting}
          />
          {errors.store_name && (
            <p className="mt-1 text-sm text-red-600">{errors.store_name}</p>
          )}
        </div>

        {/* Store Address */}
        <div>
          <label htmlFor="store_address" className="block text-sm font-medium text-gray-700 mb-2">
            {t('store_address')} *
          </label>
          <textarea
            id="store_address"
            value={formData.store_address}
            onChange={(e) => handleInputChange('store_address', e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.store_address ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder={t('store_address')}
            disabled={isSubmitting}
          />
          {errors.store_address && (
            <p className="mt-1 text-sm text-red-600">{errors.store_address}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
              } text-white`}
          >
            {isSubmitting ? t('submitting') : t('submit')}
          </button>
        </div>
      </form>
    </div>
  );
}