import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  Plane, 
  Hotel, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowRight, 
  ArrowLeft,
  Menu, 
  X, 
  Globe, 
  Shield,
  ShieldCheck, 
  Car, 
  UserCheck, 
  Star,
  Wifi, 
  Coffee, 
  ParkingCircle, 
  Dumbbell, 
  Waves, 
  Sparkles,
  Utensils,
  CreditCard,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Moon,
  Sun,
  MessageCircle
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { cn } from './lib/utils';
import { Currency, Package, TripType, PassengerCount, CabinClass } from './types';
import { Calendar as CustomCalendar } from './components/Calendar';
import { format } from 'date-fns';

const COUNTRY_CODES = [
  { code: '+93', name: 'Afghanistan' },
  { code: '+355', name: 'Albania' },
  { code: '+213', name: 'Algeria' },
  { code: '+1-684', name: 'American Samoa' },
  { code: '+376', name: 'Andorra' },
  { code: '+244', name: 'Angola' },
  { code: '+1-264', name: 'Anguilla' },
  { code: '+672', name: 'Antarctica' },
  { code: '+1-268', name: 'Antigua and Barbuda' },
  { code: '+54', name: 'Argentina' },
  { code: '+374', name: 'Armenia' },
  { code: '+297', name: 'Aruba' },
  { code: '+61', name: 'Australia' },
  { code: '+43', name: 'Austria' },
  { code: '+994', name: 'Azerbaijan' },
  { code: '+1-242', name: 'Bahamas' },
  { code: '+973', name: 'Bahrain' },
  { code: '+880', name: 'Bangladesh' },
  { code: '+1-246', name: 'Barbados' },
  { code: '+375', name: 'Belarus' },
  { code: '+32', name: 'Belgium' },
  { code: '+501', name: 'Belize' },
  { code: '+229', name: 'Benin' },
  { code: '+1-441', name: 'Bermuda' },
  { code: '+975', name: 'Bhutan' },
  { code: '+591', name: 'Bolivia' },
  { code: '+387', name: 'Bosnia and Herzegovina' },
  { code: '+267', name: 'Botswana' },
  { code: '+55', name: 'Brazil' },
  { code: '+246', name: 'British Indian Ocean Territory' },
  { code: '+1-284', name: 'British Virgin Islands' },
  { code: '+673', name: 'Brunei' },
  { code: '+359', name: 'Bulgaria' },
  { code: '+226', name: 'Burkina Faso' },
  { code: '+257', name: 'Burundi' },
  { code: '+855', name: 'Cambodia' },
  { code: '+237', name: 'Cameroon' },
  { code: '+1', name: 'Canada' },
  { code: '+238', name: 'Cape Verde' },
  { code: '+1-345', name: 'Cayman Islands' },
  { code: '+236', name: 'Central African Republic' },
  { code: '+235', name: 'Chad' },
  { code: '+56', name: 'Chile' },
  { code: '+86', name: 'China' },
  { code: '+61', name: 'Christmas Island' },
  { code: '+61', name: 'Cocos Islands' },
  { code: '+57', name: 'Colombia' },
  { code: '+269', name: 'Comoros' },
  { code: '+682', name: 'Cook Islands' },
  { code: '+506', name: 'Costa Rica' },
  { code: '+385', name: 'Croatia' },
  { code: '+53', name: 'Cuba' },
  { code: '+599', name: 'Curacao' },
  { code: '+357', name: 'Cyprus' },
  { code: '+420', name: 'Czech Republic' },
  { code: '+243', name: 'Democratic Republic of the Congo' },
  { code: '+45', name: 'Denmark' },
  { code: '+253', name: 'Djibouti' },
  { code: '+1-767', name: 'Dominica' },
  { code: '+1-809', name: 'Dominican Republic' },
  { code: '+670', name: 'East Timor' },
  { code: '+593', name: 'Ecuador' },
  { code: '+20', name: 'Egypt' },
  { code: '+503', name: 'El Salvador' },
  { code: '+240', name: 'Equatorial Guinea' },
  { code: '+291', name: 'Eritrea' },
  { code: '+372', name: 'Estonia' },
  { code: '+251', name: 'Ethiopia' },
  { code: '+500', name: 'Falkland Islands' },
  { code: '+298', name: 'Faroe Islands' },
  { code: '+679', name: 'Fiji' },
  { code: '+358', name: 'Finland' },
  { code: '+33', name: 'France' },
  { code: '+689', name: 'French Polynesia' },
  { code: '+241', name: 'Gabon' },
  { code: '+220', name: 'Gambia' },
  { code: '+995', name: 'Georgia' },
  { code: '+49', name: 'Germany' },
  { code: '+233', name: 'Ghana' },
  { code: '+350', name: 'Gibraltar' },
  { code: '+30', name: 'Greece' },
  { code: '+299', name: 'Greenland' },
  { code: '+1-473', name: 'Grenada' },
  { code: '+1-671', name: 'Guam' },
  { code: '+502', name: 'Guatemala' },
  { code: '+44-1481', name: 'Guernsey' },
  { code: '+224', name: 'Guinea' },
  { code: '+245', name: 'Guinea-Bissau' },
  { code: '+592', name: 'Guyana' },
  { code: '+509', name: 'Haiti' },
  { code: '+504', name: 'Honduras' },
  { code: '+852', name: 'Hong Kong' },
  { code: '+36', name: 'Hungary' },
  { code: '+354', name: 'Iceland' },
  { code: '+91', name: 'India' },
  { code: '+62', name: 'Indonesia' },
  { code: '+98', name: 'Iran' },
  { code: '+964', name: 'Iraq' },
  { code: '+353', name: 'Ireland' },
  { code: '+44-1624', name: 'Isle of Man' },
  { code: '+972', name: 'Israel' },
  { code: '+39', name: 'Italy' },
  { code: '+225', name: 'Ivory Coast' },
  { code: '+1-876', name: 'Jamaica' },
  { code: '+81', name: 'Japan' },
  { code: '+44-1534', name: 'Jersey' },
  { code: '+962', name: 'Jordan' },
  { code: '+7', name: 'Kazakhstan' },
  { code: '+254', name: 'Kenya' },
  { code: '+686', name: 'Kiribati' },
  { code: '+383', name: 'Kosovo' },
  { code: '+965', name: 'Kuwait' },
  { code: '+996', name: 'Kyrgyzstan' },
  { code: '+856', name: 'Laos' },
  { code: '+371', name: 'Latvia' },
  { code: '+961', name: 'Lebanon' },
  { code: '+266', name: 'Lesotho' },
  { code: '+231', name: 'Liberia' },
  { code: '+218', name: 'Libya' },
  { code: '+423', name: 'Liechtenstein' },
  { code: '+370', name: 'Lithuania' },
  { code: '+352', name: 'Luxembourg' },
  { code: '+853', name: 'Macau' },
  { code: '+389', name: 'Macedonia' },
  { code: '+261', name: 'Madagascar' },
  { code: '+265', name: 'Malawi' },
  { code: '+60', name: 'Malaysia' },
  { code: '+960', name: 'Maldives' },
  { code: '+223', name: 'Mali' },
  { code: '+356', name: 'Malta' },
  { code: '+692', name: 'Marshall Islands' },
  { code: '+222', name: 'Mauritania' },
  { code: '+230', name: 'Mauritius' },
  { code: '+262', name: 'Mayotte' },
  { code: '+52', name: 'Mexico' },
  { code: '+691', name: 'Micronesia' },
  { code: '+373', name: 'Moldova' },
  { code: '+377', name: 'Monaco' },
  { code: '+976', name: 'Mongolia' },
  { code: '+382', name: 'Montenegro' },
  { code: '+1-664', name: 'Montserrat' },
  { code: '+212', name: 'Morocco' },
  { code: '+258', name: 'Mozambique' },
  { code: '+95', name: 'Myanmar' },
  { code: '+264', name: 'Namibia' },
  { code: '+674', name: 'Nauru' },
  { code: '+977', name: 'Nepal' },
  { code: '+31', name: 'Netherlands' },
  { code: '+687', name: 'New Caledonia' },
  { code: '+64', name: 'New Zealand' },
  { code: '+505', name: 'Nicaragua' },
  { code: '+227', name: 'Niger' },
  { code: '+234', name: 'Nigeria' },
  { code: '+683', name: 'Niue' },
  { code: '+850', name: 'North Korea' },
  { code: '+1-670', name: 'Northern Mariana Islands' },
  { code: '+47', name: 'Norway' },
  { code: '+968', name: 'Oman' },
  { code: '+92', name: 'Pakistan' },
  { code: '+680', name: 'Palau' },
  { code: '+970', name: 'Palestine' },
  { code: '+507', name: 'Panama' },
  { code: '+675', name: 'Papua New Guinea' },
  { code: '+595', name: 'Paraguay' },
  { code: '+51', name: 'Peru' },
  { code: '+63', name: 'Philippines' },
  { code: '+64', name: 'Pitcairn' },
  { code: '+48', name: 'Poland' },
  { code: '+351', name: 'Portugal' },
  { code: '+1-787', name: 'Puerto Rico' },
  { code: '+974', name: 'Qatar' },
  { code: '+242', name: 'Republic of the Congo' },
  { code: '+262', name: 'Reunion' },
  { code: '+40', name: 'Romania' },
  { code: '+7', name: 'Russia' },
  { code: '+250', name: 'Rwanda' },
  { code: '+590', name: 'Saint Barthelemy' },
  { code: '+290', name: 'Saint Helena' },
  { code: '+1-869', name: 'Saint Kitts and Nevis' },
  { code: '+1-758', name: 'Saint Lucia' },
  { code: '+590', name: 'Saint Martin' },
  { code: '+508', name: 'Saint Pierre and Miquelon' },
  { code: '+1-784', name: 'Saint Vincent and the Grenadines' },
  { code: '+685', name: 'Samoa' },
  { code: '+378', name: 'San Marino' },
  { code: '+239', name: 'Sao Tome and Principe' },
  { code: '+966', name: 'Saudi Arabia' },
  { code: '+221', name: 'Senegal' },
  { code: '+381', name: 'Serbia' },
  { code: '+248', name: 'Seychelles' },
  { code: '+232', name: 'Sierra Leone' },
  { code: '+65', name: 'Singapore' },
  { code: '+1-721', name: 'Sint Maarten' },
  { code: '+421', name: 'Slovakia' },
  { code: '+386', name: 'Slovenia' },
  { code: '+677', name: 'Solomon Islands' },
  { code: '+252', name: 'Somalia' },
  { code: '+27', name: 'South Africa' },
  { code: '+82', name: 'South Korea' },
  { code: '+211', name: 'South Sudan' },
  { code: '+34', name: 'Spain' },
  { code: '+94', name: 'Sri Lanka' },
  { code: '+249', name: 'Sudan' },
  { code: '+597', name: 'Suriname' },
  { code: '+268', name: 'Swaziland' },
  { code: '+46', name: 'Sweden' },
  { code: '+41', name: 'Switzerland' },
  { code: '+963', name: 'Syria' },
  { code: '+886', name: 'Taiwan' },
  { code: '+992', name: 'Tajikistan' },
  { code: '+255', name: 'Tanzania' },
  { code: '+66', name: 'Thailand' },
  { code: '+228', name: 'Togo' },
  { code: '+690', name: 'Tokelau' },
  { code: '+676', name: 'Tonga' },
  { code: '+1-868', name: 'Trinidad and Tobago' },
  { code: '+216', name: 'Tunisia' },
  { code: '+90', name: 'Turkey' },
  { code: '+993', name: 'Turkmenistan' },
  { code: '+1-649', name: 'Turks and Caicos Islands' },
  { code: '+688', name: 'Tuvalu' },
  { code: '+1-340', name: 'U.S. Virgin Islands' },
  { code: '+256', name: 'Uganda' },
  { code: '+380', name: 'Ukraine' },
  { code: '+971', name: 'United Arab Emirates' },
  { code: '+44', name: 'United Kingdom' },
  { code: '+1', name: 'United States' },
  { code: '+598', name: 'Uruguay' },
  { code: '+998', name: 'Uzbekistan' },
  { code: '+678', name: 'Vanuatu' },
  { code: '+379', name: 'Vatican' },
  { code: '+58', name: 'Venezuela' },
  { code: '+84', name: 'Vietnam' },
  { code: '+681', name: 'Wallis and Futuna' },
  { code: '+212', name: 'Western Sahara' },
  { code: '+967', name: 'Yemen' },
  { code: '+260', name: 'Zambia' },
  { code: '+263', name: 'Zimbabwe' },
].sort((a, b) => a.name.localeCompare(b.name));

