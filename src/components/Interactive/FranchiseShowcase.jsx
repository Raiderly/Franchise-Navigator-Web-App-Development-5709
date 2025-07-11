import React from 'react'
import { FiMousePointer } from 'react-icons/fi'
import MouseImageTrail from './MouseImageTrail'

const FranchiseShowcase = () => {
  const franchiseLogos = [
    "https://app1.sharemyimage.com/2025/07/06/download-9.webp",
    "https://app1.sharemyimage.com/2025/07/06/download-8.webp",
    "https://app1.sharemyimage.com/2025/07/06/download-7.webp",
    "https://app1.sharemyimage.com/2025/07/06/download-6.webp",
    "https://app1.sharemyimage.com/2025/07/06/download-5.webp",
    "https://app1.sharemyimage.com/2025/07/06/download-4.webp",
    "https://app1.sharemyimage.com/2025/07/06/download-3.webp",
    "https://app1.sharemyimage.com/2025/07/06/download-2.webp",
    "https://app1.sharemyimage.com/2025/07/06/download-1.webp",
    "https://app1.sharemyimage.com/2025/07/06/download.webp",
    "https://app1.sharemyimage.com/2025/07/06/download-1.jpeg",
    "https://app1.sharemyimage.com/2025/07/06/download-1.png",
    "https://app1.sharemyimage.com/2025/07/06/images.png",
    "https://app1.sharemyimage.com/2025/07/06/download-12.webp",
    "https://app1.sharemyimage.com/2025/07/06/download-11.webp",
    "https://app1.sharemyimage.com/2025/07/06/download-10.webp"
  ]

  return (
    <section className="relative">
      <MouseImageTrail
        renderImageBuffer={50}
        rotationRange={25}
        images={franchiseLogos}
      >
        <div className="grid h-screen w-full place-content-center bg-white relative z-10">
          <div className="text-center space-y-6">
            <p className="flex items-center justify-center gap-3 text-4xl font-bold uppercase text-black">
              <FiMousePointer className="text-[#5d20d6]" />
              <span>Every Single Australian Franchise Network</span>
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Move your mouse around to explore franchise logos from across Australia. 
              Our comprehensive database includes every registered franchise opportunity.
            </p>
            <div className="mt-8 text-sm text-gray-500 flex items-center justify-center gap-2">
              <FiMousePointer className="w-4 h-4" />
              <span>Hover and move your cursor to see franchise brands</span>
            </div>
          </div>
        </div>
      </MouseImageTrail>
    </section>
  )
}

export default FranchiseShowcase