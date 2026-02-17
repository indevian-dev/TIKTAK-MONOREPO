'use client'

import Image
  from 'next/image';

export function PublicRootScreenAddsWidget() {

  return (
    <section className="hero m-auto max-w-screen-xl text-white relative gap-6 grid grid-cols-1 lg:grid-cols-2 px-4 py-4 my-4 md:my-6 lg:my-8">
      <div className='w-full relative aspect-[2/1]'>
        <Image src={"/add1.jpg"} fill priority={true} className='rounded-primary'
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt="add1" />
      </div>
      <div className='w-full relative aspect-[2/1]'>
        <Image src={"/add2.jpg"} fill priority={true} className='rounded-primary'
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt='add2'
        />
      </div>
    </section>
  )
}