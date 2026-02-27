"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, Edit, Trash2, Clock, Calendar, X, Save } from "lucide-react"
import { useSession } from "../contexts/SessionContext"

const MedicationModal = ({ isOpen, onClose, medication = null, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    dosage: "",
    frequency: "",
    times: [""],
    refill_date: "",
    refill_reminder: 7,
    notes: "",
  })
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (medication) {
        setFormData({
          name: medication.name || "",
          type: medication.type || "",
          dosage: medication.dosage || "",
          frequency: medication.frequency || "",
          times: Array.isArray(medication.time) ? medication.time : [medication.time || ""],
          refill_date: medication.refill_date || "",
          refill_reminder: medication.refill_reminder || 7,
          notes: medication.notes || "",
        })
        // If refill or notes exist, show advanced options
        if (medication.refill_date || medication.notes) {
          setShowAdvanced(true)
        } else {
          setShowAdvanced(false)
        }
      } else {
        // Reset form for new medication
        setFormData({
          name: "",
          type: "",
          dosage: "",
          frequency: "",
          times: [""],
          refill_date: "",
          refill_reminder: 7,
          notes: "",
        })
        setShowAdvanced(false)
      }
    }
  }, [medication, isOpen])

  useEffect(() => {
    const getTimesCount = (frequency) => {
      switch (frequency) {
        case "Twice daily":
          return 2
        case "Three times daily":
          return 3
        default:
          return 1
      }
    }
    const timesCount = getTimesCount(formData.frequency)
    const newTimes = Array(timesCount).fill("").map((_, i) => formData.times[i] || "")
    setFormData((prev) => ({ ...prev, times: newTimes }))
  }, [formData.frequency])

  const handleSubmit = (e) => {
    e.preventDefault()
    const dataToSave = { ...formData, time: formData.times }
    delete dataToSave.times
    onSave(dataToSave)
    onClose()
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleTimeChange = (index, value) => {
    const newTimes = [...formData.times]
    newTimes[index] = value
    setFormData({ ...formData, times: newTimes })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

        <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 sm:mx-0">
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">{medication ? "Edit Medication" : "Add Medication"}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none"
                placeholder="e.g., Lisinopril"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none"
                >
                  <option value="">Select type</option>
                  <option value="Blood Pressure">Blood Pressure</option>
                  <option value="Diabetes">Diabetes</option>
                  <option value="Heart Health">Heart Health</option>
                  <option value="Supplement">Supplement</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                <input
                  type="text"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none"
                  placeholder="e.g., 10mg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none"
              >
                <option value="">Select frequency</option>
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Three times daily">Three times daily</option>
                <option value="As needed">As needed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time(s)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {formData.times.map((time, index) => (
                  <input
                    key={index}
                    type="time"
                    value={time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none"
                  />
                ))}
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <div className="border-t border-gray-200 pt-4">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm font-medium text-[#F97316] hover:text-[#F97316]/90"
              >
                {showAdvanced ? "Hide" : "Show"} Refill & Notes Options
              </button>
            </div>

            {/* Collapsible Advanced Options */}
            {showAdvanced && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Refill Date</label>
                    <input
                      type="date"
                      name="refill_date"
                      value={formData.refill_date}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Remind me</label>
                    <select
                      name="refill_reminder"
                      value={formData.refill_reminder}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none"
                    >
                      <option value="3">3 days before</option>
                      <option value="5">5 days before</option>
                      <option value="7">7 days before</option>
                      <option value="10">10 days before</option>
                      <option value="14">14 days before</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none"
                    placeholder="Any special instructions..."
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-[#F97316] text-white rounded-lg hover:bg-[#F97316]/90 transition-colors flex items-center justify-center shadow-sm"
              >
                <Save size={18} className="mr-2" />
                {medication ? "Update Medication" : "Add Medication"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const MedicationCard = ({ medication, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col h-full hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-gray-900 truncate">{medication.name}</h3>
        <p className="text-sm text-[#F97316] bg-orange-50 rounded-full px-3 py-1 inline-block mt-2 font-medium">
          {medication.type}
        </p>
      </div>
      <div className="flex space-x-1 ml-2">
        <button
          onClick={() => onEdit(medication)}
          className="p-2 text-gray-500 hover:text-[#F97316] hover:bg-orange-50 rounded-full transition-colors"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={() => onDelete(medication.id)}
          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-100 rounded-full transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>

    <div className="space-y-3 text-sm mb-5">
      <div className="flex items-center">
        <span className="font-semibold text-gray-700 w-28">Dosage:</span>
        <span className="text-gray-800 font-medium">{medication.dosage}</span>
      </div>
      <div className="flex items-center">
        <span className="font-semibold text-gray-700 w-28">Frequency:</span>
        <span className="text-gray-800">{medication.frequency}</span>
      </div>
      <div className="flex items-center">
        <Clock size={16} className="mr-3 text-[#F97316] flex-shrink-0" />
        <span className="font-semibold text-gray-700 w-24">Time:</span>
        <span className="text-gray-800 truncate">
          {Array.isArray(medication.time) ? medication.time.join(", ") : medication.time}
        </span>
      </div>
      <div className="flex items-center">
        <Calendar size={16} className="mr-3 text-[#F97316] flex-shrink-0" />
        <span className="font-semibold text-gray-700 w-24">Refill:</span>
        <span className="text-gray-800">{medication.refill_date || "Not set"}</span>
      </div>
    </div>

    {medication.notes && (
      <div className="mt-auto p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-700">{medication.notes}</p>
      </div>
    )}
  </div>
);

const Medications = () => {
  const { session } = useSession()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMedication, setEditingMedication] = useState(null)

  // Initialize with mock data
  const [medications, setMedications] = useState([
    { id: 1, name: "Lisinopril", type: "Blood Pressure", dosage: "10mg", frequency: "Once daily", time: ["08:00"], refill_date: "2024-12-01", notes: "Take with food" },
    { id: 2, name: "Metformin", type: "Diabetes", dosage: "500mg", frequency: "Twice daily", time: ["08:00", "20:00"], refill_date: "2024-11-20", notes: "" },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const filteredMedications = medications.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (med.type && med.type.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === "all" || (med.type && med.type.toLowerCase().includes(filterType.toLowerCase()));
    return matchesSearch && matchesFilter
  })

  const handleEdit = (medication) => {
    setEditingMedication(medication)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this medication?")) {
      setMedications(medications.filter((med) => med.id !== id))
    }
  }

  const handleAddNew = () => {
    setEditingMedication(null)
    setIsModalOpen(true)
  }

  const handleSave = async (formData) => {
    try {
      if (editingMedication) {
        // Update existing medication in UI state
        const updatedMed = { ...editingMedication, ...formData };
        setMedications(
          medications.map((med) => (med.id === editingMedication.id ? updatedMed : med))
        )
      } else {
        // Add new medication to UI state
        const newMed = { ...formData, id: Date.now() };
        setMedications([newMed, ...medications])
      }
    } catch (error) {
      setError(error.message)
    }
  }

  if (loading) {
    return <div className="text-center p-8">Loading your medications...</div>
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {error && <p className="text-red-500 text-sm text-center bg-red-100 p-3 rounded-lg">{error}</p>}

      {/* Search, Filter, and Add Button */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-auto flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none"
              />
            </div>
            <div className="relative">
              <Filter size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none bg-white appearance-none"
              >
                <option value="all">All Types</option>
                <option value="Blood Pressure">Blood Pressure</option>
                <option value="Diabetes">Diabetes</option>
                <option value="Supplement">Supplement</option>
                <option value="Heart Health">Heart Health</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="w-full md:w-auto md:ml-4 flex-shrink-0">
            <button
              onClick={handleAddNew}
              className="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#F97316]/90 transition-colors shadow-sm"
            >
              <Plus size={20} className="mr-2" />
              Add Medication
            </button>
          </div>
        </div>
      </div>

      {/* Medications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMedications.map((medication) => (
          <MedicationCard key={medication.id} medication={medication} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>

      {filteredMedications.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Search size={24} className="sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No medications found</h3>
          <p className="text-sm sm:text-base text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Modal */}
      <MedicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        medication={editingMedication}
        onSave={handleSave}
      />
    </div>
  )
}

export default Medications
