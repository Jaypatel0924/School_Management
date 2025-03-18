import React, { useState } from 'react';
import { X } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      category: 'Campus',
      title: 'Main Building'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      category: 'Events',
      title: 'Annual Day Celebration'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      category: 'Sports',
      title: 'Sports Complex'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      category: 'Academics',
      title: 'Science Lab'
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      category: 'Events',
      title: 'Cultural Festival'
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      category: 'Library',
      title: 'Modern Library'
    }
  ];

  const categories = ['All', 'Campus', 'Events', 'Sports', 'Academics', 'Library'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredImages = activeCategory === 'All' 
    ? images 
    : images.filter(img => img.category === activeCategory);

  return (
    <div className="space-y-16 py-8">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Photo Gallery</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore our vibrant campus life through our collection of memories.
        </p>
      </section>

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors
                ${activeCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Image Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              onClick={() => setSelectedImage(image.url)}
              className="cursor-pointer group relative overflow-hidden rounded-lg shadow-lg"
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4 w-full text-white">
                  <p className="text-sm font-medium">{image.category}</p>
                  <h3 className="text-lg font-semibold">{image.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X className="h-8 w-8" />
          </button>
          <img
            src={selectedImage}
            alt="Selected"
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default Gallery;