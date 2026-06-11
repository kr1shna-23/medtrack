import { useState, useEffect } from "react"
import { User, Upload } from "lucide-react"
import { useSession } from "../contexts/SessionContext"
import { supabase } from "../lib/supabase"

const isValidE164PhoneNumber = (value) => {
  if (!value) return true
  return /^\+[1-9]\d{7,14}$/.test(value.trim())
}

const Avatar = ({ path, onUpload, isEditing, userId }) => {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    let objectUrl = null;

    const downloadImage = async () => {
      if (!path) {
        setAvatarUrl(null);
        return;
      }

      try {
        const { data, error } = await supabase.storage.from("avatars").download(path);
        if (error) throw error;
        objectUrl = URL.createObjectURL(data);
        setAvatarUrl(objectUrl);
      } catch (error) {
        console.error("Error downloading avatar:", error.message);
        setAvatarUrl(null);
      }
    };

    downloadImage();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [path])

  const uploadAvatar = async (event) => {
    try {
      setUploading(true)
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.")
      }
      if (!userId) {
        throw new Error("You must be signed in to upload an avatar.")
      }

      const file = event.target.files[0]
      const fileExt = file.name.split(".").pop()
      const filePath = `${userId}/avatar.${fileExt}`
      const previewUrl = URL.createObjectURL(file)

      const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: true,
        })

      if (error) throw error

      setAvatarUrl(previewUrl)
      await onUpload(filePath)
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="relative w-24 h-24 mx-auto flex-shrink-0">
      <label htmlFor="single" className={isEditing ? "cursor-pointer" : ""}>
        <div className="relative w-full h-full">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="rounded-full w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-[#F97316] to-[#FB923C] rounded-full flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
          )}
          {isEditing && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <Upload size={24} className={`text-white ${uploading ? "animate-pulse" : ""}`} />
            </div>
          )}
        </div>
      </label>
      {isEditing && (
        <input
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          className="hidden"
        />
      )}
    </div>
  )
}

const Profile = () => {
  const { session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    avatar_url: null,
  })

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, phone_number, avatar_url")
          .eq("id", session.user.id)
          .single();

        if (error && error.code !== "PGRST116") throw error;

        const profile = data || {
          full_name: session.user.user_metadata?.full_name || "",
          phone_number: session.user.user_metadata?.phone_number || "",
          avatar_url: session.user.user_metadata?.avatar_url || null,
        };

        if (!data) {
          await supabase.from("profiles").upsert({
            id: session.user.id,
            ...profile,
          });
        }

        setFormData(profile);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setError(null)

      const phoneNumber = formData.phone_number.trim()
      if (!isValidE164PhoneNumber(phoneNumber)) {
        throw new Error("Phone number must use international format, for example +919876543210.")
      }

      const { error } = await supabase.from("profiles").upsert({
        id: session.user.id,
        full_name: formData.full_name,
        phone_number: phoneNumber,
        avatar_url: formData.avatar_url,
      })
      if (error) throw error;

      await supabase.auth.updateUser({
        data: { full_name: formData.full_name, phone_number: phoneNumber }
      })

      setIsEditing(false)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateAvatar = async (path) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: path })
        .eq("id", session.user.id)

      if (error) throw error;
      setFormData({ ...formData, avatar_url: path })
    } catch (error) {
      setError(error.message)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {error && <p className="text-red-500 text-sm text-center bg-red-100 p-3 rounded-lg mb-4">{error}</p>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center space-x-4">
        <Avatar
          path={formData.avatar_url}
          isEditing={isEditing}
          userId={session?.user?.id}
          onUpload={(path) => updateAvatar(path)}
        />
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800">{formData.full_name || "User"}</h2>
          <p className="text-sm text-gray-500">{session?.user?.email}</p>
        </div>
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#F97316]/90 text-sm font-semibold"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#F97316]/90 text-sm font-semibold"
          >
            Edit
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Phone Number</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="+919876543210"
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
            />
            {isEditing && (
              <p className="mt-1 text-xs text-gray-500">
                Required for SMS and WhatsApp reminders. Include country code.
              </p>
            )}
          </div>
        </div>
      </div>


      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 mt-6">
        <h3 className="text-lg font-semibold text-red-800 mb-4">Danger Zone</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">Delete Account</p>
            <p className="text-sm text-gray-500">Permanently delete your account and all data.</p>
          </div>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
