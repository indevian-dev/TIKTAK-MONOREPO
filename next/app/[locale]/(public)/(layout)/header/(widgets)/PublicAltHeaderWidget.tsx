import { Link }
  from '@/i18n/routing';
import Image
  from 'next/image';
import { loadClientSideCoLocatedTranslations }
  from '@/i18n/i18nClientSide';
import { GlobalProfileAvatarTile }
  from '@/app/[locale]/(global)/(tiles)/GlobalProfileAvatarTile';
import {
  PiCirclesThreePlusLight,
  PiChatTeardropTextLight,
  PiHeartStraightLight,
  PiHouseLight,
  PiSidebarSimpleLight,
  PiXLight
} from "react-icons/pi";
import { FiMenu } from "react-icons/fi";
import { GlobalProfileMenuModalWidget }
  from '@/app/[locale]/(global)/(widgets)/GlobalProfileMenuModalWidget';
import { useRef, useState } from 'react';


export function PublicAltHeaderWidget() {
  const { t } = loadClientSideCoLocatedTranslations('PublicAltHeaderWidget');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const avatarRef = useRef<HTMLButtonElement>(null);
  return (
    <div className='w-full bg-brandPrimaryLightBg/50 sm:bg-brandPrimaryDarkBg fixed bottom-0 sm:relative backdrop-blur z-4'>
      <div className={`z-10 w-full  sm:max-w-7xl  m-auto  py-1 px-4 flex sm:justify-between items-center overflow-x-auto `}>
        {/* Left Side Menu Items - Hidden on mobile */}
        <ul className="hidden sm:flex sm:flex-1 text-brandPrimaryLightText gap-3 font-bold">
          {/* <li className="text-left py-2 group ">
            <Link href="/products" >
              {t('products')}
            </Link>
          </li> */}
          <li className="text-left p-5 py-2 flex items-center">
            <Link href="/" className='flex items-center gap-2'>
              <PiHouseLight className='text-brandPrimaryLightText text-3xl' />
              <span className='no-wrap flex flex-nowrap whitespace-nowrap font-bold text-brandPrimaryLightText text-md items-center pt-2'>{t('home_page')}</span>
            </Link>
          </li>
        </ul>

        {/* Right Side Menu Items with Icons - Full width on mobile */}
        <ul className="flex flex-1 justify-between sm:justify-end items-center">
          <li className="pr-2 sm:pr-0 pl-2 ">
            <div className="flex items-center gap-2">
              <GlobalProfileAvatarTile />
            </div>
          </li>
          <li className="px-2 ">
            <Link className='flex items-center gap-2' href="/provider/favorites"  >
              <PiHeartStraightLight className='text-dark sm:text-brandPrimaryLightText text-3xl' /> {/* Liked Items Icon */}
            </Link>
          </li>
          <li className="px-2">
            <Link className='inline-flex gap-1 items-center justify-center p-1 sm:p-2 bg-brandPrimary rounded' href="/provider/cards/create"  >
              <PiCirclesThreePlusLight className='text-brandPrimaryLightText text-3xl' />
              <span className='hidden no-wrap sm:flex flex-nowrap whitespace-nowrap font-bold text-brandPrimaryLightText text-md'>{t('add_card')}</span>
            </Link>
          </li>
          <li className="px-2 ">
            <Link className='flex items-center gap-2' href="/provider/conversations"  >
              <PiChatTeardropTextLight className='text-dark sm:text-brandPrimaryLightText text-3xl' /> {/* Messages Icon */}
            </Link>
          </li>
          <li className="px-2 ">
            {isModalOpen ? (
              <button className='flex items-center gap-2' onClick={() => setIsModalOpen(false)} ref={avatarRef}  >
                <PiXLight className='text-dark sm:text-brandPrimaryLightText text-3xl' />
              </button>
            ) : (
              <button className='flex items-center gap-2' onClick={() => setIsModalOpen(true)} ref={avatarRef}  >
                <FiMenu className='text-dark sm:text-brandPrimaryLightText text-3xl' />
              </button>
            )}
          </li>
        </ul>
        <GlobalProfileMenuModalWidget
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          anchorRef={avatarRef}
        />
      </div>
    </div>
  );
}
