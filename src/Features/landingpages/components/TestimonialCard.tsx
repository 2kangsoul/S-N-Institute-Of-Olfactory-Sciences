import React from 'react';
// Menggunakan 'import type' karena file sumbernya adalah .tsx
import type { TestimonialProps } from '../types/testimonialTypes';

const TestimonialCard: React.FC<TestimonialProps> = ({ name, role, text, avatar }) => {
  return (
    <div className="w-[300px] md:w-[380px] flex-shrink-0 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 whitespace-normal transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-default">
      {/* Header Kartu: Avatar & Nama */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={avatar}
          alt={name}
          className="w-12 h-12 rounded-full object-cover border border-gray-200"
        />
        <div>
          <h4 className="font-bold text-gray-900">{name}</h4>
          <p className="text-xs text-gray-500 font-medium">{role}</p>
        </div>
      </div>
      
      {/* Isi Testimoni */}
      <p className="text-sm text-gray-600 italic leading-relaxed">
        "{text}"
      </p>
    </div>
  );
};

export default TestimonialCard;