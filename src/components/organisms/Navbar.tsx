"use client";
import React, { useState, useEffect } from "react";
import {
  Shield,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "../atoms/Button";
import AuthModal from "../molecules/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "./NotificationContainer";
import BlaxLogo from "@/assets/blax-logo.png";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { showSuccess, showError } = useNotifications();

  const { user, loading, signOut, setUser } = useAuth();

  console.log("user data =>", user);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAuthSuccess = (userData: any, session: any) => {
    // Immediately update the user state in context
    setUser(userData);
    setIsAuthModalOpen(false);

    // Redirect to dashboard after successful login
    // router.push("/dashboard");
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setIsUserMenuOpen(false);

    try {
      await signOut();
      router.push("/");
      // Show success message
      showSuccess("Success Logout!");
      console.log("Signed out successfully");
    } catch (error) {
      console.error("Sign out error:", error);
      // You could show an error toast here
      showError("Error!");
    } finally {
      setIsSigningOut(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsUserMenuOpen(false);
    };

    if (isUserMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isUserMenuOpen]);

  return (
    <>
      <nav
        className={`fixed top-4 left-4 right-4 z-50 rounded-2xl transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border border-gray-200/20"
            : "bg-white/10 backdrop-blur-sm border border-white/20"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => router.push("/")}
                className="p-2 rounded-xl"
              >
                {/* <Calendar className="h-6 w-6 text-white" /> */}
                <Image src={BlaxLogo} alt="Logo" width={50} height={50} />
              </button>
              <button
                className={`text-xl font-bold transition-colors duration-300 ${
                  isScrolled
                    ? "bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"
                    : "text-white"
                }`}
                onClick={() => router.push("/")}
              >
                Blax Football
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/schedule"
                className={`font-medium transition-all duration-300 relative group ${
                  isScrolled
                    ? "text-gray-700 hover:text-blue-600"
                    : "text-white/90 hover:text-white"
                }`}
              >
                Schedule
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                    isScrolled
                      ? "bg-gradient-to-r from-blue-500 to-teal-500"
                      : "bg-gradient-to-r from-blue-400 to-teal-400"
                  }`}
                ></span>
              </Link>
              <Link
                href="/news"
                className={`font-medium transition-all duration-300 relative group ${
                  isScrolled
                    ? "text-gray-700 hover:text-blue-600"
                    : "text-white/90 hover:text-white"
                }`}
              >
                News
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                    isScrolled
                      ? "bg-gradient-to-r from-blue-500 to-teal-500"
                      : "bg-gradient-to-r from-blue-400 to-teal-400"
                  }`}
                ></span>
              </Link>
              {user && (
                <Link
                  href="/dashboard"
                  className={`font-medium transition-all duration-300 relative group ${
                    isScrolled
                      ? "text-gray-700 hover:text-blue-600"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  Dashboard
                  <span
                    className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                      isScrolled
                        ? "bg-gradient-to-r from-blue-500 to-teal-500"
                        : "bg-gradient-to-r from-blue-400 to-teal-400"
                    }`}
                  ></span>
                </Link>
              )}
              {user &&
                (user.role === "Admin" || user.role === "superadmin") && (
                  <Link
                    href="/admin"
                    className={`font-medium transition-all duration-300 relative group ${
                      isScrolled
                        ? "text-gray-700 hover:text-blue-600"
                        : "text-white/90 hover:text-white"
                    }`}
                  >
                    Admin
                    <span
                      className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                        isScrolled
                          ? "bg-gradient-to-r from-blue-500 to-teal-500"
                          : "bg-gradient-to-r from-blue-400 to-teal-400"
                      }`}
                    ></span>
                  </Link>
                )}
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full"></div>
                  <div className="w-20 h-4 animate-pulse bg-gray-200 rounded"></div>
                </div>
              ) : user ? (
                /* User Buttons */
                <div className="flex items-center space-x-3">
                  {/* Profile Button */}
                  <div className="relative">
                    <Button
                      variant="primary"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        setIsUserMenuOpen(!isUserMenuOpen);
                      }}
                      size="sm"
                      disabled={isSigningOut}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                        isScrolled
                          ? "hover:bg-gray-100 text-gray-700"
                          : "hover:bg-white/10 text-white"
                      } ${isSigningOut ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      Profile
                      {/* <span className="font-medium">Profile</span> */}
                    </Button>

                    {/* Profile Dropdown */}
                    {isUserMenuOpen && !isSigningOut && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.phone}
                          </p>
                        </div>
                        <Link
                          href="/dashboard"
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors">
                          <Settings className="h-4 w-4 mr-2" />
                          Account Settings
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Sign Out Button */}
                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className={`w-full text-left font-medium py-2 px-4 rounded-lg transition-all duration-300 ${
                      isScrolled
                        ? "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {isSigningOut ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        <span className="font-normal">Signing Out...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        <span className="font-normal">Sign Out</span>
                      </div>
                    )}
                  </button>
                </div>
              ) : (
                /* Auth Buttons */
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
                isScrolled
                  ? "hover:bg-gray-100 text-gray-700"
                  : "hover:bg-white/10 text-white"
              }`}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden transition-all duration-300 ease-in-out ${
              isMenuOpen
                ? "max-h-96 opacity-100 pb-6"
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            <div className="pt-4 space-y-4">
              <Link
                href="/schedule"
                className={`block font-medium py-2 px-4 rounded-lg transition-all duration-300 ${
                  isScrolled
                    ? "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Schedule
              </Link>
              <Link
                href="/news"
                className={`block font-medium py-2 px-4 rounded-lg transition-all duration-300 ${
                  isScrolled
                    ? "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                News
              </Link>
              {user && (
                <Link
                  href="/admin"
                  className={`block font-medium py-2 px-4 rounded-lg transition-all duration-300 ${
                    isScrolled
                      ? "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )}

              {/* Mobile Auth Section */}
              <div className="pt-4 space-y-3 border-t border-white/20">
                {loading ? (
                  <div className="w-full h-10 animate-pulse bg-gray-200 rounded-lg"></div>
                ) : user ? (
                  <>
                    {/* User Info */}
                    <div className="px-4 py-2">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium truncate">
                            {user.name}
                          </p>
                          <p className="text-xs opacity-70 truncate">
                            {user.phone}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Profile Button */}
                    <Link
                      href="/dashboard"
                      className={`w-full text-left font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center ${
                        isScrolled
                          ? "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                          : "text-white/90 hover:text-white hover:bg-white/10"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>

                    {/* Admin Button */}
                    <Link
                      href="/admin"
                      className={`w-full text-left font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center ${
                        isScrolled
                          ? "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                          : "text-white/90 hover:text-white hover:bg-white/10"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Admin
                    </Link>

                    {/* Settings Button */}
                    <button
                      className={`w-full text-left font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center ${
                        isScrolled
                          ? "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                          : "text-white/90 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Account Settings
                    </button>

                    {/* Sign Out Button */}
                    <button
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className={`w-full text-left font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center border-t border-white/20 pt-4 mt-2 ${
                        isScrolled
                          ? "text-red-600 hover:bg-red-50"
                          : "text-red-400 hover:bg-red-500/10"
                      } ${isSigningOut ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {isSigningOut ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                          Signing Out...
                        </>
                      ) : (
                        <>
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign In
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}
