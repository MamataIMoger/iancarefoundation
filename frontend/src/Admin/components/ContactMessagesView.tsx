'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Mail, Phone, MessageSquare } from 'lucide-react';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt?: string;
}

const ContactMessagesView: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchMessages = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contact-messages`)
      const contentType = res.headers.get("content-type")

      if (!res.ok || !contentType?.includes("application/json")) {
        const raw = await res.text()
        console.error("❌ Unexpected response:", raw)
        throw new Error("Invalid response format")
      }

      const data = await res.json()

      if (data.success && Array.isArray(data.data)) {
        setMessages(data.data)
      } else {
        console.error("Failed to fetch contact messages")
      }
    } catch (err) {
      console.error("Error fetching messages:", err)
    } finally {
      setLoading(false)
    }
  }

  fetchMessages()
}, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        <Loader2 className="animate-spin text-accent w-6 h-6" />
        <p className="ml-3">Loading messages...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-10 sm:px-6 lg:px-8"
      style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
    >
      <div className="max-w-4xl mx-auto bg-card text-card-foreground p-6 rounded-2xl shadow-md border border-border">
        <h1 className="text-5xl font-extrabold mb-10 tracking-wide text-foreground text-center">
          🌿 Contact Messages
        </h1>
        {messages.length === 0 ? (
          <p className="text-center text-muted-foreground">No messages found.</p>
        ) : (
          <ul className="space-y-5">
            {messages.map((msg) => (
              <li
                key={msg._id}
                className="p-5 bg-muted rounded-xl shadow-sm border border-border hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4 text-accent" />
                      {msg.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{msg.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleString()
                      : 'N/A'}
                  </span>
                </div>

                <div className="flex items-center text-muted-foreground mb-2">
                  <Phone className="w-4 h-4 mr-2 text-accent" />
                  {msg.phone || 'N/A'}
                </div>

                <p className="text-sm text-muted-foreground flex items-start gap-2 mt-2">
                  <MessageSquare className="w-4 h-4 text-accent mt-1" />
                  {msg.message || 'No message'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ContactMessagesView;
