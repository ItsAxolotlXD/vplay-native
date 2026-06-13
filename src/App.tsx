import React, { useState, useEffect } from "react";
import { 
  Smartphone, 
  Info, 
  X, 
  RefreshCw,
  Search,
  MoreVertical,
  Menu,
  Home,
  Tv,
  Package,
  Settings,
  User,
  Loader2,
  UserPlus,
  Users,
  UserCheck,
  UserMinus,
  Check,
  AlertTriangle,
  Upload,
  ChevronUp,
  ChevronDown,
  ChevronsUp,
  ChevronsDown,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { CHANNELS_DATA, Channel } from "./channelsData";
import MaterialPlayer from "./components/MaterialPlayer";
import ChannelList from "./components/ChannelList";
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile, 
  onAuthStateChanged,
  type User as FirebaseUser,
  db,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot
} from "./firebase";

type AppTab = "trang-chu" | "truc-tiep" | "package" | "cai-dat" | "sign-in" | "vplay-android-faq" | "tim-kiem";

export default function App() {
  // Load Dark Mode state (default is false/off as specified)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("vplay-dark-mode");
      return saved === "true"; // default is false unless saved as true
    } catch {
      return false;
    }
  });

  // Load favorites from local storage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("vplay-favorites");
      return saved ? JSON.parse(saved) : ["vtv1-hd", "vtv3-hd", "kplus-sport-1-hd"];
    } catch {
      return ["vtv1-hd", "vtv3-hd", "kplus-sport-1-hd"];
    }
  });

  // Load grid columns count (default is 3, optional is 2)
  const [columnsCount, setColumnsCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("vplay-columns-count");
      return saved === "2" ? 2 : 3;
    } catch {
      return 3;
    }
  });

  // Load dev search mode setting (default is false)
  const [searchEnabled, setSearchEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("vplay-dev-search");
      return saved === "true";
    } catch {
      return false;
    }
  });

  // Load dev hamburger menu setting (default is false)
  const [hamburgerEnabled, setHamburgerEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("vplay-dev-hamburger");
      return saved === "true";
    } catch {
      return false;
    }
  });

  // Load dev bottom bar setting (default is false)
  const [bottomBarEnabled, setBottomBarEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("vplay-dev-bottombar");
      return saved === "true";
    } catch {
      return false;
    }
  });

  // Load dev status bar clock setting (default is false)
  const [displayClockEnabled, setDisplayClockEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("vplay-dev-clock");
      return saved === "true";
    } catch {
      return false;
    }
  });

  // Real-time clock state
  const [timeStr, setTimeStr] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, "0");
      const mins = String(now.getMinutes()).padStart(2, "0");
      const secs = String(now.getSeconds()).padStart(2, "0");
      setTimeStr(`${hrs}:${mins}:${secs}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load playback quality setting (default is 720p)
  const [playbackQuality, setPlaybackQuality] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("vplay-play-quality");
      return saved || "720p";
    } catch {
      return "720p";
    }
  });

  // Load animation preview setting (default is false)
  const [animationPreviewEnabled, setAnimationPreviewEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("vplay-dev-animation");
      return saved === "true";
    } catch {
      return false;
    }
  });

  // Load Rounded Corners setting (default is false)
  const [roundedCornersEnabled, setRoundedCornersEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("vplay-dev-rounded");
      return saved === "true";
    } catch {
      return false;
    }
  });

  // Load New Icon setting (default is false)
  const [newIconEnabled, setNewIconEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("vplay-dev-newicon");
      return saved === "true";
    } catch {
      return false;
    }
  });

  // Load Floaty bars setting (default is false)
  const [floatyBarsEnabled, setFloatyBarsEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("vplay-dev-floatybars");
      return saved === "true";
    } catch {
      return false;
    }
  });

  // Saved Custom TV Channels for the live tab ("truc-tiep")
  const [customTvChannels, setCustomTvChannels] = useState<Channel[]>(() => {
    try {
      const saved = localStorage.getItem("vplay-custom-tv-channels");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal and custom channel states
  const [showAddChannelModal, setShowAddChannelModal] = useState<boolean>(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelUrl, setNewChannelUrl] = useState("");
  const [newChannelLogo, setNewChannelLogo] = useState("");

  // Load dev home recommendation setting (default is true)
  const [homeRecommendationEnabled, setHomeRecommendationEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("vplay-dev-home");
      return saved !== null ? saved === "true" : true;
    } catch {
      return true;
    }
  });

  // Package feature visibility flag (defaults to true)
  const [packageEnabled, setPackageEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("vplay-package-enabled");
      return saved !== "false"; // default is true
    } catch {
      return true;
    }
  });

  // Immersive search feature flag (defaults to true)
  const [immersiveSearchEnabled, setImmersiveSearchEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("vplay-immersive-search");
      return saved !== "false"; // default is true
    } catch {
      return true;
    }
  });

  // Saved Custom Package channels for custom stream playback
  const [customChannels, setCustomChannels] = useState<Channel[]>(() => {
    try {
      const saved = localStorage.getItem("vplay-custom-package-channels");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Current playing custom stream channel
  const [currentCustomChannel, setCurrentCustomChannel] = useState<Channel | null>(() => {
    try {
      const saved = localStorage.getItem("vplay-custom-package-channels");
      if (saved) {
        const parsed = JSON.parse(saved) as Channel[];
        return parsed[0] || null;
      }
    } catch {}
    return null;
  });

  // IPTV custom package state handlers
  const [singleStreamUrl, setSingleStreamUrl] = useState("");
  const [singleStreamName, setSingleStreamName] = useState("");
  const [singleStreamLogo, setSingleStreamLogo] = useState("");
  const [packageViewTab, setPackageViewTab] = useState<"direct" | "playlist" | "channels">("channels");

  const parseM3U8 = (content: string): Channel[] => {
    const lines = content.split("\n");
    const channelsList: Channel[] = [];
    let currentInfo: { name: string; logo: string; group?: string } | null = null;
    let idCounter = 1;

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      if (line.startsWith("#EXTINF:")) {
        const nameMatch = line.match(/,(.+)$/);
        const name = nameMatch ? nameMatch[1].trim() : `Custom Channel ${idCounter}`;
        
        const logoMatch = line.match(/tvg-logo="([^"]+)"/) || line.match(/logo="([^"]+)"/);
        const logo = logoMatch ? logoMatch[1] : "";

        const groupMatch = line.match(/group-title="([^"]+)"/);
        const group = groupMatch ? groupMatch[1] : "Tùy chỉnh";

        currentInfo = { name, logo, group };
      } else if (line.startsWith("http://") || line.startsWith("https://")) {
        if (currentInfo) {
          channelsList.push({
            id: `custom-pkg-${idCounter++}-${Date.now()}`,
            name: currentInfo.name,
            logo: currentInfo.logo,
            group: currentInfo.group || "Tùy chỉnh",
            url: line
          });
          currentInfo = null;
        } else {
          channelsList.push({
            id: `custom-pkg-${idCounter++}-${Date.now()}`,
            name: `Kênh tùy chỉnh ${idCounter}`,
            logo: "",
            group: "Tùy chỉnh",
            url: line
          });
        }
      }
    }
    return channelsList;
  };

  const handleM3U8Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;
      const parsed = parseM3U8(text);
      if (parsed.length > 0) {
        setCustomChannels((prev) => [...prev, ...parsed]);
        if (!currentCustomChannel) {
          setCurrentCustomChannel(parsed[0]);
        }
        setPackageViewTab("channels");
      } else {
        alert("Không tìm thấy dòng kênh hợp lệ nào trong file này. Hãy chắc chắn file chứa định dạng .m3u8.");
      }
    };
    reader.readAsText(file);
  };

  const handleAddSingleStream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleStreamUrl) return;

    const newChannel: Channel = {
      id: `custom-pkg-single-${Date.now()}`,
      name: singleStreamName.trim() || `Luồng tùy chỉnh ${customChannels.length + 1}`,
      logo: singleStreamLogo.trim(),
      group: "Tùy chỉnh",
      url: singleStreamUrl.trim()
    };

    setCustomChannels((prev) => [...prev, newChannel]);
    if (!currentCustomChannel) {
      setCurrentCustomChannel(newChannel);
    }
    setSingleStreamUrl("");
    setSingleStreamName("");
    setSingleStreamLogo("");
    setPackageViewTab("channels");
  };

  const [allChannels, setAllChannels] = useState<Channel[]>(() => {
    let customList: Channel[] = [];
    try {
      const customSaved = localStorage.getItem("vplay-custom-tv-channels");
      if (customSaved) {
        customList = JSON.parse(customSaved) as Channel[];
      }
    } catch {}
    const baseList = [...CHANNELS_DATA, ...customList];

    try {
      const saved = localStorage.getItem("vplay-channels-order");
      if (saved) {
        const parsedIds = JSON.parse(saved) as string[];
        const ordered = parsedIds
          .map(id => baseList.find(c => c.id === id))
          .filter((c): c is Channel => !!c);
        
        const remaining = baseList.filter(c => !parsedIds.includes(c.id));
        return [...ordered, ...remaining];
      }
    } catch (e) {
      console.error("Error parsing saved channels order", e);
    }
    return baseList;
  });

  const handleAddCustomTvChannel = (name: string, url: string, logo: string) => {
    const newChan: Channel = {
      id: "custom-tv-" + Date.now(),
      name,
      url,
      logo: logo || "",
      group: "Tùy chỉnh",
    };
    (newChan as any).isCustom = true;

    const updatedCustom = [...customTvChannels, newChan];
    setCustomTvChannels(updatedCustom);
    localStorage.setItem("vplay-custom-tv-channels", JSON.stringify(updatedCustom));

    const updatedAll = [...allChannels, newChan];
    setAllChannels(updatedAll);
    localStorage.setItem("vplay-channels-order", JSON.stringify(updatedAll.map(c => c.id)));
  };

  const handleDeleteCustomTvChannel = (channelId: string) => {
    const updatedCustom = customTvChannels.filter(c => c.id !== channelId);
    setCustomTvChannels(updatedCustom);
    localStorage.setItem("vplay-custom-tv-channels", JSON.stringify(updatedCustom));

    const updatedAll = allChannels.filter(c => c.id !== channelId);
    setAllChannels(updatedAll);
    localStorage.setItem("vplay-channels-order", JSON.stringify(updatedAll.map(c => c.id)));

    if (currentChannel && currentChannel.id === channelId) {
      if (updatedAll.length > 0) {
        setCurrentChannel(updatedAll[0]);
      }
    }
  };

  const [showReorderPanel, setShowReorderPanel] = useState(false);

  const moveChannel = (index: number, direction: "up" | "down" | "top" | "bottom") => {
    const updated = [...allChannels];
    const target = updated[index];
    if (!target) return;

    if (direction === "up" && index > 0) {
      updated.splice(index, 1);
      updated.splice(index - 1, 0, target);
    } else if (direction === "down" && index < updated.length - 1) {
      updated.splice(index, 1);
      updated.splice(index + 1, 0, target);
    } else if (direction === "top" && index > 0) {
      updated.splice(index, 1);
      updated.unshift(target);
    } else if (direction === "bottom" && index < updated.length - 1) {
      updated.splice(index, 1);
      updated.push(target);
    }

    setAllChannels(updated);
    localStorage.setItem("vplay-channels-order", JSON.stringify(updated.map(c => c.id)));
  };

  const resetChannelOrder = () => {
    const baseList = [...CHANNELS_DATA, ...customTvChannels];
    setAllChannels(baseList);
    localStorage.removeItem("vplay-channels-order");
  };

  // New States for Home Recommendation cycling
  const [recommendedChannels, setRecommendedChannels] = useState<Channel[]>([]);
  const [isSpinningRecommendation, setIsSpinningRecommendation] = useState(false);

  // Initial load recommendation
  useEffect(() => {
    if (allChannels.length > 0) {
      const shuffled = [...allChannels].sort(() => 0.5 - Math.random());
      setRecommendedChannels(shuffled.slice(0, 9));
    }
  }, [allChannels]);

  // Interval rotation: 5s display -> 1s rotate / spinning animation -> repeat
  useEffect(() => {
    if (allChannels.length === 0) return;

    const interval = setInterval(() => {
      // Start spin after 5 seconds of active view
      setIsSpinningRecommendation(true);

      // Spin lasts for 1 second, then updates items and resets spinning flag
      setTimeout(() => {
        const shuffled = [...allChannels].sort(() => 0.5 - Math.random());
        setRecommendedChannels(shuffled.slice(0, 9));
        setIsSpinningRecommendation(false);
      }, 1000);

    }, 6000); // 5s active + 1s spinning = 6s total cycle

    return () => clearInterval(interval);
  }, [allChannels]);

  // Active playing channel
  const [currentChannel, setCurrentChannel] = useState<Channel>(() => {
    return allChannels[0];
  });

  // Previous playing channel trace for rewind/back to previous channel feature
  const [previousChannel, setPreviousChannel] = useState<Channel | null>(null);

  // Tab State & Dropdown toggle
  const [activeTab, setActiveTab] = useState<AppTab>("truc-tiep");
  const [showAppsMenu, setShowAppsMenu] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [logoScale, setLogoScale] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("vplay-logo-scale");
      return saved !== null ? Number(saved) : 70;
    } catch {
      return 70;
    }
  });

  const switchTab = (tab: AppTab) => {
    if (activeTab === tab) return;
    setIsNavigating(true);
    setActiveTab(tab);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 1000);
    return () => clearTimeout(timer);
  };

  // Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [selectedSubTab, setSelectedSubTab] = useState("Tất cả");

  const [randomSearchSuggestion, setRandomSearchSuggestion] = useState("VTV3");
  useEffect(() => {
    const list = allChannels.filter(c => c.group !== "Phát thanh");
    if (list.length > 0) {
      const initial = list[Math.floor(Math.random() * list.length)];
      if (initial) {
        setRandomSearchSuggestion(initial.name);
      }
    }

    const interval = setInterval(() => {
      const activeTvChans = allChannels.filter(c => c.group !== "Phát thanh");
      if (activeTvChans.length > 0) {
        const randomChan = activeTvChans[Math.floor(Math.random() * activeTvChans.length)];
        if (randomChan) {
          setRandomSearchSuggestion(randomChan.name);
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [allChannels]);

  // Experimental Remote control feature states
  const [remoteEnabled, setRemoteEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("vplay-dev-remote");
      return saved === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem("vplay-dev-remote", String(remoteEnabled));
  }, [remoteEnabled]);

  const [showRemoteUI, setShowRemoteUI] = useState(false);
  const [remoteDialDigits, setRemoteDialDigits] = useState("");

  const [thickSearchEnabled, setThickSearchEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("vplay-thick-search");
      return saved === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem("vplay-thick-search", String(thickSearchEnabled));
  }, [thickSearchEnabled]);

  const [settingsSearchQuery, setSettingsSearchQuery] = useState("");

  const getMatchedChannelForRemote = (digits: string) => {
    if (!digits) return null;
    const num = parseInt(digits, 10);
    if (isNaN(num)) return null;

    // Try finding by index first (1-based index)
    if (num > 0 && num <= allChannels.length) {
      return allChannels[num - 1];
    }

    // Try finding by exact matching number in the name (e.g. "3" -> VTV3 or HTV3)
    const normalizedDigits = digits.trim();
    const matchesByNameNumber = allChannels.find(c => {
      const nameParts = c.name.split(/[^0-9]/);
      return nameParts.includes(normalizedDigits);
    });
    if (matchesByNameNumber) return matchesByNameNumber;

    // Fallback: contains the digits as a substring
    const matchesSubstring = allChannels.find(c => c.name.toLowerCase().includes(normalizedDigits));
    if (matchesSubstring) return matchesSubstring;

    return null;
  };

  // Reusable custom polished toggle switch component
  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => {
    return (
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center cursor-pointer focus:outline-none rounded-full transition-colors duration-200 ${
          checked ? "bg-[#1a73e8]" : "bg-gray-300"
        }`}
      >
        {animationPreviewEnabled ? (
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="inline-block h-4 w-4 rounded-full bg-white shadow-sm"
            style={{ marginLeft: checked ? "24px" : "4px" }}
          />
        ) : (
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-200 ${
              checked ? "translate-x-6" : "translate-x-1"
            }`}
          />
        )}
      </button>
    );
  };

  // Show App Help/Info dialog
  const [showHelp, setShowHelp] = useState(false);

  // Login States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("vplay-logged-in");
      return saved === "true";
    } catch {
      return false;
    }
  });
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  
  // Profile Form States
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState(() => {
    try {
      const saved = localStorage.getItem("vplay-custom-avatar");
      return saved || "";
    } catch {
      return "";
    }
  });

  // Profile / Username state
  const [currentUsername, setCurrentUsername] = useState<string>("");

  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [appCrashed, setAppCrashed] = useState(false);

  // Translation helper for Firebase Auth Errors
  const translateAuthError = (code: string) => {
    switch (code) {
      case "auth/invalid-email":
        return "Địa chỉ email không hợp lệ.";
      case "auth/user-disabled":
        return "Tài khoản của bạn đã bị khóa.";
      case "auth/user-not-found":
        return "Không tìm thấy tài khoản với email này.";
      case "auth/wrong-password":
        return "Mật khẩu không chính xác.";
      case "auth/email-already-in-use":
        return "Địa chỉ email này đã được sử dụng.";
      case "auth/weak-password":
        return "Mật khẩu quá yếu (tối thiểu 6 ký tự).";
      case "auth/invalid-credential":
        return "Thông tin đăng nhập không hợp lệ hoặc mật khẩu sai.";
      default:
        return "Đã xảy ra lỗi hệ thống, vui lòng thử lại sau.";
    }
  };

  // Sync state with live Firebase Auth stream
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setIsLoggedIn(true);
        setDisplayName(user.displayName || "");
        setPhotoURL(user.photoURL || "");
        localStorage.setItem("vplay-logged-in", "true");

        // Fetch username from Firestore
        try {
          const userDocRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setCurrentUsername(data.username || "");
            if (data.photoURL) {
              setPhotoURL(data.photoURL);
            }
          } else {
            // Auto generate username for legacy users
            const autoUsername = user.email?.split("@")[0] || "user_" + user.uid.slice(0, 5);
            try {
              await setDoc(userDocRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || autoUsername,
                username: autoUsername,
                friends: []
              }, { merge: true });
              
              await setDoc(doc(db, "usernames", autoUsername.toLowerCase()), {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || autoUsername,
                username: autoUsername
              }, { merge: true });
            } catch (writeErr) {
              console.warn("Error auto-registering user offline:", writeErr);
            }
            setCurrentUsername(autoUsername);
          }
        } catch (err: any) {
          console.warn("Offline or failed fetching user profile from Firestore, using client-side fallback:", err.message);
          const fallbackUsername = user.displayName || user.email?.split("@")[0] || "user_" + user.uid.slice(0, 5);
          setCurrentUsername(fallbackUsername);
        }
      } else {
        setCurrentUser(null);
        setIsLoggedIn(false);
        setDisplayName("");
        setCurrentUsername("");
        localStorage.setItem("vplay-logged-in", "false");
        try {
          const savedCustomAvatar = localStorage.getItem("vplay-custom-avatar");
          if (savedCustomAvatar) {
            setPhotoURL(savedCustomAvatar);
          } else {
            setPhotoURL("");
          }
        } catch {
          setPhotoURL("");
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen to profile updates in real-time
  useEffect(() => {
    if (!currentUser) return;
    const userDocRef = doc(db, "users", currentUser.uid);
    const unsub = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.username) {
          setCurrentUsername(data.username);
        }
        if (data.photoURL) {
          setPhotoURL(data.photoURL);
        }
      }
    }, (err) => {
      console.error("Firestore onSnapshot error:", err);
    });
    return () => unsub();
  }, [currentUser]);

  // Firebase Auth functions
  const handleTestAccountLogin = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const testEmail = "vplayandroid@vplay-user.net";
      const testUsername = "vplayandroid";
      const testPassword = "abc123";
      
      try {
        await signInWithEmailAndPassword(auth, testEmail, testPassword);
      } catch (signInErr: any) {
        if (
          signInErr.code === "auth/user-not-found" || 
          signInErr.code === "auth/invalid-credential" || 
          signInErr.code === "auth/wrong-password" ||
          signInErr.message?.includes("USER_NOT_FOUND") ||
          signInErr.message?.includes("INVALID_LOGIN_CREDENTIALS")
        ) {
          // Auto create test account in Firebase & Firestore!
          try {
            const res = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
            if (res.user) {
              await updateProfile(res.user, {
                displayName: "Tuyển thủ Vplay Thử nghiệm"
              });
              
              // Save records to Firestore
              const userDocRef = doc(db, "users", res.user.uid);
              await setDoc(userDocRef, {
                uid: res.user.uid,
                email: testEmail,
                displayName: "Tuyển thủ Vplay Thử nghiệm",
                username: testUsername,
                friends: []
              }, { merge: true });

              await setDoc(doc(db, "usernames", testUsername), {
                uid: res.user.uid,
                email: testEmail,
                displayName: "Tuyển thủ Vplay Thử nghiệm",
                username: testUsername
              }, { merge: true });

              setDisplayName("Tuyển thủ Vplay Thử nghiệm");
              setCurrentUsername(testUsername);
            }
          } catch (regErr) {
            console.error("Auto registration of test account failed:", regErr);
            // Fallback: try signin one last time
            await signInWithEmailAndPassword(auth, testEmail, testPassword);
          }
        } else {
          throw signInErr;
        }
      }
    } catch (err: any) {
      console.error("Login test account error:", err);
      setAuthError(translateAuthError(err.code));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      const target = e.target as any;
      const identity = target.loginIdentity.value.trim();
      const password = target.password.value;

      if (!identity) {
        setAuthError("Vui lòng nhập Email hoặc Tên đăng nhập.");
        setAuthLoading(false);
        return;
      }

      // Intercept special test account
      if (identity.toLowerCase() === "vplayandroid" && password === "abc123") {
        await handleTestAccountLogin();
        return;
      }

      let email = identity;

      // If it doesn't look like an email (no '@'), treat as username!
      if (!identity.includes("@")) {
        const usernameLower = identity.toLowerCase();
        const usernameDocRef = doc(db, "usernames", usernameLower);
        const usernameSnap = await getDoc(usernameDocRef);

        if (!usernameSnap.exists()) {
          setAuthError(`Tên đăng nhập "${identity}" không tồn tại trong hệ thống.`);
          setAuthLoading(false);
          return;
        }

        email = usernameSnap.data().email;
      }

      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error("Login error:", err);
      setAuthError(translateAuthError(err.code));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      const target = e.target as any;
      const rawUsername = target.username.value.trim();
      const name = target.displayName.value.trim();
      let email = target.email.value.trim();
      const password = target.password.value;

      // Validate Username
      if (!rawUsername) {
        setAuthError("Tên đăng nhập không được để trống.");
        setAuthLoading(false);
        return;
      }

      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(rawUsername)) {
        setAuthError("Tên đăng nhập phải từ 3-20 ký tự, chỉ chứa chữ cái, số và dấu gạch dưới.");
        setAuthLoading(false);
        return;
      }

      const usernameLower = rawUsername.toLowerCase();

      // Check if username already exists in Firestore
      const usernameDocRef = doc(db, "usernames", usernameLower);
      const usernameCheck = await getDoc(usernameDocRef);
      if (usernameCheck.exists()) {
        setAuthError(`Tên đăng nhập "${rawUsername}" đã được sử dụng bởi tuyển thủ khác.`);
        setAuthLoading(false);
        return;
      }

      // If email is empty, auto-generate one
      if (!email) {
        email = `${usernameLower}@vplay-user.net`;
      }

      const res = await createUserWithEmailAndPassword(auth, email, password);
      if (res.user) {
        await updateProfile(res.user, {
          displayName: name
        });

        // Save records to Firestore
        const userDocRef = doc(db, "users", res.user.uid);
        await setDoc(userDocRef, {
          uid: res.user.uid,
          email: email,
          displayName: name,
          username: rawUsername,
          friends: []
        }, { merge: true });

        await setDoc(doc(db, "usernames", usernameLower), {
          uid: res.user.uid,
          email: email,
          displayName: name,
          username: rawUsername
        }, { merge: true });

        setDisplayName(name);
        setCurrentUsername(rawUsername);
        setIsRegistering(false);
      }
    } catch (err: any) {
      console.error("Register error:", err);
      setAuthError(translateAuthError(err.code));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Kích thước ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 150;
        const MAX_HEIGHT = 150;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.75); // compress to JPG, 75% quality
          setPhotoURL(dataUrl);
          try {
            localStorage.setItem("vplay-custom-avatar", dataUrl);
          } catch (e) {
            console.warn("Could not save avatar to localStorage", e);
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setAuthLoading(true);
    setAuthError(null);
    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName,
        photoURL: photoURL
      });
      
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, {
        displayName: displayName,
        photoURL: photoURL
      });
      
      if (currentUsername) {
        const usernameDocRef = doc(db, "usernames", currentUsername.toLowerCase());
        await updateDoc(usernameDocRef, {
          displayName: displayName,
          photoURL: photoURL
        });
      }
      alert("Cập nhật thông tin hồ sơ thành công!");
    } catch (err: any) {
      console.error("Profile update error:", err);
      setAuthError("Không thể cập nhật hồ sơ. Thử lại sau.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error("Logout error:", err);
    } finally {
      setAuthLoading(false);
    }
  };

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("vplay-favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Persist dark mode setting
  useEffect(() => {
    localStorage.setItem("vplay-dark-mode", String(darkMode));
  }, [darkMode]);

  // Persist grid columns setting
  useEffect(() => {
    localStorage.setItem("vplay-columns-count", String(columnsCount));
  }, [columnsCount]);

  useEffect(() => {
    localStorage.setItem("vplay-logo-scale", String(logoScale));
  }, [logoScale]);

  // Persist Developer settings
  useEffect(() => {
    localStorage.setItem("vplay-dev-search", String(searchEnabled));
  }, [searchEnabled]);

  useEffect(() => {
    localStorage.setItem("vplay-package-enabled", String(packageEnabled));
  }, [packageEnabled]);

  useEffect(() => {
    localStorage.setItem("vplay-immersive-search", String(immersiveSearchEnabled));
  }, [immersiveSearchEnabled]);

  useEffect(() => {
    localStorage.setItem("vplay-custom-package-channels", JSON.stringify(customChannels));
  }, [customChannels]);

  useEffect(() => {
    localStorage.setItem("vplay-dev-hamburger", String(hamburgerEnabled));
  }, [hamburgerEnabled]);

  useEffect(() => {
    localStorage.setItem("vplay-dev-bottombar", String(bottomBarEnabled));
  }, [bottomBarEnabled]);

  useEffect(() => {
    localStorage.setItem("vplay-dev-clock", String(displayClockEnabled));
  }, [displayClockEnabled]);

  useEffect(() => {
    localStorage.setItem("vplay-dev-home", String(homeRecommendationEnabled));
  }, [homeRecommendationEnabled]);

  useEffect(() => {
    localStorage.setItem("vplay-play-quality", playbackQuality);
  }, [playbackQuality]);

  useEffect(() => {
    localStorage.setItem("vplay-dev-animation", String(animationPreviewEnabled));
  }, [animationPreviewEnabled]);

  useEffect(() => {
    localStorage.setItem("vplay-dev-rounded", String(roundedCornersEnabled));
  }, [roundedCornersEnabled]);

  useEffect(() => {
    localStorage.setItem("vplay-dev-newicon", String(newIconEnabled));
  }, [newIconEnabled]);

  useEffect(() => {
    localStorage.setItem("vplay-dev-floatybars", String(floatyBarsEnabled));
  }, [floatyBarsEnabled]);

  // Toggle Favorite helper
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // Select channel group
  const handleSelectChannel = (channel: Channel): boolean => {
    const nameOrId = `${channel.name} ${channel.id}`.toUpperCase();
    const needsLogin = nameOrId.includes("ON") || nameOrId.includes("HTV") || nameOrId.includes("VTV");
    if (!isLoggedIn && needsLogin) {
      setShowLoginPopup(true);
      return false;
    }

    if (currentChannel && currentChannel.id !== channel.id) {
      setPreviousChannel(currentChannel);
    }
    setCurrentChannel(channel);
    // Smooth scroll top on mobile layout
    window.scrollTo({ top: 0, behavior: "smooth" });
    return true;
  };

  const handleRewind = () => {
    if (previousChannel) {
      const temp = currentChannel;
      setCurrentChannel(previousChannel);
      setPreviousChannel(temp);
      switchTab("truc-tiep");
    }
  };

  const handleNavigateChannel = (direction: "prev" | "next") => {
    if (allChannels.length === 0) return;
    const currentIndex = allChannels.findIndex(c => c.id === currentChannel?.id);
    if (currentIndex === -1) {
      handleSelectChannel(allChannels[0]);
    } else {
      let nextIndex = currentIndex;
      if (direction === "prev") {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : allChannels.length - 1;
      } else {
        nextIndex = currentIndex < allChannels.length - 1 ? currentIndex + 1 : 0;
      }
      handleSelectChannel(allChannels[nextIndex]);
    }
  };

  // Dynamic values based on Dark Mode setting (Removed transition-colors & duration classes to prevent transitions/fade)
  const appBgClass = darkMode ? "bg-[#121212] text-[#f1f1f1]" : "bg-white text-[#111111]";
  const subPanelBgClass = darkMode ? "bg-[#1e1e21] border-white/5" : "bg-white border-gray-200";

  return (
    <div className={`min-h-screen ${bottomBarEnabled ? "pb-16" : "pb-10"} font-sans rounded-none flex flex-col antialiased ${appBgClass}`}>
      
      {/* SOLID MATERIAL DARK GREY TOP BAR - FLAT DESIGN */}
      <header className="sticky top-0 z-40 bg-[#343434] text-white shadow-md border-b border-[#242424] rounded-none">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between relative">
          
          {/* Logo Title (Removed TV Icon next to Vplay Android) */}
          <div className="flex items-center gap-2.5">
            {hamburgerEnabled && !bottomBarEnabled && (
              <button
                onClick={() => setShowAppsMenu(!showAppsMenu)}
                className="p-1.5 hover:bg-white/10 active:bg-white/15 text-white cursor-pointer rounded-none border-none focus:outline-none transition-all mr-0.5"
                title="Menu"
                id="btn-hamburger-left"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            {newIconEnabled ? (
              <img 
                src="https://static.wikia.nocookie.net/ftv/images/a/ab/Imagexvxvz.png/revision/latest/scale-to-width-down/1000?cb=20260429082350&path-prefix=vi" 
                alt="Vplay Android Logo" 
                className="h-6 object-contain block select-none" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="font-bold text-lg tracking-tight text-white leading-none selection:bg-white/30">
                Vplay Android
              </span>
            )}
            {displayClockEnabled && (
              <span className="ml-3 font-roboto text-xs font-semibold tracking-wider text-gray-300 bg-black/20 px-2 py-0.5 rounded-xs" style={{ fontFamily: "'Roboto', sans-serif" }} id="top-bar-clock">
                {timeStr}
              </span>
            )}
          </div>

          {/* Top Bar Action Buttons */}
          <div className="flex items-center gap-1.5">

            {/* Rewind/Back to last viewed channel Button */}
            <button
              onClick={handleRewind}
              disabled={!previousChannel}
              className={`p-2 rounded-none relative transition-all ${
                previousChannel 
                  ? "hover:bg-white/10 active:bg-white/15 text-white cursor-pointer" 
                  : "opacity-40 text-white/50 cursor-not-allowed"
              }`}
              title={previousChannel ? `Quay lại kênh xem gần đây: ${previousChannel.name}` : "Chưa có kênh xem gần nhất"}
              id="btn-top-rewind"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current stroke-none flex-shrink-0">
                <path d="M19 21L6 12L19 3V21Z" />
              </svg>
            </button>

            {/* Toggle Search Icon Button */}
            <button
              onClick={() => {
                if (immersiveSearchEnabled) {
                  switchTab("tim-kiem");
                  return;
                }
                const nextSearch = !showSearchInput;
                setShowSearchInput(nextSearch);
                if (nextSearch && activeTab !== "truc-tiep") {
                  switchTab("truc-tiep");
                }
                if (!nextSearch) {
                  setSearchTerm("");
                }
              }}
              className={`p-2 cursor-pointer relative ${
                roundedCornersEnabled ? "rounded-md" : "rounded-none"
              } ${
                showSearchInput ? "bg-white text-[#343434]" : "hover:bg-white/10 active:bg-white/15 text-white"
              }`}
              title="Tìm kiếm kênh"
              id="btn-top-search"
            >
              {newIconEnabled ? (
                <img 
                  src="https://static.wikia.nocookie.net/ftv/images/4/4f/Glass_abc.png/revision/latest?cb=20260612062552&path-prefix=vi" 
                  alt="Search" 
                  className="w-5 h-5 object-contain block select-none" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>

            {/* Sequential Channel Navigation - Left Arrow */}
            <button
              onClick={() => handleNavigateChannel("prev")}
              disabled={allChannels.length <= 1}
              className={`p-2 rounded-none relative transition-all ${
                allChannels.length > 1
                  ? "hover:bg-white/10 active:bg-white/15 text-white cursor-pointer"
                  : "opacity-40 text-white/50 cursor-not-allowed"
              }`}
              title="Kênh trước đó"
              id="btn-top-prev"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Sequential Channel Navigation - Right Arrow */}
            <button
              onClick={() => handleNavigateChannel("next")}
              disabled={allChannels.length <= 1}
              className={`p-2 rounded-none relative transition-all ${
                allChannels.length > 1
                  ? "hover:bg-white/10 active:bg-white/15 text-white cursor-pointer"
                  : "opacity-40 text-white/50 cursor-not-allowed"
              }`}
              title="Kênh tiếp theo"
              id="btn-top-next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Experimental Remote Control Button */}
            {remoteEnabled && (
              <button
                onClick={() => setShowRemoteUI(!showRemoteUI)}
                className={`p-2 cursor-pointer relative rounded-none ${
                  showRemoteUI ? "bg-white text-[#343434]" : "hover:bg-white/10 active:bg-white/15 text-white"
                }`}
                title="Bàn phím Remote ảo"
                id="btn-top-remote"
              >
                <Smartphone className="w-5 h-5" />
              </button>
            )}

            {/* Apps Launcher Button (Triggers solid flat white dropdown menu) - Only when not in hamburger mode and not in bottom bar mode */}
            {!hamburgerEnabled && !bottomBarEnabled && (
              <div className="relative">
                <button
                  onClick={() => setShowAppsMenu(!showAppsMenu)}
                  className={`p-2 cursor-pointer rounded-none relative ${
                    showAppsMenu ? "bg-white text-[#343434]" : "hover:bg-white/10 active:bg-white/15 text-white"
                  }`}
                  title="Ứng dụng hệ thống"
                  id="btn-apps"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {/* Dropdown Menu: ALWAYS flat square edges, solid white background with gray text. NO icons, NO status dots */}
                {showAppsMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowAppsMenu(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-xl z-50 rounded-none overflow-hidden py-1">
                      
                      <button
                        onClick={() => {
                          switchTab("trang-chu");
                          setShowAppsMenu(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-xs font-bold font-sans cursor-pointer ${
                          activeTab === "trang-chu" 
                            ? "bg-gray-100 text-[#1a73e8]" 
                            : "text-gray-800 hover:bg-gray-50"
                        }`}
                      >
                        <span>Trang chủ</span>
                      </button>

                      <button
                        onClick={() => {
                          switchTab("truc-tiep");
                          setShowAppsMenu(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-xs font-bold font-sans cursor-pointer ${
                          activeTab === "truc-tiep" 
                            ? "bg-gray-100 text-[#1a73e8]" 
                            : "text-gray-800 hover:bg-gray-50"
                        }`}
                      >
                        <span>Trực tiếp</span>
                      </button>

                      {packageEnabled && (
                        <button
                          onClick={() => {
                            switchTab("package");
                            setShowAppsMenu(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-xs font-bold font-sans cursor-pointer ${
                            activeTab === "package" 
                              ? "bg-gray-100 text-[#1a73e8]" 
                              : "text-gray-800 hover:bg-gray-50"
                          }`}
                        >
                          <span>Package</span>
                        </button>
                      )}

                      {/* Add Custom Channel Shortcut */}
                      <button
                        onClick={() => {
                          setShowAddChannelModal(true);
                          setShowAppsMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-xs font-bold font-sans cursor-pointer text-gray-800 hover:bg-gray-50 flex items-center gap-2 border-t border-gray-100/50"
                      >
                        <Plus className="w-4 h-4 text-[#1a73e8]" />
                        <span>Thêm kênh mới</span>
                      </button>

                      <button
                        onClick={() => {
                          switchTab("cai-dat");
                          setShowAppsMenu(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-xs font-bold font-sans cursor-pointer ${
                          activeTab === "cai-dat" 
                            ? "bg-gray-100 text-[#1a73e8]" 
                            : "text-gray-800 hover:bg-gray-50"
                        }`}
                      >
                        <span>Cài đặt</span>
                      </button>

                      <button
                        onClick={() => {
                          switchTab("sign-in");
                          setShowAppsMenu(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-xs font-bold font-sans cursor-pointer ${
                          activeTab === "sign-in" 
                            ? "bg-gray-100 text-[#1a73e8]" 
                            : "text-gray-800 hover:bg-gray-50"
                        }`}
                      >
                        <span>{isLoggedIn ? "Profile" : "Sign in"}</span>
                      </button>

                      <button
                        onClick={() => {
                          switchTab("vplay-android-faq");
                          setShowAppsMenu(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-xs font-bold font-sans cursor-pointer ${
                          activeTab === "vplay-android-faq" 
                            ? "bg-gray-100 text-[#1a73e8]" 
                            : "text-gray-800 hover:bg-gray-50"
                        }`}
                      >
                        <span>Vplay Android FAQ</span>
                      </button>

                    </div>
                  </>
                )}
              </div>
            )}

          </div>

        </div>
      </header>

      {/* Drawer Menu for Hamburger layout (Left to Right sliding) */}
      <AnimatePresence>
        {hamburgerEnabled && showAppsMenu && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black z-50 backdrop-blur-xs cursor-pointer"
              onClick={() => setShowAppsMenu(false)} 
            />
            {/* Drawer Container (Slides L -> R) */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-64 bg-white shadow-2xl z-55 flex flex-col rounded-none text-gray-800"
            >
              {/* Header inside drawer */}
              <div className="flex items-center justify-end p-4 border-b border-gray-200 bg-gray-50">
                <button 
                  onClick={() => setShowAppsMenu(false)}
                  className="p-1 hover:bg-gray-200 active:bg-gray-300 text-gray-600 rounded-none cursor-pointer"
                  title="Đóng"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Drawer Links */}
              <div className="flex-grow overflow-y-auto py-2">
                <button
                  onClick={() => {
                    switchTab("trang-chu");
                    setShowAppsMenu(false);
                  }}
                  className={`w-full text-left px-5 py-4 text-xs font-bold font-sans cursor-pointer border-b border-gray-100 ${
                    activeTab === "trang-chu" 
                      ? "bg-gray-100 text-[#1a73e8]" 
                      : "text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  Trang chủ
                </button>

                <button
                  onClick={() => {
                    switchTab("truc-tiep");
                    setShowAppsMenu(false);
                  }}
                  className={`w-full text-left px-5 py-4 text-xs font-bold font-sans cursor-pointer border-b border-gray-100 ${
                    activeTab === "truc-tiep" 
                      ? "bg-gray-100 text-[#1a73e8]" 
                      : "text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  Trực tiếp
                </button>

                {packageEnabled && (
                  <button
                    onClick={() => {
                      switchTab("package");
                      setShowAppsMenu(false);
                    }}
                    className={`w-full text-left px-5 py-4 text-xs font-bold font-sans cursor-pointer border-b border-gray-100 ${
                      activeTab === "package" 
                        ? "bg-gray-100 text-[#1a73e8]" 
                        : "text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    Package
                  </button>
                )}

                {/* Add Custom Channel Shortcut */}
                <button
                  onClick={() => {
                    setShowAddChannelModal(true);
                    setShowAppsMenu(false);
                  }}
                  className="w-full text-left px-5 py-4 text-xs font-bold font-sans cursor-pointer border-b border-gray-100 text-gray-800 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-[#1a73e8]" />
                  <span>Thêm kênh mới</span>
                </button>

                <button
                  onClick={() => {
                    switchTab("cai-dat");
                    setShowAppsMenu(false);
                  }}
                  className={`w-full text-left px-5 py-4 text-xs font-bold font-sans cursor-pointer border-b border-gray-100 ${
                    activeTab === "cai-dat" 
                      ? "bg-gray-100 text-[#1a73e8]" 
                      : "text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  Cài đặt
                </button>

                <button
                  onClick={() => {
                    switchTab("sign-in");
                    setShowAppsMenu(false);
                  }}
                  className={`w-full text-left px-5 py-4 text-xs font-bold font-sans cursor-pointer border-b border-gray-100 ${
                    activeTab === "sign-in" 
                      ? "bg-gray-100 text-[#1a73e8]" 
                      : "text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {isLoggedIn ? "Profile" : "Sign in"}
                </button>

                <button
                  onClick={() => {
                    switchTab("vplay-android-faq");
                    setShowAppsMenu(false);
                  }}
                  className={`w-full text-left px-5 py-4 text-xs font-bold font-sans cursor-pointer ${
                    activeTab === "vplay-android-faq" 
                      ? "bg-gray-100 text-[#1a73e8]" 
                      : "text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  Vplay Android FAQ
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Dynamic Search Box displayed immediately below top bar, conditionally toggled */}
      <AnimatePresence>
        {showSearchInput && (
          <motion.div 
            initial={animationPreviewEnabled ? { height: 0, opacity: 0 } : false}
            animate={{ height: "auto", opacity: 1 }}
            exit={animationPreviewEnabled ? { height: 0, opacity: 0 } : undefined}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={`sticky top-[48px] z-30 border-b overflow-hidden shadow-md transition-all duration-200 ${
              darkMode ? "bg-[#1f1f23] border-white/5" : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="max-w-7xl mx-auto px-3 py-2">
              <div className={`flex items-center gap-2 px-3 border rounded-none shadow-sm transition-all duration-200 ${
                thickSearchEnabled ? "py-3.5" : "py-2"
              } ${
                darkMode ? "bg-[#2d2d34] border-white/10 text-white" : "bg-white border-gray-300 text-gray-900"
              }`}>
                <Search className={`text-gray-400 flex-shrink-0 transition-all ${thickSearchEnabled ? "w-5 h-5" : "w-4 h-4"}`} />
                <input
                  type="text"
                  placeholder={`Nhập để tìm kênh (VD: ${randomSearchSuggestion})`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`bg-transparent w-full focus:outline-none font-roboto font-medium placeholder-gray-400 transition-all ${
                    thickSearchEnabled ? "text-sm py-1" : "text-xs py-0"
                  }`}
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="text-gray-400 hover:text-gray-550 p-0.5"
                  >
                    <X className={`transition-all ${thickSearchEnabled ? "w-5 h-5" : "w-4 h-4"}`} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container Layout: Optimized vertical single column for mobile first */}
      <main className="max-w-7xl w-full mx-auto px-3 py-3 flex flex-col gap-3 flex-grow min-h-[350px]">
        
        {isNavigating ? (
          <div className="flex-grow flex flex-col items-center justify-center py-24 text-center rounded-none bg-transparent">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-[#1a73e8] border-t-transparent animate-spin rounded-full"></div>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* =============== VIEW 1: TRANG CHỦ (COMMUNITY RECOMMENDATIONS & PREMIUM BANNER) =============== */}
            {activeTab === "trang-chu" && (
              <motion.div
                key="trang-chu"
                initial={animationPreviewEnabled ? { opacity: 0, y: 15 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={animationPreviewEnabled ? { opacity: 0, y: -15 } : undefined}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="flex flex-col gap-4 rounded-none w-full"
              >
                {homeRecommendationEnabled ? (
                  <div className={`p-4 rounded-none border ${subPanelBgClass}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-[#1a73e8]">
                        Đề xuất kênh ngẫu nhiên
                      </h3>
                      {/* Live status indicating automatic selection with corner-sharp flat styles */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-gray-400 font-sans font-semibold uppercase tracking-wider">
                          {isSpinningRecommendation ? "ĐANG LÀM MỚI..." : "TỰ ĐỘNG LÀM MỚI"}
                        </span>
                        <div className={`w-2 h-2 ${isSpinningRecommendation ? "bg-[#1a73e8] animate-ping" : "bg-green-500"} rounded-none`} />
                      </div>
                    </div>
                    <p className={`text-[10px] mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Trải nghiệm hệ thống giới thiệu thông minh. Mỗi lượt đề xuất hiển thị 3 dòng, mỗi dòng 3 ô.
                    </p>
                    
                    <div className="relative min-h-[260px] flex items-center justify-center p-0.5">
                      <AnimatePresence mode="wait">
                        {isSpinningRecommendation ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col items-center justify-center gap-3 py-12"
                          >
                            <Loader2 className="w-10 h-10 text-[#1a73e8] animate-spin" />
                            <span className={`text-[10px] font-bold tracking-wider uppercase font-sans ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                              ĐANG LÀM MỚI ĐỀ XUẤT...
                            </span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="grid"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.3 }}
                            className="w-full grid grid-cols-3 gap-2 rounded-none"
                          >
                            {recommendedChannels.map((channel) => {
                              const isPlaying = currentChannel.id === channel.id;
                              return (
                                <div
                                  key={channel.id}
                                  onClick={() => {
                                    if (handleSelectChannel(channel)) {
                                      switchTab("truc-tiep");
                                    }
                                  }}
                                  className={`flex flex-col p-2.5 cursor-pointer select-none transition-all active:scale-98 rounded-none relative overflow-hidden ${
                                    isPlaying
                                      ? "bg-blue-50/20 ring-1 ring-red-500"
                                      : darkMode
                                        ? "bg-[#252528] hover:bg-[#2c2c2f]"
                                        : "bg-gray-50 hover:bg-gray-100/70"
                                  }`}
                                >
                                  <div className={`h-11 flex items-center justify-center p-1 rounded-none bg-white ${
                                    darkMode ? "bg-opacity-5" : ""
                                  }`}>
                                    {channel.logo ? (
                                      <img
                                        src={channel.logo}
                                        alt={channel.name}
                                        referrerPolicy="no-referrer"
                                        className="max-h-full max-w-full object-contain transition-all"
                                        style={{ transform: `scale(${logoScale / 100})` }}
                                        onError={(e) => {
                                          e.currentTarget.src = "https://images.unsplash.com/photo-1542204172-e7052809a862?auto=format&fit=crop&w=120&q=80";
                                        }}
                                      />
                                    ) : (
                                      <span className="text-[9px] font-bold text-gray-400">No Logo</span>
                                    )}
                                  </div>
                                  <div className="mt-2 min-w-0 text-center">
                                    <p className="text-[10px] font-bold truncate tracking-tight">{channel.name}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ) : (
                  <div className={`p-4 rounded-none border text-center ${subPanelBgClass}`}>
                    <div className={`font-roboto ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      <div className="text-sm font-bold mb-1">Đề xuất kênh đang tắt.</div>
                      <div className="text-[11px] font-medium opacity-85">Bật tính năng đề xuất kênh trong phần Cài đặt Dev để trải nghiệm.</div>
                    </div>
                  </div>
                )}

                {/* Vplay Premium web version section */}
                <div className={`p-5 rounded-none border ${subPanelBgClass} text-left`}>
                  <h3 className={`text-sm md:text-base font-bold tracking-tight mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Trải nghiệm phiên bản cao cấp hơn của Vplay
                  </h3>
                  <p className={`text-xs leading-relaxed mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Vplay Web by VNRT là phiên bản hiện đại hơn được xây dựng trên web sử dùng Google Build, đem đến cho người dùng trải nghiệm đẹp mắt hơn với nhiều hiệu ứng tinh tế và nhiều tính năng hấp dẫn nổi bật khác. Phiên bản này thích hợp cho các dòng máy đời mới, hiệu năng cao. Trải nghiệm ngay
                  </p>
                  <div>
                    <a
                      href="https://vnrtapp.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-5 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[11px] font-bold uppercase tracking-wider rounded-none cursor-pointer shadow-md transition-all text-center font-sans tracking-wide"
                    >
                      THỬ VPLAY WEB BY VNRT
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

        {/* =============== VIEW 2: TRỰC TIẾP (MAIN PLAYER & CHANNELS GRID) =============== */}
        {activeTab === "truc-tiep" && (
          <motion.div
            key="truc-tiep"
            initial={animationPreviewEnabled ? { opacity: 0, y: 15 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={animationPreviewEnabled ? { opacity: 0, y: -15 } : undefined}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex flex-col gap-3 w-full"
          >
            {/* Dynamic Player Screen and Title Container */}
            <div className={`flex flex-col gap-3 ${roundedCornersEnabled ? "rounded-lg" : "rounded-none"}`}>
              
              {/* Live Player Element */}
              <MaterialPlayer 
                currentChannel={currentChannel} 
                themeColor="ocean" 
                playbackQuality={playbackQuality}
                roundedCornersEnabled={roundedCornersEnabled}
              />

              {/* Active play information banner (completely clean & simplified flat design) */}
              <div className={`p-3 ${subPanelBgClass} ${roundedCornersEnabled ? "rounded-md border border-[#1a73e8]/15" : "rounded-none"}`}>
                <h2 className={`text-sm font-bold truncate leading-none ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {currentChannel.name}
                </h2>
              </div>

            </div>

            {/* Info panel section if toggled */}
            {showHelp && (
              <div className={`relative border p-4 rounded-none text-xs leading-relaxed ${
                darkMode ? "bg-[#1c1b1f] border-[#1a73e8]/30 text-gray-300" : "bg-blue-50/50 border-[#1a73e8]/20 text-gray-700"
              }`}>
                <button 
                  onClick={() => setShowHelp(false)}
                  className={`absolute top-3.5 right-3.5 p-1 rounded-none ${
                    darkMode ? "hover:bg-white/10 text-gray-400 hover:text-white" : "hover:bg-gray-200 text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
                <h3 className="font-bold text-[#1a73e8] text-sm mb-2 flex items-center gap-1.5 uppercase">
                  Thiết kế tối ưu hóa cho Mobile
                </h3>
                <ul className={`list-disc pl-4 space-y-1.5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  <li>Tỷ lệ ô lưới hiển thị <span className="font-semibold">Hình chữ nhật (Rectangular Aspect Ratio)</span> thuận tiện cho giao diện lướt dọc bằng ngón tay.</li>
                  <li>Dễ dàng lọc tìm kiếm kênh thời gian thực thông qua công cụ tìm kiếm trực tiếp đặt tại Header Blue Topbar.</li>
                  <li>Sử dụng tính năng <span className="font-semibold">Tỉ lệ khung hình</span> trong trình phát để điều chỉnh tràn viền hoặc khít với màn hình di động của bạn.</li>
                  <li>Chạm vào nút Smartphone để chạy chế độ cửa sổ nổi <span className="font-semibold">Picture-in-Picture (PiP)</span> tiện lợi.</li>
                </ul>
              </div>
            )}

            {/* Channel Grid List Module (Removed title heading) */}
            <div className={`flex flex-col gap-3 ${roundedCornersEnabled ? "rounded-lg" : "rounded-none"}`}>
              <div className={`p-3 border ${subPanelBgClass} ${roundedCornersEnabled ? "rounded-lg" : "rounded-none"}`}>
                
                {searchTerm && !searchEnabled ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center rounded-none font-roboto">
                    <div className="text-sm font-bold text-[#343434] mb-1">Search function is coming soon.</div>
                    <div className={`text-[11px] opacity-75 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Search capability is under construction
                    </div>
                  </div>
                ) : (
                  /* Flat channel list component with rectangular tiles */
                  <ChannelList
                    channels={allChannels}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    currentChannel={currentChannel}
                    onSelectChannel={handleSelectChannel}
                    themeColor="ocean"
                    searchTerm={searchTerm}
                    selectedSubTab={selectedSubTab}
                    setSelectedSubTab={setSelectedSubTab}
                    darkMode={darkMode}
                    columnsCount={columnsCount}
                    logoScale={logoScale}
                    animationPreviewEnabled={animationPreviewEnabled}
                    roundedCornersEnabled={roundedCornersEnabled}
                    onDeleteChannel={handleDeleteCustomTvChannel}
                  />
                )}

              </div>
            </div>
          </motion.div>
        )}

        {/* =============== VIEW 3: PACKAGE (CUSTOM CHANNELS & PLAYLIST IMPORT) =============== */}
        {activeTab === "package" && (
          <motion.div
            key="package"
            initial={animationPreviewEnabled ? { opacity: 0, y: 15 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={animationPreviewEnabled ? { opacity: 0, y: -15 } : undefined}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex flex-col gap-4 w-full"
          >
            {/* 1. Custom Player Workspace */}
            <div className={`flex flex-col gap-3 ${roundedCornersEnabled ? "rounded-lg" : "rounded-none"}`}>
              {currentCustomChannel ? (
                <>
                  <div className={`overflow-hidden ${roundedCornersEnabled ? "rounded-lg" : "rounded-none"}`}>
                    <MaterialPlayer 
                      currentChannel={currentCustomChannel} 
                      themeColor="ocean" 
                      playbackQuality={playbackQuality}
                      roundedCornersEnabled={roundedCornersEnabled}
                    />
                  </div>
                  {/* Now Playing Custom Info Overlay */}
                  <div className={`p-4 ${subPanelBgClass} flex items-center justify-between border ${
                    darkMode ? "border-white/5" : "border-gray-200"
                  } ${roundedCornersEnabled ? "rounded-lg" : "rounded-none"}`}>
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                      </span>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#1a73e8]">Đang Thiết Lập Custom Stream</span>
                        <h2 className={`text-sm font-bold truncate leading-tight ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {currentCustomChannel.name}
                        </h2>
                        <p className={`text-[9px] font-mono select-all truncate max-w-[220px] sm:max-w-md ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {currentCustomChannel.url}
                        </p>
                      </div>
                    </div>
                    {/* Reset custom channel */}
                    <button
                      onClick={() => {
                        const remaining = customChannels.filter(c => c.id !== currentCustomChannel.id);
                        setCustomChannels(remaining);
                        setCurrentCustomChannel(remaining[0] || null);
                      }}
                      className="p-2 text-red-500 hover:bg-red-500/10 active:bg-red-500/20 rounded-md transition-all cursor-pointer"
                      title="Xóa luồng phát hiện tại"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className={`flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed ${
                  darkMode ? "bg-[#1a1a1c] border-white/10 text-gray-400" : "bg-gray-50 border-gray-300 text-gray-500"
                } ${roundedCornersEnabled ? "rounded-lg" : "rounded-none"}`}>
                  <Tv className="w-10 h-10 mb-3 text-[#1a73e8] animate-pulse" />
                  <h3 className={`text-sm font-bold mb-1 ${darkMode ? "text-white" : "text-gray-800"}`}>Chưa Có Luồng Phát Custom Nào</h3>
                  <p className="text-[11px] max-w-sm mx-auto leading-relaxed opacity-85">
                    Hãy dán liên kết URL m3u8 đơn lẻ hoặc tải lên tệp .m3u8 danh sách kênh của riêng bạn bên dưới để xem tivi ngay lập tức.
                  </p>
                </div>
              )}
            </div>

            {/* 2. Setup Hub with horizontal Sub-Tabs */}
            <div className={`p-4 border ${subPanelBgClass} ${darkMode ? "border-white/5" : "border-gray-200"} ${
              roundedCornersEnabled ? "rounded-lg" : "rounded-none"
            }`}>
              <div className="flex border-b border-gray-200 dark:border-white/10 mb-4 pb-1 overflow-x-auto gap-2">
                <button
                  type="button"
                  onClick={() => setPackageViewTab("channels")}
                  className={`px-3 py-1.5 text-xs font-bold tracking-wider uppercase cursor-pointer border-b-2 transition-all whitespace-nowrap ${
                    packageViewTab === "channels"
                      ? "border-[#1a73e8] text-[#1a73e8]"
                      : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-200"
                  }`}
                >
                  Danh Sách Kênh ({customChannels.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPackageViewTab("direct")}
                  className={`px-3 py-1.5 text-xs font-bold tracking-wider uppercase cursor-pointer border-b-2 transition-all whitespace-nowrap ${
                    packageViewTab === "direct"
                      ? "border-[#1a73e8] text-[#1a73e8]"
                      : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-200"
                  }`}
                >
                  Nhập Luồng Lẻ
                </button>
                <button
                  type="button"
                  onClick={() => setPackageViewTab("playlist")}
                  className={`px-3 py-1.5 text-xs font-bold tracking-wider uppercase cursor-pointer border-b-2 transition-all whitespace-nowrap ${
                    packageViewTab === "playlist"
                      ? "border-[#1a73e8] text-[#1a73e8]"
                      : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-200"
                  }`}
                >
                  Nhập File M3U8
                </button>
              </div>

              {/* Sub-Tab Content: Channels list (The Grid catalog) */}
              {packageViewTab === "channels" && (
                <div className="flex flex-col gap-3">
                  {customChannels.length > 0 ? (
                    <>
                      <div className="flex justify-between items-center px-1">
                        <span className={`text-[10px] font-bold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          DANH SÁCH ONLINE ({customChannels.length})
                        </span>
                        <button
                          onClick={() => {
                            if (confirm("Bạn có chắc chắn muốn xóa toàn bộ danh sách kênh tùy chỉnh?")) {
                              setCustomChannels([]);
                              setCurrentCustomChannel(null);
                            }
                          }}
                          className="text-[10px] font-bold text-red-500 uppercase tracking-wider bg-red-500/5 hover:bg-red-500/10 px-2 py-1 rounded-sm cursor-pointer transition-all"
                        >
                          Xóa Tất Cả
                        </button>
                      </div>

                      {/* Channels list grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {customChannels.map((channel) => (
                          <div
                            key={channel.id}
                            className={`p-2.5 flex items-center justify-between border cursor-pointer group transition-all relative ${
                              currentCustomChannel?.id === channel.id
                                ? "bg-[#1a73e8]/10 border-[#1a73e8]"
                                : `${darkMode ? "bg-[#1c1b1f] border-white/5 hover:border-white/20" : "bg-gray-50 border-gray-200 hover:border-gray-400"}`
                            } ${roundedCornersEnabled ? "rounded-md" : "rounded-none"}`}
                            onClick={() => setCurrentCustomChannel(channel)}
                          >
                            <div className="flex items-center gap-2 overflow-hidden mr-5 w-full">
                              {/* Thumbnail / Logo Preview */}
                              <div className={`w-7 h-7 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-300 dark:border-white/10 ${
                                roundedCornersEnabled ? "rounded-sm" : "rounded-none"
                              }`}>
                                {channel.logo ? (
                                  <img 
                                    src={channel.logo} 
                                    alt={channel.name} 
                                    className="w-full h-full object-cover animate-fade-in"
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = "none";
                                    }}
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <Tv className="w-3.5 h-3.5 text-[#1a73e8]" />
                                )}
                              </div>
                              <div className="overflow-hidden flex-grow">
                                <h4 className={`text-xs font-bold truncate leading-snug ${darkMode ? "text-white" : "text-gray-900"}`}>
                                  {channel.name}
                                </h4>
                                <span className="text-[9px] text-gray-400 block truncate font-mono">
                                  {channel.url}
                                </span>
                              </div>
                            </div>

                            {/* Delete single customized channel */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const remain = customChannels.filter(c => c.id !== channel.id);
                                setCustomChannels(remain);
                                if (currentCustomChannel?.id === channel.id) {
                                  setCurrentCustomChannel(remain[0] || null);
                                }
                              }}
                              className="p-1 text-gray-400 hover:text-red-500 rounded-sm hover:bg-red-500/5 transition-all opacity-0 group-hover:opacity-100 absolute top-1 right-1"
                              title="Xóa kênh này"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-10">
                      <p className={`text-xs mb-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Danh sách rỗng! Hãy thiết lập luồng trực tiếp ngay.
                      </p>
                      <button
                        onClick={() => setPackageViewTab("direct")}
                        className="px-4 py-2 text-[11px] font-bold uppercase bg-[#1a73e8] text-white hover:bg-[#1557b0] transition-all cursor-pointer rounded-sm"
                      >
                        Bắt đầu
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Sub-Tab Content: Direct setup */}
              {packageViewTab === "direct" && (
                <form onSubmit={handleAddSingleStream} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className={`text-[10px] font-bold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Đường dẫn dòng Stream HLS (m3u8, mp4,..) *
                    </label>
                    <input
                      type="url"
                      value={singleStreamUrl}
                      onChange={(e) => setSingleStreamUrl(e.target.value)}
                      placeholder="https://example.com/playlist.m3u8"
                      required
                      className={`w-full px-3 py-2 text-xs border bg-transparent font-sans ${
                        darkMode ? "border-white/10 text-white focus:border-[#1a73e8]" : "border-gray-300 text-gray-900 focus:border-[#1a73e8]"
                      } focus:outline-none ${roundedCornersEnabled ? "rounded-md" : "rounded-none"}`}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className={`text-[10px] font-bold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Tên gợi nhớ của kênh
                      </label>
                      <input
                        type="text"
                        value={singleStreamName}
                        onChange={(e) => setSingleStreamName(e.target.value)}
                        placeholder="VTV1 HD (Tùy chọn)"
                        className={`w-full px-3 py-2 text-xs border bg-transparent font-sans ${
                          darkMode ? "border-white/10 text-white" : "border-gray-300 text-gray-900"
                        } focus:outline-none focus:border-[#1a73e8] ${roundedCornersEnabled ? "rounded-md" : "rounded-none"}`}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className={`text-[10px] font-bold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Địa chỉ logo kênh (URL ảnh)
                      </label>
                      <input
                        type="url"
                        value={singleStreamLogo}
                        onChange={(e) => setSingleStreamLogo(e.target.value)}
                        placeholder="https://example.com/logo.png (Tùy chọn)"
                        className={`w-full px-3 py-2 text-xs border bg-transparent font-sans ${
                          darkMode ? "border-white/10 text-white" : "border-gray-300 text-gray-900"
                        } focus:outline-none focus:border-[#1a73e8] ${roundedCornersEnabled ? "rounded-md" : "rounded-none"}`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-2.5 mt-2 text-xs font-bold uppercase tracking-wider font-sans cursor-pointer bg-[#1a73e8] hover:bg-[#1557b0] text-white flex items-center justify-center gap-1.5 transition-all ${
                      roundedCornersEnabled ? "rounded-md" : "rounded-none"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Lưu và Phát Ngay</span>
                  </button>
                </form>
              )}

              {/* Sub-Tab Content: M3U8 local upload */}
              {packageViewTab === "playlist" && (
                <div className="flex flex-col gap-3">
                  <div className={`p-6 border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#1a73e8]/60 transition-all ${
                    darkMode ? "bg-white/5 border-white/10 hover:bg-white/8" : "bg-gray-50 border-gray-300 hover:bg-gray-100/60"
                  } ${roundedCornersEnabled ? "rounded-lg" : "rounded-none"}`}>
                    <Upload className="w-8 h-8 mb-2 text-[#1a73e8]" />
                    <span className={`text-xs font-bold block ${darkMode ? "text-white" : "text-gray-800"}`}>
                      Chọn tệp playlist (.m3u hoặc .m3u8) từ thiết bị
                    </span>
                    <span className={`text-[10px] ${darkMode ? "text-gray-400" : "text-gray-500"} mt-1 max-w-sm block`}>
                      Hỗ trợ giải nén hoàn toàn danh sách các dòng kênh TV có trong file m3u.
                    </span>
                    <input
                      type="file"
                      id="m3u-file-uploader"
                      accept=".m3u,.m3u8"
                      onChange={handleM3U8Upload}
                      className="hidden"
                    />
                    <label
                      htmlFor="m3u-file-uploader"
                      className={`mt-4 px-4 py-2 font-bold uppercase tracking-wide text-[10px] bg-[#1a73e8] hover:bg-[#1557b0] text-white cursor-pointer transition-all ${
                        roundedCornersEnabled ? "rounded-md" : "rounded-none"
                      }`}
                    >
                      Duyệt file thiết bị
                    </label>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* =============== VIEW 3.5: DEDICATED IMMERSIVE SEARCH VIEW =============== */}
        {activeTab === "tim-kiem" && (
          <motion.div
            key="tim-kiem"
            initial={animationPreviewEnabled ? { opacity: 0, scale: 0.98 } : false}
            animate={{ opacity: 1, scale: 1 }}
            exit={animationPreviewEnabled ? { opacity: 0, scale: 0.98 } : undefined}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex flex-col gap-4 w-full"
          >
            {/* Header and Back Button */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => switchTab("trang-chu")}
                className={`py-1.5 px-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer font-sans text-[#1a73e8] hover:bg-[#1a73e8]/5 transition-all ${
                  roundedCornersEnabled ? "rounded-md" : "rounded-none"
                }`}
              >
                <span>← Quay lại</span>
              </button>
              <h2 className={`text-sm font-bold uppercase tracking-wider ${darkMode ? "text-white" : "text-gray-900"}`}>
                CÔNG CỤ TÌM KIẾM
              </h2>
              <div className="w-12"></div> {/* empty spacer for alignment balance */}
            </div>

            {/* Immersive Search input box */}
            <div className={`p-5 border ${subPanelBgClass} ${darkMode ? "border-white/5" : "border-gray-200"} ${
              roundedCornersEnabled ? "rounded-lg" : "rounded-none"
            } flex flex-col gap-4 shadow-sm`}>
              <div className="relative flex items-center">
                <input
                  type="text"
                  autoFocus
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Nhập để tìm kênh (VD: ${randomSearchSuggestion})`}
                  className={`w-full border font-sans transition-all duration-200 focus:outline-none ${
                    thickSearchEnabled ? "py-4.5 pl-12 pr-11 text-sm animate-fade-in" : "py-3 pl-10 pr-10 text-xs"
                  } ${
                    darkMode 
                      ? "bg-[#2d2d34] border-white/10 text-white focus:border-[#1a73e8]" 
                      : "bg-white border-gray-300 text-gray-900 focus:border-[#1a73e8]"
                  } ${roundedCornersEnabled ? "rounded-md" : "rounded-none"} shadow-inner`}
                />
                <Search className={`text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-all ${
                  thickSearchEnabled ? "w-5 h-5" : "w-4 h-4"
                }`} />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-all text-gray-400 hover:text-white"
                  >
                    <X className={`transition-all ${thickSearchEnabled ? "w-4.5 h-4.5" : "w-3.5 h-3.5"}`} />
                  </button>
                )}
              </div>
            </div>

            {/* Grid display for matching results */}
            <div className={`p-4 border ${subPanelBgClass} ${darkMode ? "border-white/5" : "border-gray-200"} ${
              roundedCornersEnabled ? "rounded-lg" : "rounded-none"
            } flex-grow`}>
              {/* Filter channels */}
              {(() => {
                const results = allChannels.filter((c) => {
                  const keyword = searchTerm.toLowerCase();
                  return (
                    c.name.toLowerCase().includes(keyword) ||
                    (c.group && c.group.toLowerCase().includes(keyword))
                  );
                });

                if (results.length > 0) {
                  return (
                    <div className="flex flex-col gap-3">
                      <span className={`text-[10px] font-bold tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        KẾT QUẢ TÌM THẤY ({results.length})
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                        {results.map((channel) => (
                          <div
                            key={channel.id}
                            onClick={() => {
                              if (handleSelectChannel(channel)) {
                                switchTab("truc-tiep");
                              }
                            }}
                            className={`relative p-3 border flex flex-col items-center text-center gap-2 cursor-pointer transition-all ${
                              currentChannel?.id === channel.id
                                ? "bg-[#1a73e8]/10 border-[#1a73e8] text-[#1a73e8]"
                                : `${darkMode ? "bg-white/5 border-white/5 hover:border-white/25" : "bg-gray-50 border-gray-200 hover:border-gray-400"}`
                            } ${roundedCornersEnabled ? "rounded-md" : "rounded-none"}`}
                          >
                            {(() => {
                              const globalIndex = allChannels.findIndex((c) => c.id === channel.id);
                              if (globalIndex !== -1) {
                                const paddedNumber = String(globalIndex + 1).padStart(3, "0");
                                return (
                                  <span className={`absolute top-1 left-1.5 z-20 text-[9px] font-mono font-bold tracking-tighter select-none ${
                                    darkMode ? "text-gray-500" : "text-gray-400"
                                  }`}>
                                    ({paddedNumber})
                                  </span>
                                );
                              }
                              return null;
                            })()}
                            <div className="w-10 h-10 flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-xs overflow-hidden border border-gray-200 dark:border-white/5">
                              {channel.logo ? (
                                <img
                                  src={channel.logo}
                                  alt={channel.name}
                                  className="w-full h-full object-contain"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <Tv className="w-5 h-5 text-[#1a73e8]" />
                              )}
                            </div>
                            <div>
                              <h4 className={`text-xs font-bold truncate max-w-[120px] ${darkMode ? "text-white" : "text-gray-900"}`}>
                                {channel.name}
                              </h4>
                              <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400">
                                {channel.group || "Kênh TV"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="text-center py-16 flex flex-col items-center justify-center">
                      <AlertTriangle className="w-10 h-10 text-amber-500 mb-2 animate-bounce" />
                      <h3 className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Không tìm thấy kênh phù hợp</h3>
                      <p className="text-[11px] text-gray-400 mt-1 max-w-sm leading-relaxed">
                        Thử tìm kiếm với từ khóa khác hoặc bấm các thẻ ý gợi ý "VTV", "HTV" để mở rộng kết quả.
                      </p>
                    </div>
                  );
                }
              })()}
            </div>
          </motion.div>
        )}

        {/* =============== VIEW 4: CÀI ĐẶT (SETTINGS BLENDED WITH THE APP BACKGROUND) =============== */}
        {activeTab === "cai-dat" && (
          <motion.div
            key="cai-dat"
            initial={animationPreviewEnabled ? { opacity: 0, y: 15 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={animationPreviewEnabled ? { opacity: 0, y: -15 } : undefined}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex flex-col gap-1 rounded-none px-1 w-full"
          >
            {/* Settings Search bar */}
            <div className="mb-3 transition-all duration-200">
              <div className={`flex items-center gap-2 px-3 py-2 border rounded-none shadow-sm ${
                darkMode ? "bg-[#2d2d34] border-white/10 text-white" : "bg-white border-gray-300 text-gray-900"
              }`}>
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Tìm kiếm cài đặt... (VD: tối, dev, logo)"
                  value={settingsSearchQuery}
                  onChange={(e) => setSettingsSearchQuery(e.target.value)}
                  className="bg-transparent text-xs w-full focus:outline-none placeholder-gray-400 font-sans"
                />
                {settingsSearchQuery && (
                  <button 
                    onClick={() => setSettingsSearchQuery("")}
                    className="text-gray-400 hover:text-gray-550 p-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* App Settings list - blended option list (no encapsulating dark boxes, direct background flow) */}
            {(() => {
              const isSettingMatchQuery = (title: string, keywords: string[] = []) => {
                if (!settingsSearchQuery) return true;
                const query = settingsSearchQuery.toLowerCase().trim();
                if (!query) return true;
                const matchTitle = title.toLowerCase().includes(query);
                const matchKeywords = keywords.some((k) => k.toLowerCase().includes(query));
                return matchTitle || matchKeywords;
              };

              const showDarkMode = isSettingMatchQuery("Chế độ tối", ["dark mode", "giao dien toi", "nen toi", "mau toi", "cai dat"]);
              const showColumns = isSettingMatchQuery("Số ô kênh hiển thị", ["so o", "dong", "cot", "columns", "layout", "grid", "cai dat"]);
              const showLogoScale = isSettingMatchQuery("Phóng to biểu tượng", ["logo", "scale", "zoom", "hinh anh", "dai dien", "cai dat"]);
              const showQuality = isSettingMatchQuery("Chất lượng phát", ["play quality", "do phan gia", "video", "hls", "cai dat"]);
              const showVersion = isSettingMatchQuery("Phiên bản ứng dụng", ["version", "info", "thong tin", "app", "beta", "cai dat"]);

              // Dev Options
              const devQueryMatch = settingsSearchQuery.toLowerCase().includes("dev") || settingsSearchQuery.toLowerCase().includes("nhà phát triển") || settingsSearchQuery.toLowerCase().includes("cài đặt");
              const showHamburger = devQueryMatch || isSettingMatchQuery("Hamburger menu", ["menu", "dev", "sidebar", "hamburger"]);
              const showSearchFunc = devQueryMatch || isSettingMatchQuery("Search function", ["tim kiem", "chuc nang search", "dev"]);
              const showHomeRec = devQueryMatch || isSettingMatchQuery("Thử nghiệm trang chủ", ["recommend", "home", "trang chu", "dev"]);
              const showPackage = devQueryMatch || isSettingMatchQuery("Package enabled", ["goi kenh", "m3u", "playlist", "dev"]);
              const showImmersive = devQueryMatch || isSettingMatchQuery("Immersive search", ["tim kiem toan canh", "sau", "dev"]);
              const showRemote = devQueryMatch || isSettingMatchQuery("Experimental remote control", ["remote", "bam so", "dieukhien", "dev"]);
              const showBottomBar = devQueryMatch || isSettingMatchQuery("Bottom bar", ["thanh duoi", "menu bottom", "dev"]);
              const showFloaty = devQueryMatch || (bottomBarEnabled && isSettingMatchQuery("Floaty bars", ["noi", "floating", "dev"]));
              const showClock = devQueryMatch || isSettingMatchQuery("Display clock", ["dong ho", "time", "clock", "dev"]);
              const showAnim = devQueryMatch || isSettingMatchQuery("Animation preview", ["hieu ung", "chuyen can", "dev"]);
              const showRound = devQueryMatch || isSettingMatchQuery("Rounded corners", ["bo tron", "goc", "dev"]);
              const showThickSearch = devQueryMatch || isSettingMatchQuery("Thick search", ["search day", "chieu cao", "tim kiem day", "dev"]);
              const showNewIcon = devQueryMatch || isSettingMatchQuery("New icon", ["icon moi", "logo moi", "dev"]);
              const showReorder = devQueryMatch || isSettingMatchQuery("Re-order channels", ["sap xep", "thu tu", "order", "dev"]);

              const hasDevMatch = showHamburger || showSearchFunc || showHomeRec || showPackage || showImmersive || showRemote || showBottomBar || (bottomBarEnabled && showFloaty) || showClock || showAnim || showRound || showThickSearch || showNewIcon || showReorder;

              const hasAnyMatch = showDarkMode || showColumns || showLogoScale || showQuality || showVersion || hasDevMatch;
              
              if (!hasAnyMatch) {
                return (
                  <div className={`text-center py-12 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    <SlidersHorizontal className="w-8 h-8 mx-auto mb-2 opacity-50 text-[#1a73e8]" />
                    <p className="font-bold text-sm">Không tìm thấy cài đặt phù hợp</p>
                    <p className="text-[10px] opacity-75 mt-1">Thử tìm kiếm với từ khóa khác (VD: "tối", "logo", "dev")</p>
                  </div>
                );
              }

              return (
                <div className="flex flex-col text-xs">
                  {/* Option 1: Dark Mode Toggle with blue Toggle Switch as requested */}
                  {showDarkMode && (
                    <div className={`flex items-center justify-between py-4 border-b ${
                      darkMode ? "border-white/10" : "border-gray-200"
                    }`}>
                      <div>
                        <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Chế độ tối</h4>
                      </div>
                      <ToggleSwitch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                    </div>
                  )}

                  {/* Option 2: Grid column tiles layout selector (flat rectangular selection) */}
                  {showColumns && (
                    <div className={`flex items-center justify-between py-4 border-b ${
                      darkMode ? "border-white/10" : "border-gray-200"
                    }`}>
                      <div>
                        <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Số ô kênh hiển thị</h4>
                      </div>
                      <select
                        value={columnsCount}
                        onChange={(e) => setColumnsCount(Number(e.target.value))}
                        className={`px-3 py-1.5 text-xs font-bold leading-tight cursor-pointer focus:outline-none border rounded-none ${
                          darkMode 
                            ? "bg-[#1e1e21] border-white/10 text-white hover:bg-[#252529]" 
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <option value={2}>2 ô / dòng</option>
                        <option value={3}>3 ô / dòng</option>
                      </select>
                    </div>
                  )}

                  {/* Option 3: Phóng to biểu tượng logo */}
                  {showLogoScale && (
                    <div className={`flex flex-col py-4 border-b gap-2 ${
                      darkMode ? "border-white/10" : "border-gray-200"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Phóng to biểu tượng</h4>
                        </div>
                        <span className={`font-mono text-xs font-bold text-[#1a73e8]`}>
                          {logoScale}%
                        </span>
                      </div>
                      <div className="flex items-center gap-3 py-1 bg-transparent">
                        <span className="text-[10px] text-gray-400 font-mono">0</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={logoScale}
                          onChange={(e) => setLogoScale(Number(e.target.value))}
                          className="flex-grow accent-[#1a73e8] h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-[10px] text-gray-400 font-mono">100</span>
                      </div>
                    </div>
                  )}

                  {/* Option: Chất lượng phát */}
                  {showQuality && (
                    <div className={`flex items-center justify-between py-4 border-b ${
                      darkMode ? "border-white/10" : "border-gray-200"
                    }`}>
                      <div>
                        <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Chất lượng phát</h4>
                      </div>
                      <select
                        value={playbackQuality}
                        onChange={(e) => setPlaybackQuality(e.target.value)}
                        className={`px-3 py-1.5 text-xs font-bold leading-tight cursor-pointer focus:outline-none border rounded-none ${
                          darkMode 
                            ? "bg-[#1e1e21] border-white/10 text-white hover:bg-[#252529]" 
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <option value="360p">360p</option>
                        <option value="480p">480p</option>
                        <option value="720p">720p</option>
                        <option value="1080p">1080p</option>
                      </select>
                    </div>
                  )}

                  {/* Option 4: Version Info option - blended wrapper */}
                  {showVersion && (
                    <div className={`flex items-center justify-between py-4 border-b ${
                      darkMode ? "border-white/10" : "border-gray-200"
                    }`}>
                      <div>
                        <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Phiên bản ứng dụng</h4>
                      </div>
                      <span className={`font-mono text-[11px] font-bold px-2 py-1 rounded-none ${
                        darkMode ? "bg-white/10 text-white" : "bg-gray-150 text-gray-800"
                      }`}>
                        0.1_beta_android_native_preview
                      </span>
                    </div>
                  )}

                  {/* Option 4: Developer settings (Cài đặt nhà phát triển) - Toggle options */}
                  {hasDevMatch && (
                    <div className={`mt-6 pt-6 border-t ${
                      darkMode ? "border-white/10" : "border-gray-200"
                    }`}>
                      <h3 className="font-bold text-xs uppercase tracking-wider mb-2 text-[#1a73e8]">
                        Cài đặt nhà phát triển
                      </h3>
                      
                      {/* Dev Option A: Hamburger Menu switch */}
                      {showHamburger && (
                        <div className={`flex items-center justify-between py-4 border-b ${
                          darkMode ? "border-white/10" : "border-gray-200"
                        }`}>
                          <div>
                            <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Hamburger menu</h4>
                          </div>
                          <ToggleSwitch checked={hamburgerEnabled} onChange={() => setHamburgerEnabled(!hamburgerEnabled)} />
                        </div>
                      )}

                      {/* Dev Option B: Search function switch */}
                      {showSearchFunc && (
                        <div className={`flex items-center justify-between py-4 border-b ${
                          darkMode ? "border-white/10" : "border-gray-200"
                        }`}>
                          <div>
                            <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Search function</h4>
                          </div>
                          <ToggleSwitch checked={searchEnabled} onChange={() => setSearchEnabled(!searchEnabled)} />
                        </div>
                      )}

                      {/* Dev Option C: Home page recommendations switch */}
                      {showHomeRec && (
                        <div className={`flex items-center justify-between py-4 border-b ${
                          darkMode ? "border-white/10" : "border-gray-200"
                        }`}>
                          <div>
                            <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Thử nghiệm trang chủ</h4>
                          </div>
                          <ToggleSwitch checked={homeRecommendationEnabled} onChange={() => setHomeRecommendationEnabled(!homeRecommendationEnabled)} />
                        </div>
                      )}

                      {/* Dev Option J: Package enabled switch */}
                      {showPackage && (
                        <div className={`flex items-center justify-between py-4 border-b flex-row ${
                          darkMode ? "border-white/10" : "border-gray-200"
                        }`}>
                          <div>
                            <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Package enabled</h4>
                          </div>
                          <ToggleSwitch checked={packageEnabled} onChange={() => {
                            const newVal = !packageEnabled;
                            setPackageEnabled(newVal);
                            if (!newVal && activeTab === "package") {
                              switchTab("trang-chu");
                            }
                          }} />
                        </div>
                      )}

                      {/* Dev Option K: Immersive search switch */}
                      {showImmersive && (
                        <div className={`flex items-center justify-between py-4 border-b flex-row ${
                          darkMode ? "border-white/10" : "border-gray-200"
                        }`}>
                          <div>
                            <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Immersive search</h4>
                          </div>
                          <ToggleSwitch checked={immersiveSearchEnabled} onChange={() => {
                            const newVal = !immersiveSearchEnabled;
                            setImmersiveSearchEnabled(newVal);
                            if (!newVal && activeTab === "tim-kiem") {
                              switchTab("trang-chu");
                            }
                          }} />
                        </div>
                      )}

                      {/* Dev Option L: Experimental remote control switch */}
                      {showRemote && (
                        <div className={`flex items-center justify-between py-4 border-b flex-row ${
                          darkMode ? "border-white/10" : "border-gray-200"
                        }`}>
                          <div>
                            <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Experimental remote control</h4>
                          </div>
                          <ToggleSwitch checked={remoteEnabled} onChange={() => setRemoteEnabled(!remoteEnabled)} />
                        </div>
                      )}

                      {/* Dev Option D: Bottom bar mode switch */}
                      {showBottomBar && (
                        <div className={`flex items-center justify-between py-4 border-b ${
                          darkMode ? "border-white/10" : "border-gray-200"
                        }`}>
                          <div>
                            <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Bottom bar</h4>
                          </div>
                          <ToggleSwitch checked={bottomBarEnabled} onChange={() => {
                            const newVal = !bottomBarEnabled;
                            setBottomBarEnabled(newVal);
                            if (newVal) {
                              setAppCrashed(true);
                            }
                          }} />
                        </div>
                      )}

                      {/* Dev Option D2: Floaty bars switch */}
                      {showFloaty && (
                        <div className={`flex items-center justify-between py-4 border-b ${
                          darkMode ? "border-white/10" : "border-gray-200"
                        }`}>
                          <div>
                            <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Floaty bars</h4>
                            <p className={`text-[10px] ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                              Làm cho thanh bottom bar nổi và bo tròn toàn bộ.
                            </p>
                          </div>
                          <ToggleSwitch checked={floatyBarsEnabled} onChange={() => setFloatyBarsEnabled(!floatyBarsEnabled)} />
                        </div>
                      )}

                      {/* Dev Option E: Status bar clock switch */}
                      {showClock && (
                        <div className="flex items-center justify-between py-4">
                          <div>
                            <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Display clock</h4>
                          </div>
                          <ToggleSwitch checked={displayClockEnabled} onChange={() => {
                            const newVal = !displayClockEnabled;
                            setDisplayClockEnabled(newVal);
                            if (newVal) {
                              setAppCrashed(true);
                            }
                          }} />
                        </div>
                      )}

                      {/* Dev Option F: Animation preview switch */}
                      {showAnim && (
                        <div className={`flex items-center justify-between py-4 border-t ${
                          darkMode ? "border-white/10" : "border-gray-200"
                        }`}>
                          <div>
                            <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Animation preview</h4>
                          </div>
                          <ToggleSwitch checked={animationPreviewEnabled} onChange={() => setAnimationPreviewEnabled(!animationPreviewEnabled)} />
                        </div>
                      )}

                      {/* Dev Option G: Rounded corners switch */}
                      {showRound && (
                        <div className={`flex items-center justify-between py-4 border-t ${
                          darkMode ? "border-white/10" : "border-gray-200"
                        }`}>
                          <div>
                            <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Rounded corners</h4>
                          </div>
                          <ToggleSwitch checked={roundedCornersEnabled} onChange={() => setRoundedCornersEnabled(!roundedCornersEnabled)} />
                        </div>
                      )}

                      {/* Dev Option M: Thick search switch */}
                      {showThickSearch && (
                        <div className={`flex items-center justify-between py-4 border-t flex-row ${
                          darkMode ? "border-white/10" : "border-gray-200"
                        }`}>
                          <div>
                            <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Thick search</h4>
                          </div>
                          <ToggleSwitch checked={thickSearchEnabled} onChange={() => setThickSearchEnabled(!thickSearchEnabled)} />
                        </div>
                      )}

                      {/* Dev Option H: New icon switch */}
                      {showNewIcon && (
                        <div className={`flex items-center justify-between py-4 border-t flex-row ${
                          darkMode ? "border-white/10" : "border-gray-200"
                        }`}>
                          <div>
                            <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>New icon</h4>
                          </div>
                          <ToggleSwitch checked={newIconEnabled} onChange={() => setNewIconEnabled(!newIconEnabled)} />
                        </div>
                      )}

                      {/* Dev Option I: Re-order channels expandable section */}
                      {showReorder && (
                        <div className={`py-4 border-t ${darkMode ? "border-white/10" : "border-gray-200"}`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Re-order channels</h4>
                              <p className={`text-[10px] ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                Tùy chỉnh và sắp xếp lại thứ tự của các kênh TV.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowReorderPanel(!showReorderPanel)}
                              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer font-sans bg-[#1a73e8] hover:bg-[#1557b0] text-white transition-all ${
                                roundedCornersEnabled ? "rounded-md" : "rounded-none"
                              }`}
                            >
                              {showReorderPanel ? "Thu gọn" : "Mở rộng"}
                            </button>
                          </div>

                          <AnimatePresence>
                            {showReorderPanel && (
                              <motion.div
                                initial={animationPreviewEnabled ? { opacity: 0, height: 0 } : false}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={animationPreviewEnabled ? { opacity: 0, height: 0 } : undefined}
                                className="overflow-hidden mt-3"
                              >
                                <div className={`p-3 border space-y-2 max-h-[320px] overflow-y-auto custom-scrollbar ${
                                  darkMode ? "bg-[#121212] border-white/5 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                                } ${roundedCornersEnabled ? "rounded-lg" : "rounded-none"}`}>
                                  <div className="flex justify-between items-center pb-1.5 border-b border-gray-200 dark:border-white/10">
                                    <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-gray-500">
                                      Lượt kênh ({allChannels.length})
                                    </span>
                                    <button
                                      type="button"
                                      onClick={resetChannelOrder}
                                      className="text-[9px] font-sans font-bold text-red-500 hover:underline cursor-pointer"
                                    >
                                      Khôi phục mặc định
                                    </button>
                                  </div>

                                  <div className="space-y-1">
                                    {allChannels.map((chan, idx) => (
                                      <motion.div
                                        layout
                                        key={chan.id}
                                        className={`flex items-center justify-between p-2 text-xs border ${
                                          darkMode 
                                            ? "bg-[#1c1c1f] border-white/5 hover:bg-[#252528] text-white" 
                                            : "bg-white border-gray-150 hover:bg-gray-50 text-gray-900"
                                        } ${roundedCornersEnabled ? "rounded-md" : "rounded-none"}`}
                                      >
                                        <div className="flex items-center gap-2 min-w-0">
                                          <span className="text-[10px] font-mono text-gray-500 w-4 font-bold text-center">
                                            {idx + 1}
                                          </span>
                                          {chan.logo ? (
                                            <img
                                              src={chan.logo}
                                              alt={chan.name}
                                              className="w-5 h-5 object-contain select-none flex-shrink-0"
                                              referrerPolicy="no-referrer"
                                            />
                                          ) : (
                                            <div className="w-5 h-5 bg-[#1a73e8]/10 text-[#1a73e8] rounded-full flex items-center justify-center text-[8px] font-bold font-sans flex-shrink-0">
                                              {chan.name.slice(0, 1)}
                                            </div>
                                          )}
                                          <span className="font-bold truncate text-[11px] font-sans">
                                            {chan.name}
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-0.5 flex-shrink-0">
                                          {/* Delete Custom Channel */}
                                          {(chan as any).isCustom && (
                                            <button
                                              type="button"
                                              onClick={() => {
                                                if (confirm(`Bạn có chắc chắn muốn xóa kênh "${chan.name}" không?`)) {
                                                  handleDeleteCustomTvChannel(chan.id);
                                                }
                                              }}
                                              title="Xóa kênh"
                                              className="p-1 text-red-500 hover:text-red-700 transition-colors cursor-pointer mr-1"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          )}
                                          {/* Top */}
                                          <button
                                            type="button"
                                            onClick={() => moveChannel(idx, "top")}
                                            disabled={idx === 0}
                                            title="Đưa lên đầu"
                                            className="p-1 text-gray-400 hover:text-[#1a73e8] disabled:opacity-30 disabled:hover:text-gray-400 transition-colors cursor-pointer"
                                          >
                                            <ChevronsUp className="w-3.5 h-3.5" />
                                          </button>
                                          {/* Up */}
                                          <button
                                            type="button"
                                            onClick={() => moveChannel(idx, "up")}
                                            disabled={idx === 0}
                                            title="Lên trên"
                                            className="p-1 text-gray-400 hover:text-[#1a73e8] disabled:opacity-30 disabled:hover:text-gray-400 transition-colors cursor-pointer"
                                          >
                                            <ChevronUp className="w-3.5 h-3.5" />
                                          </button>
                                          {/* Down */}
                                          <button
                                            type="button"
                                            onClick={() => moveChannel(idx, "down")}
                                            disabled={idx === allChannels.length - 1}
                                            title="Xuống dưới"
                                            className="p-1 text-gray-400 hover:text-[#1a73e8] disabled:opacity-30 disabled:hover:text-gray-400 transition-colors cursor-pointer"
                                          >
                                            <ChevronDown className="w-3.5 h-3.5" />
                                          </button>
                                          {/* Bottom */}
                                          <button
                                            type="button"
                                            onClick={() => moveChannel(idx, "bottom")}
                                            disabled={idx === allChannels.length - 1}
                                            title="Đưa xuống cuối"
                                            className="p-1 text-gray-400 hover:text-[#1a73e8] disabled:opacity-30 disabled:hover:text-gray-400 transition-colors cursor-pointer"
                                          >
                                            <ChevronsDown className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}
          </motion.div>
        )}

        {/* =============== VIEW 5: SIGN IN (BETA LOGIN PAGE) =============== */}
        {activeTab === "sign-in" && (
          <motion.div
            key="sign-in"
            initial={animationPreviewEnabled ? { opacity: 0, y: 15 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={animationPreviewEnabled ? { opacity: 0, y: -15 } : undefined}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex-grow flex items-center justify-center py-10 px-4 bg-transparent w-full"
          >
            {isLoggedIn ? (
              <div className={`w-full max-w-md p-6 border shadow-md text-left ${
                darkMode ? "bg-[#1e1e21] border-white/5" : "bg-white border-gray-200"
              } ${roundedCornersEnabled ? "rounded-lg" : "rounded-none"}`}>
                <div className="text-center mb-5">
                  <h3 className={`text-xs font-bold tracking-tight uppercase ${darkMode ? "text-[#1a73e8]" : "text-[#1557b0]"}`}>
                    Thông tin hồ sơ
                  </h3>
                  <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Cập nhật ảnh đại diện và tên hiển thị thành viên của bạn.
                  </p>
                </div>

                {/* Avatar upload representation */}
                <div className="flex flex-col items-center justify-center mb-5">
                  <div className="relative group cursor-pointer">
                    <div className={`w-16 h-16 rounded-full overflow-hidden flex items-center justify-center border-2 ${
                      darkMode ? "bg-[#27272a] border-[#1a73e8]/30" : "bg-gray-100 border-[#1557b0]/20"
                    }`}>
                      {photoURL ? (
                        <img 
                          src={photoURL} 
                          alt="Avatar" 
                          className="w-full h-full object-cover select-none"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <User className={`w-8 h-8 ${darkMode ? "text-[#1a73e8]" : "text-[#1557b0]"}`} />
                      )}
                    </div>
                    {/* Upload hover overlay click trigger */}
                    <label 
                      htmlFor="avatar-upload"
                      className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer text-white"
                      title="Tải lên ảnh mới"
                    >
                      <Upload className="w-5 h-5" />
                    </label>
                  </div>
                  <input 
                    type="file" 
                    id="avatar-upload" 
                    accept="image/*" 
                    onChange={handleAvatarChange}
                    className="hidden" 
                  />
                  <p className={`text-xs font-bold font-mono tracking-wide mt-2.5 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    @{currentUsername || "chưa_đặt"}
                  </p>
                  <label 
                    htmlFor="avatar-upload" 
                    className="text-[9px] uppercase font-sans font-bold tracking-wider px-2 py-1 bg-[#1a73e8]/10 text-[#1a73e8] hover:bg-[#1a73e8]/25 transition-colors mt-2 cursor-pointer rounded-xs"
                  >
                    Tải ảnh lên từ thiết bị
                  </label>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  {/* Readonly Username */}
                  <div>
                    <label className={`block text-[10px] font-bold mb-1 uppercase tracking-wider ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}>
                      Tên đăng nhập (username)
                    </label>
                    <input
                      type="text"
                      disabled
                      value={currentUsername ? `@${currentUsername}` : ""}
                      className={`w-full p-2.5 text-xs rounded-none border opacity-70 select-none outline-none font-mono ${
                        darkMode 
                          ? "bg-[#121212] border-white/10 text-gray-400" 
                          : "bg-gray-100 border-gray-300 text-gray-500"
                      }`}
                    />
                  </div>

                  {/* Readonly Email */}
                  <div>
                    <label className={`block text-[10px] font-bold mb-1 uppercase tracking-wider ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}>
                      Email liên kết
                    </label>
                    <input
                      type="text"
                      disabled
                      value={currentUser?.email || ""}
                      className={`w-full p-2.5 text-xs rounded-none border opacity-70 select-none outline-none ${
                        darkMode 
                          ? "bg-[#121212] border-white/10 text-gray-400" 
                          : "bg-gray-100 border-gray-300 text-gray-500"
                      }`}
                    />
                  </div>

                  {/* Editable display name */}
                  <div>
                    <label className={`block text-[10px] font-bold mb-1 uppercase tracking-wider ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}>
                      Tên hiển thị
                    </label>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Nhập tên của bạn"
                      className={`w-full p-2.5 text-xs rounded-none border focus:outline-none focus:border-[#1a73e8] ${
                        darkMode 
                          ? "bg-[#121212] border-white/10 text-white placeholder-gray-600" 
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      }`}
                    />
                  </div>

                  {authError && (
                    <p className="text-red-500 text-[10px] font-semibold text-center">{authError}</p>
                  )}

                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[11px] font-bold uppercase tracking-wider rounded-none cursor-pointer transition-all shadow-sm disabled:opacity-50"
                    >
                      {authLoading ? "Đang xử lý..." : "Lưu thay đổi"}
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={authLoading}
                      className="w-full py-2 bg-red-600/95 hover:bg-red-700 text-white text-[11px] font-bold uppercase tracking-wider rounded-none cursor-pointer transition-all shadow-sm disabled:opacity-50"
                    >
                      Đăng xuất tài khoản
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className={`w-full max-w-sm p-6 border shadow-md ${
                darkMode ? "bg-[#1e1e21] border-white/5" : "bg-white border-gray-200"
              } ${roundedCornersEnabled ? "rounded-lg" : "rounded-none"}`}>
                  <div className="text-center mb-6">
                    <h3 className={`text-base font-bold tracking-tight mt-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
                      {isRegistering ? "Đăng ký tài khoản Vplay" : "Đăng nhập tài khoản Vplay"}
                    </h3>
                    <p className={`text-[10px] mt-1.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {isRegistering 
                        ? "Bắt đầu tạo tài khoản để đồng bộ hóa tùy chọn xem TV." 
                        : "Trải nghiệm đầy đủ tính năng của Vplay bằng cách đăng nhập ngay."}
                    </p>
                  </div>

                  {isRegistering ? (
                    <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left">
                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}>
                          Tên hiển thị
                        </label>
                        <input
                          type="text"
                          name="displayName"
                          required
                          placeholder="Nguyễn Văn A"
                          className={`w-full p-2.5 text-xs rounded-none border focus:outline-none focus:border-[#1a73e8] ${
                            darkMode 
                              ? "bg-[#121212] border-white/10 text-white placeholder-gray-600" 
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}>
                          Tên đăng nhập (username)
                        </label>
                        <input
                          type="text"
                          name="username"
                          required
                          placeholder="vietnam123"
                          className={`w-full p-2.5 text-xs rounded-none border focus:outline-none focus:border-[#1a73e8] font-mono ${
                            darkMode 
                              ? "bg-[#121212] border-white/10 text-white placeholder-gray-600" 
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                          }`}
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className={`block text-xs font-bold ${
                            darkMode ? "text-gray-300" : "text-gray-600"
                          }`}>
                            Địa chỉ Email
                          </label>
                          <span className="text-[9px] text-[#1a73e8] font-bold tracking-wide uppercase">Tùy chọn</span>
                        </div>
                        <input
                          type="email"
                          name="email"
                          placeholder="example@vplay.vn (Để trống tự tạo)"
                          className={`w-full p-2.5 text-xs rounded-none border focus:outline-none focus:border-[#1a73e8] ${
                            darkMode 
                              ? "bg-[#121212] border-white/10 text-white placeholder-gray-600" 
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}>
                          Mật khẩu
                        </label>
                        <input
                          type="password"
                          name="password"
                          required
                          placeholder="••••••••"
                          className={`w-full p-2.5 text-xs rounded-none border focus:outline-none focus:border-[#1a73e8] ${
                            darkMode 
                              ? "bg-[#121212] border-white/10 text-white placeholder-gray-600" 
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                          }`}
                        />
                      </div>

                      {authError && (
                        <p className="text-red-500 text-[10px] font-semibold text-center">{authError}</p>
                      )}

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={authLoading}
                          className="w-full py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[11px] font-bold uppercase tracking-wider rounded-none cursor-pointer transition-all shadow-sm disabled:opacity-50"
                        >
                          {authLoading ? "Đang xử lý..." : "Đăng ký tài khoản"}
                        </button>
                      </div>

                      <div className="text-center pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsRegistering(false);
                            setAuthError(null);
                          }}
                          className="text-[#1a73e8] hover:underline text-[11px] font-semibold cursor-pointer"
                        >
                          Đã có tài khoản? Đăng nhập ngay
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                      {/* Premium Test Account Quick Entry banner */}
                      <div className={`p-3 border rounded-none text-left mb-2 transition-all ${
                        darkMode 
                          ? "bg-[#1a73e8]/10 border-[#1a73e8]/30" 
                          : "bg-blue-50/70 border-blue-200"
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold tracking-wider uppercase font-sans ${
                            darkMode ? "text-[#1a73e8]" : "text-[#1557b0]"
                          }`}>
                            Tài khoản thử nghiệm (Full access)
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 font-bold uppercase tracking-wider bg-green-500/10 text-green-500">
                            BETA
                          </span>
                        </div>
                        <p className={`text-[10px] mt-1 font-mono leading-relaxed ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}>
                          Tên đăng nhập: <strong className="select-all text-[#1a73e8]">vplayandroid</strong><br />
                          Mật khẩu: <strong className="select-all text-[#1a73e8]">abc123</strong>
                        </p>
                        <div className="mt-2 text-right">
                          <button
                            type="button"
                            onClick={async () => {
                              await handleTestAccountLogin();
                            }}
                            className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider bg-[#1a73e8] hover:bg-[#1557b0] text-white cursor-pointer active:scale-95 transition-all"
                          >
                            Đăng nhập nhanh
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}>
                          Tên đăng nhập hoặc Email
                        </label>
                        <input
                          type="text"
                          name="loginIdentity"
                          required
                          placeholder="Nhập email hoặc username..."
                          className={`w-full p-2.5 text-xs rounded-none border focus:outline-none focus:border-[#1a73e8] ${
                            darkMode 
                              ? "bg-[#121212] border-white/10 text-white placeholder-gray-600" 
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}>
                          Mật khẩu
                        </label>
                        <input
                          type="password"
                          name="password"
                          required
                          placeholder="••••••••"
                          className={`w-full p-2.5 text-xs rounded-none border focus:outline-none focus:border-[#1a73e8] ${
                            darkMode 
                              ? "bg-[#121212] border-white/10 text-white placeholder-gray-600" 
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                          }`}
                        />
                      </div>

                      {authError && (
                        <p className="text-red-500 text-[10px] font-semibold text-center">{authError}</p>
                      )}

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={authLoading}
                          className="w-full py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[11px] font-bold uppercase tracking-wider rounded-none cursor-pointer transition-all shadow-sm disabled:opacity-50"
                        >
                          {authLoading ? "Đang xử lý..." : "Đăng nhập tài khoản"}
                        </button>
                      </div>

                      <div className="text-center pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsRegistering(true);
                            setAuthError(null);
                          }}
                          className="text-[#1a73e8] hover:underline text-[11px] font-semibold cursor-pointer"
                        >
                          Chưa có tài khoản? Đăng ký ngay
                        </button>
                      </div>
                    </form>
                  )}
              </div>
            )}
          </motion.div>
        )}

        {/* =============== VIEW 6: VPLAY ANDROID FAQ =============== */}
        {activeTab === "vplay-android-faq" && (
          <motion.div
            key="vplay-android-faq"
            initial={animationPreviewEnabled ? { opacity: 0, y: 15 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={animationPreviewEnabled ? { opacity: 0, y: -15 } : undefined}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex-grow py-8 max-w-3xl mx-auto px-4 w-full"
          >
            <h2 className={`font-roboto text-xl font-bold tracking-tight mb-6 text-center ${darkMode ? "text-white" : "text-gray-900"}`}>
              Vplay Android FAQ
            </h2>
            <div className={`font-roboto flex flex-col gap-6 text-left ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-[#1a73e8]">
                  1. Vplay Android là gì?
                </h3>
                <p className={`text-xs leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Vplay Android là dự án xây dựng ứng dụng xem truyền hình Vplay hoàn toàn native, không port từ phiên bản web của Vplay.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-[#1a73e8]">
                  2. Có một vài tính năng từ Vplay Web bị thiếu trong Vplay Android
                </h3>
                <p className={`text-xs leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Điều đó hoàn toàn bình thường khi mà hiện ứng dụng vẫn đang trong quá trình phát triển nên rất nhiều tính năng sẽ bị thiếu và sẽ có rất nhiều lỗi.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-[#1a73e8]">
                  3. Vplay Android có tối ưu cho thiết bị yếu không?
                </h3>
                <p className={`text-xs leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Tất nhiên, Vplay Android đã giảm thiểu nhiều tính năng và hiệu ứng nhất có thể để có thể chạy tốt nhất trên các dòng điện thoại đời cũ có hiệu năng kém. Bạn vẫn có thể tùy chỉnh, bật/tắt các hiệu ứng trong cài đặt nếu muốn.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-[#1a73e8]">
                  4. Vplay Android khác gì Vplay Web?
                </h3>
                <div className={`text-xs space-y-3 leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-650"}`}>
                  <p>
                    <span className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Vplay Android</span> là phiên bản được xây dựng từ các thành phần gốc của android, sẽ có một số hạn chế về tùy biến, hiệu ứng và các tính năng dư thừa được cắt giảm đi đáng kể. Thích hợp cho các dòng máy đời cũ có hiệu năng kém.
                  </p>
                  <p>
                    <span className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Vplay Web</span> là phiên bản được xây dựng trên web sử dùng Google Build, có thể thoải mái tùy biến giao diện, hiệu ứng và các tính năng được chú trong hơn. Thích hợp cho các dòng máy đời mới, hiệu năng cao.
                  </p>
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <button
                  onClick={() => switchTab("truc-tiep")}
                  className="px-6 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold uppercase tracking-wider rounded-none cursor-pointer shadow-md transition-all"
                >
                  Đến tab Live
                </button>
              </div>
            </div>
          </motion.div>
        )}

          </AnimatePresence>
        )}
      </main>

      {/* Elegant, completely clean empty space footer */}
      <footer className="w-full mt-4 py-2 text-center" />

      {/* Styled Android-style Dialog for login request popup (INSTANT TRANSITION - NO ANIMATION AT ALL) */}
      {showLoginPopup && (
        <div 
          className="fixed inset-0 bg-black/55 z-55 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setShowLoginPopup(false)}
        >
          <div
            className="w-full max-w-[340px] bg-white text-gray-900 shadow-2xl p-6 cursor-default rounded-none max-h-min border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title left-aligned */}
            <h3 className="text-xl font-bold tracking-tight text-gray-950 mb-2 font-sans text-left">
              Yêu cầu đăng nhập
            </h3>
            
            {/* Message body left-aligned */}
            <p className="text-xs text-gray-600 leading-relaxed font-normal mb-6 text-left">
              Nội dung bạn muốn xem yêu cầu đăng nhập vào tài khoản. Vui lòng đi đến tab Đăng nhập để đăng nhập.
            </p>

            {/* Flat action buttons section */}
            <div className="flex items-center justify-end gap-1 font-sans">
              <button
                onClick={() => setShowLoginPopup(false)}
                className="px-3 py-2 text-[11px] font-bold text-[#1a73e8] hover:bg-gray-100 active:bg-gray-200 cursor-pointer rounded-none border-none uppercase transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  setShowLoginPopup(false);
                  switchTab("sign-in");
                }}
                className="px-3 py-2 text-[11px] font-bold text-[#1a73e8] hover:bg-gray-100 active:bg-gray-200 cursor-pointer rounded-none border-none uppercase transition-colors"
              >
                ĐẾN ĐĂNG NHẬP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styled Android-style Dialog for app crash simulation (INSTANT TRANSITION - NO ANIMATION AT ALL) */}
      {appCrashed && (
        <div 
          className="fixed inset-0 bg-black/55 z-55 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setAppCrashed(false)}
        >
          <div
            className="w-full max-w-[340px] bg-white text-gray-900 shadow-2xl p-6 cursor-default rounded-none max-h-min border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title left-aligned */}
            <h3 className="text-xl font-bold tracking-tight text-gray-950 mb-2 font-sans text-left">
              Something went wrong
            </h3>
            
            {/* Message body left-aligned */}
            <p className="text-xs text-gray-600 leading-relaxed font-normal mb-6 text-left">
              App crashed. Try to restart your app
            </p>

            {/* Flat action buttons section */}
            <div className="flex items-center justify-end font-sans">
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="px-3 py-2 text-[11px] font-bold text-[#1a73e8] hover:bg-gray-100 active:bg-gray-200 cursor-pointer rounded-none border-none uppercase transition-colors"
              >
                RESTART APP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styled Dialog for adding custom TV channel */}
      {showAddChannelModal && (
        <div 
          className="fixed inset-0 bg-black/55 z-55 flex items-center justify-center p-4 cursor-pointer font-sans"
          onClick={() => setShowAddChannelModal(false)}
        >
          <div
            className="w-full max-w-[340px] bg-white text-gray-900 shadow-2xl p-6 cursor-default rounded-none max-h-min border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title left-aligned */}
            <h3 className="text-xl font-bold tracking-tight text-gray-950 mb-4 font-sans text-left">
              Thêm kênh truyền hình mới
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newChannelName.trim() || !newChannelUrl.trim()) {
                alert("Vui lòng nhập đầy đủ tên kênh và URL luồng phát!");
                return;
              }
              handleAddCustomTvChannel(newChannelName.trim(), newChannelUrl.trim(), newChannelLogo.trim());
              setNewChannelName("");
              setNewChannelUrl("");
              setNewChannelLogo("");
              setShowAddChannelModal(false);
            }} className="space-y-4 text-left">
              <div>
                <label className="block text-[10px] font-bold mb-1 uppercase tracking-wider text-gray-500">
                  Tên kênh hiển thị <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nhập tên kênh"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  className="w-full p-2 py-1.5 text-xs border border-gray-300 text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:border-[#1a73e8] rounded-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold mb-1 uppercase tracking-wider text-gray-500">
                  URL Luồng phát (.m3u8 hoặc luồng trực tiếp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/live.m3u8"
                  value={newChannelUrl}
                  onChange={(e) => setNewChannelUrl(e.target.value)}
                  className="w-full p-2 py-1.5 text-xs border border-gray-300 text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:border-[#1a73e8] font-mono rounded-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold mb-1 uppercase tracking-wider text-gray-500">
                  URL Ảnh đại diện / Logo / Biểu tượng (Tùy chọn)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={newChannelLogo}
                  onChange={(e) => setNewChannelLogo(e.target.value)}
                  className="w-full p-2 py-1.5 text-xs border border-gray-300 text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:border-[#1a73e8] font-mono rounded-none shadow-sm"
                />
              </div>

              <div className="flex items-center justify-end font-sans pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddChannelModal(false)}
                  className="px-3 py-2 text-[11px] font-bold text-[#1a73e8] hover:bg-gray-100 active:bg-gray-200 cursor-pointer rounded-none border-none uppercase transition-colors"
                >
                  HUỶ
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 text-[11px] font-bold text-[#1a73e8] hover:bg-gray-100 active:bg-gray-200 cursor-pointer rounded-none border-none uppercase transition-colors font-semibold"
                >
                  THÊM KÊNH
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Experimental Digital Hardware Remote UI Pop-up */}
      {showRemoteUI && (
        <div 
          className="fixed inset-0 bg-black/55 z-55 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => {
            setShowRemoteUI(false);
            setRemoteDialDigits("");
          }}
        >
          <div
            className="w-full max-w-[280px] bg-[#1a1a1c] text-white shadow-2xl p-5 cursor-default rounded-2xl border border-white/10 flex flex-col font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Display screen */}
            <div className="bg-black/50 border border-white/5 p-3 rounded-lg mb-4 text-center font-mono">
              <div className="text-[9px] text-gray-400 uppercase tracking-widest mb-1 font-semibold">Nhập số kênh</div>
              <div className="text-2xl font-bold tracking-widest text-[#1a73e8] min-h-[32px] flex items-center justify-center">
                {remoteDialDigits || "— —"}
              </div>
              <div className="text-[10px] text-gray-400 mt-1 truncate min-h-[15px]">
                {getMatchedChannelForRemote(remoteDialDigits) 
                  ? `Sẽ chuyển: ${getMatchedChannelForRemote(remoteDialDigits)?.name}` 
                  : "Chưa khớp kênh"}
              </div>
            </div>

            {/* Numerical Pad Grid */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    if (remoteDialDigits.length < 4) {
                      setRemoteDialDigits(prev => prev + num);
                    }
                  }}
                  className="py-3 bg-white/5 hover:bg-white/10 active:bg-white/15 text-lg font-bold rounded-lg transition-all cursor-pointer font-mono border-none focus:outline-none"
                >
                  {num}
                </button>
              ))}
              {/* CLR code */}
              <button
                type="button"
                onClick={() => setRemoteDialDigits("")}
                className="py-3 bg-red-650 hover:bg-red-600 active:bg-red-700 text-xs font-bold rounded-lg transition-all cursor-pointer text-red-100 border-none focus:outline-none"
              >
                CLR
              </button>
              {/* 0 */}
              <button
                type="button"
                onClick={() => {
                  if (remoteDialDigits.length < 4) {
                    setRemoteDialDigits(prev => prev + "0");
                  }
                }}
                className="py-3 bg-white/5 hover:bg-white/10 active:bg-white/15 text-lg font-bold rounded-lg transition-all cursor-pointer font-mono border-none focus:outline-none"
              >
                0
              </button>
              {/* Backspace code */}
              <button
                type="button"
                onClick={() => setRemoteDialDigits(prev => prev.slice(0, -1))}
                className="py-3 bg-white/5 hover:bg-white/10 active:bg-white/15 text-sm font-bold rounded-lg transition-all cursor-pointer border-none focus:outline-none"
              >
                ←
              </button>
            </div>

            {/* Controller Action Buttons */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  const target = getMatchedChannelForRemote(remoteDialDigits);
                  if (target) {
                    handleSelectChannel(target);
                    setShowRemoteUI(false);
                    setRemoteDialDigits("");
                  } else {
                    alert("Không tìm thấy kênh phù hợp với số: " + remoteDialDigits);
                  }
                }}
                disabled={!getMatchedChannelForRemote(remoteDialDigits)}
                className={`w-full py-2.5 font-bold text-xs uppercase tracking-wider rounded-lg transition-all border-none ${
                  getMatchedChannelForRemote(remoteDialDigits)
                    ? "bg-[#1a73e8] hover:bg-[#1557b0] text-white cursor-pointer"
                    : "bg-white/5 text-gray-500 cursor-not-allowed"
                }`}
              >
                CHUYỂN KÊNH
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRemoteUI(false);
                  setRemoteDialDigits("");
                }}
                className="w-full py-2 bg-transparent hover:bg-white/5 text-gray-400 hover:text-white rounded-lg text-xs font-bold transition-all border-none cursor-pointer"
              >
                ĐÓNG REMOTE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Navigation Bar under Dev setting */}
      {bottomBarEnabled && (
        <div className={floatyBarsEnabled
          ? `fixed bottom-4 left-4 right-4 max-w-lg mx-auto z-45 border flex items-center justify-around h-14 shadow-[0_8px_32px_rgba(0,0,0,0.16)] px-2 rounded-full transition-all duration-300 ${
              darkMode ? "bg-[#1c1c1f]/95 backdrop-blur-md border-white/10 text-gray-300" : "bg-white/95 backdrop-blur-md border-gray-300 text-gray-700"
            }`
          : `fixed bottom-0 left-0 right-0 z-45 border-t flex items-center justify-around h-12 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] transition-all duration-300 ${
              darkMode ? "bg-[#1c1c1f] border-white/5 text-gray-300" : "bg-white border-gray-200 text-gray-700"
            }`
        }>
          <button
            onClick={() => switchTab("trang-chu")}
            className={`relative flex flex-col items-center justify-center cursor-pointer h-full flex-1 min-w-0 transition-all ${
              activeTab === "trang-chu" 
                ? "text-[#1a73e8] font-bold" 
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium"
            } ${animationPreviewEnabled ? "hover:scale-[1.05] active:scale-95 duration-200" : ""}`}
          >
            <span className="text-[11px] uppercase tracking-wide truncate">Trang chủ</span>
            {activeTab === "trang-chu" && (
              <motion.div 
                layoutId="activeBottomTabLine"
                className={floatyBarsEnabled 
                  ? "absolute bottom-1 w-1.5 h-1.5 bg-[#1a73e8] rounded-full z-10"
                  : "absolute bottom-0 left-3 right-3 h-[3px] bg-[#1a73e8] rounded-none z-10"
                }
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>

          <button
            onClick={() => switchTab("truc-tiep")}
            className={`relative flex flex-col items-center justify-center cursor-pointer h-full flex-1 min-w-0 transition-all ${
              activeTab === "truc-tiep" 
                ? "text-[#1a73e8] font-bold" 
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium"
            } ${animationPreviewEnabled ? "hover:scale-[1.05] active:scale-95 duration-200" : ""}`}
          >
            <span className="text-[11px] uppercase tracking-wide truncate">Trực tiếp</span>
            {activeTab === "truc-tiep" && (
              <motion.div 
                layoutId="activeBottomTabLine"
                className={floatyBarsEnabled 
                  ? "absolute bottom-1 w-1.5 h-1.5 bg-[#1a73e8] rounded-full z-10"
                  : "absolute bottom-0 left-3 right-3 h-[3px] bg-[#1a73e8] rounded-none z-10"
                }
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>

          {packageEnabled && (
            <button
              onClick={() => switchTab("package")}
              className={`relative flex flex-col items-center justify-center cursor-pointer h-full flex-1 min-w-0 transition-all ${
                activeTab === "package" 
                  ? "text-[#1a73e8] font-bold" 
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium"
              } ${animationPreviewEnabled ? "hover:scale-[1.05] active:scale-95 duration-200" : ""}`}
            >
              <span className="text-[11px] uppercase tracking-wide truncate">Package</span>
              {activeTab === "package" && (
                <motion.div 
                  layoutId="activeBottomTabLine"
                  className={floatyBarsEnabled 
                    ? "absolute bottom-1 w-1.5 h-1.5 bg-[#1a73e8] rounded-full z-10"
                    : "absolute bottom-0 left-3 right-3 h-[3px] bg-[#1a73e8] rounded-none z-10"
                  }
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          )}

          {/* Add Custom Channel Shortcut positioned between Package (or Trực tiếp if package is disabled) and Cài đặt */}
          <button
            type="button"
            onClick={() => setShowAddChannelModal(true)}
            className={`relative flex flex-col items-center justify-center cursor-pointer h-full flex-1 min-w-0 transition-all text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ${
              animationPreviewEnabled ? "hover:scale-[1.12] active:scale-90 duration-200" : ""
            }`}
            title="Thêm kênh truyền hình mới"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#1a73e8]/25 transition-all ${
              darkMode ? "bg-white/5 text-gray-300 hover:text-white" : "bg-gray-100/90 text-gray-700 hover:text-black"
            }`}>
              <Plus className="w-5 h-5 font-bold" />
            </div>
          </button>

          <button
            onClick={() => switchTab("cai-dat")}
            className={`relative flex flex-col items-center justify-center cursor-pointer h-full flex-1 min-w-0 transition-all ${
              activeTab === "cai-dat" 
                ? "text-[#1a73e8] font-bold" 
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium"
            } ${animationPreviewEnabled ? "hover:scale-[1.05] active:scale-95 duration-200" : ""}`}
          >
            <span className="text-[11px] uppercase tracking-wide truncate">Cài đặt</span>
            {activeTab === "cai-dat" && (
              <motion.div 
                layoutId="activeBottomTabLine"
                className={floatyBarsEnabled 
                  ? "absolute bottom-1 w-1.5 h-1.5 bg-[#1a73e8] rounded-full z-10"
                  : "absolute bottom-0 left-3 right-3 h-[3px] bg-[#1a73e8] rounded-none z-10"
                }
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>

          <button
            onClick={() => switchTab("sign-in")}
            className={`relative flex flex-col items-center justify-center cursor-pointer h-full flex-1 min-w-0 transition-all ${
              activeTab === "sign-in" 
                ? "text-[#1a73e8] font-bold" 
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium"
            } ${animationPreviewEnabled ? "hover:scale-[1.05] active:scale-95 duration-200" : ""}`}
          >
            <span className="text-[11px] uppercase tracking-wide truncate">
              {isLoggedIn ? "Profile" : "Sign in"}
            </span>
            {activeTab === "sign-in" && (
              <motion.div 
                layoutId="activeBottomTabLine"
                className={floatyBarsEnabled 
                  ? "absolute bottom-1 w-1.5 h-1.5 bg-[#1a73e8] rounded-full z-10"
                  : "absolute bottom-0 left-3 right-3 h-[3px] bg-[#1a73e8] rounded-none z-10"
                }
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>

          <button
            onClick={() => switchTab("vplay-android-faq")}
            className={`relative flex flex-col items-center justify-center cursor-pointer h-full flex-1 min-w-0 transition-all ${
              activeTab === "vplay-android-faq" 
                ? "text-[#1a73e8] font-bold" 
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium"
            } ${animationPreviewEnabled ? "hover:scale-[1.05] active:scale-95 duration-200" : ""}`}
          >
            <span className="text-[11px] uppercase tracking-wide truncate">FAQ</span>
            {activeTab === "vplay-android-faq" && (
              <motion.div 
                layoutId="activeBottomTabLine"
                className={floatyBarsEnabled 
                  ? "absolute bottom-1 w-1.5 h-1.5 bg-[#1a73e8] rounded-full z-10"
                  : "absolute bottom-0 left-3 right-3 h-[3px] bg-[#1a73e8] rounded-none z-10"
                }
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
