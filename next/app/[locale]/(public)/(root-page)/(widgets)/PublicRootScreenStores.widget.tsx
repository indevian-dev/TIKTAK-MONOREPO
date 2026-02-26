"use client";

import { PublicStoresListItemWidget } from "@/app/[locale]/(public)/stores/(widgets)/PublicStoresListItem.widget";
import { loadClientSideCoLocatedTranslations } from "@/i18n/i18nClientSide";
import { useState, useEffect } from "react";
import { apiCall } from '@/lib/utils/Http.FetchApiSPA.util';
import { Link } from "@/i18n/routing";
import { PublicSectionTitleTile } from "@/app/[locale]/(public)/(tiles)/PublicSectionTitle.tile";

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import type { ProviderPublicProfile } from '@/app/[locale]/(public)/stores/(widgets)/PublicStoresListItem.widget';
import { ConsoleLogger } from '@/lib/logging/Console.logger';
import { Section } from "@/app/primitives/Section.primitive";


export function PublicRootScreenStoresWidget() {
    const { t } = loadClientSideCoLocatedTranslations("PublicRootScreenStoresWidget");
    const [stores, setStores] = useState<ProviderPublicProfile[]>([]);

    useEffect(() => {
        const fetchStores = async () => {
            const response = await apiCall({ method: "GET", url: '/api/stores' });

            if (response.status === 200) {
                setStores(response.data);
            } else {
                ConsoleLogger.error("Failed to fetch stores");
            }
        }
        fetchStores();
    }, []);


    return (
        <Section variant="centered">
            <div className='flex justify-between items-center py-4'>
                <PublicSectionTitleTile sectionTitle={t('stores')} />
                <Link href="/stores" className="text-app-bright-purple font-bold whitespace-nowrap bg-app-bright-purple/10 px-4 py-2 rounded">
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
            <style dangerouslySetInnerHTML={{
                __html: `
                .stores-swiper-container .swiper-pagination-bullet {
                    background-color: #5B23FF;
                    opacity: 0.3;
                }
                .stores-swiper-container .swiper-pagination-bullet-active {
                    opacity: 1;
                }
            `}} />
        </Section>
    )
}
