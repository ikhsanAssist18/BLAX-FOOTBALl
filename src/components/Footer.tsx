import React from "react";
import {
  Calendar,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import BlaxLogo from "@/assets/blax-logo.png";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center">
                <Image src={BlaxLogo} alt="Logo" width={50} height={50} />
              </div>
              <h3 className="text-xl font-bold">Blax Football</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Platform booking futsal dan mini soccer terpercaya di Jakarta.
              Bergabunglah dengan komunitas football terbesar dan nikmati
              pengalaman bermain yang tak terlupakan.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-700 hover:bg-sky-500 rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-700 hover:bg-sky-500 rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-700 hover:bg-sky-500 rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-700 hover:bg-sky-500 rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-sky-400">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-gray-300 hover:text-sky-400 transition-colors duration-200"
                >
                  Beranda
                </a>
              </li>
              <li>
                <a
                  href="/lineup"
                  className="text-gray-300 hover:text-sky-400 transition-colors duration-200"
                >
                  Player Lineups
                </a>
              </li>
              <li>
                <a
                  href="/news"
                  className="text-gray-300 hover:text-sky-400 transition-colors duration-200"
                >
                  Berita
                </a>
              </li>
              <li>
                <a
                  href="/gallery"
                  className="text-gray-300 hover:text-sky-400 transition-colors duration-200"
                >
                  Gallery
                </a>
              </li>
              <li>
                <a
                  href="/user-profile"
                  className="text-gray-300 hover:text-sky-400 transition-colors duration-200"
                >
                  Profile
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-sky-400 transition-colors duration-200"
                >
                  Turnamen
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-sky-400 transition-colors duration-200"
                >
                  Tentang Kami
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-sky-400">Layanan</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-sky-400 transition-colors duration-200"
                >
                  Booking Lapangan
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-sky-400 transition-colors duration-200"
                >
                  Turnamen Bulanan
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-sky-400 transition-colors duration-200"
                >
                  Private Coaching
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-sky-400 transition-colors duration-200"
                >
                  Team Building
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-sky-400 transition-colors duration-200"
                >
                  Equipment Rental
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-sky-400 transition-colors duration-200"
                >
                  Event Organizer
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-sky-400">Kontak</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-sky-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">
                    Jl. Sudirman No. 123
                    <br />
                    Jakarta Pusat, 10220
                    <br />
                    Indonesia
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-sky-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">+62 21 1234 5678</p>
                  <p className="text-gray-300">+62 812 3456 7890</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-sky-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">info@blaxfootball.com</p>
                  <p className="text-gray-300">support@blaxfootball.com</p>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <h5 className="font-semibold text-sky-400 mb-2">
                Jam Operasional
              </h5>
              <div className="text-sm text-gray-300 space-y-1">
                <p>Senin - Jumat: 06:00 - 23:00</p>
                <p>Sabtu - Minggu: 05:00 - 24:00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} Blax Football. All rights reserved.
            </div>

            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-sky-400 transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-sky-400 transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-sky-400 transition-colors duration-200"
              >
                Cookie Policy
              </a>
            </div>
          </div>

          <div className="text-center mt-4 text-gray-500 text-sm">
            Made with ❤️ for the football community in Jakarta
          </div>
        </div>
      </div>
    </footer>
  );
}
