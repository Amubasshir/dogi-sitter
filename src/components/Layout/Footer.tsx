import React from 'react';
import { Heart, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/95 backdrop-blur-xl border-t border-orange-100 mt-auto">
      {/* Desktop Footer */}
      <div className="hidden sm:block">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-400 rounded-lg flex items-center justify-center shadow-lg">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                  דוגיסיטר
                </h3>
                <p className="text-sm text-gray-600">הפלטפורמה המובילה לטיפול בכלבים</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@dogsitter.co.il</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>03-1234567</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-orange-100 text-center">
            <p className="text-sm text-gray-500">
              © 2024 דוגיסיטר. כל הזכויות שמורות.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Footer */}
      <div className="sm:hidden">
        <div className="px-4 py-4 bg-gradient-to-r from-orange-50 to-pink-50">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-pink-400 rounded-lg flex items-center justify-center shadow-lg">
              <Heart className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-base bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              דוגיסיטר
            </span>
          </div>
          <p className="text-center text-xs text-gray-500">
            © 2024 דוגיסיטר. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;