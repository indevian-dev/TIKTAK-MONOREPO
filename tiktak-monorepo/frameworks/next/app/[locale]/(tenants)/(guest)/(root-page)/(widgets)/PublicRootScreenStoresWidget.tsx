"use client";

import { PublicStoresListItemWidget } from "@/app/[locale]/(tenants)/(guest)/stores/(widgets)/PublicStoresListItemWidget";
import { loadClientSideCoLocatedTranslations } from "@/i18n/i18nClientSide";
import { useState, useEffect } from "react";
import { apiFetchHelper } from "@/lib/helpers/apiCallForSpaHelper";
import { Link } from "@/i18n/routing";
import { PublicSectionTitleTile } from "@/app/[locale]/(tenants)/(guest)/(tiles)/PublicSectionTitleTile";

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import type { Store } from '@/types';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
interface PublicRootScreenStoreApiResponse extends Pick<Store.PublicAccess, 'id'> {
    [key: string]: unknown; // Allow additional store fields
}

export function PublicRootScreenStoresWidget() {
    const { t } = loadClientSideCoLocatedTranslations("PublicRootScreenStoresWidget");
    const [stores, setStores] = useState<PublicRootScreenStoreApiResponse[]>([]);

    useEffect(() => {
        const fetchStores = async () => {
            const response = await apiFetchHelper({ method: "GET", url: '/api/stores' });

            if (response.status === 200) {
                setStores(response.data);
            } else {
                ConsoleLogger.error("Failed to fetch stores");
            }
        }
        fetchStores();
    }, []);


    return (
        <section className='relative w-full my-4 md:my-6 lg:my-8 '>
            <div className='container m-auto max-w-screen-xl px-4 py-5'>
                <div className='flex justify-between items-center py-4'>
                    <PublicSectionTitleTile sectionTitle={t('stores')} />
                    <Link href="/stores" className="text-brandPrimary font-bold whitespace-nowrap bg-brandPrimaryLightBg px-4 py-2 rounded">
                        {t("view_all")} {t("stores")}
                    </Link>
                </div>
                <div className="stores-swiper-container">
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        spaceBetween={16}
                        slidesPerView={1}
                        navigation={false}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true
                        }}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 16,
                            },
                            768: {
                                slidesPerView: 3,
                                spaceBetween: 16,
                            },
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 16,
                            },
                        }}
                        className="stores-swiper"
                    >
                        {stores.slice(0, 8).map((store) => (
                            <SwiperSlide key={store.id} className="aspect-video">
                                <div className="w-full h-full">
                                    <PublicStoresListItemWidget store={store} />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
            <style jsx>{`
                .stores-swiper-container :global(.swiper-pagination-bullet) {
                    background-color: #ff0032;
                    opacity: 0.3;
                }
                .stores-swiper-container :global(.swiper-pagination-bullet-active) {
                    opacity: 1;
                }
            `}</style>
        </section>
    )
}
