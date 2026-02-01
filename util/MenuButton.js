"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, BookOpen, LogOut, Settings, Database, Package } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import DataPacketBrowser from "../components/DataPacket";
import EquipmentBrowser from "../components/Equipment";

export default function MenuButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDataPackets, setShowDataPackets] = useState(false);
  const [showEquipment, setShowEquipment] = useState(false);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserId(user?.uid || null);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const menuItems = [
    // {
    //   icon: Home,
    //   label: "Dashboard",
    //   action: () => router.push("/dashboard"),
    //   color: "text-blue-400"
    // },
    {
      icon: Database,
      label: "Data Packets",
      action: () => {
        setIsOpen(false);
        setShowDataPackets(true);
      },
      color: "text-blue-400"
    },
    {
      icon: Package,
      label: "Inventory",
      action: () => {
        setIsOpen(false);
        setShowEquipment(true);
      },
      color: "text-green-400"
    },
    // {
    //   icon: Settings,
    //   label: "Settings",
    //   action: () => router.push("/settings"),
    //   color: "text-gray-400"
    // },
    {
      icon: LogOut,
      label: "Logout",
      action: handleLogout,
      color: "text-red-400"
    }
  ];

  const containerVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      rotate: -180
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const menuVariants = {
    hidden: { 
      opacity: 0,
      y: -20,
      scale: 0.8
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.8,
      transition: {
        duration: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: -20 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <>
      {/* <div className="fixed top-4 right-4 z-50" style={{ top: 10 }}> */}
      <div className="fixed top-4 right-4 z-50">
        {/* Menu Toggle Button */}
        <motion.button
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          // whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="display bg-gray-900 bg-opacity-90 backdrop-blur-sm text-white p-2 shadow-2xl border-2 border-gray-700 hover:border-gray-600 transition-colors"
        >
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.div>
        </motion.button>

        {/* Menu Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="display absolute top-16 right-0 bg-gray-900 bg-opacity-95 backdrop-blur-md shadow-2xl border-2 border-gray-700 overflow-hidden"
              style={{ minWidth: "200px" }}
            >
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  variants={itemVariants}
                  whileHover={{ 
                    x: 5, 
                    backgroundColor: "rgba(55, 65, 81, 0.5)",
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    item.action();
                    if (item.label !== "Data Packets" && item.label !== "Inventory") {
                      setIsOpen(false);
                    }
                  }}
                  className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-b-0"
                >
                  <item.icon size={18} className={item.color} />
                  <span className="text-white font-medium">{item.label}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Data Packet Browser */}
      {showDataPackets && (
        <DataPacketBrowser
          isOpen={showDataPackets}
          onClose={() => setShowDataPackets(false)}
          userId={userId}
        />
      )}

      {/* Equipment Browser */}
      {showEquipment && (
        <EquipmentBrowser
          isOpen={showEquipment}
          onClose={() => setShowEquipment(false)}
          userId={userId}
        />
      )}
    </>
  );
}