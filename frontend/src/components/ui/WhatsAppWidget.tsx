"use client";

import { MessageCircle } from "lucide-react";
import React from "react";

export function WhatsAppWidget() {
    return (
        <a
            href="https://wa.me/8801700000000" // Placeholder BD number
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:scale-110 hover:shadow-[0_8px_30px_rgba(37,211,102,0.6)] transition-all duration-300 animate-fadeInUp group"
            aria-label="Chat with us on WhatsApp"
        >
            <MessageCircle className="w-7 h-7" />

            {/* Tooltip */}
            <div className="absolute right-full mr-4 bg-white text-[#111827] text-sm font-bold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                Chat with us 👋
                {/* Arrow */}
                <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white rotate-45"></div>
            </div>

            {/* Ping animation effect */}
            <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        </a>
    );
}
