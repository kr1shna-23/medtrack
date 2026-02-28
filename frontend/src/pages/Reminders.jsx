import { useState, useEffect } from "react"
import { Bell, Clock, Calendar, CheckCircle2, MessageSquare, Mail, AlertCircle } from "lucide-react"
import { useSession } from "../contexts/SessionContext"
import { supabase } from "../lib/supabase"

const ReminderRow = ({ medication, reminders, onToggle, onTypeChange }) => {
  // Find if there's an active reminder for this medication
  const activeReminder = reminders.find(r => r.medication_id === medication.id);
  const isEnabled = !!activeReminder;

  // Default type if enabling a new reminder, or current type if exists
  const currentType = activeReminder?.type || 'whatsapp';

  const timeString = Array.isArray(medication.time)
    ? medication.time.join(", ")
    : (medication.time || "Not set");

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        {/* Medication Info Details */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900">{medication.name}</h3>
            {isEnabled && (
              <span className="flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                <CheckCircle2 size={12} className="mr-1" /> Active
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
            <span className="flex items-center"><span className="font-medium mr-1">Dose:</span> {medication.dosage || "Not set"}</span>
            <span className="flex items-center truncate"><Clock size={14} className="mr-1 text-orange-500" /> {timeString}</span>
            <span className="flex items-center"><Calendar size={14} className="mr-1 text-orange-500" /> {medication.frequency || "Not set"}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:border-l border-gray-100 sm:pl-6">

          {/* Method Selector (Only show if enabled or about to be enabled) */}
          <div className={`transition-opacity duration-200 ${isEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <div className="flex p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => onTypeChange(medication.id, 'whatsapp', activeReminder)}
                className={`flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${currentType === 'whatsapp' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <MessageSquare size={14} className="mr-1.5" /> WhatsApp
              </button>
              <button
                onClick={() => onTypeChange(medication.id, 'email', activeReminder)}
                className={`flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${currentType === 'email' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Mail size={14} className="mr-1.5" /> Email
              </button>
            </div>
          </div>

          {/* Master Toggle */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isEnabled}
              onChange={() => onToggle(medication, activeReminder, !isEnabled, currentType)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F97316]"></div>
          </label>

        </div>
      </div>
    </div>
  )
}

const Reminders = () => {
  const { session } = useSession()
  const [medications, setMedications] = useState([])
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Stats
  const activeCount = reminders.length;
  const totalCount = medications.length;

  const fetchData = async () => {
    if (!session?.user?.id) return;
    try {
      setLoading(true);
      setError(null);

      const [medRes, remRes] = await Promise.all([
        supabase.from('medications').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }),
        supabase.from('reminders').select('*').eq('user_id', session.user.id)
      ]);

      if (medRes.error) throw medRes.error;
      if (remRes.error) throw remRes.error;

      console.log("Reminders Page Fetched Medications:", medRes.data);
      console.log("Reminders Page Fetched Reminders:", remRes.data);

      setMedications(medRes.data || []);
      setReminders(remRes.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load your medications. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData()
  }, [session])


  // Handle Master Enable/Disable Toggle
  const handleToggle = async (medication, activeReminder, turnOn, targetType) => {
    try {
      if (!turnOn && activeReminder) {
        // Turn Off -> Delete all reminders for this medication
        const { error } = await supabase.from('reminders').delete().eq('medication_id', medication.id);
        if (error) throw error;

        setReminders(prev => prev.filter(r => r.medication_id !== medication.id));

      } else if (turnOn && !activeReminder) {
        // Turn On -> Create new reminders based on medication times
        let timesArray = Array.isArray(medication.time) ? medication.time : [medication.time];
        // If no time is set on medication, default to 08:00
        if (!timesArray || timesArray.length === 0 || timesArray[0] === null) timesArray = ["08:00"];

        const newReminders = timesArray.map(timeStr => {
          const [hours, minutes] = (timeStr || "08:00").split(":");
          const reminderDate = new Date();
          reminderDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

          return {
            user_id: session.user.id,
            medication_id: medication.id,
            dosage: medication.dosage,
            frequency: medication.frequency,
            type: targetType,
            reminder_time: reminderDate.toISOString()
          }
        });

        const { data, error } = await supabase.from('reminders').insert(newReminders).select();
        if (error) throw error;

        setReminders(prev => [...prev, ...data]);
      }
    } catch (err) {
      console.error("Toggle error:", err);
      alert("Failed to update reminder status: " + err.message);
    }
  }

  // Handle changing between WhatsApp and Email when already active
  const handleTypeChange = async (medicationId, newType, activeReminder) => {
    // If reminder isn't active yet, do nothing (controlled via toggle)
    if (!activeReminder) return;

    // If no change, return
    if (activeReminder.type === newType) return;

    try {
      // Update all reminders for this medication to the new type
      const { data, error } = await supabase
        .from('reminders')
        .update({ type: newType })
        .eq('medication_id', medicationId)
        .select();

      if (error) throw error;

      // Replace matching reminder records in state
      setReminders(prev => {
        const filtered = prev.filter(r => r.medication_id !== medicationId);
        return [...filtered, ...(data || [])]
      });

    } catch (err) {
      console.error("Type change error:", err);
      alert("Failed to change reminder channel: " + err.message);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-gray-500">
        <Bell className="animate-pulse mb-3" size={32} />
        <p>Loading your notification preferences...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* Page Header & Stats Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Notification Settings</h1>
            <p className="text-orange-100 opacity-90 text-sm sm:text-base max-w-xl">
              Manage how and when you receive reminders for your active medications. Choose between WhatsApp and Email channels.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm self-start sm:self-auto border border-white/20">
            <div className="p-3 bg-white/20 rounded-lg">
              <Bell size={24} className="text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight">{activeCount} <span className="text-lg font-medium text-orange-200">/ {totalCount}</span></p>
              <p className="text-xs text-orange-100 font-medium uppercase tracking-wider">Active Alerts</p>
            </div>
          </div>
        </div>
        {/* Decorative background circle */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Main List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-800">Your Medications</h2>
        </div>

        <div className="p-6">
          {medications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-orange-50 rounded-full flex items-center justify-center">
                <Plus size={24} className="text-orange-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No medications found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">You need to add a medication first before configuring its notification schedule.</p>
              <a href="/app/medications" className="inline-flex items-center justify-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
                Go to Medications
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {medications.map((medication) => (
                <ReminderRow
                  key={medication.id}
                  medication={medication}
                  reminders={reminders}
                  onToggle={handleToggle}
                  onTypeChange={handleTypeChange}
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
