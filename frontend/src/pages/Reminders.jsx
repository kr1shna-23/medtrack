"use client"

import { useState, useEffect } from "react"
import { Bell, Plus, Clock, Mail, MessageSquare, Edit, Trash2, X, Save } from "lucide-react"
import { supabase } from "../lib/supabase"
import { useSession } from "../contexts/SessionContext"

const ReminderModal = ({ isOpen, onClose, reminder = null, onSave, medications = [] }) => {
  const [formData, setFormData] = useState({
    medication_id: "",
    dosage: "",
    times: [], // Available times from medication
    selectedTimes: [], // Times selected by the user
    frequency: "Daily",
    type: "whatsapp",
    active: true,
  })

  useEffect(() => {
    if (isOpen) {
      if (reminder) {
        // Editing an existing reminder
        const time = reminder.reminder_time ? new Date(reminder.reminder_time).toTimeString().slice(0, 5) : ""
        const med = medications.find(m => m.id === reminder.medication_id);
        setFormData({
          medication_id: reminder.medication_id || "",
          dosage: reminder.dosage || "",
          times: med?.time || [time],
          selectedTimes: [time],
          frequency: reminder.frequency || "Daily",
          type: reminder.type || "whatsapp",
          active: reminder.active ?? true,
        })
      } else {
        // Adding a new reminder
        const firstMed = medications[0]
        setFormData({
          medication_id: firstMed?.id || "",
          dosage: firstMed?.dosage || "",
          times: firstMed?.time || [],
          selectedTimes: [],
          frequency: firstMed?.frequency || "Daily",
          type: "whatsapp",
          active: true,
        })
      }
    }
  }, [reminder, isOpen, medications])

  useEffect(() => {
    // This effect runs when the medication selection changes to update related fields
    if (!isOpen) return;
    const selectedMed = medications.find((med) => med.id.toString() === formData.medication_id);
    if (selectedMed) {
      // Check if the times are different before updating to prevent unnecessary re-renders
      if (JSON.stringify(formData.times) !== JSON.stringify(selectedMed.time)) {
        setFormData((prev) => ({
          ...prev,
          dosage: selectedMed.dosage || "",
          frequency: selectedMed.frequency || "Daily",
          times: selectedMed.time || [],
          selectedTimes: [], // Reset selected times when medication changes
        }));
      }
    }
  }, [formData.medication_id, medications, isOpen, formData.times]);

  const handleTimeSelect = (time) => {
    setFormData((prev) => {
      const newSelectedTimes = prev.selectedTimes.includes(time)
        ? prev.selectedTimes.filter((t) => t !== time) // Deselect
        : [...prev.selectedTimes, time]; // Select
      return { ...prev, selectedTimes: newSelectedTimes };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      times: formData.selectedTimes, // Use the selected times
    })
    onClose()
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 sm:mx-0">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{reminder ? "Edit Reminder" : "Add Reminder"}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medication</label>
              <select
                name="medication_id"
                value={formData.medication_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none"
              >
                {medications.map((med) => (
                  <option key={med.id} value={med.id}>
                    {med.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dosage</label>
                <input
                  type="text"
                  name="dosage"
                  value={formData.dosage}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                <input
                  type="text"
                  name="frequency"
                  value={formData.frequency}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Times</label>
              <div className="flex flex-wrap gap-2">
                {formData.times.map((time, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => handleTimeSelect(time)}
                    className={`flex items-center rounded-full px-3 py-1 text-sm transition-colors ${
                      formData.selectedTimes.includes(time)
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    <Clock size={14} className="mr-2" />
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Method</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Active Reminder</h4>
                <p className="text-sm text-gray-600">Enable this reminder</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#F97316]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F97316]"></div>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#F97316]/90 transition-colors flex items-center justify-center"
              >
                <Save size={16} className="mr-2" />
                {reminder ? "Update" : "Add"} Reminder
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const ReminderCard = ({ reminder, onEdit, onDelete }) => {
  const getTypeInfo = (type) => {
    switch (type) {
      case "email":
        return {
          icon: <Mail size={14} className="text-blue-500" />,
          style: "bg-blue-50 border-blue-200 text-blue-700",
        }
      case "whatsapp":
        return {
          icon: <MessageSquare size={14} className="text-green-500" />,
          style: "bg-green-50 border-green-200 text-green-700",
        }
      default:
        return {
          icon: <Bell size={14} className="text-gray-500" />,
          style: "bg-gray-50 border-gray-200 text-gray-700",
        }
    }
  }

  const { icon, style } = getTypeInfo(reminder.type)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-md font-bold text-gray-800 truncate">
            {reminder.medication?.name || "Medication not found"}
          </h3>
          <p className="text-xs text-gray-500">{reminder.dosage}</p>
        </div>
        <div className="flex space-x-1 ml-2">
          <button
            onClick={() => onEdit(reminder)}
            className="p-1.5 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-md transition-colors"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => onDelete(reminder.id)}
            className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm mb-4 flex-grow">
        <div className="flex items-center">
          <Clock size={14} className="mr-2 text-orange-500" />
          <span className="font-semibold text-gray-700 w-20">Time:</span>
          <span className="text-gray-600 font-mono">
            {reminder.reminder_time
              ? new Date(reminder.reminder_time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A"}
          </span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold text-gray-700 w-20 ml-6">Frequency:</span>
          <span className="text-gray-600">{reminder.frequency}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto text-xs">
        <div className={`flex items-center gap-2 px-2 py-1 rounded-full border ${style}`}>
          {icon}
          <span className="font-medium capitalize">{reminder.type}</span>
        </div>
        <div
          className={`px-2 py-1 rounded-full font-medium ${
            reminder.active
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {reminder.active ? "Active" : "Inactive"}
        </div>
      </div>
    </div>
  )
}

const Reminders = () => {
  const { session } = useSession()
  const [activeTab, setActiveTab] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingReminder, setEditingReminder] = useState(null)
  const [reminders, setReminders] = useState([])
  const [medications, setMedications] = useState([])
  const [combinedReminders, setCombinedReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    if (!session) return

    try {
      setLoading(true)
      setError(null)

      const { data: remindersData, error: remindersError } = await supabase
        .from("reminders")
        .select("*")
        .eq("user_id", session.user.id)

      if (remindersError) throw remindersError

      const { data: medicationsData, error: medicationsError } = await supabase
        .from("medications")
        .select("*")
        .eq("user_id", session.user.id)

      if (medicationsError) throw medicationsError

      setReminders(remindersData || [])
      setMedications(medicationsData || [])
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [session])

  useEffect(() => {
    const medicationMap = new Map(medications.map((med) => [med.id, med]))
    const combined = reminders.map((reminder) => ({
      ...reminder,
      active: reminder.status === "active",
      medication: medicationMap.get(reminder.medication_id) || null,
    }))
    setCombinedReminders(combined)
  }, [reminders, medications])

  const filteredReminders = combinedReminders.filter((reminder) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return reminder.active
    if (activeTab === "inactive") return !reminder.active
    return reminder.type === activeTab
  })

  const handleEdit = (reminder) => {
    setEditingReminder(reminder)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from("reminders").delete().eq("id", id)
      if (error) throw error
      fetchData() // Refetch to update the list
    } catch (error) {
      setError(error.message)
    }
  }

  const handleAddNew = () => {
    setEditingReminder(null)
    setIsModalOpen(true)
  }

  const handleSave = async (formData) => {
    try {
      const remindersToInsert = formData.times.map(time => {
        const [hours, minutes] = time.split(":");
        const reminderDate = new Date();
        reminderDate.setHours(hours, minutes, 0, 0);

        return {
          medication_id: formData.medication_id,
          dosage: formData.dosage,
          reminder_time: reminderDate.toISOString(),
          frequency: formData.frequency,
          type: formData.type,
          status: formData.active ? "active" : "inactive",
          user_id: session.user.id,
        };
      });

      if (editingReminder) {
        // For simplicity, we'll delete the old reminder and insert new ones
        // A more robust solution would handle updates more gracefully
        await supabase.from("reminders").delete().eq("id", editingReminder.id);
      }

      const { error } = await supabase.from("reminders").insert(remindersToInsert);
      if (error) throw error;

      fetchData();
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

 const tabs = [
    { id: "all", label: "All Reminders", count: combinedReminders.length },
    { id: "active", label: "Active", count: combinedReminders.filter((r) => r.active).length },
    { id: "whatsapp", label: "WhatsApp", count: combinedReminders.filter((r) => r.type === "whatsapp").length },
    { id: "email", label: "Email", count: combinedReminders.filter((r) => r.type === "email").length },
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {/* Tabs and Add Button */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 sm:px-6">
          <nav className="flex space-x-4 sm:space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-[#F97316] text-[#F97316]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">{tab.count}</span>
              </button>
            ))}
          </nav>
          <button
            onClick={handleAddNew}
            className="hidden sm:flex items-center justify-center px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#F97316]/90 transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Add Reminder
          </button>
        </div>
      </div>
      <button
        onClick={handleAddNew}
        className="sm:hidden fixed bottom-6 right-6 flex items-center justify-center w-14 h-14 bg-[#F97316] text-white rounded-full shadow-lg hover:bg-[#F97316]/90 transition-colors z-40"
      >
        <Plus size={24} />
      </button>

      {/* Reminders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredReminders.map((reminder) => (
          <ReminderCard key={reminder.id} reminder={reminder} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>

      {filteredReminders.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Bell size={24} className="sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No reminders found</h3>
          <p className="text-sm sm:text-base text-gray-600">Create your first reminder to get started</p>
        </div>
      )}

      {/* Modal */}
      <ReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reminder={editingReminder}
        onSave={handleSave}
        medications={medications}
      />
    </div>
  )
}

export default Reminders
