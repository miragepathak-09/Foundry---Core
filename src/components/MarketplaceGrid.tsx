import React from 'react';
import { motion } from 'motion/react';
import { Star, MapPin, Zap, ArrowUpRight, ShoppingBag, Sparkles } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { Item } from '../types';

interface MarketplaceGridProps {
  onItemClick: (item: Item) => void;
}

export const MarketplaceGrid: React.FC<MarketplaceGridProps> = ({ onItemClick }) => {
  const { items, user, initiateRental, wallet } = useAppContext();
  const professionalListings: Item[] = [
    {
      id: 'p1',
      userId: 'FD-2026-A',
      type: 'lending',
      title: 'DJI Mavic 3 Pro Drone',
      description: 'Triple-camera system, 43-min flight time. Perfect for high-end cinematography.',
      coordinates: { lat: 27.7172, lng: 85.3240 },
      createdAt: Date.now(),
      status: 'active',
      tags: ['Electronics', 'Photography'],
      pricePerDay: 1500,
      deposit: 10000,
      authorName: 'Anish',
      authorRating: 4.9,
      neighborhood: 'Thamel',
      image: 'https://picsum.photos/seed/drone/800/600'
    },
    {
      id: 'p2',
      userId: 'FD-2026-P',
      type: 'lending',
      title: 'Sony A7R IV + 24-70mm GM',
      description: '61MP full-frame mirrorless camera. Includes extra batteries and 128GB SD card.',
      coordinates: { lat: 27.6915, lng: 85.3420 },
      createdAt: Date.now(),
      status: 'active',
      tags: ['Electronics', 'Photography'],
      pricePerDay: 1200,
      deposit: 8000,
      authorName: 'Prerana',
      authorRating: 5.0,
      neighborhood: 'Baneshwor',
      image: 'https://picsum.photos/seed/camera/800/600'
    },
    {
      id: 'p3',
      userId: 'FD-2026-S',
      type: 'lending',
      title: 'North Face 4-Season Tent',
      description: 'Geodesic dome design, extreme weather protection. Ideal for Himalayan expeditions.',
      coordinates: { lat: 27.6744, lng: 85.3240 },
      createdAt: Date.now(),
      status: 'active',
      tags: ['Outdoors', 'Camping'],
      pricePerDay: 800,
      deposit: 5000,
      authorName: 'Sunil',
      authorRating: 4.8,
      neighborhood: 'Patan',
      image: 'https://picsum.photos/seed/tent/800/600'
    },
    {
      id: 'p4',
      userId: 'FD-2026-R',
      type: 'lending',
      title: 'Bosch Professional Jackhammer',
      description: 'Heavy-duty demolition hammer. 1100W, 12J impact energy.',
      coordinates: { lat: 27.7042, lng: 85.3067 },
      createdAt: Date.now(),
      status: 'active',
      tags: ['Tools', 'Construction'],
      pricePerDay: 600,
      deposit: 4000,
      authorName: 'Ramesh',
      authorRating: 4.7,
      neighborhood: 'Basantapur',
      image: 'https://picsum.photos/seed/tools/800/600'
    },
    {
      id: 'p5',
      userId: 'FD-2026-K',
      type: 'lending',
      title: 'Epson 4K Home Theater Projector',
      description: '3000 Lumens, HDR10 support. Perfect for outdoor movie nights.',
      coordinates: { lat: 27.7215, lng: 85.3620 },
      createdAt: Date.now(),
      status: 'active',
      tags: ['Electronics', 'Entertainment'],
      pricePerDay: 500,
      deposit: 3000,
      authorName: 'Kiran',
      authorRating: 4.6,
      neighborhood: 'Chabahil',
      image: 'https://picsum.photos/seed/projector/800/600'
    },
    {
      id: 'p6',
      userId: 'FD-2026-M',
      type: 'lending',
      title: 'Black Diamond Ice Climbing Set',
      description: 'Includes 2 ice axes, crampons, and 10 ice screws. Professional grade.',
      coordinates: { lat: 27.7149, lng: 85.3148 },
      createdAt: Date.now(),
      status: 'active',
      tags: ['Outdoors', 'Climbing'],
      pricePerDay: 1000,
      deposit: 7000,
      authorName: 'Maya',
      authorRating: 4.9,
      neighborhood: 'Thamel',
      image: 'https://picsum.photos/seed/climbing/800/600'
    },
    {
      id: 'p7',
      userId: 'FD-2026-B',
      type: 'lending',
      title: 'Honda EU2200i Portable Generator',
      description: 'Super quiet, 2200W inverter generator. Perfect for remote camping or backup.',
      coordinates: { lat: 27.6850, lng: 85.3150 },
      createdAt: Date.now(),
      status: 'active',
      tags: ['Tools', 'Electronics'],
      pricePerDay: 900,
      deposit: 6000,
      authorName: 'Binod',
      authorRating: 4.8,
      neighborhood: 'Kupondole',
      image: 'https://picsum.photos/seed/generator/800/600'
    },
    {
      id: 'p8',
      userId: 'FD-2026-N',
      type: 'lending',
      title: 'Yamaha Stagepas 400BT PA System',
      description: '400W portable PA system with Bluetooth. Includes 2 speakers and mixer.',
      coordinates: { lat: 27.7000, lng: 85.3300 },
      createdAt: Date.now(),
      status: 'active',
      tags: ['Electronics', 'Events'],
      pricePerDay: 700,
      deposit: 4500,
      authorName: 'Nabin',
      authorRating: 4.7,
      neighborhood: 'Maitidevi',
      image: 'https://picsum.photos/seed/pa/800/600'
    },
    {
      id: 'p9',
      userId: 'FD-2026-L',
      type: 'lending',
      title: 'Leica Disto D810 Laser Measure',
      description: 'World first: touch screen and camera for measuring in pictures.',
      coordinates: { lat: 27.6710, lng: 85.4298 },
      createdAt: Date.now(),
      status: 'active',
      tags: ['Tools', 'Measurement'],
      pricePerDay: 400,
      deposit: 2500,
      authorName: 'Laxmi',
      authorRating: 5.0,
      neighborhood: 'Bhaktapur',
      image: 'https://picsum.photos/seed/laser/800/600'
    },
    {
      id: 'p10',
      userId: 'FD-2026-G',
      type: 'lending',
      title: 'GoPro Hero 12 Black Creator Edition',
      description: 'Includes Media Mod, Light Mod, and Volta Battery Grip.',
      coordinates: { lat: 27.7100, lng: 85.3200 },
      createdAt: Date.now(),
      status: 'active',
      tags: ['Electronics', 'Photography'],
      pricePerDay: 600,
      deposit: 3500,
      authorName: 'Gopal',
      authorRating: 4.8,
      neighborhood: 'Lazimpat',
      image: 'https://picsum.photos/seed/gopro/800/600'
    }
  ];

  const featuredItems = items.filter(item => item.type === 'lending' && item.status === 'active').concat(professionalListings);

  const handleRent = (e: React.MouseEvent, item: Item) => {
    e.stopPropagation();
    if (!user?.isVerified) return;
    
    // Trigger Handshake Modal instead of direct rental
    onItemClick(item);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-yellow-400/10 text-yellow-400">
            <ShoppingBag size={20} />
          </div>
          <h3 className="text-xl font-bold tracking-tight">Marketplace: Baneshwor • Thamel • Lalitpur</h3>
        </div>
        <button className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all flex items-center gap-1">
          Explore All <ArrowUpRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredItems.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
            className="bento-card group cursor-pointer relative overflow-hidden"
            onClick={() => onItemClick(item)}
          >
            {item.isNew && (
              <div className="absolute top-4 left-4 z-10">
                <div className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center gap-1">
                  <Sparkles size={10} /> Just Listed
                </div>
              </div>
            )}
            <div className="absolute top-0 right-0 p-4">
              <div className="px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-400 text-[10px] font-bold uppercase tracking-widest border border-yellow-400/20">
                Rs. {item.pricePerDay}/day
              </div>
            </div>

            <div className="aspect-video rounded-2xl overflow-hidden mb-4 bg-white/5">
              <img 
                src={item.image || 'https://picsum.photos/seed/item/400/300'} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-yellow-400">
                  <Zap size={20} />
                </div>
                <div>
                  <h4 className="font-bold group-hover:text-yellow-400 transition-colors">{item.title}</h4>
                  <div className="flex items-center gap-1 text-[10px] text-white/40 font-bold uppercase tracking-widest">
                    <Star size={10} className="text-yellow-400 fill-yellow-400" />
                    {item.authorRating} • {item.authorName}
                  </div>
                </div>
              </div>

              <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="flex items-center gap-1 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                  <MapPin size={10} />
                  {item.neighborhood || '0.8km away'}
                </div>
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  Available Now
                </div>
              </div>

              <button 
                onClick={(e) => handleRent(e, item)}
                disabled={!user?.isVerified}
                className={`w-full py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
                  user?.isVerified 
                    ? 'bg-electric-blue text-white hover:shadow-[0_0_20px_rgba(0,122,255,0.4)]' 
                    : 'bg-white/5 text-white/20 cursor-not-allowed'
                }`}
              >
                {user?.isVerified ? 'Rent Now' : 'Verify to Rent'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
