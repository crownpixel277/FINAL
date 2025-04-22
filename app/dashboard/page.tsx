'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Shield, Upload, History, Settings, User, AlertCircle, Image, Mail, Link as LinkIcon, 
         Mic, Video, ChevronRight, BarChart, Clock, Check, X, RefreshCw, FileText, Loader2, Home } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

// Mock data for demonstrations
const mockHistory = [
  { id: 1, type: 'image', filename: 'profile_photo.jpg', status: 'real', date: '2023-06-15' },
  { id: 2, type: 'video', filename: 'interview.mp4', status: 'fake', date: '2023-06-12' },
  { id: 3, type: 'url', filename: 'https://example.com/news', status: 'real', date: '2023-06-10' },
];

type AnalysisResult = {
  status: 'real' | 'fake' | 'error' | null;
  message?: string;
  confidence?: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [tokenError, setTokenError] = useState(false);
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [uploadType, setUploadType] = useState('image');
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>({ status: null });
  const [showCompletionToast, setShowCompletionToast] = useState(false);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('No token found in dashboard, redirecting to login');
      router.push('/login');
      return;
    }
    
    console.log('Token found in dashboard, length:', token.length);
    
    // Attempt to decode the token to extract basic user info
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);
      console.log('Token payload userId:', payload.userId);
      setUserId(payload.userId || '');
      
      // Fetch basic user info
      fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          console.log('Profile data in dashboard:', data);
          setEmail(data.email || '');
        } else {
          console.error('Failed to fetch profile in dashboard:', await res.text());
          setTokenError(true);
        }
      }).catch(err => {
        console.error('Error fetching profile in dashboard:', err);
        setTokenError(true);
      });
      
    } catch (err) {
      console.error('Error decoding token:', err);
      setTokenError(true);
    }
    
    setIsLoading(false);
  }, [router]);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    
    // Always remove local token first
    localStorage.removeItem('token');

    // Optionally call the server logout endpoint
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
          // Log error but proceed with client-side logout anyway
          console.error('Server logout failed:', await response.text());
          // Optionally show a specific error toast here if server state is critical
          // toast({ title: "Logout Error", description: "Could not clear server session.", variant: "destructive" });
        } else {
          console.log('Server session cleared successfully.');
        }
      } catch (error) {
        console.error('Error calling logout API:', error);
        // Optionally show a network error toast
        // toast({ title: "Logout Error", description: "Network error during logout.", variant: "destructive" });
      }
    }

    // Show success toast and redirect to home page
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    router.push('/'); // Redirect to home page
  };
  
  const handleResetProfile = () => {
    localStorage.removeItem('token');
    toast({
      title: "Profile reset",
      description: "Please login again to reset your profile session.",
    });
    router.push('/login');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setAnalysisResult({ status: null });
      console.log('File selected:', event.target.files[0].name);
    }
  };

  const triggerFileInput = (type: 'image' | 'video' | 'audio' | 'email') => {
    setAnalysisResult({ status: null });
    setSelectedFile(null);
    switch (type) {
      case 'image': imageInputRef.current?.click(); break;
      case 'video': videoInputRef.current?.click(); break;
      case 'audio': audioInputRef.current?.click(); break;
      case 'email': emailInputRef.current?.click(); break;
    }
  };

  const startAnalysis = () => {
    if (!selectedFile && uploadType !== 'url') {
      toast({
        title: "No file selected",
        description: `Please select a ${uploadType} file first.`,
        variant: "destructive"
      });
      return;
    }
    
    if (uploadType === 'url') {
      const urlInput = document.getElementById('url-input') as HTMLInputElement;
      if (!urlInput || !urlInput.value.startsWith('http')) {
         toast({
            title: "Invalid URL",
            description: "Please enter a valid URL.",
            variant: "destructive"
          });
         return;
      }
    }

    setIsUploading(true);
    setProgress(0);
    setAnalysisResult({ status: null });

    const interval = setInterval(() => {
      setProgress(prev => {
        const nextProgress = prev + Math.random() * 10;
        if (nextProgress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          const randomStatus = Math.random() > 0.4 ? 'real' : 'fake';
          const randomConfidence = Math.random() * 0.4 + 0.6;
          setAnalysisResult({ 
            status: randomStatus, 
            confidence: Math.round(randomConfidence * 100),
            message: randomStatus === 'real' ? 'Appears authentic' : 'Potential manipulation detected'
          });
          setShowCompletionToast(true);
          return 100;
        }
        return Math.min(nextProgress, 100);
      });
    }, 250);
  };
  
  useEffect(() => {
    if (showCompletionToast) {
      toast({
        title: "Analysis Complete",
        description: `Finished analyzing ${selectedFile?.name || 'URL'}.`,
      });
      setShowCompletionToast(false);
    }
  }, [showCompletionToast, toast, selectedFile, uploadType]);
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <motion.h1 
          className="text-3xl font-bold"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          DeepFake Detection Dashboard
        </motion.h1>
        <div className="flex space-x-2 items-center">
          <Button variant="outline" size="icon" asChild> 
             <Link href="/">
               <Home className="h-[1.2rem] w-[1.2rem]" />
               <span className="sr-only">Go to Home</span>
             </Link>
           </Button>
          <ThemeToggle />
          <Button variant="outline" onClick={() => router.push('/profile')}>My Profile</Button>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </div>
      
      {tokenError && (
        <motion.div 
          className="bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 p-4 rounded-md mb-6 flex items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AlertCircle className="mr-2 h-5 w-5" />
          <div>
            <p className="font-semibold">Profile access issue detected</p>
            <p className="text-sm">We're having trouble accessing your profile. This could be due to an expired session.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 bg-amber-100 dark:bg-amber-900 hover:bg-amber-200 dark:hover:bg-amber-800"
              onClick={handleResetProfile}
            >
              Reset Session
            </Button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.01 }}
        >
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>DeepFake Detection</CardTitle>
              <CardDescription>Upload media or provide a URL to check for manipulation</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <Tabs defaultValue="image" className="w-full" onValueChange={(value) => { setUploadType(value); setSelectedFile(null); setAnalysisResult({status: null}); }}>
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 mb-4">
                  <TabsTrigger value="image" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Image className="h-4 w-4" /> Image</TabsTrigger>
                  <TabsTrigger value="video" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Video className="h-4 w-4" /> Video</TabsTrigger>
                  <TabsTrigger value="audio" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Mic className="h-4 w-4" /> Audio</TabsTrigger>
                  <TabsTrigger value="url" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><LinkIcon className="h-4 w-4" /> URL</TabsTrigger>
                  <TabsTrigger value="email" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Mail className="h-4 w-4" /> Email</TabsTrigger>
                </TabsList>

                <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
                <input ref={audioInputRef} type="file" accept="audio/*" className="hidden" onChange={handleFileChange} />
                <input ref={emailInputRef} type="file" accept=".eml,.msg" className="hidden" onChange={handleFileChange} />

                {['image', 'video', 'audio', 'email'].map((type) => (
                  <TabsContent key={type} value={type} className="mt-0">
                    <motion.div 
                      className={cn(
                        "border-2 border-dashed rounded-lg p-6 text-center relative min-h-[250px] flex flex-col items-center justify-center transition-colors duration-300",
                        isUploading && "border-primary/50",
                        selectedFile && uploadType === type && "border-primary"
                      )}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {type === 'image' && <Image className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />}
                      {type === 'video' && <Video className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />}
                      {type === 'audio' && <Mic className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />}
                      {type === 'email' && <Mail className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />}

                      <h3 className="text-lg font-medium mb-1">
                        {selectedFile && uploadType === type 
                          ? "File Selected" 
                          : `Upload ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                      </h3>

                      {selectedFile && uploadType === type ? (
                          <motion.div 
                            className="text-sm text-muted-foreground mb-4 flex items-center gap-2 bg-muted p-2 rounded-md"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="truncate max-w-[200px]" title={selectedFile.name}>{selectedFile.name}</span>
                            <span className="text-xs whitespace-nowrap">({formatFileSize(selectedFile.size)})</span>
                          </motion.div>
                      ) : (
                        <p className="text-sm text-muted-foreground mb-4">
                          {type === 'email' 
                            ? "Supports .eml and .msg files. Max 5MB."
                            : `Supports common ${type} formats. Max size varies.`}
                        </p>
                      )}
                      
                      {!selectedFile && uploadType === type && (
                        <Button 
                          variant="default"
                          onClick={() => triggerFileInput(type as 'image' | 'video' | 'audio' | 'email')}
                          disabled={isUploading}
                          className="relative overflow-hidden"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Select {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Button>
                      )}
                      
                      {selectedFile && uploadType === type && !isUploading && analysisResult.status === null && (
                         <motion.div 
                           initial={{ opacity: 0, scale: 0.8 }}
                           animate={{ opacity: 1, scale: 1 }}
                           className="flex gap-2 mt-2"
                         >
                            <Button 
                              variant="default"
                              onClick={startAnalysis}
                              disabled={isUploading}
                              className="relative overflow-hidden"
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Analyze File
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => triggerFileInput(type as 'image' | 'video' | 'audio' | 'email')}
                              disabled={isUploading}
                            >
                              Change File
                            </Button>
                         </motion.div>
                      )}

                    </motion.div>
                  </TabsContent>
                ))}

                <TabsContent value="url" className="mt-0">
                  <motion.div 
                    className={cn(
                      "border-2 border-dashed rounded-lg p-6 text-center relative min-h-[250px] flex flex-col items-center justify-center transition-colors duration-300",
                      isUploading && uploadType === 'url' && "border-primary/50"
                    )}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <LinkIcon className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Analyze Media from URL</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Enter a direct URL pointing to an image or video
                    </p>
                    <div className="flex w-full max-w-md mx-auto mb-4">
                      <input 
                        id="url-input"
                        type="text" 
                        placeholder="https://example.com/media.jpg" 
                        className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-background dark:border-slate-700"
                        disabled={isUploading}
                      />
                      <Button 
                        variant="default"
                        className="rounded-l-none"
                        onClick={startAnalysis}
                        disabled={isUploading}
                      >
                        {isUploading && uploadType === 'url' ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Analyze"
                        )}
                      </Button>
                    </div>
                     <p className="text-xs text-muted-foreground">Note: URL analysis might be limited by website restrictions.</p>
                  </motion.div>
                </TabsContent>
              </Tabs>

              <AnimatePresence>
                {isUploading && (
                  <motion.div 
                    className="mt-6 text-center"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2 text-sm font-medium text-primary">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing {selectedFile?.name || 'URL'}...
                    </div>
                    <Progress value={progress} className="w-full h-2" />
                    <p className="text-xs text-muted-foreground mt-1">{Math.round(progress)}% Complete</p>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <AnimatePresence>
                {analysisResult.status && !isUploading && (
                   <motion.div
                    className="mt-6 p-4 rounded-lg border"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    style={{ 
                        borderColor: analysisResult.status === 'real' ? 'hsl(var(--success))' : analysisResult.status === 'fake' ? 'hsl(var(--destructive))' : 'hsl(var(--border))',
                        backgroundColor: analysisResult.status === 'real' ? 'hsl(var(--success)/0.1)' : analysisResult.status === 'fake' ? 'hsl(var(--destructive)/0.1)' : 'transparent'
                    }}
                   >
                    <div className="flex items-center gap-3">
                        {analysisResult.status === 'real' && <Check className="h-6 w-6 text-green-600" />}
                        {analysisResult.status === 'fake' && <X className="h-6 w-6 text-red-600" />}
                        {analysisResult.status === 'error' && <AlertCircle className="h-6 w-6 text-amber-600" />}
                        <div>
                            <p className={cn(
                                "font-semibold",
                                analysisResult.status === 'real' && "text-green-700 dark:text-green-400",
                                analysisResult.status === 'fake' && "text-red-700 dark:text-red-400",
                                analysisResult.status === 'error' && "text-amber-700 dark:text-amber-400"
                            )}>
                                Result: {analysisResult.status.toUpperCase()}
                                {analysisResult.confidence && ` (${analysisResult.confidence}%)`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {analysisResult.message || (analysisResult.status === 'error' ? 'Analysis failed.' : 'Analysis complete.')}
                            </p>
                        </div>
                    </div>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3 w-full" 
                        onClick={() => { setAnalysisResult({ status: null }); setSelectedFile(null); }}>
                         Scan Another {uploadType === 'url' ? 'URL' : 'File'}
                    </Button>
                   </motion.div>
                )}
              </AnimatePresence>

            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.01 }}
        >
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Analysis History</CardTitle>
                <Button variant="ghost" size="sm" className="gap-1">
                  <span className="hidden sm:inline">View All</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Your recent deepfake detection activities</CardDescription>
            </CardHeader>
            <CardContent>
              {mockHistory.length > 0 ? (
                <div className="space-y-4">
                  {mockHistory.map((item) => (
                    <motion.div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-3">
                        {item.type === 'image' && <Image className="h-5 w-5 text-blue-500" />}
                        {item.type === 'video' && <Video className="h-5 w-5 text-purple-500" />}
                        {item.type === 'url' && <LinkIcon className="h-5 w-5 text-green-500" />}
                        {item.type === 'audio' && <Mic className="h-5 w-5 text-amber-500" />}
                        {item.type === 'email' && <Mail className="h-5 w-5 text-red-500" />}
                        
                        <div>
                          <p className="font-medium text-sm">{item.filename}</p>
                          <p className="text-xs text-muted-foreground">{item.date}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {item.status === 'real' ? (
                          <span className="flex items-center text-green-600 text-sm gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30">
                            <Check className="h-3 w-3" /> Real
                          </span>
                        ) : (
                          <span className="flex items-center text-red-600 text-sm gap-1 px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30">
                            <X className="h-3 w-3" /> Fake
                          </span>
                        )}
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <History className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">No scan history yet</p>
                  <p className="text-sm text-muted-foreground text-center mt-1">
                    Scanned media will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="md:col-span-2"
          whileHover={{ scale: 1.01 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Detection Statistics</CardTitle>
              <CardDescription>Your detection history and analytics</CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] flex items-center justify-center">
              <div className="text-center">
                <BarChart className="h-16 w-16 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Statistics will be shown here</p>
                <p className="text-sm text-muted-foreground">After you perform more analyses</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.01 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>News & Updates</CardTitle>
              <CardDescription>Latest from our blog</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-2 border-primary pl-3">
                  <p className="text-sm font-medium">New DeepFake Detection Technology Released</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
                <div className="border-l-2 border-muted pl-3">
                  <p className="text-sm font-medium">How to Spot AI Generated Content</p>
                  <p className="text-xs text-muted-foreground">1 week ago</p>
                </div>
                <div className="border-l-2 border-muted pl-3">
                  <p className="text-sm font-medium">Understanding Facial Manipulation Detection</p>
                  <p className="text-xs text-muted-foreground">2 weeks ago</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                View All Updates
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 