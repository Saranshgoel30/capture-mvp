
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAnimalAvatarForUser } from '@/lib/animalAvatars';

const Chatroom: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('chatroom_messages')
      .select('*, user_id(full_name)')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data || []);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const { error } = await supabase
      .from('chatroom_messages')
      .insert({
        content: newMessage,
        user_id: user.id
      });

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setNewMessage('');
      fetchMessages();
    }
  };

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel('public:chatroom_messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chatroom_messages' },
        (payload) => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-secondary/40 backdrop-blur-md rounded-xl p-6 h-[600px] flex flex-col">
            <div className="flex-grow overflow-y-auto mb-4">
              {messages.map((msg) => (
                <div key={msg.id} className="mb-2 flex items-start">
                  <img 
                    src={getAnimalAvatarForUser(msg.user_id.id)} 
                    alt="User avatar" 
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <div>
                    <p className="font-semibold">{msg.user_id.full_name || 'Anonymous'}</p>
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button onClick={sendMessage}>Send</Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Chatroom;
