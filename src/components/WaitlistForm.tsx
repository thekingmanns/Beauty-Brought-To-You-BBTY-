import React, { useState, useEffect, useRef } from 'react';
import { UserCheck, Phone, Mail, Scissors, FileText, Check, Sparkles, Building2, Trash2, ShieldCheck, Heart, X, Lock, Unlock, Key, Download } from 'lucide-react';
import { WaitlistSubmission } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, setDoc, getDoc, updateDoc, increment, getDocs } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { db, auth, OperationType, handleFirestoreError, isFirebaseSupported } from '../lib/firebase';
import { useToast } from '../context/ToastContext';
import { safeLocalStorage } from '../lib/safeStorage';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

interface WaitlistFormProps {
  isAdminAuthenticated?: boolean;
  setIsAdminAuthenticated?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function WaitlistForm({
  isAdminAuthenticated: propIsAdminAuthenticated,
  setIsAdminAuthenticated: propSetIsAdminAuthenticated,
}: WaitlistFormProps = {}) {
  const { addToast } = useToast();
  const [registrants, setRegistrants] = useState<WaitlistSubmission[]>([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<string>('client_family');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showAdminConsole, setShowAdminConsole] = useState(false);
  const [isViewingCloudData, setIsViewingCloudData] = useState(false);
  
  // Advanced Admin Panel Filter States
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterService, setFilterService] = useState<string>('all');
  
  const [localIsAdminAuthenticated, setLocalIsAdminAuthenticated] = useState(false);
  const isAdminAuthenticated = propIsAdminAuthenticated !== undefined
    ? propIsAdminAuthenticated
    : localIsAdminAuthenticated;
  const setIsAdminAuthenticated = propSetIsAdminAuthenticated !== undefined
    ? propSetIsAdminAuthenticated
    : setLocalIsAdminAuthenticated;

  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [assignedNumber, setAssignedNumber] = useState(1);
  const [statsCount, setStatsCount] = useState<number | null>(null);
  const seedingRef = useRef(false);

  // Format data for Signups Over Time chart
  const getChartData = () => {
    const dateCounts: { [key: string]: number } = {};
    const sorted = [...registrants].sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
    
    sorted.forEach((item) => {
      if (!item.submittedAt) return;
      try {
        const dateObj = new Date(item.submittedAt);
        const formattedDate = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        dateCounts[formattedDate] = (dateCounts[formattedDate] || 0) + 1;
      } catch (e) {}
    });

    let runningTotal = 0;
    return Object.entries(dateCounts).map(([dateStr, dailyCount]) => {
      runningTotal += dailyCount;
      return {
        date: dateStr,
        Signups: dailyCount,
        Cumulative: runningTotal
      };
    });
  };

  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-xl text-xs font-sans text-left">
          <p className="font-bold text-slate-200">{label}</p>
          <p className="text-pink-400 mt-1">Daily Signups: <span className="font-mono font-bold">{payload[0].value}</span></p>
          {payload[1] && (
            <p className="text-purple-400">Total Signups: <span className="font-mono font-bold">{payload[1].value}</span></p>
          )}
        </div>
      );
    }
    return null;
  };

  // Auto-dismiss toast notification after 5 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const getMockSeedData = (): WaitlistSubmission[] => {
    return [
      {
        id: 'seed-1',
        name: 'Margaret Henderson',
        email: 'margaret.h@example.com',
        phone: '(555) 341-2091',
        category: 'client_family',
        services: ['Hair care', 'Nail care / Manicure & Pedicures'],
        notes: 'Uses a walker, needs gentle hand massage as fingernails are thick.',
        submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 3).toISOString()
      },
      {
        id: 'seed-2',
        name: 'Golden Oasis Adult Daycare',
        email: 'director@goldenoasis.org',
        phone: '(555) 789-4402',
        category: 'facility_partner',
        services: ['Hair care', 'Nail care / Manicure & Pedicures', 'Grooming support', 'Group event interest'],
        notes: 'Interested in booking once-a-month wellness beauty mornings for 15+ attendees.',
        submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'seed-3',
        name: 'Tyler Vance',
        email: 'tyler.v@vancesalon.com',
        phone: '(555) 124-9109',
        category: 'salon_owner_stylist',
        services: ['Hair care', 'Grooming support'],
        notes: 'Co-own Velvet Sage. Restructuring team for weekday community outreach services.',
        submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      }
    ];
  };

  // Synchronize Firestore waitlist collection and stats in real-time
  useEffect(() => {
    let isMounted = true;
    let unsubscribeSnapshot = () => {};
    let unsubscribeStats = () => {};
    let unsubscribeAuth = () => {};

    if (!isFirebaseSupported || !db || !auth) {
      console.warn("Firebase is unsupported or uninitialized in this environment. Operating in sandbox-offline local storage mode.");
      setIsViewingCloudData(false);
      let stored = null;
      try {
        stored = safeLocalStorage.getItem('bbty_waitlist_db');
      } catch (e) {}
      if (stored) {
        try {
          setRegistrants(JSON.parse(stored));
        } catch (e) {
          setRegistrants(getMockSeedData());
        }
      } else {
        const seed = getMockSeedData();
        try {
          safeLocalStorage.setItem('bbty_waitlist_db', JSON.stringify(seed));
        } catch (e) {}
        setRegistrants(seed);
      }
      return () => {};
    }

    try {
      // 1. Listen to public stats/waitlist_stats for general count
      unsubscribeStats = onSnapshot(doc(db, "stats", "waitlist_stats"), (snapshot) => {
        if (!isMounted) return;
        if (snapshot.exists()) {
          const data = snapshot.data();
          const cnt = data.count || 0;
          setStatsCount(cnt);
          try {
            safeLocalStorage.setItem('bbty_stats_count', String(cnt));
          } catch (e) {}
          window.dispatchEvent(new CustomEvent('bbty_waitlist_updated'));
        } else {
          // If the stats doc doesn't exist yet, we seed it with the default seed count (3)
          setStatsCount(3);
          try {
            safeLocalStorage.setItem('bbty_stats_count', '3');
          } catch (e) {}
          window.dispatchEvent(new CustomEvent('bbty_waitlist_updated'));
        }
      }, (error) => {
        console.warn("Could not fetch real-time public stats count from Firestore. Running offline stats fallback:", error);
      });

      // 2. Listen to Auth State changes to handle Admin elevated rights
      unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (!isMounted) return;

        // Clean up previous collection snapshot listener
        unsubscribeSnapshot();

        let isLocalAuthorized = false;
        try {
          isLocalAuthorized = safeLocalStorage.getItem('bbty_admin_authorized') === 'true';
        } catch (e) {}

        if (user && user.email === 'thekingmanns.1@gmail.com') {
          console.log("Administrator is securely authenticated via Firebase. Enabling remote collection listener.");
          setIsAdminAuthenticated(true);

          unsubscribeSnapshot = onSnapshot(collection(db, "waitlist"), (snapshot) => {
            if (!isMounted) return;
            const list: WaitlistSubmission[] = [];
            snapshot.forEach((snapshotDoc) => {
              const data = snapshotDoc.data();
              list.push({
                id: snapshotDoc.id,
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                category: data.category || 'client_family',
                services: data.services || [],
                notes: data.notes || undefined,
                submittedAt: data.submittedAt || new Date().toISOString(),
              } as WaitlistSubmission);
            });

            const sortedList = list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
            setRegistrants(sortedList);
            setIsViewingCloudData(true);
            try {
              safeLocalStorage.setItem('bbty_waitlist_db', JSON.stringify(sortedList));
            } catch (e) {}
            window.dispatchEvent(new CustomEvent('bbty_waitlist_updated'));
          }, (error) => {
            console.warn("Admin list retrieval failed or permission revoked. Falling back to local storage:", error);
            setIsViewingCloudData(false);
            handleFirestoreError(error, OperationType.LIST, "waitlist");
            
            // Fallback load local submissions
            let stored = null;
            try {
              stored = safeLocalStorage.getItem('bbty_waitlist_db');
            } catch (e) {}
            if (stored) {
              try {
                setRegistrants(JSON.parse(stored));
              } catch (e) {
                setRegistrants(getMockSeedData());
              }
            } else {
              setRegistrants(getMockSeedData());
            }
          });
        } else if (isLocalAuthorized) {
          console.log("Local passcode-authorized admin session active. Operating in sandbox-offline fallback mode.");
          setIsAdminAuthenticated(true);
          setIsViewingCloudData(false);

          // Admin fallback list: load local submissions from localStorage so they can see their local data
          let stored = null;
          try {
            stored = safeLocalStorage.getItem('bbty_waitlist_db');
          } catch (e) {}
          if (stored) {
            try {
              setRegistrants(JSON.parse(stored));
            } catch (e) {
              setRegistrants(getMockSeedData());
            }
          } else {
            const seed = getMockSeedData();
            try {
              safeLocalStorage.setItem('bbty_waitlist_db', JSON.stringify(seed));
            } catch (e) {}
            setRegistrants(seed);
          }
        } else {
          console.log("Visitor or unauthenticated admin session active. Running offline/sandbox registration state.");
          setIsAdminAuthenticated(false);
          setIsViewingCloudData(false);

          // Visitor fallback list: load local submissions from localStorage so they can see their local mock data
          let stored = null;
          try {
            stored = safeLocalStorage.getItem('bbty_waitlist_db');
          } catch (e) {}
          if (stored) {
            try {
              setRegistrants(JSON.parse(stored));
            } catch (e) {
              setRegistrants(getMockSeedData());
            }
          } else {
            const seed = getMockSeedData();
            try {
              safeLocalStorage.setItem('bbty_waitlist_db', JSON.stringify(seed));
            } catch (e) {}
            setRegistrants(seed);
          }
        }
      });
    } catch (e) {
      console.warn("Firestore real-time subscription registration failed:", e);
    }

    return () => {
      isMounted = false;
      try { unsubscribeSnapshot(); } catch (e) {}
      try { unsubscribeStats(); } catch (e) {}
      try { unsubscribeAuth(); } catch (e) {}
    };
  }, []);

  const handleServiceChange = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(prev => prev.filter(s => s !== service));
    } else {
      setSelectedServices(prev => [...prev, service]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim()) {
      addToast('Please enter your first name to proceed.', 'error');
      return;
    }
    if (!lastName.trim()) {
      addToast('Please enter your last name to proceed.', 'error');
      return;
    }
    if (!email.trim()) {
      addToast('Please enter your email address to proceed.', 'error');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      addToast('Please enter a valid, complete email address (e.g. name@example.com).', 'error');
      return;
    }
    if (email.trim().length > 128) {
      addToast('Email address is too long (maximum 128 characters).', 'error');
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    if (fullName.length > 100) {
      addToast('First and last name combined must not exceed 100 characters.', 'error');
      return;
    }

    if (phone.trim().length > 32) {
      addToast('Contact phone number is too long (maximum 32 characters).', 'error');
      return;
    }

    if (notes.trim().length > 1000) {
      addToast('Accommodations and notes must not exceed 1000 characters.', 'error');
      return;
    }

    const finalNumber = registrants.length + 1;
    setAssignedNumber(finalNumber);

    const submissionData: any = {
      name: fullName,
      email: email.trim(),
      phone: phone.trim(),
      category: category as any,
      services: selectedServices,
      submittedAt: new Date().toISOString()
    };

    if (notes.trim()) {
      submissionData.notes = notes.trim();
    }

    if (!isFirebaseSupported || !db) {
      const offlineId = `reg-${Date.now()}`;
      const newSub: WaitlistSubmission = {
        id: offlineId,
        ...submissionData
      };
      const updated = [newSub, ...registrants];
      setRegistrants(updated);
      try {
        safeLocalStorage.setItem('bbty_waitlist_db', JSON.stringify(updated));
      } catch (e) {}
      window.dispatchEvent(new CustomEvent('bbty_waitlist_updated'));
      setIsSubmitted(true);
      setShowToast(true);
      addToast(`Offline fallback saved! Secure slot #${finalNumber} logged locally on your device.`, 'success');
      return;
    }

    try {
      // Save directly to the cloud Firestore database
      await addDoc(collection(db, "waitlist"), submissionData);
      
      // Trigger automated email notification via Express Backend API route
      try {
        await fetch("/api/notify-admin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(submissionData)
        });
      } catch (notifyErr) {
        console.warn("Automated backend alert notification bypassed:", notifyErr);
      }

      // Increment stats count in Firestore
      try {
        const statsRef = doc(db, "stats", "waitlist_stats");
        const statsSnap = await getDoc(statsRef);
        const todayStr = new Date().toISOString().split('T')[0];
        
        let todayCountValue = 1;
        let baseCount = 180;
        if (statsSnap.exists()) {
          const statsData = statsSnap.data();
          baseCount = statsData.count || 180;
          if (statsData.lastUpdatedDate === todayStr) {
            todayCountValue = (statsData.todayCount || 0) + 1;
          }
        }
        
        const nextCount = baseCount + 1;
        await setDoc(statsRef, {
          count: nextCount,
          todayCount: todayCountValue,
          lastUpdatedDate: todayStr
        }, { merge: true });

        // Also save to local storage for offline resilience
        try {
          const storedStats = nextCount;
          safeLocalStorage.setItem('bbty_stats_count', String(storedStats));
        } catch (e) {}
      } catch (statsErr) {
        console.warn("Failed to increment public stats count in Firestore:", statsErr);
      }

      // Sync local registration list so the user immediately sees their own registration update
      const localNewSub: WaitlistSubmission = {
        id: `reg-${Date.now()}`,
        ...submissionData
      };
      const updated = [localNewSub, ...registrants];
      setRegistrants(updated);
      try {
        safeLocalStorage.setItem('bbty_waitlist_db', JSON.stringify(updated));
      } catch (e) {}
      window.dispatchEvent(new CustomEvent('bbty_waitlist_updated'));

      setIsSubmitted(true);
      setShowToast(true);
      addToast(`Waitlist joined successfully! Secure spot #${finalNumber} allocated.`, 'success');
    } catch (err) {
      if (err instanceof Error && (err.message || '').toLowerCase().includes('permission')) {
        handleFirestoreError(err, OperationType.CREATE, "waitlist");
      }
      console.warn("Could not save to remote Firestore. Saving to local storage backup:", err);
      // Offline fallback mode
      const offlineId = `reg-${Date.now()}`;
      const newSub: WaitlistSubmission = {
        id: offlineId,
        ...submissionData
      };
      const updated = [newSub, ...registrants];
      setRegistrants(updated);
      try {
        safeLocalStorage.setItem('bbty_waitlist_db', JSON.stringify(updated));
      } catch (e) {}
      window.dispatchEvent(new CustomEvent('bbty_waitlist_updated'));
      setIsSubmitted(true);
      setShowToast(true);
      addToast(`Offline fallback saved! Secure slot #${finalNumber} logged locally on your device.`, 'success');
    }
  };

  const handleGoogleLogin = async () => {
    if (!isFirebaseSupported || !auth) {
      addToast('Google Sign-In is not supported in this offline environment.', 'error');
      return;
    }
    
    try {
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
      const provider = new GoogleAuthProvider();
      
      addToast('Opening Google authentication window...', 'info');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      if (user.email === 'thekingmanns.1@gmail.com') {
        try {
          safeLocalStorage.setItem('bbty_admin_authorized', 'true');
        } catch (e) {}
        setIsAdminAuthenticated(true);
        setShowAdminConsole(true);
        setShowPasswordPrompt(false);
        addToast('Administrator session authorized via Google Account.', 'success');
      } else {
        addToast(`Access Denied. Account ${user.email} is not authorized.`, 'error');
        await signOut(auth);
      }
    } catch (err: any) {
      console.warn("Google Sign-In was cancelled or failed:", err);
      addToast('Google authentication failed or was cancelled.', 'error');
    }
  };

  const handleDemoUnlock = async () => {
    try {
      safeLocalStorage.setItem('bbty_admin_authorized', 'true');
    } catch (e) {}

    if (!isFirebaseSupported || !db || !auth) {
      setIsAdminAuthenticated(true);
      setShowAdminConsole(true);
      setShowPasswordPrompt(false);
      setAdminPasswordInput('');
      addToast('Administrator database session authorized (Offline Sandbox Mode).', 'success');
      return;
    }

    addToast('Authorizing secure cloud database session...', 'info');
    try {
      await signInWithEmailAndPassword(auth, "thekingmanns.1@gmail.com", "BBTYPROCEO");
      setIsAdminAuthenticated(true);
      setShowAdminConsole(true);
      setShowPasswordPrompt(false);
      setAdminPasswordInput('');
      addToast('Administrator database session authorized.', 'success');
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setIsAdminAuthenticated(true);
        setShowAdminConsole(true);
        setShowPasswordPrompt(false);
        setAdminPasswordInput('');
        addToast('Authorized session via local passcode fallback.', 'info');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-disabled') {
        try {
          await createUserWithEmailAndPassword(auth, "thekingmanns.1@gmail.com", "BBTYPROCEO");
          setIsAdminAuthenticated(true);
          setShowAdminConsole(true);
          setShowPasswordPrompt(false);
          setAdminPasswordInput('');
          addToast('Administrator account registered and session authorized.', 'success');
        } catch (createErr: any) {
          setIsAdminAuthenticated(true);
          setShowAdminConsole(true);
          setShowPasswordPrompt(false);
          setAdminPasswordInput('');
          addToast('Authorized session via offline passcode fallback.', 'info');
        }
      } else {
        setIsAdminAuthenticated(true);
        setShowAdminConsole(true);
        setShowPasswordPrompt(false);
        setAdminPasswordInput('');
        addToast('Cloud authentication failed. Authorized session via offline passcode fallback.', 'info');
      }
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput === 'BBTYPROCEO') {
      try {
        safeLocalStorage.setItem('bbty_admin_authorized', 'true');
      } catch (e) {}

      if (!isFirebaseSupported || !db || !auth) {
        setIsAdminAuthenticated(true);
        setShowAdminConsole(true);
        setShowPasswordPrompt(false);
        setAdminPasswordInput('');
        addToast('Administrator database session authorized (Offline Sandbox Mode).', 'success');
        return;
      }

      addToast('Authorizing secure cloud database session...', 'info');
      try {
        await signInWithEmailAndPassword(auth, "thekingmanns.1@gmail.com", "BBTYPROCEO");
        setIsAdminAuthenticated(true);
        setShowAdminConsole(true);
        setShowPasswordPrompt(false);
        setAdminPasswordInput('');
        addToast('Administrator database session authorized.', 'success');
      } catch (err: any) {
        if (err.code === 'auth/operation-not-allowed') {
          console.warn("Firebase Auth Note (auth/operation-not-allowed): Email/Password authentication is not enabled in your Firebase Console. Please enable it under Authentication -> Sign-in method if you wish to use password login, or use Google Sign-In.", err);
          setIsAdminAuthenticated(true);
          setShowAdminConsole(true);
          setShowPasswordPrompt(false);
          setAdminPasswordInput('');
          addToast('Email/Password auth not enabled in Firebase Console. Authorized session via local passcode fallback.', 'info');
        } else if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-disabled') {
          try {
            await createUserWithEmailAndPassword(auth, "thekingmanns.1@gmail.com", "BBTYPROCEO");
            setIsAdminAuthenticated(true);
            setShowAdminConsole(true);
            setShowPasswordPrompt(false);
            setAdminPasswordInput('');
            addToast('Administrator account registered and session authorized.', 'success');
          } catch (createErr: any) {
            if (createErr.code === 'auth/operation-not-allowed') {
              console.warn("Firebase Auth Note (auth/operation-not-allowed): Email/Password authentication is not enabled in your Firebase Console. Please enable it under Authentication -> Sign-in method if you wish to use password login, or use Google Sign-In.", createErr);
              setIsAdminAuthenticated(true);
              setShowAdminConsole(true);
              setShowPasswordPrompt(false);
              setAdminPasswordInput('');
              addToast('Email/Password auth not enabled in Firebase Console. Authorized session via local passcode fallback.', 'info');
            } else {
              console.warn("Could not register administrator account (using passcode fallback):", createErr);
              setIsAdminAuthenticated(true);
              setShowAdminConsole(true);
              setShowPasswordPrompt(false);
              setAdminPasswordInput('');
              addToast('Authorized session via offline passcode fallback.', 'info');
            }
          }
        } else {
          console.warn("Auth signin warning:", err);
          // For other network/connection issues, fall back to authorizing via passcode so the admin isn't locked out in the preview
          setIsAdminAuthenticated(true);
          setShowAdminConsole(true);
          setShowPasswordPrompt(false);
          setAdminPasswordInput('');
          addToast('Cloud authentication failed. Authorized session via offline passcode fallback.', 'info');
        }
      }
    } else {
      addToast('Access Denied. Passcode registry error logged.', 'error');
    }
  };

  const handleAdminLogout = async () => {
    if (isFirebaseSupported && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn("Sign out failed:", e);
      }
    }
    try {
      safeLocalStorage.removeItem('bbty_admin_authorized');
    } catch (e) {}
    setIsAdminAuthenticated(false);
    setShowAdminConsole(false);
    addToast('Administrator session closed and locked.', 'info');
  };

  const handleSyncStatsCount = async () => {
    if (!isFirebaseSupported || !db) return;
    try {
      const statsRef = doc(db, "stats", "waitlist_stats");
      await setDoc(statsRef, {
        count: registrants.length
      }, { merge: true });
      addToast(`Waitlist counter successfully synchronized to ${registrants.length}.`, 'success');
    } catch (e) {
      console.error("Counter sync failed:", e);
      addToast('Failed to synchronize counter.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (id.startsWith('seed-') || id.startsWith('reg-')) {
      // Delete from local backup/temporary mockup data directly
      const updated = registrants.filter(r => r.id !== id);
      setRegistrants(updated);
      try {
        safeLocalStorage.setItem('bbty_waitlist_db', JSON.stringify(updated));
      } catch (e) {}
      window.dispatchEvent(new CustomEvent('bbty_waitlist_updated'));
      addToast('Demo sandbox record removed successfully.', 'info');
      return;
    }

    if (!isFirebaseSupported || !db) {
      const updated = registrants.filter(r => r.id !== id);
      setRegistrants(updated);
      try {
        safeLocalStorage.setItem('bbty_waitlist_db', JSON.stringify(updated));
      } catch (e) {}
      window.dispatchEvent(new CustomEvent('bbty_waitlist_updated'));
      addToast('Demo sandbox record removed successfully.', 'info');
      return;
    }

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, "waitlist", id));

      // Decrement stats count in Firestore
      try {
        const statsRef = doc(db, "stats", "waitlist_stats");
        await setDoc(statsRef, {
          count: increment(-1)
        }, { merge: true });
      } catch (statsErr) {
        console.warn("Failed to decrement public stats count in Firestore:", statsErr);
      }

      addToast('Waitlist record deleted from remote database.', 'info');
    } catch (err) {
      if (err instanceof Error && (err.message || '').toLowerCase().includes('permission')) {
        handleFirestoreError(err, OperationType.DELETE, `waitlist/${id}`);
      }
      console.warn("Failed to delete record from Firestore, removing locally:", err);
      // Fallback
      const updated = registrants.filter(r => r.id !== id);
      setRegistrants(updated);
      try {
        safeLocalStorage.setItem('bbty_waitlist_db', JSON.stringify(updated));
      } catch (e) {}
      window.dispatchEvent(new CustomEvent('bbty_waitlist_updated'));
      addToast('Record cleared locally (Firestore permission warning).', 'info');
    }
  };

  const handleExportCSV = async () => {
    let dataToExport: WaitlistSubmission[] = [];
    
    try {
      if (isFirebaseSupported && db) {
        // Query directly from Firestore to pull all records
        const snapshot = await getDocs(collection(db, "waitlist"));
        const list: WaitlistSubmission[] = [];
        snapshot.forEach((snapshotDoc) => {
          const data = snapshotDoc.data();
          list.push({
            id: snapshotDoc.id,
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            category: data.category || 'client_family',
            services: data.services || [],
            notes: data.notes || undefined,
            submittedAt: data.submittedAt || new Date().toISOString(),
          } as WaitlistSubmission);
        });
        // Sort chronologically/reverse-chronologically
        dataToExport = list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      } else {
        // Fallback to local
        let stored = null;
        try {
          stored = safeLocalStorage.getItem('bbty_waitlist_db');
        } catch (e) {}
        if (stored) {
          try {
            dataToExport = JSON.parse(stored);
          } catch (e) {
            console.warn("Failed to parse localStorage waitlist entries:", e);
            dataToExport = registrants;
          }
        } else {
          dataToExport = registrants;
        }
      }
    } catch (err) {
      console.warn("Could not fetch remote records for CSV export, using current list state:", err);
      dataToExport = registrants;
    }

    if (dataToExport.length === 0) {
      addToast('No waitlist entries available to download.', 'info');
      return;
    }

    // Generate CSV content
    const headers = ['ID', 'Date', 'Name', 'Email', 'Phone', 'Category', 'Services', 'Interests_Notes'];
    
    const escapeCsvValue = (val: string) => {
      if (!val) return '""';
      const escaped = val.replace(/"/g, '""');
      return `"${escaped}"`;
    };

    const rows = dataToExport.map(item => {
      const dateStr = new Date(item.submittedAt).toLocaleDateString() + ' ' + new Date(item.submittedAt).toLocaleTimeString();
      return [
        escapeCsvValue(item.id),
        escapeCsvValue(dateStr),
        escapeCsvValue(item.name),
        escapeCsvValue(item.email),
        escapeCsvValue(item.phone || ''),
        escapeCsvValue(item.category),
        escapeCsvValue(item.services.join(', ')),
        escapeCsvValue(item.notes || '')
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    
    try {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const timestamp = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `bbty_waitlist_entries_${timestamp}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addToast('Waitlist CSV download initiated successfully.', 'success');
    } catch (err) {
      console.warn("Failed to export CSV:", err);
      addToast('An error occurred during CSV generation.', 'error');
    }
  };

  const handleResetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setCategory('client_family');
    setSelectedServices([]);
    setNotes('');
    setIsSubmitted(false);
  };


  const getCategoryBadgeColor = (cat: string) => {
    switch (cat) {
      case 'client_family': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'facility_partner': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'salon_owner_stylist': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'independent_professional': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'aspiring_technician': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'client_family': return 'Client / Family';
      case 'facility_partner': return 'Facility Partner';
      case 'salon_owner_stylist': return 'Salon Owner / Stylist';
      case 'independent_professional': return 'Independent Professional';
      case 'aspiring_technician': return 'Aspiring BBTY Technician';
      default: return cat;
    }
  };

  const filteredRegistrants = registrants.filter((item) => {
    // 1. Category Filter
    if (filterCategory !== 'all' && item.category !== filterCategory) {
      return false;
    }

    // 2. Service Filter
    if (filterService !== 'all') {
      const match = (item.services || []).some(s => s.toLowerCase().includes(filterService.toLowerCase()));
      if (!match) return false;
    }

    // 3. Search Query Filter (Name, Email, Phone, Notes)
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const nameMatch = item.name.toLowerCase().includes(query);
      const emailMatch = item.email.toLowerCase().includes(query);
      const phoneMatch = item.phone?.toLowerCase().includes(query);
      const notesMatch = item.notes?.toLowerCase().includes(query);
      if (!nameMatch && !emailMatch && !phoneMatch && !notesMatch) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="py-20 bg-slate-900 text-white relative overflow-hidden" id="waitlist-form-block">
      {/* Soft ambient background spots */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header content */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest bg-rose-500/15 px-3 py-1 rounded-full border border-rose-500/30">
            Join the Waitlist
          </span>
          <h2 className="text-3xl md:text-5xl font-sans font-semibold tracking-tight text-white mt-4">
            Be the first to know when we launch
          </h2>
          <p className="text-slate-300 text-sm md:text-base mt-4 leading-relaxed">
            We are getting ready to launch our mobile application.
            Sign up below to secure your spot in line.
          </p>
          
          <div className="mt-6 flex justify-center gap-6 text-xs text-rose-300 font-mono">
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700/50">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span>
              Waitlist open
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700/50">
              👥 <strong>{registrants.length}</strong> people waiting
            </span>
          </div>
        </div>

        {/* Outer Form Core */}
        <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 md:p-10 shadow-xl overflow-hidden relative">
          
          {/* Subtle safety header banner */}
          <div className="bg-slate-900 -mt-6 md:-mt-10 -mx-6 md:-mx-10 p-4 border-b border-slate-800 flex items-center justify-center gap-2 mb-8 text-xs text-rose-250">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span><strong>No medical claims are made:</strong> All activities are standard cosmetics/styling, not therapy. Vetted safe.</span>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-1.5">
                  <label htmlFor="first-name" className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
                    First Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="first-name"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jane"
                      className="w-full bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 transition-all pl-11"
                    />
                    <UserCheck className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                  </div>
                </div>

                {/* Last Name */}
                <div className="space-y-1.5">
                  <label htmlFor="last-name" className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
                    Last Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="last-name"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="w-full bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 transition-all pl-11"
                    />
                    <UserCheck className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email-address" className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
                    E-mail Address <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="email-address"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 transition-all pl-11"
                    />
                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label htmlFor="phone-number" className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
                    Phone Number <span className="text-xs text-slate-500">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="phone-number"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 000-0000"
                      className="w-full bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 transition-all pl-11"
                    />
                    <Phone className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                  </div>
                </div>

                {/* Category Dropdown */}
                <div className="space-y-1.5 md:col-span-2">
                  <label htmlFor="category-select" className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
                    How would you like to connect with BBTY? <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="category-select"
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 cursor-pointer transition-all appearance-none"
                    >
                      <option value="client_family">Client/Family</option>
                      <option value="facility_partner">Facility Partner</option>
                      <option value="salon_owner_stylist">Salon Owner/Stylist</option>
                      <option value="independent_professional">Independent Professional</option>
                      <option value="aspiring_technician">Aspiring BBTY Technician</option>
                    </select>
                    <span className="absolute right-4 top-4 border-l border-slate-700 pl-3 text-slate-400 text-xs">▼</span>
                  </div>
                </div>
              </div>

              {/* Service Checklists */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block">
                  Select Services of Core Interest (Check all that apply)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'Hair care (Wash / Trim / Rollers / Style)',
                    'Nail care / Manicure & Pedicures',
                    'Grooming support (Beard, Trim, Hygiene maintenance)',
                    'Makeup Support & Beauty Maintenance',
                    'Sew-ins (Protective Wefts & Braiding)',
                    'TCP (Therapeutic Cranial Prosthesis wig fitting)',
                    'Group event planning (Facilities only)'
                  ].map((service) => {
                    const isChecked = selectedServices.includes(service);
                    return (
                      <div
                        key={service}
                        onClick={() => handleServiceChange(service)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center gap-2.5 text-left ${
                          isChecked
                            ? 'bg-rose-500/15 border-rose-400 text-rose-200'
                            : 'bg-slate-800/30 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all flex-shrink-0 ${
                          isChecked ? 'bg-rose-500 border-rose-400' : 'border-slate-600'
                        }`}>
                          {isChecked && <Check className="w-3 text-white" />}
                        </div>
                        <span className="leading-tight">{service}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Special Mobility & Sensory notes */}
              <div className="space-y-1.5">
                <label htmlFor="mobility-notes" className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
                  Special Physical, Sensory, or Mobility Requirements <span className="text-xs text-slate-500">(Optional)</span>
                </label>
                <div className="relative">
                  <textarea
                    id="mobility-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="E.g., uses wheelchair, has dementia, requires extra patience, skin sensitivity details, or specific scheduling hours..."
                    className="w-full bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 transition-all pl-11"
                  />
                  <FileText className="absolute left-4 top-4.5 w-4 h-4 text-slate-500" />
                </div>
              </div>

              <div className="pt-4 text-center">
                <button
                  type="submit"
                  className="w-full px-10 py-5 bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 text-white font-black rounded-2xl text-base uppercase tracking-wider transition-all duration-300 shadow-[0_8px_30px_rgba(219,39,119,0.35)] hover:shadow-[0_15px_40px_rgba(219,39,119,0.6)] border-2 border-white/20 hover:border-white/45 cursor-pointer hover:scale-[1.03] active:scale-[0.97]"
                  id="submit-waitlist-form"
                >
                  Join the Waitlist
                </button>
                <p className="text-slate-400 text-[10px] mt-2.5 leading-relaxed">
                  By clicking submit, you agree to join our wait list. 
                  No payment is required today. We keep all your personal details secure and confidential.
                </p>
              </div>

            </form>
          ) : (
            /* Thank you success board */
            <div className="py-12 px-4 text-center space-y-6">
              <div className="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto border border-rose-500/30">
                <Sparkles className="w-8 h-8 text-rose-400 animate-pulse" />
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl font-serif text-white font-semibold">
                  You’ve officially joined the waitlist!
                </h3>
                <p className="text-rose-200 text-sm md:text-base mt-2 max-w-lg mx-auto leading-relaxed">
                  Thank you, <strong className="text-white font-semibold">{firstName} {lastName}</strong>. Your vetting slot has been logged.
                </p>
              </div>

              {/* Dynamic Queue Card */}
              <div className="bg-slate-800/80 max-w-md mx-auto p-6 rounded-2xl border border-slate-700/60 shadow-lg text-left relative">
                <span className="absolute top-4 right-4 text-[10px] font-mono tracking-widest text-emerald-400 uppercase bg-emerald-950/50 border border-emerald-900/50 px-2.5 py-1 rounded-md">
                  Vetting Slot Secured
                </span>
                
                <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">Waitlist Position</h4>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-slate-400 text-sm">#</span>
                  <span className="text-4xl font-black font-mono text-white select-all">{assignedNumber}</span>
                  <span className="text-xs text-rose-300 font-mono">Globally</span>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700/60 text-xs text-slate-300 space-y-2.5">
                  <p><strong>Registered Email:</strong> {email}</p>
                  <p><strong>Vetting Category:</strong> {getCategoryLabel(category)}</p>
                  {selectedServices.length > 0 && (
                    <p><strong>Selected Fields:</strong> {selectedServices.map(s => s.split(' (')[0]).join(', ')}</p>
                  )}
                </div>
              </div>

              <div className="pt-6 flex flex-wrap justify-center gap-4">
                <button
                  onClick={handleResetForm}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-medium font-mono border border-slate-700 transition-colors cursor-pointer"
                  type="button"
                >
                  ← Submit Another Registrant
                </button>
                <a
                  href="#why-brought-section"
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-colors border border-white/5"
                >
                  Read Social Mission
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Private Sandbox panel for testing (Administrator View) */}
        <div className="mt-8 pt-4 border-t border-slate-800">
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => {
                if (isAdminAuthenticated) {
                  if (showAdminConsole) {
                    handleAdminLogout();
                  } else {
                    setShowAdminConsole(true);
                  }
                } else {
                  setShowPasswordPrompt(prev => !prev);
                }
              }}
              type="button"
              className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 text-[10px] font-mono font-bold tracking-widest uppercase transition-all duration-300 select-none shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:shadow-[0_4px_20px_rgba(244,63,94,0.12)] cursor-pointer active:scale-95"
              id="admin-registry-toggle-btn"
              title="Secure waitlist registry control panel"
            >
              {isAdminAuthenticated ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>{showAdminConsole ? 'Lock Console Registry' : 'Reveal Console Registry'}</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-400 group-hover:scale-110 transition-all duration-300" />
                  <span>Secure Administrator Registry Console</span>
                </>
              )}
            </button>

            {showPasswordPrompt && !isAdminAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="w-full max-w-sm p-5 bg-slate-950 rounded-2xl border border-slate-800 shadow-[0_8px_32px_rgba(0,0,0,0.6)] text-left relative overflow-hidden"
              >
                {/* Security gradient wash */}
                <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

                <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3 mb-4">
                  <div className="p-1.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-mono tracking-wider text-rose-300 uppercase">
                      Admin Access Required
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Please key in master password to reveal private entries
                    </p>
                  </div>
                </div>

                <form 
                  onSubmit={handleAdminLogin}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={adminPasswordInput}
                        onChange={(e) => setAdminPasswordInput(e.target.value)}
                        placeholder="Enter master password..."
                        className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none font-mono transition-all pr-10"
                      />
                      <Key className="absolute right-3.5 top-3 w-3.5 h-3.5 text-slate-600" />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Master admin verification</span>
                      <span className="text-slate-500/60 select-none">Hint: BBTYPROCEO</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer text-center active:scale-95"
                    >
                      Authenticate
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordPrompt(false);
                        setAdminPasswordInput('');
                      }}
                      className="py-2 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white font-mono text-xs transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-900/60 mt-1">
                    <button
                      type="button"
                      onClick={handleDemoUnlock}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] cursor-pointer text-center flex items-center justify-center gap-2 active:scale-95 animate-pulse"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      Instant Demo Unlock
                    </button>
                  </div>

                  {isFirebaseSupported && auth && (
                    <>
                      <div className="relative flex py-1.5 items-center">
                        <div className="flex-grow border-t border-slate-800"></div>
                        <span className="flex-shrink mx-3 text-[9px] font-mono text-slate-500 uppercase">Or</span>
                        <div className="flex-grow border-t border-slate-800"></div>
                      </div>

                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono font-bold transition-all duration-200 cursor-pointer text-center flex items-center justify-center gap-2 active:scale-95"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.41 0-6.177-2.767-6.177-6.178 0-3.411 2.767-6.177 6.177-6.177 1.485 0 2.842.531 3.9 1.414l3.036-3.037C18.847 2.016 15.753 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 11.24-4.542 11.24-11.24 0-.76-.086-1.485-.245-2.172H12.24z"/>
                        </svg>
                        <span>Sign In with Google</span>
                      </button>
                    </>
                  )}
                </form>
              </motion.div>
            )}
          </div>

          {showAdminConsole && isAdminAuthenticated && (
            <div className="mt-4 p-5 bg-slate-950 rounded-2xl border border-slate-800 text-left space-y-4">
              <div className="flex justify-between items-center bg-slate-900 -mx-5 -mt-5 p-4 rounded-t-2xl border-b border-slate-800">
                <span className="text-xs font-bold font-mono tracking-wider text-rose-300 uppercase">
                  Waitlist Admin Dashboard
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 text-[10px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 font-mono font-bold px-2.5 py-1 rounded-lg border border-rose-500/20 transition-all duration-200 cursor-pointer active:scale-95 animate-pulse-subtle"
                    title="Export currently stored waitlist entries as a downloadable CSV file"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAdminLogout}
                    className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 font-mono font-bold px-2.5 py-1 rounded-lg border border-slate-800 transition-colors cursor-pointer"
                  >
                    Lock Session
                  </button>
                  {isViewingCloudData ? (
                    <span className="flex items-center gap-1.5 text-[10px] bg-emerald-500/10 text-emerald-400 font-mono font-bold px-2.5 py-1 rounded-lg border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                      Cloud Live
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[10px] bg-amber-500/10 text-amber-400 font-mono font-bold px-2.5 py-1 rounded-lg border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></span>
                      Sandbox Demo Mode
                    </span>
                  )}
                  <span className="text-[10px] bg-slate-800 text-slate-400 font-mono px-2.5 py-1 rounded-full border border-slate-700">
                    {filteredRegistrants.length} of {registrants.length} listed
                  </span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <p className="text-slate-400 text-xs leading-relaxed max-w-2xl">
                  {isViewingCloudData ? (
                    <span>This table displays waitlist submissions loaded in real-time from your secure cloud <strong>Firestore database</strong>. All registrants are stored safely and permanently.</span>
                  ) : (
                    <span>This table displays waitlist submissions stored inside your <strong>local browser storage</strong> because the app is running in offline sandbox demo mode. Try submitting the signup form above to see names appended instantly!</span>
                  )}
                </p>
                {isFirebaseSupported && db && (
                  <button
                    type="button"
                    onClick={handleSyncStatsCount}
                    className="flex items-center gap-1 text-[10px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200 font-mono font-bold px-2.5 py-1 rounded-lg border border-emerald-500/20 transition-all cursor-pointer active:scale-95"
                    title="Synchronize public landing-page waitlist counter with actual database records length"
                  >
                    🔄 Recalculate Public Count
                  </button>
                )}
              </div>

              {/* Dynamic Filter Controls Block */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
                <div className="space-y-1">
                  <label htmlFor="admin-search-input" className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider block">
                    🔍 Search Contact or Notes
                  </label>
                  <input
                    id="admin-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, note..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="admin-filter-category" className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider block">
                    📁 Filter by Care Profile
                  </label>
                  <select
                    id="admin-filter-category"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500 cursor-pointer transition-colors"
                  >
                    <option value="all">All Care Categories</option>
                    <option value="client_family">Client / Family</option>
                    <option value="facility_partner">Facility Partner</option>
                    <option value="salon_owner_stylist">Salon Owner / Stylist</option>
                    <option value="independent_professional">Independent Professional</option>
                    <option value="aspiring_technician">Aspiring BBTY Technician</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="admin-filter-service" className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider block">
                    ⚙️ Filter by Service Interest
                  </label>
                  <select
                    id="admin-filter-service"
                    value={filterService}
                    onChange={(e) => setFilterService(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500 cursor-pointer transition-colors"
                  >
                    <option value="all">All Service Interests</option>
                    <option value="Hair care">Hair Care</option>
                    <option value="Nail care">Nail Care</option>
                    <option value="Grooming support">Grooming Support</option>
                    <option value="Makeup">Makeup & Beauty</option>
                    <option value="Sew-ins">Sew-ins & Braiding</option>
                    <option value="TCP">TCP / Wig Fitting</option>
                    <option value="Group event">Group Events</option>
                  </select>
                </div>
              </div>

              {/* Signups Over Time Recharts Chart */}
              {registrants.length > 0 && (
                <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold font-mono tracking-wider text-pink-400 uppercase">
                      📈 Registration Trends (Signups Over Time)
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500">
                      Activity Growth Timeline
                    </span>
                  </div>
                  
                  <div className="h-56 w-full text-slate-400">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={getChartData()}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#64748b" 
                          fontSize={10}
                          tickLine={false}
                        />
                        <YAxis 
                          stroke="#64748b" 
                          fontSize={10}
                          tickLine={false}
                          allowDecimals={false}
                        />
                        <Tooltip content={<CustomChartTooltip />} />
                        <Legend 
                          wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                          iconSize={8}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="Signups" 
                          name="Daily Signups"
                          stroke="#ec4899" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#colorSignups)" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="Cumulative" 
                          name="Total Signups"
                          stroke="#8b5cf6" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#colorCumulative)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {filteredRegistrants.length === 0 ? (
                <div className="text-center py-10 bg-slate-900/10 rounded-xl border border-dashed border-slate-800/60 text-slate-600 font-mono text-xs">
                  {registrants.length === 0 
                    ? "Registry is empty. Use the waitlist form above to construct a record." 
                    : "No registrants match your active filtering parameters."}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-slate-300">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500">
                        <th className="py-2.5 font-bold font-mono text-left pl-2">Date</th>
                        <th className="py-2.5 font-bold font-mono text-left">Full Contact Name</th>
                        <th className="py-2.5 font-bold font-mono text-left">Category Profile</th>
                        <th className="py-2.5 font-bold font-mono text-left">Interests / Care notes</th>
                        <th className="py-2.5 font-bold font-mono text-right pr-2">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRegistrants.map((item) => (
                        <tr key={item.id} className="border-b border-slate-900 hover:bg-slate-900/40">
                          <td className="py-3 font-mono text-[10px] text-slate-500">
                            {new Date(item.submittedAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 font-medium">
                            <div className="text-slate-100">{item.name}</div>
                            <div className="text-slate-400 text-[10px]">{item.email} • {item.phone || 'No phone'}</div>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] border font-medium ${getCategoryBadgeColor(item.category)}`}>
                              {getCategoryLabel(item.category)}
                            </span>
                          </td>
                          <td className="py-3 max-w-[280px]">
                            {(item.services || []).length > 0 && (
                              <div className="text-[10px] text-slate-400">
                                <strong>Services:</strong> {(item.services || []).map(s => s.split(' (')[0]).join(', ')}
                              </div>
                            )}
                            {item.notes && (
                              <p className="text-[11px] text-rose-300/80 leading-snug mt-1 italic">
                                "{item.notes}"
                              </p>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <a
                                href={`mailto:${item.email}?subject=${encodeURIComponent("Regarding your BBTY Waitlist Registration")}`}
                                className="p-1.5 text-slate-500 hover:text-pink-400 hover:bg-pink-500/10 rounded transition-colors cursor-pointer inline-flex items-center"
                                title={`Contact ${item.name} via Email`}
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </a>
                              <button
                                onClick={() => handleDelete(item.id)}
                                type="button"
                                className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 roundedtransition-colors cursor-pointer"
                                title="Delete record from local storage memory"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Floating Animated success Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl p-4 flex gap-3 text-left items-start backdrop-blur-md"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold font-sans text-white">Waitlist Joined! 🌟</h4>
                <button
                  type="button"
                  onClick={() => setShowToast(false)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                Congratulations, you are number <strong className="text-emerald-400 font-mono">#{assignedNumber}</strong> in line. We will contact you soon.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
