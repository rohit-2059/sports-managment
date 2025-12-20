import { useState, useEffect } from "react";

const Header = ({ onSwitchToLogin, onSwitchToRegister }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isScrollingUp, setIsScrollingUp] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const [isOnPricing, setIsOnPricing] = useState(false);

    useEffect(() => {
        let ticking = false;

        const updateScrollState = () => {
            const scrollY = window.scrollY;

            if (scrollY > lastScrollY && scrollY > 80) {
                setIsScrollingUp(false);
                setIsScrolled(true);
            } else if (scrollY < lastScrollY) {
                setIsScrollingUp(true);
                if (scrollY <= 80) {
                    setIsScrolled(false);
                }
            }

            setLastScrollY(scrollY);
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollState);
                ticking = true;
            }
        };

        const handleScroll = () => requestTick();

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        const updateActiveSection = () => {
            const sections = ['home', 'features', 'pricing', 'testimonials', 'faq', 'contact'];
            const scrollPosition = window.scrollY + 100;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const offsetTop = element.offsetTop;
                    const offsetBottom = offsetTop + element.offsetHeight;

                    if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
                        setActiveSection(section);
                        // Set pricing state when on pricing section
                        setIsOnPricing(section === 'pricing');
                        break;
                    }
                }
            }

            if (window.scrollY < 100) {
                setActiveSection('home');
                setIsOnPricing(false);
            }
        };

        const handleScrollForSection = () => {
            requestAnimationFrame(updateActiveSection);
        };

        window.addEventListener('scroll', handleScrollForSection, { passive: true });
        updateActiveSection();

        return () => window.removeEventListener('scroll', handleScrollForSection);
    }, []);

    // Dynamic width classes for scroll animation
    let widthClasses = '';
    if (!isScrolled) {
        // At top - full width
        widthClasses = 'w-[95%] sm:w-[90%] lg:w-[85%] max-w-7xl';
    } else if (isScrollingUp) {
        // Scrolling up - expand
        widthClasses = 'w-[95%] sm:w-[90%] lg:w-[85%] max-w-7xl';
    } else {
        // Scrolling down - compact
        widthClasses = 'w-[90%] sm:w-[80%] lg:w-[60%] max-w-4xl';
    }

    return (
        <>
            {/* Floating Animated Header Container */}
            <header className={`fixed left-1/2 -translate-x-1/2 top-4 sm:top-6 z-50 transition-all duration-500 ease-in-out rounded-full ${widthClasses} ${
                isOnPricing
                    ? 'bg-white/95 backdrop-blur-md shadow-lg border border-gray-200'
                    : isScrolled
                        ? 'bg-background/95 backdrop-blur-md shadow-lg border border-border/40'
                        : 'bg-background/80 backdrop-blur-sm shadow-md border border-border/20'
                }`}>
                {/* Subtle gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-transparent pointer-events-none rounded-full"></div>

                <div className="relative px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14 sm:h-16">
                        {/* Logo - Enhanced Visual Hierarchy */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <img 
                                    src="/src/assets/sports.png" 
                                    alt="SportsPro" 
                                    className={`w-8 h-8 sm:w-9 sm:h-9 object-contain transition-all duration-500 ${
                                        isOnPricing ? '' : 'invert brightness-0 contrast-200'
                                    }`}
                                />
                                <span className={`text-lg sm:text-xl font-bold tracking-tight transition-colors duration-500 ${
                                    isOnPricing ? 'text-black' : 'text-foreground'
                                }`}>
                                    SportsPro
                                </span>
                            </div>
                        </div>

                        {/* Desktop Navigation - Improved Spacing & Clarity */}
                        <nav className="hidden md:flex items-center gap-1">
                            <a
                                href="#home"
                                className={`relative px-3 lg:px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
                                    activeSection === 'home'
                                        ? isOnPricing
                                            ? 'text-black bg-gray-100'
                                            : 'text-foreground bg-accent/50'
                                        : isOnPricing
                                            ? 'text-gray-700 hover:text-black hover:bg-gray-50'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'
                                }`}
                            >
                                Home
                                {activeSection === 'home' && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
                                )}
                            </a>
                            <a
                                href="#features"
                                className={`relative px-3 lg:px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
                                    activeSection === 'features'
                                        ? isOnPricing
                                            ? 'text-black bg-gray-100'
                                            : 'text-foreground bg-accent/50'
                                        : isOnPricing
                                            ? 'text-gray-700 hover:text-black hover:bg-gray-50'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'
                                }`}
                            >
                                Features
                                {activeSection === 'features' && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
                                )}
                            </a>
                            <a
                                href="#pricing"
                                className={`relative px-3 lg:px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
                                    activeSection === 'pricing'
                                        ? isOnPricing
                                            ? 'text-black bg-gray-100'
                                            : 'text-foreground bg-accent/50'
                                        : isOnPricing
                                            ? 'text-gray-700 hover:text-black hover:bg-gray-50'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'
                                }`}
                            >
                                Pricing
                                {activeSection === 'pricing' && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
                                )}
                            </a>
                            <a
                                href="#testimonials"
                                className={`relative px-3 lg:px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
                                    activeSection === 'testimonials'
                                        ? isOnPricing
                                            ? 'text-black bg-gray-100'
                                            : 'text-foreground bg-accent/50'
                                        : isOnPricing
                                            ? 'text-gray-700 hover:text-black hover:bg-gray-50'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'
                                }`}
                            >
                                Testimonials
                                {activeSection === 'testimonials' && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
                                )}
                            </a>
                            <a
                                href="#faq"
                                className={`relative px-3 lg:px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
                                    activeSection === 'faq'
                                        ? isOnPricing
                                            ? 'text-black bg-gray-100'
                                            : 'text-foreground bg-accent/50'
                                        : isOnPricing
                                            ? 'text-gray-700 hover:text-black hover:bg-gray-50'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'
                                }`}
                            >
                                FAQ
                                {activeSection === 'faq' && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
                                )}
                            </a>
                            <a
                                href="#contact"
                                className={`relative px-3 lg:px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
                                    activeSection === 'contact'
                                        ? isOnPricing
                                            ? 'text-black bg-gray-100'
                                            : 'text-foreground bg-accent/50'
                                        : isOnPricing
                                            ? 'text-gray-700 hover:text-black hover:bg-gray-50'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'
                                }`}
                            >
                                Contact
                                {activeSection === 'contact' && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
                                )}
                            </a>
                        </nav>

                        {/* Mobile Navigation */}
                        <nav className="flex md:hidden items-center gap-1 flex-1 justify-center mx-4">
                            <a
                                href="#home"
                                className={`px-2 py-1.5 text-xs font-medium transition-colors rounded ${activeSection === 'home'
                                    ? 'text-foreground bg-accent/50'
                                    : 'text-muted-foreground'
                                    }`}
                            >
                                Home
                            </a>
                            <a
                                href="#features"
                                className={`px-2 py-1.5 text-xs font-medium transition-colors rounded ${activeSection === 'features'
                                    ? 'text-foreground bg-accent/50'
                                    : 'text-muted-foreground'
                                    }`}
                            >
                                Features
                            </a>
                            <a
                                href="#pricing"
                                className={`px-2 py-1.5 text-xs font-medium transition-colors rounded ${activeSection === 'pricing'
                                    ? 'text-foreground bg-accent/50'
                                    : 'text-muted-foreground'
                                    }`}
                            >
                                Pricing
                            </a>
                            <a
                                href="#faq"
                                className={`px-2 py-1.5 text-xs font-medium transition-colors rounded ${activeSection === 'faq'
                                    ? 'text-foreground bg-accent/50'
                                    : 'text-muted-foreground'
                                    }`}
                            >
                                FAQ
                            </a>
                        </nav>

                        {/* Auth Buttons - Clean Outline Style */}
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                            {/* Sign In - Primary Button */}
                            <button 
                                onClick={onSwitchToLogin}
                                className={`hidden sm:inline-flex items-center px-6 py-2.5 text-sm font-semibold transition-all duration-300 rounded-full shadow-md hover:shadow-xl hover:scale-105 ${
                                    isOnPricing
                                        ? 'text-white bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700'
                                        : 'text-black bg-gradient-to-r from-white to-gray-100 hover:from-gray-100 hover:to-white'
                                }`}
                            >
                                Sign In
                            </button>

                            {/* Register - Primary Button */}
                            <button 
                                onClick={onSwitchToRegister}
                                className={`inline-flex items-center px-6 py-2.5 text-sm font-semibold transition-all duration-300 rounded-full shadow-md hover:shadow-xl hover:scale-105 ${
                                    isOnPricing
                                        ? 'text-white bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700'
                                        : 'text-black bg-gradient-to-r from-white to-gray-100 hover:from-gray-100 hover:to-white'
                                }`}
                            >
                                Register
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Spacer to prevent content from going under fixed header */}
            <div className="h-16 sm:h-20"></div>
        </>
    );
};

export default Header;
