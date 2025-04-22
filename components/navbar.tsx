'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Paths where this navbar should be completely hidden
const HIDDEN_NAVBAR_PATHS = ['/dashboard', '/profile'];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitial, setUserInitial] = useState('U');

  useEffect(() => {
    // Client-side check for token
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    if (token) {
       try {
         // Basic decode to get initial (avoid full profile fetch here)
         const base64Url = token.split('.')[1];
         const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
         const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
           return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
         }).join(''));
         const payload = JSON.parse(jsonPayload);
         // Attempt to get email from payload, fallback to 'U'
         const email = payload.email; 
         if (email && typeof email === 'string' && email.length > 0) {
             setUserInitial(email[0].toUpperCase());
         }
       } catch (error) {
         console.error("Error decoding token for navbar initial:", error);
         // Keep default initial
       }
    }
  }, [pathname]);

  // Determine if the navbar should be shown AT ALL
  // We hide it completely on dashboard/profile
  const shouldShowNavbar = !HIDDEN_NAVBAR_PATHS.some(path => pathname.startsWith(path));

  // If the path matches dashboard/profile, render nothing
  if (!shouldShowNavbar) {
    return null;
  }
  
  // Specific logic for login/register pages (maybe minimal/no navbar)
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
      // Optionally render a very minimal navbar or null
      // For now, let's render null to be consistent with HIDDEN_NAVBAR_PATHS approach
      return null; 
  }

  // Determine if we're on the home page for different link logic
  const isHomePage = pathname === '/';

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    
    // Always remove local token first
    localStorage.removeItem('token');
    setIsLoggedIn(false); // Update local state immediately

    // Call the server logout endpoint
    if (token) {
      try {
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
          }
        });

        if (!response.ok) {
          console.error('Server logout failed:', await response.text());
          // Optionally show error toast
           toast({ title: "Logout Error", description: "Could not clear server session. Proceeding with client logout.", variant: "destructive" });
        } else {
          console.log('Server session cleared successfully.');
        }
      } catch (error) {
        console.error('Error calling logout API:', error);
        // Optionally show error toast
         toast({ title: "Logout Error", description: "Network error during logout. Proceeding with client logout.", variant: "destructive" });
      }
    }

    // Show success toast and redirect to home page
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    router.push('/'); // Redirect to home page
  };

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold">
              DeepFake Detection
            </Link>
            <div className="hidden md:flex gap-6">
              {isLoggedIn && isHomePage ? (
                 // Logged-in user on Home page
                 <Button variant="ghost" onClick={() => router.push('/dashboard')}>
                    Go to Dashboard
                 </Button>
              ) : (
                 // Public links (not logged in or not on home page)
                 <>
                    <Link
                      href={isHomePage ? '#features' : '/#features'}
                      className={`text-sm font-medium transition-colors hover:text-primary text-muted-foreground`}
                    >
                      Features
                    </Link>
                    <Link
                      href={isHomePage ? '#awareness' : '/#awareness'}
                      className={`text-sm font-medium transition-colors hover:text-primary text-muted-foreground`}
                    >
                      Cyber Awareness
                    </Link>
                    <Link
                      href={isHomePage ? '#how-it-works' : '/#how-it-works'}
                      className={`text-sm font-medium transition-colors hover:text-primary text-muted-foreground`}
                    >
                      How It Works
                    </Link>
                 </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {isLoggedIn ? (
              // Show Avatar and Logout for logged-in users
              <>
                <Button variant="ghost" size="icon" onClick={() => router.push('/profile')} title="Go to Profile">
                    <Avatar className="h-8 w-8"> 
                      <AvatarImage src="" /> 
                      <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                     <span className="sr-only">Go to Profile</span>
                </Button>
                <Button variant="outline" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              // Show Login/Register for logged-out users
              <>
                <Button variant="outline" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 