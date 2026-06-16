import { useState, useEffect } from "react"
import { Bell, Clock, Calendar, CheckCircle2, MessageSquare, Smartphone, AlertCircle, Plus, Info } from "lucide-react"
import { useSession } from "../contexts/SessionContext"
import { supabase } from "../lib/supabase"

const getMedicationReminders = (reminders, medicationId) => {
  const reminderList = Array.isArray(reminders) ? reminders : []
  return reminderList.filter((reminder) => reminder.medication_id === medicationId)
}

const getMedicationTimes = (medication) => {
  const times = Array.isArray(medication.time) ? medication.time : [medication.time]
  const cleanTimes = times.map((time) => time || "").filter(Boolean)
  return cleanTimes.length > 0 ? cleanTimes : ["08:00"]
}

const isSmsReminder = (reminder) => reminder.type === "sms" || reminder.type === "email"

const formatDeliveryTime = (value) => {
  if (!value) return null

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const getLatestByDate = (items, field) => {
  return [...items]
    .filter((item) => item[field])
    .sort((a, b) => new Date(b[field]).getTime() - new Date(a[field]).getTime())[0]
}

const getDeliveryStatus = (channelReminders, label) => {
  if (channelReminders.length === 0) return null

  const latestError = getLatestByDate(
    channelReminders.filter((reminder) => reminder.last_error),
    "updated_at"
  )

  if (latestError?.last_error) {
    return {
      tone: "red",
      text: `${label}: ${latestError.last_error}`,
    }
  }

  const latestSent = getLatestByDate(channelReminders, "last_sent_at")
  if (latestSent?.last_sent_at) {
    return {
      tone: "green",
      text: `${label}: Sent ${formatDeliveryTime(latestSent.last_sent_at)}`,
    }
  }

  return {
    tone: "gray",
    text: `${label}: Scheduled`,
  }
}

const buildReminderRows = (medication, userId, channel) => {
  return getMedicationTimes(medication).map((timeStr) => {
    const [rawHours, rawMinutes] = (timeStr || "08:00").split(":")
    const hours = Number.parseInt(rawHours, 10)
    const minutes = Number.parseInt(rawMinutes, 10)
    const reminderDate = new Date()
    reminderDate.setHours(
      Number.isFinite(hours) ? hours : 8,
      Number.isFinite(minutes) ? minutes : 0,
      0,
      0
    )

    return {
      user_id: userId,
      medication_id: medication.id,
      medication_name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      type: channel,
      reminder_time: reminderDate.toISOString(),
    }
  })
}

const ChannelButton = ({ active, icon, label, tone, onClick }) => {
  const ChannelIcon = icon
  const activeStyles = tone === "green"
    ? "border-green-200 bg-green-50 text-green-700"
    : "border-blue-200 bg-blue-50 text-blue-700"
  const inactiveStyles = tone === "green"
    ? "border-gray-200 bg-white text-gray-600 hover:border-green-200 hover:text-green-700"
    : "border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-700"

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${active ? activeStyles : inactiveStyles}`}
    >
      <ChannelIcon size={16} />
      {label}
    </button>
  )
}

const DeliveryStatus = ({ status }) => {
  if (!status) return null

  const styles = {
    green: "border-green-100 bg-green-50 text-green-700",
    red: "border-red-100 bg-red-50 text-red-700",
    gray: "border-gray-200 bg-gray-50 text-gray-600",
  }

  return (
    <p className={`rounded-md border px-3 py-2 text-xs ${styles[status.tone] || styles.gray}`}>
      {status.text}
    </p>
  )
}

const ReminderRow = ({ medication, reminders, profile, onChannelToggle }) => {
  const medicationReminders = getMedicationReminders(reminders, medication.id)
  const smsReminders = medicationReminders.filter(isSmsReminder)
  const whatsappReminders = medicationReminders.filter((reminder) => reminder.type === "whatsapp")
  const smsEnabled = medicationReminders.some(isSmsReminder)
  const whatsappEnabled = whatsappReminders.length > 0
  const isEnabled = smsEnabled || whatsappEnabled
  const showPhoneNotice = isEnabled && !profile?.phone_number
  const deliveryStatuses = [
    getDeliveryStatus(smsReminders, "SMS"),
    getDeliveryStatus(whatsappReminders, "WhatsApp"),
  ].filter(Boolean)

  const timeString = Array.isArray(medication.time)
    ? medication.time.join(", ")
    : (medication.time || "Not set")

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="text-base font-semibold text-gray-900">{medication.name}</h3>
            {isEnabled ? (
              <span className="flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                <CheckCircle2 size={12} className="mr-1" /> Active
              </span>
            ) : (
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                No alerts
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
            <span><span className="font-medium">Dose:</span> {medication.dosage || "Not set"}</span>
            <span className="flex items-center"><Clock size={14} className="mr-1 text-orange-500" /> {timeString}</span>
            <span className="flex items-center"><Calendar size={14} className="mr-1 text-orange-500" /> {medication.frequency || "Not set"}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 lg:min-w-[310px] lg:border-l lg:border-gray-100 lg:pl-5">
          <div className="flex flex-wrap items-center gap-2">
            <ChannelButton
              active={smsEnabled}
              icon={Smartphone}
              label="SMS"
              tone="blue"
              onClick={() => onChannelToggle(medication, "sms", !smsEnabled)}
            />
            <ChannelButton
              active={whatsappEnabled}
              icon={MessageSquare}
              label="WhatsApp"
              tone="green"
              onClick={() => onChannelToggle(medication, "whatsapp", !whatsappEnabled)}
            />
          </div>

          {showPhoneNotice && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-md px-3 py-2">
              Add your phone number in <a href="/app/profile" className="font-medium underline">Profile Settings</a> using international format, for example +919876543210.
            </p>
          )}

          {deliveryStatuses.length > 0 && (
            <div className="space-y-1">
              {deliveryStatuses.map((status) => (
                <DeliveryStatus key={status.text} status={status} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const Reminders = () => {
  const { session } = useSession()
  const [medications, setMedications] = useState([])
  const [reminders, setReminders] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const activeMedicationCount = new Set(reminders.map((reminder) => reminder.medication_id)).size
  const smsCount = reminders.filter(isSmsReminder).length
  const whatsappCount = reminders.filter((reminder) => reminder.type === "whatsapp").length

  const fetchData = async () => {
    if (!session?.user?.id) return
    try {
      setLoading(true)
      setError(null)

      const [medRes, remRes, profileRes] = await Promise.all([
        supabase.from("medications").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false }),
        supabase.from("reminders").select("*").eq("user_id", session.user.id),
        supabase.from("profiles").select("phone_number").eq("id", session.user.id).single(),
      ])

      if (medRes.error) throw medRes.error
      if (remRes.error) throw remRes.error
      if (profileRes.error && profileRes.error.code !== "PGRST116") throw profileRes.error

      setMedications(Array.isArray(medRes.data) ? medRes.data : [])
      setReminders(Array.isArray(remRes.data) ? remRes.data : [])
      setProfile(profileRes.data || null)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to load your reminders. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [session])

  const handleChannelToggle = async (medication, channel, shouldEnable) => {
    try {
      setError(null)

      if (shouldEnable) {
        const existing = getMedicationReminders(reminders, medication.id).some((reminder) => (
          channel === "sms" ? isSmsReminder(reminder) : reminder.type === channel
        ))
        if (existing) return

        const { data, error } = await supabase
          .from("reminders")
          .insert(buildReminderRows(medication, session.user.id, channel))
          .select()

        if (error) throw error
        setReminders((prev) => [...prev, ...(data || [])])
      } else {
        const { error } = await supabase
          .from("reminders")
          .delete()
          .eq("medication_id", medication.id)
          .eq("user_id", session.user.id)
          .in("type", channel === "sms" ? ["sms", "email"] : [channel])

        if (error) throw error
        setReminders((prev) => prev.filter((reminder) => {
          if (reminder.medication_id !== medication.id) return true
          return channel === "sms" ? !isSmsReminder(reminder) : reminder.type !== channel
        }))
      }
    } catch (err) {
      console.error("Reminder channel update error:", err)
      setError("Failed to update reminder preference: " + err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-gray-500">
        <Bell className="animate-pulse mb-3" size={32} />
        <p>Loading your notification preferences...</p>
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Notification Settings</h1>
            <p className="text-sm text-gray-600 mt-1">
              Choose SMS, WhatsApp, both, or neither for each medication.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center sm:min-w-[280px]">
            <div className="rounded-md bg-gray-50 border border-gray-200 px-3 py-2">
              <p className="text-lg font-semibold text-gray-900">{activeMedicationCount}</p>
              <p className="text-xs text-gray-500">Active meds</p>
            </div>
            <div className="rounded-md bg-blue-50 border border-blue-100 px-3 py-2">
              <p className="text-lg font-semibold text-blue-700">{smsCount}</p>
              <p className="text-xs text-blue-600">SMS</p>
            </div>
            <div className="rounded-md bg-green-50 border border-green-100 px-3 py-2">
              <p className="text-lg font-semibold text-green-700">{whatsappCount}</p>
              <p className="text-xs text-green-600">WhatsApp</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <Info size={18} className="mt-0.5 flex-shrink-0" />
        <p>
          SMS and WhatsApp delivery uses Twilio. Trial or sandbox accounts may only send to verified numbers, but reminder preferences will still be saved.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60">
          <h2 className="text-base font-semibold text-gray-800">Your Medications</h2>
        </div>

        <div className="p-5">
          {medications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-50 rounded-full flex items-center justify-center">
                <Plus size={24} className="text-orange-400" />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-2">No medications found</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                Add a medication first, then choose how you want to be reminded.
              </p>
              <a href="/app/medications" className="inline-flex items-center justify-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-medium">
                Go to Medications
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {medications.map((medication) => (
                <ReminderRow
                  key={medication.id}
                  medication={medication}
                  reminders={reminders}
                  profile={profile}
                  onChannelToggle={handleChannelToggle}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reminders
