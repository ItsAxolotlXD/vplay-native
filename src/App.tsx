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
  AlertTriangle
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

type AppTab = "trang-chu" | "truc-tiep" | "package" | "cai-dat" | "sign-in" | "vplay-android-faq";

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

  // Load dev home recommendation setting (default is true)
  const [homeRecommendationEnabled, setHomeRecommendationEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("vplay-dev-home");
      return saved !== null ? saved === "true" : true;
    } catch {
      return true;
    }
  });

  const allChannels = CHANNELS_DATA;

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
      return saved !== null ? Number(saved) : 100;
    } catch {
      return 100;
    }
  });

  const switchTab = (tab: AppTab) => {
    if (tab === "package") {
      setAppCrashed(true);
      return;
    }
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
  const [photoURL, setPhotoURL] = useState("");

  // Profile / Friends list / Username state
  const [currentUsername, setCurrentUsername] = useState<string>("");
  const [friendsList, setFriendsList] = useState<{ uid: string; displayName: string; username: string }[]>([]);
  const [friendInput, setFriendInput] = useState<string>("");
  const [friendActionLoading, setFriendActionLoading] = useState<boolean>(false);
  const [friendActionError, setFriendActionError] = useState<string | null>(null);
  const [friendActionSuccess, setFriendActionSuccess] = useState<string | null>(null);

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
        localStorage.setItem("vplay-logged-in", "true");

        // Fetch username from Firestore
        try {
          const userDocRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setCurrentUsername(data.username || "");
          } else {
            // Auto generate username for legacy users
            const autoUsername = user.email?.split("@")[0] || "user_" + user.uid.slice(0, 5);
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
            setCurrentUsername(autoUsername);
          }
        } catch (err) {
          console.error("Error loading user profile from Firestore:", err);
        }
      } else {
        setCurrentUser(null);
        setIsLoggedIn(false);
        setDisplayName("");
        setCurrentUsername("");
        setFriendsList([]);
        localStorage.setItem("vplay-logged-in", "false");
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen to friends list updates in real-time
  useEffect(() => {
    if (!currentUser) return;
    const userDocRef = doc(db, "users", currentUser.uid);
    const unsub = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setFriendsList(data.friends || []);
        if (data.username) {
          setCurrentUsername(data.username);
        }
      }
    }, (err) => {
      console.error("Firestore onSnapshot error:", err);
    });
    return () => unsub();
  }, [currentUser]);

  // Firebase Auth functions
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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setAuthLoading(true);
    setAuthError(null);
    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName
      });
      
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, {
        displayName: displayName
      });
      
      if (currentUsername) {
        const usernameDocRef = doc(db, "usernames", currentUsername.toLowerCase());
        await updateDoc(usernameDocRef, {
          displayName: displayName
        });
      }
      alert("Cập nhật thông tin hồ sơ thành công!");
    } catch (err: any) {
      console.error("Profile update error:", err);
      setAuthError("Không thể cập nhật hồ sơ vạn lỗi. Thử lại sau.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!friendInput.trim()) return;

    setFriendActionLoading(true);
    setFriendActionError(null);
    setFriendActionSuccess(null);

    const targetUsername = friendInput.trim().toLowerCase();

    // Prevent adding self
    if (targetUsername === currentUsername.toLowerCase()) {
      setFriendActionError("Không thể tự kết bạn với chính mình.");
      setFriendActionLoading(false);
      return;
    }

    try {
      // Look up target username in /usernames/{targetUsername}
      const usernameDocRef = doc(db, "usernames", targetUsername);
      const usernameSnap = await getDoc(usernameDocRef);

      if (!usernameSnap.exists()) {
        setFriendActionError(`Không tìm thấy người dùng có tên đăng nhập "${friendInput}".`);
        setFriendActionLoading(false);
        return;
      }

      const targetData = usernameSnap.data();
      const targetUid = targetData.uid;
      const targetDisplayName = targetData.displayName || targetData.username;
      const targetOrgUsername = targetData.username;

      // Check if already friends
      const alreadyFriends = friendsList.some(item => item.uid === targetUid);
      if (alreadyFriends) {
        setFriendActionError(`Bạn và "${targetOrgUsername}" đã là bạn bè rồi.`);
        setFriendActionLoading(false);
        return;
      }

      // Add as friend for both users!
      const myUserDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(myUserDocRef, {
        friends: arrayUnion({
          uid: targetUid,
          displayName: targetDisplayName,
          username: targetOrgUsername
        })
      });

      const targetUserDocRef = doc(db, "users", targetUid);
      await updateDoc(targetUserDocRef, {
        friends: arrayUnion({
          uid: currentUser.uid,
          displayName: displayName || currentUsername,
          username: currentUsername
        })
      });

      setFriendActionSuccess(`Đã kết bạn thành công với "${targetOrgUsername}"!`);
      setFriendInput("");
    } catch (err: any) {
      console.error("Add friend error:", err);
      setFriendActionError("Đã xảy ra lỗi khi thêm bạn bè. Vui lòng thử lại.");
    } finally {
      setFriendActionLoading(false);
    }
  };

  const handleRemoveFriend = async (friend: { uid: string; displayName: string; username: string }) => {
    if (!currentUser) return;
    if (!confirm(`Bạn có chắc muốn xóa kết bạn với ${friend.displayName} (@${friend.username})?`)) return;

    try {
      const myUserDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(myUserDocRef, {
        friends: arrayRemove(friend)
      });

      const targetUserDocRef = doc(db, "users", friend.uid);
      await updateDoc(targetUserDocRef, {
        friends: arrayRemove({
          uid: currentUser.uid,
          displayName: displayName || currentUsername,
          username: currentUsername
                })
      });
    } catch (err) {
      console.error("Remove friend error:", err);
      alert("Đã xảy ra lỗi khi xóa bạn bè. Thử lại sau.");
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

  // Dynamic values based on Dark Mode setting (Removed transition-colors & duration classes to prevent transitions/fade)
  const appBgClass = darkMode ? "bg-[#121212] text-[#f1f1f1]" : "bg-white text-[#111111]";
  const subPanelBgClass = darkMode ? "bg-[#1e1e21] border-white/5" : "bg-white border-gray-200";

  return (
    <div className={`min-h-screen ${bottomBarEnabled ? "pb-24" : "pb-10"} font-sans rounded-none flex flex-col antialiased ${appBgClass}`}>
      
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
            <span className="font-bold text-lg tracking-tight text-white leading-none selection:bg-white/30">
              Vplay Android
            </span>
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
                const nextSearch = !showSearchInput;
                setShowSearchInput(nextSearch);
                if (nextSearch && activeTab !== "truc-tiep") {
                  switchTab("truc-tiep");
                }
                if (!nextSearch) {
                  setSearchTerm("");
                }
              }}
              className={`p-2 cursor-pointer rounded-none relative ${
                showSearchInput ? "bg-white text-[#343434]" : "hover:bg-white/10 active:bg-white/15 text-white"
              }`}
              title="Tìm kiếm kênh"
              id="btn-top-search"
            >
              <Search className="w-5 h-5" />
            </button>

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
      {showSearchInput && (
        <div className={`border-b ${darkMode ? "bg-[#18181a] border-white/5" : "bg-gray-50 border-gray-200"}`}>
          <div className="max-w-7xl mx-auto px-3 py-2">
            <div className={`flex items-center gap-2 px-3 py-2 border rounded-none shadow-sm ${
              darkMode ? "bg-[#1e1e21] border-white/10 text-white" : "bg-white border-gray-300 text-gray-900"
            }`}>
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search TV..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-xs w-full focus:outline-none font-roboto font-medium placeholder-gray-400"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="text-gray-400 hover:text-gray-550 p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Container Layout: Optimized vertical single column for mobile first */}
      <main className="max-w-7xl w-full mx-auto px-3 py-3 flex flex-col gap-3 flex-grow min-h-[350px]">
        
        {isNavigating ? (
          <div className="flex-grow flex flex-col items-center justify-center py-24 text-center rounded-none bg-transparent">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-[#1a73e8] border-t-transparent animate-spin rounded-full"></div>
            </div>
          </div>
        ) : (
          <>
            {/* =============== VIEW 1: TRANG CHỦ (COMMUNITY RECOMMENDATIONS & PREMIUM BANNER) =============== */}
            {activeTab === "trang-chu" && (
              <div className="flex flex-col gap-4 rounded-none">
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
                      href="https://vplay-android.firebaseapp.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-5 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[11px] font-bold uppercase tracking-wider rounded-none cursor-pointer shadow-md transition-all text-center font-sans tracking-wide"
                    >
                      THỬ VPLAY WEB BY VNRT
                    </a>
                  </div>
                </div>
              </div>
            )}

        {/* =============== VIEW 2: TRỰC TIẾP (MAIN PLAYER & CHANNELS GRID) =============== */}
        {activeTab === "truc-tiep" && (
          <>
            {/* Dynamic Player Screen and Title Container */}
            <div className="flex flex-col gap-3 rounded-none">
              
              {/* Live Player Element */}
              <MaterialPlayer 
                currentChannel={currentChannel} 
                themeColor="ocean" 
                playbackQuality={playbackQuality}
              />

              {/* Active play information banner (completely clean & simplified flat design) */}
              <div className={`p-3 rounded-none ${subPanelBgClass}`}>
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
            <div className="flex flex-col gap-3 rounded-none">
              <div className={`p-3 rounded-none border ${subPanelBgClass}`}>
                
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
                  />
                )}

              </div>
            </div>
          </>
        )}

        {/* =============== VIEW 3: PACKAGE (COMING SOON SIMPLIFIED) =============== */}
        {activeTab === "package" && (
          <div className="flex-grow flex items-center justify-center py-24 text-center rounded-none bg-transparent">
            <div className={`font-roboto ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              <div className="text-sm font-bold mb-1">Coming soon.</div>
              <div className="text-[11px] font-medium opacity-85">To get started, go to Live tab</div>
            </div>
          </div>
        )}

        {/* =============== VIEW 4: CÀI ĐẶT (SETTINGS BLENDED WITH THE APP BACKGROUND) =============== */}
        {activeTab === "cai-dat" && (
          <div className="flex flex-col gap-1 rounded-none px-1">
            
            {/* App Settings list - blended option list (no encapsulating dark boxes, direct background flow) */}
            <div className="flex flex-col text-xs">
              
              {/* Option 1: Dark Mode Toggle with blue Toggle Switch as requested */}
              <div className={`flex items-center justify-between py-4 border-b ${
                darkMode ? "border-white/10" : "border-gray-200"
              }`}>
                <div>
                  <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Chế độ tối</h4>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex h-6 w-11 items-center cursor-pointer focus:outline-none rounded-full ${
                    darkMode ? "bg-[#1a73e8]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                      darkMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Option 2: Grid column tiles layout selector (flat rectangular selection) */}
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

              {/* Option 3: Phóng to biểu tượng logo */}
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

              {/* Option: Chất lượng phát */}
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

              {/* Option 4: Version Info option - blended wrapper */}
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

              {/* Option 4: Developer settings (Cài đặt nhà phát triển) - Toggle options */}
              <div className={`mt-6 pt-6 border-t ${
                darkMode ? "border-white/10" : "border-gray-200"
              }`}>
                <h3 className="font-bold text-xs uppercase tracking-wider mb-2 text-[#1a73e8]">
                  Cài đặt nhà phát triển
                </h3>
                
                {/* Dev Option A: Hamburger Menu switch */}
                <div className={`flex items-center justify-between py-4 border-b ${
                  darkMode ? "border-white/10" : "border-gray-200"
                }`}>
                  <div>
                    <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Hamburger menu</h4>
                  </div>
                  <button
                    onClick={() => setHamburgerEnabled(!hamburgerEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center cursor-pointer focus:outline-none rounded-full ${
                      hamburgerEnabled ? "bg-[#1a73e8]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                        hamburgerEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Dev Option B: Search function switch */}
                <div className={`flex items-center justify-between py-4 border-b ${
                  darkMode ? "border-white/10" : "border-gray-200"
                }`}>
                  <div>
                    <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Search function</h4>
                  </div>
                  <button
                    onClick={() => setSearchEnabled(!searchEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center cursor-pointer focus:outline-none rounded-full ${
                      searchEnabled ? "bg-[#1a73e8]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                        searchEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Dev Option C: Home page recommendations switch */}
                <div className={`flex items-center justify-between py-4 border-b ${
                  darkMode ? "border-white/10" : "border-gray-200"
                }`}>
                  <div>
                    <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Thử nghiệm trang chủ</h4>
                  </div>
                  <button
                    onClick={() => setHomeRecommendationEnabled(!homeRecommendationEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center cursor-pointer focus:outline-none rounded-full ${
                      homeRecommendationEnabled ? "bg-[#1a73e8]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                        homeRecommendationEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Dev Option D: Bottom bar mode switch */}
                <div className={`flex items-center justify-between py-4 border-b ${
                  darkMode ? "border-white/10" : "border-gray-200"
                }`}>
                  <div>
                    <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Bottom bar</h4>
                  </div>
                  <button
                    onClick={() => {
                      const newVal = !bottomBarEnabled;
                      setBottomBarEnabled(newVal);
                      if (newVal) {
                        setAppCrashed(true);
                      }
                    }}
                    className={`relative inline-flex h-6 w-11 items-center cursor-pointer focus:outline-none rounded-full ${
                      bottomBarEnabled ? "bg-[#1a73e8]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                        bottomBarEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Dev Option E: Status bar clock switch */}
                <div className="flex items-center justify-between py-4">
                  <div>
                    <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Display clock</h4>
                  </div>
                  <button
                    onClick={() => {
                      const newVal = !displayClockEnabled;
                      setDisplayClockEnabled(newVal);
                      if (newVal) {
                        setAppCrashed(true);
                      }
                    }}
                    className={`relative inline-flex h-6 w-11 items-center cursor-pointer focus:outline-none rounded-full ${
                      displayClockEnabled ? "bg-[#1a73e8]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                        displayClockEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Dev Option F: Animation preview switch */}
                <div className={`flex items-center justify-between py-4 border-t ${
                  darkMode ? "border-white/10" : "border-gray-200"
                }`}>
                  <div>
                    <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Animation preview</h4>
                  </div>
                  <button
                    onClick={() => setAnimationPreviewEnabled(!animationPreviewEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center cursor-pointer focus:outline-none rounded-full ${
                      animationPreviewEnabled ? "bg-[#1a73e8]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                        animationPreviewEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =============== VIEW 5: SIGN IN (BETA LOGIN PAGE) =============== */}
        {activeTab === "sign-in" && (
          <div className="flex-grow flex items-center justify-center py-10 px-4 bg-transparent">
            <div className={`w-full max-w-sm p-6 border rounded-none shadow-md ${
              darkMode ? "bg-[#1e1e21] border-white/5" : "bg-white border-gray-200"
            }`}>
              {isLoggedIn ? (
                <div className="space-y-6">
                  {/* Grid Layout for responsive columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    
                    {/* Column 1: Profile Info */}
                    <div className={`p-5 border rounded-none text-left ${darkMode ? "bg-[#18181b] border-white/5" : "bg-gray-50 border-gray-200"}`}>
                      <div className="text-center mb-5">
                        <h3 className={`text-xs font-bold tracking-tight uppercase ${darkMode ? "text-[#1a73e8]" : "text-[#1557b0]"}`}>
                          Thông tin hồ sơ
                        </h3>
                        <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          Xem thông tin tài khoản và cập nhật tên hiển thị của bạn.
                        </p>
                      </div>

                      {/* Large Default Avatar representation */}
                      <div className="flex flex-col items-center justify-center mb-5">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 border ${
                          darkMode ? "bg-[#27272a] border-white/10 text-[#1a73e8]" : "bg-gray-200 border-gray-300 text-[#1557b0]"
                        }`}>
                          <User className="w-7 h-7" />
                        </div>
                        <p className={`text-xs font-bold font-mono tracking-wide ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          @{currentUsername || "chưa_đặt"}
                        </p>
                        <span className="text-[9px] uppercase font-sans font-semibold tracking-wider px-2 py-0.5 bg-[#1a73e8]/10 text-[#1a73e8] mt-1">
                          Thành viên Vplay
                        </span>
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

                    {/* Column 2: Friends Management */}
                    <div className={`p-5 border rounded-none text-left ${darkMode ? "bg-[#18181b] border-white/5" : "bg-gray-50 border-gray-200"}`}>
                      <div className="text-center mb-4">
                        <h3 className={`text-xs font-bold tracking-tight uppercase flex items-center justify-center gap-1.5 ${darkMode ? "text-[#1a73e8]" : "text-[#1557b0]"}`}>
                          <Users className="w-4 h-4" /> Bạn bè trên Vplay
                        </h3>
                        <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          Kết nối, kết bạn với tuyển thủ bằng tên đăng nhập vplay.
                        </p>
                      </div>

                      {/* Add Friend Form */}
                      <form onSubmit={handleAddFriend} className="space-y-3 mb-6">
                        <div>
                          <div className="flex gap-2">
                            <div className="relative flex-grow">
                              <span className="absolute left-3 top-2.5 text-xs text-gray-500 font-mono">@</span>
                              <input
                                type="text"
                                name="friendInput"
                                value={friendInput}
                                onChange={(e) => setFriendInput(e.target.value)}
                                placeholder="nhập username tuyển thủ..."
                                className={`w-full pl-7 pr-3 py-2 text-xs rounded-none border focus:outline-none focus:border-[#1a73e8] font-mono ${
                                  darkMode 
                                    ? "bg-[#121212] border-white/10 text-white placeholder-gray-600" 
                                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                                }`}
                              />
                            </div>
                            <button
                              type="submit"
                              disabled={friendActionLoading || !friendInput.trim()}
                              className="px-4 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[11px] font-bold uppercase tracking-wider rounded-none cursor-pointer transition-all disabled:opacity-40 font-sans"
                            >
                              Kết bạn
                            </button>
                          </div>
                          
                          {friendActionError && (
                            <p className="text-red-500 text-[9px] font-semibold mt-1.5 flex items-center gap-1 justify-start">
                              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                              {friendActionError}
                            </p>
                          )}
                          {friendActionSuccess && (
                            <p className="text-green-500 text-[9px] font-semibold mt-1.5 flex items-center gap-1 justify-start">
                              <Check className="w-3.5 h-3.5 flex-shrink-0" />
                              {friendActionSuccess}
                            </p>
                          )}
                        </div>
                      </form>

                      {/* Friends list title */}
                      <div className="border-b border-gray-200 dark:border-white/10 pb-1.5 mb-2.5 flex justify-between items-center">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Danh sách bạn bè ({friendsList.length})
                        </span>
                      </div>

                      {/* Friends scrollable container */}
                      <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {friendsList.length === 0 ? (
                          <div className={`p-4 text-center text-xs opacity-70 italic ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
                            Chưa có tuyển thủ nào trong danh sách bạn bè.
                          </div>
                        ) : (
                          friendsList.map((friend) => (
                            <div 
                              key={friend.uid}
                              className={`flex items-center justify-between p-2.5 border rounded-none ${
                                darkMode 
                                  ? "bg-[#121212] border-white/5 hover:bg-[#252528]" 
                                  : "bg-white border-gray-150 hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${
                                  darkMode ? "bg-[#27272a] border-white/10 text-[#1a73e8]" : "bg-gray-100 border-gray-200 text-[#1557b0]"
                                }`}>
                                  <User className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 text-left">
                                  <p className={`text-xs font-bold truncate ${darkMode ? "text-white" : "text-gray-800"}`}>
                                    {friend.displayName}
                                  </p>
                                  <p className="text-[10px] text-gray-500 font-mono truncate">
                                    @{friend.username}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveFriend(friend)}
                                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                title="Hủy kết bạn"
                              >
                                <UserMinus className="w-4 h-4" strokeWidth={2.5} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        )}

        {/* =============== VIEW 6: VPLAY ANDROID FAQ =============== */}
        {activeTab === "vplay-android-faq" && (
          <div className="flex-grow py-8 max-w-3xl mx-auto px-4">
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
          </div>
        )}

          </>
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

      {/* Sticky Bottom Navigation Bar under Dev setting */}
      {bottomBarEnabled && (
        <div className={`fixed bottom-0 left-0 right-0 z-45 border-t flex items-center justify-around py-2 px-1 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] ${
          darkMode ? "bg-[#1c1c1f] border-white/5 text-gray-300" : "bg-white border-gray-200 text-gray-700"
        }`}>
          <button
            onClick={() => switchTab("trang-chu")}
            className={`flex flex-col items-center justify-center cursor-pointer flex-1 min-w-0 py-1 rounded-none transition-all ${
              activeTab === "trang-chu" 
                ? "text-[#1a73e8] font-bold" 
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium"
            } ${animationPreviewEnabled ? "hover:scale-[1.12] active:scale-90 duration-200" : ""}`}
          >
            <Home className="w-[18px] h-[18px] mb-1" strokeLinecap="square" strokeLinejoin="miter" />
            <span className="text-[10px] tracking-tight truncate">Trang chủ</span>
          </button>

          <button
            onClick={() => switchTab("truc-tiep")}
            className={`flex flex-col items-center justify-center cursor-pointer flex-1 min-w-0 py-1 rounded-none transition-all ${
              activeTab === "truc-tiep" 
                ? "text-[#1a73e8] font-bold" 
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium"
            } ${animationPreviewEnabled ? "hover:scale-[1.12] active:scale-90 duration-200" : ""}`}
          >
            <Tv className="w-[18px] h-[18px] mb-1" strokeLinecap="square" strokeLinejoin="miter" />
            <span className="text-[10px] tracking-tight truncate">Trực tiếp</span>
          </button>

          <button
            onClick={() => switchTab("package")}
            className={`flex flex-col items-center justify-center cursor-pointer flex-1 min-w-0 py-1 rounded-none transition-all ${
              activeTab === "package" 
                ? "text-[#1a73e8] font-bold" 
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium"
            } ${animationPreviewEnabled ? "hover:scale-[1.12] active:scale-90 duration-200" : ""}`}
          >
            <Package className="w-[18px] h-[18px] mb-1" strokeLinecap="square" strokeLinejoin="miter" />
            <span className="text-[10px] tracking-tight truncate">Package</span>
          </button>

          <button
            onClick={() => switchTab("cai-dat")}
            className={`flex flex-col items-center justify-center cursor-pointer flex-1 min-w-0 py-1 rounded-none transition-all ${
              activeTab === "cai-dat" 
                ? "text-[#1a73e8] font-bold" 
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium"
            } ${animationPreviewEnabled ? "hover:scale-[1.12] active:scale-90 duration-200" : ""}`}
          >
            <Settings className="w-[18px] h-[18px] mb-1" strokeLinecap="square" strokeLinejoin="miter" />
            <span className="text-[10px] tracking-tight truncate">Cài đặt</span>
          </button>

          <button
            onClick={() => switchTab("sign-in")}
            className={`flex flex-col items-center justify-center cursor-pointer flex-1 min-w-0 py-1 rounded-none transition-all ${
              activeTab === "sign-in" 
                ? "text-[#1a73e8] font-bold" 
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium"
            } ${animationPreviewEnabled ? "hover:scale-[1.12] active:scale-90 duration-200" : ""}`}
          >
            <User className="w-[18px] h-[18px] mb-1" strokeLinecap="square" strokeLinejoin="miter" />
            <span className="text-[10px] tracking-tight truncate">
              {isLoggedIn ? "Profile" : "Sign in"}
            </span>
          </button>

          <button
            onClick={() => switchTab("vplay-android-faq")}
            className={`flex flex-col items-center justify-center cursor-pointer flex-1 min-w-0 py-1 rounded-none transition-all ${
              activeTab === "vplay-android-faq" 
                ? "text-[#1a73e8] font-bold" 
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium"
            } ${animationPreviewEnabled ? "hover:scale-[1.12] active:scale-90 duration-200" : ""}`}
          >
            <Info className="w-[18px] h-[18px] mb-1" strokeLinecap="square" strokeLinejoin="miter" />
            <span className="text-[10px] tracking-tight truncate">FAQ</span>
          </button>
        </div>
      )}
    </div>
  );
}
