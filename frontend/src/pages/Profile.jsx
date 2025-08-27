import { useState, useEffect } from "react"
import { User, Mail, Phone, Bell, Shield, Edit, Save, X, Trash2, Upload } from "lucide-react"
import { supabase } from "../lib/supabase"
import { useSession } from "../contexts/SessionContext"

const Avatar = ({ url, onUpload, isEditing }) => {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

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

  const uploadAvatar = async (event) => {
    try {
      setUploading(true)
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.")
      }

      const file = event.target.files[0]
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file)
      if (uploadError) throw uploadError
      onUpload(filePath)
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
              <Upload size={24} className="text-white" />
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    avatar_url: "",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session) return
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, phone_number, avatar_url")
          .eq("id", session.user.id)
          .single()

        if (error) throw error
        if (data) setFormData(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [session])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          avatar_url: formData.avatar_url,
        })
        .eq("id", session.user.id)
      if (error) throw error
      setIsEditing(false)
    } catch (error) {
      setError(error.message)
    }
  }

  const updateAvatar = async (url) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: url })
        .eq("id", session.user.id)
      if (error) throw error
      setFormData({ ...formData, avatar_url: url })
    } catch (error) {
      setError(error.message)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center space-x-4">
        <Avatar
          url={formData.avatar_url}
          isEditing={isEditing}
          onUpload={(url) => updateAvatar(url)}
        />
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800">{formData.full_name}</h2>
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
              className="px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#F97316]/90 text-sm font-semibold"
            >
              Update
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
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
            />
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
