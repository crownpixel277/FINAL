'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Headset, Send, X, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Message = {
  id: number;
  sender: 'user' | 'ai';
  text: string;
};

const initialMessage: Message = {
  id: 0,
  sender: 'ai',
  text: "Hello! 👋 Ask me anything about cybersecurity or this application.",
};

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      // Reset to initial message if empty
      if (messages.length === 0) {
          setMessages([initialMessage]);
      }
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Function to handle refreshing the chat
  const handleRefreshChat = () => {
    setMessages([initialMessage]);
    setInput('');
    setIsLoading(false); // Stop loading if refresh clicked
    // Optionally add a toast notification for refresh
    // toast({ title: "Chat Cleared", description: "Conversation history has been reset." });
  };

  const handleSendMessage = async (event?: FormEvent) => {
    event?.preventDefault();
    const userMessageText = input.trim();
    if (!userMessageText || isLoading) return;

    const newUserMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: userMessageText,
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessageText }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      const aiResponse: Message = {
        id: Date.now() + 1, // Ensure unique ID
        sender: 'ai',
        text: data.response || "Sorry, I couldn't get a response.",
      };
      setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error('Failed to send message:', error);
      const errorResponse: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: "Sorry, something went wrong. Please try again later.",
      };
      setMessages(prev => [...prev, errorResponse]);
      toast({
          title: "Chat Error",
          description: "Could not connect to the AI assistant.",
          variant: "destructive"
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button - Heartbeat animation on button, static icon, tooltip */}
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div 
              className="fixed bottom-6 right-6 z-50"
              initial={{ scale: 0 }} // Initial entrance animation
              animate={{ 
                scale: isOpen ? 1 : [1, 1.05, 1], // Heartbeat scale animation when closed
              }} 
              transition={{ 
                // Separate transition for initial scale vs heartbeat
                scale: isOpen ? 
                  { delay: 0, type: 'spring', stiffness: 120 } // Entrance/Exit transition
                  : { 
                      delay: 0.5, // Delay initial entrance
                      duration: 1.5, // Heartbeat duration
                      repeat: Infinity, 
                      repeatType: "loop", 
                      ease: "easeInOut" 
                    } // Heartbeat transition
              }}
            >
              <Button 
                size="icon" 
                className={cn(
                  "rounded-full w-14 h-14 shadow-lg",
                  "transition-all duration-300 ease-in-out", // Smooth transition for manual hover
                  "hover:shadow-primary/40 hover:shadow-lg hover:scale-110" // Keep manual hover effect
                )}
                onClick={toggleChat} 
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
              >
                {/* Icon is now static (no motion.div wrapping it) */}
                {isOpen ? <X className="h-6 w-6" /> : <Headset className="h-6 w-6" />}
              </Button>
            </motion.div>
          </TooltipTrigger>
          {/* Tooltip Content */} 
          {!isOpen && ( // Only show tooltip when chat is closed
            <TooltipContent side="left" className="bg-foreground text-background">
              <p>Chat with us</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-full max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="flex flex-col h-[500px] shadow-xl border">
              {/* Card Header with Refresh Button */}
              <CardHeader className="border-b flex flex-row items-center justify-between py-3 px-4">
                <div className="flex items-center gap-2">
                   <Avatar className="h-7 w-7">
                      <AvatarFallback>AI</AvatarFallback>
                   </Avatar>
                   <CardTitle className="text-lg font-semibold">AI Assistant</CardTitle>
                </div>
                <div className="flex items-center">
                   <Button variant="ghost" size="icon" onClick={handleRefreshChat} className="h-7 w-7 mr-1" title="Refresh chat">
                      <RefreshCw className="h-4 w-4" />
                      <span className="sr-only">Refresh chat</span>
                   </Button>
                   <Button variant="ghost" size="icon" onClick={toggleChat} className="h-7 w-7" title="Close chat">
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close chat</span>
                   </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        className={cn(
                          "flex items-end gap-2",
                          message.sender === 'user' ? 'justify-end' : 'justify-start'
                        )}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {message.sender === 'ai' && (
                          <Avatar className="h-6 w-6 flex-shrink-0">
                            <AvatarFallback>AI</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            "max-w-[80%] rounded-lg px-3 py-2 text-sm break-words",
                            message.sender === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          )}
                        >
                          {message.text}
                        </div>
                         {message.sender === 'user' && (
                          <Avatar className="h-6 w-6 flex-shrink-0">
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                        )}
                      </motion.div>
                    ))}
                    {isLoading && (
                       <motion.div 
                         className="flex items-center justify-start gap-2"
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                       >
                          <Avatar className="h-6 w-6 flex-shrink-0">
                             <AvatarFallback>AI</AvatarFallback>
                          </Avatar>
                         <div className="bg-muted rounded-lg px-3 py-2 flex items-center space-x-1.5">
                            <span className="h-1.5 w-1.5 bg-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="h-1.5 w-1.5 bg-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="h-1.5 w-1.5 bg-foreground rounded-full animate-bounce"></span>
                         </div>
                       </motion.div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about cyber or the app..."
                    className="flex-1"
                    disabled={isLoading}
                    aria-label="Chat input"
                  />
                  <Button type="submit" size="icon" disabled={isLoading || input.trim() === ''}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    <span className="sr-only">Send message</span>
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 