// --- Components ---

const Logo = ({ className, sloganClassName, size = 'md' }: { 
  className?: string, 
  sloganClassName?: string,
  size?: 'sm' | 'md' | 'lg'
}) => {
  const titleSizes = {
    sm: "text-lg",
    md: "text-xl md:text-2xl",
    lg: "text-2xl md:text-3xl"
  };
  const sloganSizes = {
    sm: "text-[6px]",
    md: "text-[7px] md:text-[8px]",
    lg: "text-[8px] md:text-[10px]"
  };
  const globeSizes = {
    sm: 14,
    md: 20,
    lg: 24
  };

  return (
    <motion.div 
      whileHover="hover"
      className={cn("flex flex-col items-center justify-center group cursor-pointer", className)}
    >
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="gold-gradient-logo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F9F295" />
            <stop offset="25%" stopColor="#E0AA3E" />
            <stop offset="50%" stopColor="#B8860B" />
            <stop offset="75%" stopColor="#E0AA3E" />
            <stop offset="100%" stopColor="#F9F295" />
          </linearGradient>
        </defs>
      </svg>
      <div className="relative flex flex-col items-center">
        <div className={cn("font-bold tracking-[0.05em] font-serif gold-text-gradient flex items-center gap-1 whitespace-nowrap", titleSizes[size])}>
          <span>THE F</span>
          <div className="relative flex items-center justify-center mx-[-1px]">
            <Globe style={{ stroke: 'url(#gold-gradient-logo)' }} size={globeSizes[size]} />
            <motion.div
              variants={{
                hover: { 
                  x: size === 'sm' ? 18 : size === 'md' ? 50 : 65, 
                  y: -2,
                  opacity: 1,
                }
              }}
              initial={{ x: 0, y: 0, opacity: 0, rotate: 45 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute z-10 pointer-events-none"
            >
              <Plane style={{ fill: 'url(#gold-gradient-logo)', stroke: 'url(#gold-gradient-logo)' }} size={globeSizes[size] * 0.7} />
            </motion.div>
          </div>
          <span>RTIS TRAVELS</span>
        </div>
        <div className="w-full flex justify-center mt-1">
          <span className={cn("font-bold tracking-[0.3em] uppercase gold-text-gradient opacity-90 text-center", sloganSizes[size], sloganClassName)}>
            HAPPINESS IS TRAVELING
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const Header = ({ currency, setCurrency, setView, view, darkMode, setDarkMode }: { 
  currency: Currency, 
  setCurrency: (c: Currency) => void, 
  setView: (v: any) => void,
  view: string,
  darkMode: boolean,
  setDarkMode: (d: boolean) => void
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const leftNav = [
    { name: 'HOME', onClick: () => setView('home') },
    { 
      name: 'SERVICES', 
      dropdown: [
        { name: 'Umrah Packages', onClick: () => setView('service-Umrah Packages') },
        { name: 'Visa Services', onClick: () => setView('service-Visa Services') },
        { name: 'Car Rental', onClick: () => setView('service-Car Rental') },
        { name: 'Travel Insurance', onClick: () => setView('service-Travel Insurance') },
        { name: 'Meet & Greet', onClick: () => setView('service-Meet & Greet') },
      ]
    },
    { 
      name: 'TOUR PACKAGES', 
      dropdown: [
        { name: 'Holiday Packages', onClick: () => setView('service-Holiday Packages') },
        { name: 'UAE Attractions', onClick: () => setView('service-UAE Attractions') },
      ]
    },
  ];

  const rightNav = [
    { name: 'PRIVATE CHARTER', onClick: () => setView('service-Private Charter') },
    { name: 'ABOUT US', onClick: () => setView('about') },
    { name: 'CONTACT', onClick: () => setView('contact') },
  ];

  const NavItem = ({ item }: { item: any }) => {
    const isActive = view === (item.onClick ? (item as any).viewValue || item.name.toLowerCase() : '') || 
                    (item.dropdown && item.dropdown.some((sub: any) => view === `service-${sub.name}`)) ||
                    (item.name === 'PRIVATE CHARTER' && view === 'service-Private Charter') ||
                    (item.name === 'HOME' && view === 'home') ||
                    (item.name === 'ABOUT US' && view === 'about') ||
                    (item.name === 'CONTACT' && view === 'contact');

    return (
      <div className="relative group">
        <button 
          onClick={item.onClick}
          className={cn(
            "text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-300 relative py-2 flex items-center gap-1 cursor-pointer",
            isActive ? "text-brand-gold" : "text-white/60 hover:text-brand-gold"
          )}
        >
          {item.name}
          {item.dropdown && <ChevronDown size={10} />}
          <span className={cn(
            "absolute bottom-0 left-0 h-[2px] bg-brand-gold transition-all duration-300",
            isActive ? "w-full" : "w-0 group-hover:w-full"
          )} />
        </button>
        
        {item.dropdown && (
          <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100]">
            <div className="bg-white dark:bg-brand-black shadow-2xl border border-black/5 dark:border-white/10 py-4 min-w-[200px] rounded-sm">
              {item.dropdown.map((sub: any) => {
                const isSubActive = view === `service-${sub.name}`;
                return (
                  <button 
                    key={sub.name}
                    onClick={sub.onClick}
                    className={cn(
                      "block w-full text-left px-6 py-3 text-[10px] font-bold tracking-widest uppercase transition-colors cursor-pointer",
                      isSubActive 
                        ? "text-brand-gold bg-brand-grey dark:bg-white/5" 
                        : "text-black/60 dark:text-white/60 hover:text-brand-gold hover:bg-brand-grey dark:hover:bg-white/5"
                    )}
                  >
                    {sub.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500",
        isScrolled ? "bg-brand-black/95 backdrop-blur-xl py-4 shadow-xl border-b border-white/5" : "bg-brand-black py-6 border-b border-white/5"
      )}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Left Nav */}
          <nav className="hidden lg:flex items-center gap-8 flex-1">
            {leftNav.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>

          {/* Logo - Center */}
          <div className="flex-1 flex justify-center" onClick={() => setView('home')}>
            <Logo size="md" />
          </div>

          {/* Right Nav + Actions */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-end">
            <nav className="flex items-center gap-8">
              {rightNav.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
            
            <div className="flex items-center gap-4 ml-4 border-l border-white/10 pl-8">
              <div className="relative group">
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className={cn(
                    "transition-colors cursor-pointer text-white/60 hover:text-brand-gold"
                  )}
                >
                  {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                </button>
                <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-brand-black text-white text-[8px] font-bold tracking-widest uppercase px-2 py-1 whitespace-nowrap border border-white/10">
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                  </div>
                </div>
              </div>
              <div className="relative group">
                <button className={cn(
                  "text-[10px] font-bold tracking-widest flex items-center gap-1 transition-colors text-white/60 hover:text-white"
                )}>
                  {currency} <ChevronDown size={10} />
                </button>
                <div className="absolute top-full right-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-white dark:bg-brand-black shadow-2xl border border-black/5 dark:border-white/10 py-2 min-w-[80px] rounded-sm">
                    {(['AED', 'USD', 'EUR', 'GBP', 'CAD'] as Currency[]).map((c) => (
                      <button 
                        key={c} 
                        onClick={() => setCurrency(c)}
                        className="block w-full text-left px-4 py-2 text-[9px] font-bold tracking-widest text-black/60 dark:text-white/60 hover:text-brand-gold hover:bg-brand-grey dark:hover:bg-white/5 uppercase cursor-pointer"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setView('contact')}
              className="gold-gradient text-black px-8 py-3 text-[10px] font-bold tracking-[0.2em] uppercase hover:opacity-90 transition-all shadow-lg"
            >
              Book Now
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            className={cn(
              "lg:hidden transition-colors text-white"
            )}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-brand-grey lg:hidden"
          >
            <div className="flex flex-col h-full p-12 overflow-y-auto">
              <div className="flex justify-between items-center mb-16">
                <div className="flex items-center" onClick={() => { setView('home'); setMobileMenuOpen(false); }}>
                  <Logo size="sm" />
                </div>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X size={32} className="text-brand-gold" />
                </button>
              </div>

              <nav className="flex flex-col space-y-8">
                {[...leftNav, ...rightNav].map((item, idx) => {
                  const isActive = view === (item.onClick ? (item as any).viewValue || item.name.toLowerCase() : '') || 
                                  ((item as any).dropdown && (item as any).dropdown.some((sub: any) => view === `service-${sub.name}`)) ||
                                  (item.name === 'PRIVATE CHARTER' && view === 'service-Private Charter') ||
                                  (item.name === 'HOME' && view === 'home') ||
                                  (item.name === 'ABOUT US' && view === 'about') ||
                                  (item.name === 'CONTACT' && view === 'contact');
                  
                  return (
                    <motion.div 
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <div className="space-y-4">
                        <button 
                          onClick={() => {
                            if (!(item as any).dropdown) {
                              (item as any).onClick();
                              setMobileMenuOpen(false);
                            }
                          }}
                          className={cn(
                            "text-4xl font-bold transition-colors uppercase tracking-tighter flex items-center justify-between w-full cursor-pointer",
                            isActive ? "text-brand-gold" : "text-black dark:text-white hover:text-brand-gold"
                          )}
                        >
                          {item.name}
                        </button>
                        {(item as any).dropdown && (
                          <div className="pl-6 flex flex-col space-y-4 border-l border-black/10 dark:border-white/10">
                            {(item as any).dropdown.map((sub: any) => {
                              const isSubActive = view === `service-${sub.name}`;
                              return (
                                <button 
                                  key={sub.name}
                                  onClick={() => {
                                    sub.onClick();
                                    setMobileMenuOpen(false);
                                  }}
                                  className={cn(
                                    "text-xl font-bold transition-colors uppercase tracking-tight text-left cursor-pointer",
                                    isSubActive ? "text-brand-gold" : "text-black/60 dark:text-white/60 hover:text-brand-gold"
                                  )}
                                >
                                  {sub.name}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <button 
                    onClick={() => {
                      setView('contact');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full gold-gradient text-black py-6 text-xl font-bold tracking-[0.2em] uppercase shadow-2xl mt-8"
                  >
                    Book Now
                  </button>
                </motion.div>
              </nav>

              <div className="mt-12 pt-12 border-t border-black/10 flex justify-between items-center">
                <div className="flex gap-6">
                  <Instagram size={20} className="text-black/40 hover:text-brand-gold" />
                  <Facebook size={20} className="text-black/40 hover:text-brand-gold" />
                  <Twitter size={20} className="text-black/40 hover:text-brand-gold" />
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setDarkMode(!darkMode)} className="text-black/40">
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                  <span className="text-brand-gold font-bold text-xs">{currency}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const LocationSearch = ({ label, placeholder, value, onChange, icon: Icon = MapPin }: { label: string, placeholder: string, value: string, onChange: (val: string) => void, icon?: any }) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/airports?keyword=${query}`);
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (err) {
        console.error(err);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative space-y-2">
      <label className="text-[9px] font-bold tracking-widest text-white/40 uppercase">{label}</label>
      <div className="relative">
        <Icon className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-gold/40" size={16} />
        <input 
          type="text" 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
          }}
          placeholder={placeholder} 
          className="w-full pl-6 monochrome-input text-sm" 
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
        />
        {query && (
          <button 
            onClick={() => {
              setQuery('');
              onChange('');
              setSuggestions([]);
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-white/20 hover:text-brand-gold transition-colors"
          >
            <X size={12} />
          </button>
        )}
      </div>
      <AnimatePresence>
        {showSuggestions && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-full left-0 w-full bg-brand-white shadow-2xl border border-white/5 z-[100] mt-1 max-h-60 overflow-y-auto"
          >
            {suggestions.length > 0 ? (
              suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const val = s.iataCode ? `${s.iataCode} - ${s.name}` : s.name;
                    setQuery(val);
                    onChange(val);
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left px-4 py-3 text-[11px] hover:bg-white/5 border-b border-white/5 last:border-0 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-gold/10 flex items-center justify-center rounded-full">
                      {s.iataCode ? <Plane size={12} className="text-brand-gold" /> : <MapPin size={12} className="text-brand-gold" />}
                    </div>
                    <div>
                      <p className="font-bold">{s.iataCode ? `${s.iataCode} - ${s.name}` : s.name}</p>
                      <p className="text-[9px] text-white/40 uppercase tracking-widest">{s.address?.cityName || s.detailedName}</p>
                    </div>
                  </div>
                  <div className="text-[9px] font-bold text-white/20 group-hover:text-brand-gold transition-colors">
                    {s.subType || (s.iataCode ? 'AIRPORT' : 'CITY')}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center">
                <p className="text-[10px] font-bold tracking-widest text-white/20 uppercase">No locations found</p>
                <p className="text-[8px] text-white/40 mt-1 uppercase">Try searching for a city or airport code</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Hero = ({ onSearch }: { onSearch: (type: 'flights' | 'hotels', params: any) => void }) => {
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels'>('flights');
  const [tripType, setTripType] = useState<TripType>('RETURN');
  const [cabinClass, setCabinClass] = useState<CabinClass>('ECONOMY');
  const [passengers, setPassengers] = useState<PassengerCount>({ adults: 1, children: 0, infants: 0 });
  const [rooms, setRooms] = useState(1);
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [showCabinDropdown, setShowCabinDropdown] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [flightSearch, setFlightSearch] = useState({ origin: '', destination: '' });
  const [hotelSearch, setHotelSearch] = useState('');
  
  const heroImages = [
    { url: "https://www.coomberetreat.co.uk/wp-content/uploads/2026/02/airbus-pulls-off-historic-first-by-bringing-two-jets-to-the-exact-same-point-without-a-collision-1.jpg", statement: "Experience the Thrill of Commercial Jet Takes-off" },
    { url: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=1920&q=80", statement: "Seamless Transitions at the World's Finest Airports" },
    { url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80", statement: "Luxury Redefined in Our Handpicked Hotel Suites" },
    { url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1920&q=80", statement: "Discover Hidden Gems with Expert Sightseeing Tours" },
    { url: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=1920&q=80", statement: "Travel in Style with Our Private Jet Charters" },
    { url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1920&q=80", statement: "Escape to Serenity in Exclusive Mountain Resorts" },
    { url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80", statement: "Global Connectivity for the Modern Explorer" },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  // Date States
  const [departureDate, setDepartureDate] = useState<Date>(new Date());
  const [returnDate, setReturnDate] = useState<Date | undefined>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [checkInDate, setCheckInDate] = useState<Date>(new Date());
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));
  
  const [showDepartureCalendar, setShowDepartureCalendar] = useState(false);
  const [showReturnCalendar, setShowReturnCalendar] = useState(false);
  const [showCheckInCalendar, setShowCheckInCalendar] = useState(false);
  const [showCheckOutCalendar, setShowCheckOutCalendar] = useState(false);

  const amenities = [
    { id: 'pool', label: 'Pool', icon: <Waves size={14} /> },
    { id: 'spa', label: 'Spa', icon: <Sparkles size={14} /> },
    { id: 'gym', label: 'Gym', icon: <Dumbbell size={14} /> },
    { id: 'wifi', label: 'Free WiFi', icon: <Wifi size={14} /> },
    { id: 'restaurant', label: 'Restaurant', icon: <Utensils size={14} /> },
    { id: 'breakfast', label: 'Breakfast', icon: <Coffee size={14} /> },
    { id: 'parking', label: 'Car Parking', icon: <ParkingCircle size={14} /> },
  ];

  const cabinClasses: CabinClass[] = ['ECONOMY', 'PREMIUM', 'BUSINESS', 'FIRST'];

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleSearchClick = () => {
    if (activeTab === 'flights') {
      onSearch('flights', {
        origin: flightSearch.origin,
        destination: flightSearch.destination,
        dates: { from: departureDate, to: returnDate },
        passengers,
        cabinClass,
        tripType
      });
    } else {
      onSearch('hotels', {
        destination: hotelSearch,
        dates: { from: checkInDate, to: checkOutDate },
        guests: passengers,
        rooms,
        amenities: selectedAmenities
      });
    }
  };

  const closeAllDropdowns = () => {
    setShowDepartureCalendar(false);
    setShowReturnCalendar(false);
    setShowCheckInCalendar(false);
    setShowCheckOutCalendar(false);
    setShowPassengerDropdown(false);
    setShowCabinDropdown(false);
  };

  return (
    <section className="relative w-full flex flex-col items-center bg-brand-white pt-24">
      {/* Hero Image Slider - Full Width */}
      <div className="relative w-full h-[75vh] overflow-hidden group bg-black">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <motion.img
                src={heroImages[currentImageIndex].url}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 5, ease: "linear" }}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              
              {/* Statement Overlay - Inside the same transition block for perfect sync */}
              <div className="absolute inset-x-0 bottom-12 flex items-center justify-center z-20 p-8 pointer-events-none">
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="text-brand-gold text-2xl md:text-5xl font-serif font-bold text-center leading-tight drop-shadow-2xl gold-text-gradient max-w-4xl mx-auto"
                >
                  {heroImages[currentImageIndex].statement}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Navigation Arrows */}
        <button 
          onClick={() => setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-brand-gold hover:text-black transition-all duration-300 cursor-pointer"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={() => setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-brand-gold hover:text-black transition-all duration-300 cursor-pointer"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      <div className="relative z-20 w-full max-w-6xl px-6 pb-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="text-white/40 text-sm font-light tracking-[0.4em] uppercase max-w-2xl mx-auto">
            Bespoke Journeys • Private Aviation • Global Concierge
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-brand-white shadow-2xl relative z-30"
        >
          <div className="flex border-b border-white/5">
            {(['flights', 'hotels'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  closeAllDropdowns();
                }}
                className={cn(
                  "flex-1 py-6 text-[10px] font-bold tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-3",
                  activeTab === tab ? "gold-gradient text-black" : "text-white/40 hover:text-brand-gold hover:bg-brand-gold/5"
                )}
              >
                {tab === 'flights' ? <Plane size={14} /> : <Hotel size={14} />}
                {tab}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === 'flights' ? (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex gap-8">
                    {(['ONEWAY', 'RETURN', 'MULTI CITY'] as TripType[]).map((type) => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <div className={cn(
                          "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                          tripType === type ? "border-brand-gold" : "border-black/20 group-hover:border-brand-gold/40"
                        )}>
                          {tripType === type && <div className="w-2 h-2 bg-brand-gold rounded-full" />}
                        </div>
                        <input 
                          type="radio" 
                          name="tripType" 
                          className="hidden" 
                          checked={tripType === type} 
                          onChange={() => {
                            setTripType(type);
                            closeAllDropdowns();
                          }} 
                        />
                        <span className={cn(
                          "text-[10px] font-bold tracking-widest uppercase",
                          tripType === type ? "text-white" : "text-white/40"
                        )}>{type}</span>
                      </label>
                    ))}
                  </div>

                  <div className="relative">
                    <button 
                      onClick={() => {
                        const next = !showCabinDropdown;
                        closeAllDropdowns();
                        setShowCabinDropdown(next);
                      }}
                      className="text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 hover:text-brand-gold transition-colors"
                    >
                      {cabinClass} <ChevronDown size={12} className="text-brand-gold/40" />
                    </button>
                    <AnimatePresence>
                      {showCabinDropdown && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full right-0 bg-brand-white shadow-2xl border border-white/5 z-[100] mt-2 py-2 min-w-[140px]"
                        >
                          {cabinClasses.map((c) => (
                            <button
                              key={c}
                              onClick={() => {
                                setCabinClass(c);
                                setShowCabinDropdown(false);
                              }}
                              className={cn(
                                "w-full text-left px-4 py-2 text-[10px] font-bold tracking-widest uppercase hover:bg-brand-gold/5",
                                cabinClass === c ? "text-brand-gold" : "text-white/40"
                              )}
                            >
                              {c}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                  <div className="md:col-span-3">
                    <LocationSearch 
                      label="Origin" 
                      placeholder="Search IATA / City" 
                      value={flightSearch.origin} 
                      onChange={(v) => setFlightSearch(prev => ({ ...prev, origin: v }))} 
                      icon={Plane}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <LocationSearch 
                      label="Destination" 
                      placeholder="Search IATA / City" 
                      value={flightSearch.destination} 
                      onChange={(v) => setFlightSearch(prev => ({ ...prev, destination: v }))} 
                      icon={MapPin}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2 relative">
                    <label className="text-[9px] font-bold tracking-widest text-white/40 uppercase">Departure</label>
                    <button 
                      onClick={() => {
                        const next = !showDepartureCalendar;
                        closeAllDropdowns();
                        setShowDepartureCalendar(next);
                      }}
                      className="w-full text-left monochrome-input text-sm flex items-center gap-2"
                    >
                      <Calendar className="text-brand-gold/40" size={16} />
                      <span className="truncate">{format(departureDate, 'dd MMM yyyy')}</span>
                    </button>
                    
                    <AnimatePresence>
                      {showDepartureCalendar && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 z-[100] mt-2"
                        >
                          <CustomCalendar 
                            mode="single"
                            selected={{ from: departureDate }}
                            onSelect={(date) => {
                              setDepartureDate(date);
                              setShowDepartureCalendar(false);
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="md:col-span-2 space-y-2 relative">
                    <label className="text-[9px] font-bold tracking-widest text-white/40 uppercase">Return</label>
                    <button 
                      disabled={tripType === 'ONEWAY'}
                      onClick={() => {
                        const next = !showReturnCalendar;
                        closeAllDropdowns();
                        setShowReturnCalendar(next);
                      }}
                      className={cn(
                        "w-full text-left monochrome-input text-sm flex items-center gap-2",
                        tripType === 'ONEWAY' && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <Calendar className="text-brand-gold/40" size={16} />
                      <span className="truncate">
                        {tripType === 'ONEWAY' ? '---' : (returnDate ? format(returnDate, 'dd MMM yyyy') : 'Select Date')}
                      </span>
                    </button>
                    
                    <AnimatePresence>
                      {showReturnCalendar && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 z-[100] mt-2"
                        >
                          <CustomCalendar 
                            mode="single"
                            selected={{ from: returnDate || new Date() }}
                            onSelect={(date) => {
                              setReturnDate(date);
                              setShowReturnCalendar(false);
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="md:col-span-2 space-y-2 relative">
                    <label className="text-[9px] font-bold tracking-widest text-white/40 uppercase">Passengers</label>
                    <button 
                      onClick={() => {
                        const next = !showPassengerDropdown;
                        closeAllDropdowns();
                        setShowPassengerDropdown(next);
                      }}
                      className="w-full text-left monochrome-input text-sm flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Users size={16} className="text-brand-gold/40" />
                        {passengers.adults + passengers.children + passengers.infants}
                      </span>
                      <ChevronDown size={14} className="text-brand-gold/40" />
                    </button>
                    
                    <AnimatePresence>
                      {showPassengerDropdown && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 w-full bg-brand-white shadow-2xl border border-white/5 p-6 z-[100] mt-2 min-w-[240px]"
                        >
                          {(['adults', 'children', 'infants'] as const).map((type) => (
                            <div key={type} className="flex items-center justify-between mb-4 last:mb-0">
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest">{type}</p>
                                <p className="text-[8px] text-white/40 uppercase">
                                  {type === 'adults' ? 'Ages 12+' : type === 'children' ? 'Ages 2-11' : 'Ages <2'}
                                </p>
                              </div>
                              <div className="flex items-center gap-4">
                                <button 
                                  onClick={() => setPassengers(p => ({ ...p, [type]: Math.max(type === 'adults' ? 1 : 0, p[type] - 1) }))}
                                  className="w-8 h-8 border border-brand-gold/20 flex items-center justify-center hover:bg-brand-gold hover:text-black transition-all"
                                >-</button>
                                <span className="text-xs font-bold w-4 text-center">{passengers[type]}</span>
                                <button 
                                  onClick={() => setPassengers(p => ({ ...p, [type]: p[type] + 1 }))}
                                  className="w-8 h-8 border border-brand-gold/20 flex items-center justify-center hover:bg-brand-gold hover:text-black transition-all"
                                >+</button>
                              </div>
                            </div>
                          ))}
                          <button 
                            onClick={() => setShowPassengerDropdown(false)}
                            className="w-full mt-6 bg-brand-gold text-black py-3 text-[9px] font-bold tracking-widest uppercase hover:opacity-90 transition-all"
                          >
                            CONFIRM
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                  <div className="md:col-span-4 space-y-2">
                    <LocationSearch 
                      label="Destination" 
                      placeholder="City, Landmark, or Hotel Name" 
                      value={hotelSearch} 
                      onChange={setHotelSearch} 
                      icon={Hotel}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2 relative">
                    <label className="text-[9px] font-bold tracking-widest text-white/40 uppercase">Check In</label>
                    <button 
                      onClick={() => {
                        const next = !showCheckInCalendar;
                        closeAllDropdowns();
                        setShowCheckInCalendar(next);
                      }}
                      className="w-full text-left monochrome-input text-sm flex items-center gap-2"
                    >
                      <Calendar className="text-brand-gold/40" size={16} />
                      <span className="truncate">{format(checkInDate, 'dd MMM yyyy')}</span>
                    </button>

                    <AnimatePresence>
                      {showCheckInCalendar && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 z-[100] mt-2"
                        >
                          <CustomCalendar 
                            mode="single"
                            selected={{ from: checkInDate }}
                            onSelect={(date) => {
                              setCheckInDate(date);
                              setShowCheckInCalendar(false);
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="md:col-span-2 space-y-2 relative">
                    <label className="text-[9px] font-bold tracking-widest text-white/40 uppercase">Check Out</label>
                    <button 
                      onClick={() => {
                        const next = !showCheckOutCalendar;
                        closeAllDropdowns();
                        setShowCheckOutCalendar(next);
                      }}
                      className="w-full text-left monochrome-input text-sm flex items-center gap-2"
                    >
                      <Calendar className="text-brand-gold/40" size={16} />
                      <span className="truncate">
                        {checkOutDate ? format(checkOutDate, 'dd MMM yyyy') : 'Select Date'}
                      </span>
                    </button>

                    <AnimatePresence>
                      {showCheckOutCalendar && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 z-[100] mt-2"
                        >
                          <CustomCalendar 
                            mode="single"
                            selected={{ from: checkOutDate || new Date() }}
                            onSelect={(date) => {
                              setCheckOutDate(date);
                              setShowCheckOutCalendar(false);
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="md:col-span-4 space-y-2 relative">
                    <label className="text-[9px] font-bold tracking-widest text-white/40 uppercase">Rooms & Guests</label>
                    <button 
                      onClick={() => {
                        const next = !showPassengerDropdown;
                        closeAllDropdowns();
                        setShowPassengerDropdown(next);
                      }}
                      className="w-full text-left monochrome-input text-sm flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Users size={16} className="text-brand-gold/40" />
                        {rooms} Room, {passengers.adults + passengers.children} Guests
                      </span>
                      <ChevronDown size={14} className="text-brand-gold/40" />
                    </button>

                    <AnimatePresence>
                      {showPassengerDropdown && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 w-full bg-brand-white shadow-2xl border border-white/5 p-6 z-[100] mt-2 min-w-[240px]"
                        >
                          <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest">Rooms</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <button 
                                onClick={() => setRooms(r => Math.max(1, r - 1))}
                                className="w-8 h-8 border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all"
                              >-</button>
                              <span className="text-xs font-bold w-4 text-center">{rooms}</span>
                              <button 
                                onClick={() => setRooms(r => r + 1)}
                                className="w-8 h-8 border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all"
                              >+</button>
                            </div>
                          </div>

                          {(['adults', 'children'] as const).map((type) => (
                            <div key={type} className="flex items-center justify-between mb-4 last:mb-0">
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest">{type}</p>
                                <p className="text-[8px] text-black/40 uppercase">
                                  {type === 'adults' ? 'Ages 18+' : 'Ages 0-17'}
                                </p>
                              </div>
                              <div className="flex items-center gap-4">
                                <button 
                                  onClick={() => setPassengers(p => ({ ...p, [type]: Math.max(type === 'adults' ? 1 : 0, p[type] - 1) }))}
                                  className="w-8 h-8 border border-brand-gold/20 flex items-center justify-center hover:bg-brand-gold hover:text-black transition-all"
                                >-</button>
                                <span className="text-xs font-bold w-4 text-center">{passengers[type]}</span>
                                <button 
                                  onClick={() => setPassengers(p => ({ ...p, [type]: p[type] + 1 }))}
                                  className="w-8 h-8 border border-brand-gold/20 flex items-center justify-center hover:bg-brand-gold hover:text-black transition-all"
                                >+</button>
                              </div>
                            </div>
                          ))}
                          <button 
                            onClick={() => setShowPassengerDropdown(false)}
                            className="w-full mt-6 bg-brand-gold text-black py-3 text-[9px] font-bold tracking-widest uppercase hover:opacity-90 transition-all"
                          >
                            CONFIRM
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[9px] font-bold tracking-widest text-white/40 uppercase block">Amenities Filter</label>
                  <div className="flex flex-wrap gap-3">
                    {amenities.map((amenity) => (
                      <button
                        key={amenity.id}
                        onClick={() => toggleAmenity(amenity.id)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 border text-[9px] font-bold tracking-widest transition-all",
                          selectedAmenities.includes(amenity.id) 
                            ? "gold-gradient text-black border-brand-gold" 
                            : "border-white/10 text-white/40 hover:bg-brand-gold hover:text-black hover:border-brand-gold"
                        )}
                      >
                        {amenity.icon}
                        {amenity.label.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-12 flex justify-center">
              <button 
                onClick={handleSearchClick}
                className="gold-gradient text-black py-6 px-20 font-bold text-[12px] tracking-[0.5em] hover:opacity-90 transition-all flex items-center gap-4 group"
              >
                {activeTab === 'flights' ? 'SEARCH FLIGHTS' : 'SEARCH HOTELS'} <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const ServiceGrid = ({ setView }: { setView: (v: any) => void }) => {
  const services = [
    { id: 'Umrah Packages', title: 'Umrah Packages', desc: 'Spiritual journeys with premium GDS connectivity.', icon: <Moon size={24} />, img: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80' },
    { id: 'Visa Services', title: 'Visa Services', desc: 'Global mobility solutions and expert consultation.', icon: <ShieldCheck size={24} />, img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80' },
    { id: 'Car Rental', title: 'Car Rental', desc: 'Luxury fleet access: From supercars to SUVs.', icon: <Car size={24} />, img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80' },
    { id: 'Travel Insurance', title: 'Travel Insurance', desc: 'Comprehensive coverage for global peace of mind.', icon: <ShieldCheck size={24} />, img: 'https://images.unsplash.com/photo-1454165833767-027ff33027ef?auto=format&fit=crop&w=800&q=80' },
    { id: 'Meet & Greet', title: 'Meet & Greet', desc: 'VIP airport assistance and seamless transfers.', icon: <Users size={24} />, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' },
    { id: 'Private Charter', title: 'Private Charter', desc: 'Exclusive aviation solutions for elite travelers.', icon: <Plane size={24} />, img: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80' },
  ];

  return (
    <section id="packages" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif font-bold mb-4 text-white">Our Premium Services</h2>
          <div className="w-24 h-1 bg-brand-gold mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              onClick={() => setView(`service-${service.id}`)}
              className="group relative h-[400px] overflow-hidden cursor-pointer"
            >
              <img 
                src={service.img} 
                className="w-full h-full object-cover transition-all duration-1000 grayscale group-hover:grayscale-0 group-hover:scale-110" 
                alt={service.title} 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <div className="text-brand-gold mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{service.icon}</div>
                <h3 className="text-white text-2xl font-serif font-bold mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{service.title}</h3>
                <p className="text-white/60 text-xs leading-relaxed opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-150">{service.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HotDestinations = ({ onInquire }: { onInquire: () => void }) => {
  const destinations = [
    { name: 'DUBAI', desc: 'City of Gold: Luxury stays at Dubai South.', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80' },
    { name: 'MALDIVES', desc: 'Private Island Escapes & Charter Flights.', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80' },
    { name: 'LONDON', desc: 'Historical Tours & Luxury Visa Services.', img: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'UMRAH', desc: 'Premium Umrah Packages: Direct GDS Rates.', img: 'https://images.unsplash.com/photo-1693590614566-1d3ea9ef32f7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'SWITZERLAND', desc: 'Alpine Retreats & Private Ski Charters.', img: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80' },
    { name: 'SINGAPORE', desc: 'Urban Luxury & Business Class Excellence.', img: 'https://images.unsplash.com/photo-1541267226650-673e4bc869c7?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'PARIS', desc: 'Romantic Escapes & Haute Couture Tours.', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80' },
    { name: 'NEW YORK', desc: 'Manhattan Suites & VIP Broadway Access.', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80' },
    { name: 'SYDNEY', desc: 'Iconic skyline, global gateway.', img: 'https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  ];

  return (
    <section id="destinations" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-5xl font-serif font-bold mb-4 text-white">Hot Destinations</h2>
            <p className="text-white/50 text-sm leading-relaxed tracking-wide">
              Curated experiences in the world's most sought-after locations. Meticulously planned, exclusively delivered with real-time GDS connectivity.
            </p>
          </div>
          <button className="text-[10px] font-bold tracking-[0.3em] border-b border-white pb-2 hover:text-white/60 hover:border-white/60 transition-all text-white">
            EXPLORE ALL
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest, idx) => (
            <motion.div 
              key={dest.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="relative aspect-[3/4] overflow-hidden group cursor-pointer"
            >
              <img 
                src={dest.img} 
                className="w-full h-full object-cover transition-all duration-1000 grayscale group-hover:grayscale-0 group-hover:scale-110" 
                alt={dest.name} 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 p-10 w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-white text-3xl font-serif font-bold mb-2 tracking-tight">{dest.name}</h3>
                <p className="text-white/70 text-[10px] font-bold tracking-[0.2em] leading-relaxed mb-6">{dest.desc.toUpperCase()}</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onInquire();
                  }}
                  className="bg-brand-white text-white px-6 py-3 text-[9px] font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200"
                >
                  Inquire Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PaymentSection = () => {
  return (
    <section className="py-16 border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-brand-gold text-black flex items-center justify-center rounded-full">
            <CreditCard size={24} />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase mb-1 text-white">Pay Online Securely</h3>
            <p className="text-[10px] text-white/40 font-bold tracking-widest uppercase">Encrypted & Secure Transactions</p>
          </div>
        </div>
        
        <div className="flex items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 invert" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="Amex" className="h-8" />
        </div>
      </div>
    </section>
  );
};

const AboutUs = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase mb-12 text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to Home
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
          <div>
            <h1 className="text-6xl font-serif font-bold mb-8 leading-tight text-white">Redefining the Art of Travel</h1>
            <p className="text-lg text-white/60 font-light mb-8 leading-relaxed">
              Founded on the principles of exclusivity, efficiency, and excellence, The Fortis Travels & Tourism is more than an OTA aggregator. We are your global concierge, your private aviation partner, and your bridge to the world's most extraordinary experiences.
            </p>
            <div className="grid grid-cols-2 gap-12">
              <div>
                <h3 className="text-3xl font-serif font-bold mb-2 text-brand-gold">15+</h3>
                <p className="text-[10px] text-white/40 font-bold tracking-widest uppercase">Years of Excellence</p>
              </div>
              <div>
                <h3 className="text-3xl font-serif font-bold mb-2 text-brand-gold">120+</h3>
                <p className="text-[10px] text-white/40 font-bold tracking-widest uppercase">Global Destinations</p>
              </div>
            </div>
          </div>
          <div className="relative aspect-square">
            <img 
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=80" 
              alt="Team" 
              className="w-full h-full object-cover grayscale"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-12 -left-12 gold-gradient text-black p-12 max-w-xs hidden md:block shadow-2xl">
              <p className="text-sm font-light italic leading-relaxed">
                "Our mission is to provide seamless, luxury travel solutions that empower our clients to explore the world without boundaries."
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="p-12 bg-brand-white/5 border border-white/5 shadow-sm hover:shadow-xl transition-all group">
            <Globe className="mb-8 text-brand-gold/20 group-hover:text-brand-gold transition-colors" size={48} />
            <h3 className="text-xl font-serif font-bold mb-4 text-white">Global Network</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              With direct GDS connectivity and partnerships with leading luxury hotel chains and private aviation providers, we offer unparalleled access worldwide.
            </p>
          </div>
          <div className="p-12 bg-brand-white/5 border border-white/5 shadow-sm hover:shadow-xl transition-all group">
            <ShieldCheck className="mb-8 text-brand-gold/20 group-hover:text-brand-gold transition-colors" size={48} />
            <h3 className="text-xl font-serif font-bold mb-4 text-white">Uncompromising Safety</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Your safety and security are our top priorities. We work only with certified partners who meet the highest international standards of safety and service.
            </p>
          </div>
          <div className="p-12 bg-brand-white/5 border border-white/5 shadow-sm hover:shadow-xl transition-all group">
            <Star className="mb-8 text-brand-gold/20 group-hover:text-brand-gold transition-colors" size={48} />
            <h3 className="text-xl font-serif font-bold mb-4 text-white">Bespoke Service</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Every journey is unique. Our dedicated team of travel experts works tirelessly to tailor every detail of your trip to your specific needs and preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactSection = ({ standalone, onBack }: { standalone?: boolean, onBack?: () => void }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [countryCode, setCountryCode] = useState('+971');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get('name'),
      mobile: formData.get('mobile'),
      countryCode: countryCode,
      email: formData.get('email'),
      description: formData.get('description')
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        setStatus('success');
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      console.error('Contact error:', error);
      alert('Failed to send message. Please try again.');
      setStatus('idle');
    }
  };

  return (
    <section id="contact" className={cn("py-24 bg-black text-white", standalone && "pt-32 min-h-screen bg-black")}>
      <div className="max-w-7xl mx-auto px-6">
        {standalone && (
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase mb-12 text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to Home
          </button>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-24">
          <div>
            <h2 className="text-5xl font-serif font-bold mb-8">Get in Touch</h2>
            <p className="text-white/50 text-sm leading-relaxed tracking-wide mb-12">
              Whether you're planning a corporate retreat, a spiritual journey, or a private getaway, our team is here to assist you 24/7. Contact us today for a bespoke consultation.
            </p>
            
            <div className="space-y-8 mb-12">
              <a href="tel:+97141234567" className="flex items-center gap-6 group">
                <div className="w-12 h-12 bg-brand-gold/10 flex items-center justify-center rounded-full group-hover:bg-brand-gold/20 transition-all">
                  <Phone size={20} className="text-brand-gold" />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-1">Call Us 24/7</p>
                  <p className="text-sm font-bold group-hover:text-brand-gold transition-colors">+971 4 123 4567</p>
                </div>
              </a>
              <a href="mailto:ops@fortisny.co" className="flex items-center gap-6 group">
                <div className="w-12 h-12 bg-brand-gold/10 flex items-center justify-center rounded-full group-hover:bg-brand-gold/20 transition-all">
                  <Mail size={20} className="text-brand-gold" />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-1">Email Us</p>
                  <p className="text-sm font-bold group-hover:text-brand-gold transition-colors">ops@fortisny.co</p>
                </div>
              </a>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-brand-gold/10 flex items-center justify-center rounded-full">
                  <MapPin size={20} className="text-brand-gold" />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-1">Our Office</p>
                  <p className="text-sm font-bold">Dubai South, Business Park, UAE</p>
                </div>
              </div>
            </div>

            <div className="p-8 border border-white/5 bg-white/5 rounded-2xl">
              <h4 className="text-lg font-serif font-bold mb-4 text-brand-gold">Immediate Assistance?</h4>
              <p className="text-xs text-white/40 mb-6 leading-relaxed">Our concierge team is available around the clock to handle urgent travel requests and private charter bookings.</p>
              <div className="flex gap-4">
                <a href="mailto:ops@fortisny.co" className="flex-1 bg-brand-gold text-black text-center py-3 text-[10px] font-bold tracking-widest uppercase hover:opacity-90 transition-all">Email Now</a>
                <a href="https://wa.me/971566286377" target="_blank" rel="noopener noreferrer" className="flex-1 border border-brand-gold text-brand-gold text-center py-3 text-[10px] font-bold tracking-widest uppercase hover:bg-brand-gold/10 transition-all">WhatsApp</a>
              </div>
            </div>
          </div>

          <div className="bg-brand-white/5 p-12 border border-white/5 shadow-2xl">
            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-12"
              >
                <div className="w-20 h-20 gold-gradient text-black rounded-full flex items-center justify-center mb-8">
                  <ShieldCheck size={40} />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4">Message Received</h3>
                <p className="text-sm text-white/50 max-w-xs mx-auto">One of our team member will contact you shortly at the provided details.</p>
                <button onClick={() => setStatus('idle')} className="mt-12 text-[10px] font-bold tracking-[0.3em] uppercase border-b border-brand-gold pb-2 hover:text-brand-gold/60 transition-all">SEND ANOTHER ENQUIRY</button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold tracking-widest uppercase text-white/40">Full Name</label>
                  <input name="name" type="text" required placeholder="John Doe" className="w-full monochrome-input py-4 bg-white/5 border-white/10 text-white" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[9px] font-bold tracking-widest uppercase text-white/40">Mobile Number</label>
                  <div className="flex gap-4">
                    <select 
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="monochrome-input w-40 appearance-none text-center font-bold text-[10px] bg-white/5 border-white/10 text-white"
                    >
                      {COUNTRY_CODES.map(c => (
                        <option key={`${c.name}-${c.code}`} value={c.code} className="bg-black">{c.name} ({c.code})</option>
                      ))}
                    </select>
                    <input name="mobile" type="tel" required placeholder="50 123 4567" className="w-full monochrome-input py-4 bg-white/5 border-white/10 text-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold tracking-widest uppercase text-white/40">Email Address</label>
                  <input name="email" type="email" required placeholder="john@example.com" className="w-full monochrome-input py-4 bg-white/5 border-white/10 text-white" />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold tracking-widest uppercase text-white/40">Detailed Description</label>
                  <textarea name="description" rows={5} required placeholder="Tell us about your travel requirements..." className="w-full monochrome-input resize-none py-4 bg-white/5 border-white/10 text-white" />
                </div>

                <button 
                  disabled={status === 'loading'}
                  className="w-full gold-gradient text-black py-6 font-bold text-[10px] tracking-[0.4em] hover:opacity-90 transition-all disabled:opacity-50 shadow-xl"
                >
                  {status === 'loading' ? 'SENDING ENQUIRY...' : 'SUBMIT ENQUIRY'}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="w-full h-[400px] grayscale invert opacity-50 hover:grayscale-0 hover:invert-0 hover:opacity-100 transition-all duration-700">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115615.1584061612!2d55.03450375!3d24.8988647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f7267104f6477%3A0x67a3648f88998899!2sDubai%20South!5e0!3m2!1sen!2sae!4v1700000000000!5m2!1sen!2sae" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
};

const Footer = ({ setView }: { setView: (view: string) => void }) => {
  return (
    <footer className="bg-black text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
          <div className="col-span-1 md:col-span-1">
            <div className="flex justify-start mb-8">
              <Logo size="md" className="items-center md:items-start" />
            </div>
            <p className="text-xs text-white/40 leading-relaxed mb-8">
              The Fortis Travels & Tourism is a premier OTA aggregator providing bespoke travel solutions, luxury charters, and spiritual journeys globally.
            </p>
            <div className="flex gap-4">
              <Instagram size={18} className="text-white/40 hover:text-brand-gold cursor-pointer transition-colors" />
              <Facebook size={18} className="text-white/40 hover:text-brand-gold cursor-pointer transition-colors" />
              <Twitter size={18} className="text-white/40 hover:text-brand-gold cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div>
            <h4 className="text-[10px] font-bold tracking-widest uppercase mb-8 text-brand-gold">Quick Links</h4>
            <ul className="space-y-4 text-xs text-white/40">
              <li><a href="#" onClick={(e) => { e.preventDefault(); setView('home'); }} className="hover:text-brand-gold transition-colors">Home</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setView('about'); }} className="hover:text-brand-gold transition-colors">About Us</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setView('faq'); }} className="hover:text-brand-gold transition-colors">FAQs</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setView('contact'); }} className="hover:text-brand-gold transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold tracking-widest uppercase mb-8 text-brand-gold">Services</h4>
            <ul className="space-y-4 text-xs text-white/40">
              <li><a href="#" className="hover:text-brand-gold transition-colors">Umrah Packages</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Visa Services</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Car Rental</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Travel Insurance</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold tracking-widest uppercase mb-8 text-brand-gold">Newsletter</h4>
            <p className="text-xs text-white/40 mb-6">Subscribe for exclusive travel offers.</p>
            <div className="flex border-b border-brand-gold/20 pb-2">
              <input type="email" placeholder="Your email" className="bg-transparent text-xs outline-none flex-1" />
              <button className="text-[10px] font-bold tracking-widest text-brand-gold">JOIN</button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-white/20 tracking-widest">© 2026 THE FORTIS TRAVELS & TOURISM. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8 text-[10px] text-white/20 tracking-widest">
            <a href="#" className="hover:text-white">PRIVACY POLICY</a>
            <a href="#" className="hover:text-white">TERMS OF SERVICE</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const ServicePage = ({ service, currency, onBack, onInquire }: { service: string, currency: Currency, onBack: () => void, onInquire: () => void }) => {
  const serviceData: Record<string, { title: string, subtitle: string, description: string, packages: any[] }> = {
    'Umrah Packages': {
      title: 'Umrah Packages',
      subtitle: 'Spiritual Journeys Crafted with Excellence',
      description: 'Experience a seamless spiritual journey with our premium Umrah packages. We handle everything from visa processing to luxury accommodation in Mecca and Medina.',
      packages: [
        { name: 'Economy Umrah', duration: '15 Days', price: 1200, image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80', features: ['3 Star Hotels', 'Visa Processing', 'Shared Transport', 'Ziyarat Tours'] },
        { name: 'Premium Umrah', duration: '10 Days', price: 2500, image: 'https://images.unsplash.com/photo-1710695198971-3abdf7fcc82e?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', features: ['5 Star Hotels (Front Row)', 'Visa Processing', 'Private Transport', 'Buffet Breakfast'] },
        { name: 'VIP Umrah', duration: '7 Days', price: 4500, image: 'https://images.unsplash.com/photo-1624171156512-077b7a150e6c?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', features: ['Luxury Suites', 'VIP Visa Service', 'Luxury Car Transfers', 'Personal Guide'] },
      ]
    },
    'Visa Services': {
      title: 'Visa Services',
      subtitle: 'Global Mobility Made Simple',
      description: 'Our expert team provides comprehensive visa assistance for travelers worldwide. We ensure high success rates and fast processing times.',
      packages: [
        { name: 'UAE Tourist Visa', duration: '30 Days', price: 1000, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80', features: ['Single Entry', 'Online Processing', 'Insurance Included', '24/7 Support'] },
        { name: 'UAE Tourist Visa', duration: '60 Days', price: 1500, image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80', features: ['Single Entry', 'Extended Stay', 'Insurance Included', 'Fast Track'] },
        { name: 'Schengen Assistance', duration: 'Variable', price: 400, image: 'https://schengen.europ-assistance.com/sites/default/files/articles/pictures/shutterstock_248727709-min_4.jpg', features: ['Document Review', 'Appointment Booking', 'Interview Prep', 'Travel Itinerary'] },
        { name: 'B1/B2 USA Visa', duration: 'Variable', price: 400, image: 'https://kingswoodconsultancy.net/wp-content/uploads/elementor/thumbs/Visa-Support-2-q4dexo7y8q82n2a5k1dyqgx6h28bp90s8vrwdcd5q0.jpg', features: ['Document Review', 'Appointment Booking', 'Interview Prep', 'Travel Itinerary'] },
        { name: 'UK Visitor Visa', duration: 'Variable', price: 400, image: 'https://www.awsolicitors.co.uk/wp-content/uploads/2025/10/AWS-Blog-Your-Escape-Plan-From-Student-to-Skilled-Worker-12-1-1170x752.png', features: ['Document Review', 'Appointment Booking', 'Interview Prep', 'Travel Itinerary'] },
      ]
    },
    'Car Rental': {
      title: 'Car Rental',
      subtitle: 'Drive in Luxury and Comfort',
      description: 'Choose from our extensive fleet of vehicles, from practical economy cars to high-end supercars. Available for daily, weekly, or monthly rentals in the UAE.',
      packages: [
        { name: 'Economy Sedan', duration: 'Per Day', price: 150, image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80', features: ['Unlimited Mileage', 'Insurance Included', 'Free Delivery', '24/7 Roadside'] },
        { name: 'Luxury SUV', duration: 'Per Day', price: 350, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80', features: ['Chauffeur Available', 'Full Insurance', 'GPS Included', 'Premium Sound'] },
        { name: 'Supercar Experience', duration: 'Per Day', price: 2000, image: 'https://static.dezeen.com/uploads/2019/07/lotus-evija-car-design_dezeen_2364_sq-1-411x411.jpg', features: ['Ferrari/Lamborghini', 'Concierge Delivery', 'Track Day Options', 'VIP Support'] },
      ]
    },
    'Travel Insurance': {
      title: 'Travel Insurance',
      subtitle: 'Comprehensive Protection for Your Journey',
      description: 'Travel with peace of mind knowing you are protected against unforeseen events. Our insurance plans cover medical emergencies, trip cancellations, and more.',
      packages: [
        { name: 'Basic Cover', duration: 'Per Trip', price: 20, image: 'https://images.unsplash.com/photo-1454165833767-027ff33027ef?auto=format&fit=crop&w=800&q=80', features: ['Medical Emergencies', 'Baggage Loss', '24/7 Assistance', 'Global Coverage'] },
        { name: 'Family Plan', duration: 'Per Trip', price: 50, image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80', features: ['Up to 5 Members', 'Full Medical Cover', 'Trip Cancellation', 'Legal Assistance'] },
        { name: 'Adventure Sports', duration: 'Per Trip', price: 40, image: 'https://images.unsplash.com/photo-1533669952390-d1eb163024fd?auto=format&fit=crop&w=800&q=80', features: ['Extreme Sports Cover', 'Search & Rescue', 'Equipment Insurance', 'High Altitude Cover'] },
      ]
    },
    'Meet & Greet': {
      title: 'Meet & Greet',
      subtitle: 'VIP Airport Assistance',
      description: 'Skip the queues and enjoy a stress-free airport experience. Our professional staff will assist you from the moment you arrive until you reach your destination.',
      packages: [
        { name: 'Bronze Service', duration: 'Arrival', price: 50, image: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&w=800&q=80', features: ['Personal Welcome', 'Baggage Assistance', 'Porter Service', 'Escort to Vehicle'] },
        { name: 'Silver Service', duration: 'Arrival/Departure', price: 100, image: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=800&q=80', features: ['Fast Track Immigration', 'Lounge Access', 'Priority Boarding', 'Personal Assistant'] },
        { name: 'Gold VIP', duration: 'Full Service', price: 250, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', features: ['Private VIP Terminal', 'Limousine Transfer', 'Gourmet Dining', 'Personal Concierge'] },
      ]
    },
    'Holiday Packages': {
      title: 'Holiday Packages',
      subtitle: 'Unforgettable Global Adventures',
      description: 'Discover the world with our meticulously planned holiday packages. From tropical paradises to cultural landmarks, we offer experiences that last a lifetime.',
      packages: [
        { name: 'Swiss Alps Escape', duration: '7 Days', price: 1800, image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80', features: ['Luxury Chalet', 'Ski Passes', 'Private Transfers', 'Gourmet Dining'] },
        { name: 'Maldives Retreat', duration: '5 Days', price: 2200, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80', features: ['Overwater Villa', 'All-Inclusive', 'Seaplane Transfer', 'Spa Treatments'] },
        { name: 'Parisian Romance', duration: '4 Days', price: 1500, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80', features: ['Boutique Hotel', 'Eiffel Tower Dinner', 'Private City Tour', 'Seine Cruise'] },
      ]
    },
    'UAE Attractions': {
      title: 'UAE Attractions',
      subtitle: 'Experience the Best of the Emirates',
      description: 'Explore the wonders of the UAE with our exclusive attraction tickets and tours. From the heights of Burj Khalifa to the sands of the desert.',
      packages: [
        { name: 'Burj Khalifa VIP', duration: 'Half Day', price: 150, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80', features: ['Level 148 Access', 'Skip the Line', 'Refreshments', 'Personal Guide'] },
        { name: 'Desert Safari', duration: 'Full Day', price: 80, image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=800&q=80', features: ['Dune Bashing', 'BBQ Dinner', 'Camel Riding', 'Belly Dance Show'] },
        { name: 'Ferrari World', duration: 'Full Day', price: 120, image: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&w=800&q=80', features: ['All Rides Access', 'Fast Track', 'Transfer Included', 'F1 Experience'] },
      ]
    },
    'Private Charter': {
      title: 'Private Charter',
      subtitle: 'VIP Transportation Without Limits',
      description: 'Experience the ultimate in privacy and convenience with our bespoke charter services. From private jets to luxury yachts and helicopters, we provide elite transportation tailored to your schedule.',
      packages: [
        { name: 'Light Jet', duration: 'Per Hour', price: 3500, image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80', features: ['Up to 6 Passengers', 'VIP Catering', 'Fast Boarding', 'Global Reach'] },
        { name: 'Luxury Yacht', duration: 'Per Day', price: 8500, image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=800&q=80', features: ['80ft Superyacht', 'Full Crew & Chef', 'Water Sports Gear', 'Sunset Cruises'] },
        { name: 'Helicopter Charter', duration: 'Per Flight', price: 1200, image: 'https://images.unsplash.com/photo-1533669952390-d1eb163024fd?auto=format&fit=crop&w=800&q=80', features: ['City Skyline Tours', 'Airport Transfers', 'VIP Landing Access', 'Panoramic Views'] },
        { name: 'Heavy Jet', duration: 'Per Hour', price: 12000, image: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&w=800&q=80', features: ['Up to 16 Passengers', 'Sleeping Berths', 'Global Connectivity', 'Ultimate Luxury'] },
        { name: 'Luxury Chauffeur', duration: 'Per Day', price: 500, image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80', features: ['Rolls Royce / Maybach', 'Professional Chauffeur', 'VIP Airport Pickup', '24/7 Availability'] },
      ]
    }
  };

  const data = serviceData[service] || {
    title: service,
    subtitle: 'Premium Travel Services',
    description: 'Experience the best in global travel with our bespoke services tailored to your needs.',
    packages: []
  };

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase mb-12 text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to Home
        </button>

        <div className="max-w-3xl mb-16">
          <h1 className="text-5xl font-serif font-bold mb-4 text-white">{data.title}</h1>
          <p className="text-xl text-white/60 font-light mb-6">{data.subtitle}</p>
          <p className="text-sm text-white/50 leading-relaxed max-w-2xl">{data.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.packages.map((pkg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-brand-white/5 group cursor-pointer border border-white/5 hover:border-brand-gold/30 transition-all duration-500"
            >
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={pkg.image} 
                  alt={pkg.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-brand-gold text-black px-4 py-2 text-[10px] font-bold tracking-widest uppercase">
                  {currency} {pkg.price}
                </div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold mb-1 text-white">{pkg.name}</h3>
                    <p className="text-[10px] text-white/40 font-bold tracking-widest uppercase">{pkg.duration}</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature: string, fIdx: number) => (
                    <li key={fIdx} className="flex items-center gap-3 text-[10px] text-white/60 font-medium uppercase tracking-wider">
                      <div className="w-1 h-1 bg-brand-gold rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={onInquire}
                  className="w-full gold-gradient text-black py-4 text-[10px] font-bold tracking-widest uppercase hover:opacity-90 transition-all"
                >
                  Inquire Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SearchResults = ({ currency, params, type, onBack, onInquire }: { currency: Currency, params: any, type: 'flights' | 'hotels', onBack: () => void, onInquire: () => void }) => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = io();
    setSocket(s);

    s.on('sync_update', (update) => {
      if (update.type === 'PRICE_UPDATE') {
        setResults(prev => prev.map(item => 
          item.id === update.data.id ? { ...item, price: update.data.newPrice, isLastSeat: update.data.isLastSeat } : item
        ));
      }
    });

    // Simulate fetching results
    setTimeout(() => {
      const mockResults = type === 'flights' ? [
        { id: 1, airline: 'Emirates', from: params.origin.split(' - ')[0], to: params.destination.split(' - ')[0], price: 2450, duration: '7h 15m', departure: '10:30 AM', arrival: '02:45 PM', isLastSeat: false },
        { id: 2, airline: 'British Airways', from: params.origin.split(' - ')[0], to: params.destination.split(' - ')[0], price: 2100, duration: '7h 45m', departure: '08:15 AM', arrival: '12:00 PM', isLastSeat: true },
        { id: 3, airline: 'Qatar Airways', from: params.origin.split(' - ')[0], to: params.destination.split(' - ')[0], price: 1950, duration: '9h 30m', departure: '11:00 AM', arrival: '05:30 PM', isLastSeat: false },
      ] : [
        { id: 1, name: 'The Ritz-Carlton', location: params.destination, price: 1800, rating: 4.9, reviews: 1240, image: 'https://picsum.photos/seed/ritz/400/300', isLastSeat: false },
        { id: 2, name: 'Savoy Hotel', location: params.destination, price: 1550, rating: 4.8, reviews: 890, image: 'https://picsum.photos/seed/savoy/400/300', isLastSeat: true },
        { id: 3, name: 'Shangri-La The Shard', location: params.destination, price: 2100, rating: 4.9, reviews: 2100, image: 'https://picsum.photos/seed/shangri/400/300', isLastSeat: false },
      ];
      setResults(mockResults);
      setLoading(false);
    }, 1500);

    return () => {
      s.disconnect();
    };
  }, [type, params]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-2 border-brand-gold border-t-transparent rounded-full mb-6"
        />
        <p className="text-[10px] font-bold tracking-[0.4em] uppercase animate-pulse text-white/40">Searching Global GDS...</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-white/40 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft size={14} /> Back to Search
            </button>
            <h2 className="text-4xl font-serif font-bold mb-2 text-white">Available {type === 'flights' ? 'Flights' : 'Hotels'}</h2>
            <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
              {type === 'flights' ? `${params.origin} to ${params.destination}` : params.destination} • {format(params.dates.from, 'dd MMM')}
              {params.dates.to && ` - ${format(params.dates.to, 'dd MMM')}`}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {results.map((item) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={item.id}
              className="bg-brand-white/5 border border-white/5 p-8 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-brand-gold/30 transition-all group"
            >
              {type === 'flights' ? (
                <>
                  <div className="flex items-center gap-6 flex-1">
                    <div className="w-16 h-16 bg-white/5 flex items-center justify-center">
                      <Plane size={24} className="text-brand-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{item.airline}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{params.cabinClass} • {item.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-12 flex-[2] justify-center">
                    <div className="text-center">
                      <p className="text-xl font-bold text-white">{item.departure}</p>
                      <p className="text-[10px] font-bold text-white/40">{item.from}</p>
                    </div>
                    <div className="flex-1 h-[1px] bg-white/10 relative min-w-[100px]">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-2">
                        <Plane size={12} className="text-brand-gold" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-white">{item.arrival}</p>
                      <p className="text-[10px] font-bold text-white/40">{item.to}</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-6 flex-1">
                    <img src={item.image} alt={item.name} className="w-48 h-32 object-cover grayscale group-hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
                    <div>
                      <p className="text-sm font-bold text-white">{item.name}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{item.location} • {item.rating} ★ ({item.reviews} reviews)</p>
                    </div>
                  </div>
                </>
              )}
              <div className="text-right min-w-[200px]">
                <div className="flex items-center gap-2 justify-end mb-1">
                  {item.isLastSeat && (
                    <span className="bg-red-500 text-white text-[8px] font-bold px-2 py-1 uppercase tracking-widest animate-pulse">
                      Last Seat
                    </span>
                  )}
                  <p className="text-2xl font-bold text-white">{currency} {item.price}</p>
                </div>
                <p className="text-[9px] text-white/40 uppercase tracking-widest mb-4">Total per person</p>
                <button 
                  onClick={onInquire}
                  className="bg-brand-gold text-black w-full py-3 text-[10px] font-bold tracking-widest uppercase hover:opacity-90 transition-all"
                >
                  Inquire Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const FAQPage = ({ onBack }: { onBack: () => void }) => {
  const faqs = [
    {
      question: 'What types of travel packages do you offer?',
      answer: 'We offer a wide range of packages including luxury vacations, spiritual journeys like Umrah, bespoke holiday packages, and private charters. We also provide services like visa assistance, car rentals, and travel insurance.',
    },
    {
      question: 'How do I book a package?',
      answer: 'You can book a package through our website by using the search functionality and following the on-screen instructions. For bespoke packages or special requirements, please contact our support team directly.',
    },
    {
      question: 'Can I customize my travel package?',
      answer: 'Absolutely. We specialize in creating bespoke travel experiences. Contact us with your requirements, and our travel experts will help you design your perfect trip.',
    },
    {
      question: 'What is your cancellation policy?',
      answer: 'Cancellation policies vary depending on the package and services booked. Please refer to the terms and conditions of your specific booking or contact our customer service for detailed information.',
    },
    {
      question: 'Do you offer travel insurance?',
      answer: 'Yes, we offer comprehensive travel insurance options to ensure you are covered during your trip. You can add travel insurance to your package during the booking process.',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-40 bg-brand-white dark:bg-brand-black">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold font-serif gold-text-gradient mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-white/60">Find answers to common questions about our services and booking process.</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-white/10 pb-4">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center text-left py-4"
              >
                <span className="text-xl font-semibold text-white">{faq.question}</span>
                <ChevronDown className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: '1rem' }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-white/70 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        <div className="text-center mt-16">
            <button 
              onClick={onBack}
              className="gold-gradient text-black px-12 py-4 text-sm font-bold tracking-[0.2em] uppercase hover:opacity-90 transition-all shadow-lg"
            >
              Back to Home
            </button>
        </div>
      </div>
    </section>
  );
};

const WhatsAppButton = () => {
  return (
    <motion.a
      href="https://wa.me/971566286377"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.5, x: 50 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-8 right-8 z-[100] flex items-center gap-3 gold-gradient text-black px-6 py-4 rounded-full shadow-2xl hover:opacity-90 transition-all group"
    >
      <div className="relative">
        <MessageCircle size={20} fill="black" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-black border-2 border-brand-gold rounded-full animate-pulse" />
      </div>
      <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Let's Talk</span>
    </motion.a>
  );
};

export default function App() {
  const [currency, setCurrency] = useState<Currency>('AED');
  const [view, setView] = useState<'home' | 'search' | string>('home');
  const [searchParams, setSearchParams] = useState<any>(null);
  const [searchType, setSearchType] = useState<'flights' | 'hotels'>('flights');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSearch = (type: 'flights' | 'hotels', params: any) => {
    setSearchType(type);
    setSearchParams(params);
    setView('search');
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    if (view === 'home') {
      return (
        <motion.div 
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Hero onSearch={handleSearch} />
          <ServiceGrid setView={setView} />
          <HotDestinations onInquire={() => setView('contact')} />
          <PaymentSection />
          <ContactSection />
        </motion.div>
      );
    }

    if (view === 'search') {
      return (
        <motion.div 
          key="search"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <SearchResults 
            currency={currency} 
            type={searchType} 
            params={searchParams} 
            onBack={() => setView('home')} 
            onInquire={() => setView('contact')}
          />
        </motion.div>
      );
    }

    if (view === 'about') {
      return (
        <motion.div 
          key="about"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <AboutUs onBack={() => setView('home')} />
        </motion.div>
      );
    }

    if (view === 'contact') {
      return (
        <motion.div 
          key="contact"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <ContactSection standalone onBack={() => setView('home')} />
        </motion.div>
      );
    }

    if (view === 'faq') {
      return (
        <motion.div
          key="faq"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <FAQPage onBack={() => setView('home')} />
        </motion.div>
      );
    }

    if (view.startsWith('service-')) {
      const serviceName = view.replace('service-', '');
      return (
        <motion.div 
          key={view}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <ServicePage 
            service={serviceName} 
            currency={currency} 
            onBack={() => setView('home')} 
            onInquire={() => setView('contact')}
          />
        </motion.div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen">
      <Header 
        currency={currency} 
        setCurrency={setCurrency} 
        setView={setView} 
        view={view}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      
      <AnimatePresence mode="wait">
        {renderView()}
      </AnimatePresence>

      <Footer setView={setView} />
      <WhatsAppButton />
    </div>
  );
}
