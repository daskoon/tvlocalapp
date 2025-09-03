
'use client';

import { useEffect, useState } from 'react';
import { CargoCalc } from '@/components/cargo-calc';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function Home() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    const hasAcknowledged = sessionStorage.getItem('disclaimerAcknowledged');
    if (!hasAcknowledged) {
      setShowDisclaimer(true);
    }
  }, []);

  const handleAcknowledge = () => {
    sessionStorage.setItem('disclaimerAcknowledged', 'true');
    setShowDisclaimer(false);
  };

  return (
    <div className="app-container flex flex-col min-h-screen">
      <header className="app-header bg-primary text-primary-foreground p-6 shadow-md">
        <div className="header-content max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="app-title text-2xl font-bold mb-1 tracking-tight">CargoCalc</h1>
              <p className="app-subtitle text-primary-foreground/90">Check fitment, find compatible TVs, or see vehicles that fit a TV.</p>
            </div>
        </div>
      </header>

      <main className="main-content flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full">
        <AlertDialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Beta Disclaimer</AlertDialogTitle>
              <AlertDialogDescription>
                This tool is for estimation purposes only. Dimensions can vary. Please verify all measurements manually before making a purchase. What Do You Want Wired LLC is not responsible for any inaccuracies.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleAcknowledge}>Acknowledge</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <CargoCalc />
      </main>
    </div>
  );
}
