import Link
  from 'next/link';
import Image
  from 'next/image';
import { FiBell }
  from 'react-icons/fi';
import { StaffRunningStrokeTile }
  from '@/app/[locale]/(tenants)/staff/(layout)/header/(tiles)/StaffRunningStrokeTile';

interface StaffHeaderWidgetProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  authData?: unknown;
}

export function StaffHeaderWidget({ isMenuOpen, setIsMenuOpen }: StaffHeaderWidgetProps) {
  return (
    <header className="sticky top-0 bg-brandPrimaryDarkBg rounded-b mb-4 z-10">
      <nav className="z-20 text-white relative bg-brandPrimaryDarkBg max-w-7xl mx-auto flex items-center px-4 py-5">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-10 h-10 md:hidden">
          <svg viewBox="0 0 24 24" className="w-6 h-6">
            <rect y={`${isMenuOpen ? '10' : '4'
              }`} width="24" height="4" rx="4" ry="4" className={`fill-brand origin-center transition-transform ${isMenuOpen ? 'transform rotate-45 ' : ''
                }`}></rect>
            <rect y={`${isMenuOpen ? '10' : '18'
              }`} width="24" height="4" rx="4" ry="4" className={`fill-brand origin-center transition-transform ${isMenuOpen ? 'transform -rotate-45 ' : ''
                }`}></rect>
          </svg>
        </button>
        <div className='w-full flex items-center justify-between'>
          <Link href="/" className='grid grid-cols-1 items-center'>
            {/* Logo for desktop and tablets (hidden on smaller screens) */}
            <div className="">
              <Image src={"/logo-w.svg"} alt="Logo" width="120" height="60" />
            </div>
            <span className='text-sm text-white font-bold'>Staff</span>
          </Link>
          <div className='w-full hidden lg:flex justify-center items-center px-4'>
            <StaffRunningStrokeTile />
          </div>
          <div className='flex gap-2 items-center relative hover:cursor-pointer justify-end group'>
            <span className='text-white font-bold text-xs hidden sm:block'>Notifications</span>
            <FiBell className='text-white text-xl' />
            <div className='absolute top-full right-0 mt-2 bg-white shadow-lg rounded-md p-4 hidden group-hover:block'>
              <h5 className='text-gray-800 font-bold mb-2 whitespace-nowrap'>Last Notifications</h5>
              <ul>
                {/* Dynamically fetched notifications will be listed here */}
              </ul>
              <button className='bg-brandPrimary text-white px-4 py-2 rounded-md'>View All</button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

