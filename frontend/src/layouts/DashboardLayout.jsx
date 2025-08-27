import { Outlet, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { Home, Pill, Bell, Settings, Menu, X, LogOut, User, ChevronDown, HelpCircle, Shield } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useSession } from "../contexts/SessionContext"
import { supabase } from "../lib/supabase"

const Avatar = ({ url, size = 8 }) => {
  const [avatarUrl, setAvatarUrl] = useState(null)

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  const downloadImage = async (path) => {
    try {
      const { data, error } = await supabase.storage.from("avatars").download(path)
      if (error) throw error
      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
    } catch (error) {
      console.log("Error downloading image: ", error.message)
    }
  }

  return (
    <div className={`relative w-${size} h-${size} rounded-full flex items-center justify-center bg-gray-200 overflow-hidden`}>
      {avatarUrl ? (
        <img src={avatarUrl} alt="Avatar" className="absolute w-full h-full object-cover" />
      ) : (
        <User size={size * 2} className="text-gray-500" />
      )}
    </div>
  )
}

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [profile, setProfile] = useState(null)
  const location = useLocation()
  const { session } = useSession()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session) return
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", session.user.id)
          .single()
        if (error) throw error
        setProfile(data)
      } catch (error) {
        console.error("Error fetching profile:", error.message)
      }
    }
    fetchProfile()
  }, [session])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate("/login")
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/app",
      icon: Home,
      description: "Quick summary of today's medications, reminders, and current streaks",
    },
    {
      name: "Medications",
      href: "/app/medications",
      icon: Pill,
      description: "Add, edit, or delete your medicines with dosage and schedule details",
    },
    {
      name: "Reminders",
      href: "/app/reminders",
      icon: Bell,
      description: "Set up when and how you want to be reminded via email or WhatsApp",
    },
    {
      name: "Settings",
      href: "/app/profile",
      icon: Settings,
      description: "Manage your MedTrack account, profile details, and preferences",
    },
  ]

  const isActive = (href) => {
    if (href === "/app") {
      return location.pathname === "/app"
    }
    return location.pathname.startsWith(href)
  }

  const getCurrentPageInfo = () => {
    const currentNav = navigation.find((nav) => isActive(nav.href))
    return currentNav || navigation[0]
  }

  const currentPage = getCurrentPageInfo()

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center h-16 px-4 border-b border-gray-200 flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="MedTrack" className="h-8 w-auto" />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 mt-6 px-3 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    active ? "bg-[#F97316] text-white" : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={20} className="mr-3" />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-3 border-t border-gray-200">
            <Link
              to="/app/profile"
              className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Avatar url={profile?.avatar_url} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{profile?.full_name || "User"}</p>
              </div>
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center p-3 mt-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <div className="flex items-center space-x-4 mb-6">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-[#F97316] to-[#FB923C]`}
            >
              <currentPage.icon size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentPage.name}</h1>
              <p className="text-sm text-gray-600">{currentPage.description}</p>
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
