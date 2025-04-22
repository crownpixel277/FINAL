'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, User, Mail, Calendar, Shield, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  email: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('No token found, redirecting to login');
          router.push('/login');
          return;
        }

        console.log('Token found, length:', token.length);
        console.log('First 10 chars of token:', token.substring(0, 10) + '...');

        setIsLoading(true);
        // Fetch user data from the profile API
        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Profile API response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Profile API error:', errorData);
          throw new Error(errorData.error || 'Failed to fetch profile');
        }

        const userData = await response.json();
        console.log('Profile data received:', userData);
        
        // Make sure we have a valid user object
        if (!userData || !userData.id) {
          console.error('Invalid user data received:', userData);
          throw new Error('Invalid user data received');
        }
        
        setUser(userData);
        setNewEmail(userData.email);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load profile. Please try again.');
        toast({
          title: "Error loading profile",
          description: "There was a problem loading your profile. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [router, toast]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      console.log('Updating profile with email:', newEmail);
      
      // Call the API to update the user's email
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: newEmail
        })
      });

      console.log('Update profile response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Update profile error:', errorData);
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      console.log('Updated user data:', updatedUser);
      
      setUser(updatedUser);
      setSuccess(true);
      
      toast({
        title: "Profile updated!",
        description: "Your profile has been updated successfully.",
      });
      
      // Exit editing mode
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <div className="flex space-x-2 items-center">
          <ThemeToggle />
          <Button variant="outline" onClick={() => router.push('/dashboard')}>Dashboard</Button>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6 flex items-center">
          <CheckCircle2 className="mr-2 h-5 w-5" />
          Your profile has been updated successfully.
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="bg-primary text-primary-foreground rounded-full p-3">
              <User size={24} />
            </div>
            <div>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Manage your account details and preferences</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!isEditing ? (
            <>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Address
                </div>
                <div className="font-medium">{user?.email}</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Account Created
                </div>
                <div className="font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  Account Type
                </div>
                <div className="font-medium">Free Tier</div>
              </div>
            </>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
        
        {!isEditing && (
          <CardFooter>
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          </CardFooter>
        )}
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>Manage your password and security settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">Change Password</Button>
        </CardContent>
      </Card>
      
      <div className="mt-6 text-sm text-muted-foreground text-center">
        <p>
          Your account information:
        </p>
        <ul className="mt-2 list-disc list-inside">
          <li>ID: {user?.id}</li>
          <li>Email: {user?.email}</li>
          <li>Created: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</li>
        </ul>
      </div>
    </div>
  );
} 