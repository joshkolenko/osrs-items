'use client';

import { findItem, imgUrl } from '@/util/osrs-items';

import useItems from '@/hooks/useItems';
import Image from 'next/image';

export default function Icon({ name }: { name: string }) {
  const items = useItems();
  const item = findItem(name, items);

  const src = imgUrl + item.icon;

  return (
    <div className="aspect-square bg-base-300 p-4 rounded-xl">
      <div className="relative w-8 h-8">
        <Image
          src={src}
          quality={100}
          alt={name}
          sizes="2rem"
          objectFit=""
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}
