import { Pill, Bell, Calendar, Clock, CheckCircle } from "lucide-react"
import { useSession } from "../contexts/SessionContext"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

const StatCard = ({ title, value, icon: Icon, color = "blue" }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-lg bg-${color}-100`}>
        <Icon size={24} className={`text-${color}-600`} />
      </div>
    </div>
  </div>
)

const MedicationCard = ({ name, dosage, nextDose, status }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-semibold text-gray-900">{name}</h3>
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${status === "taken"
          ? "bg-green-100 text-green-800"
          : status === "due"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-gray-100 text-gray-800"
          }`}
      >
        {status}
      </span>
    </div>
    <p className="text-sm text-gray-600 mb-2">{dosage}</p>
    <div className="flex items-center text-sm text-gray-500">
      <Clock size={16} className="mr-1" />
      Next: {nextDose}
    </div>
  </div>
)

const Dashboard = () => {
  const { session } = useSession();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalMedications: 0,
      totalReminders: 0,
      medsTakenToday: 0,
      upcomingReminders: 0,
      nextRefill: "N/A",
    },
    upcomingReminders: [],
    medicationSummary: [],
    loading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      setDashboardData((prev) => ({ ...prev, loading: true }));

      if (!session) return;

      const now = new Date();
      const nowISO = now.toISOString();

      try {
        const [medReq, remReq] = await Promise.all([
          supabase.from('medications').select('*').eq('user_id', session.user.id),
          supabase.from('reminders').select('*').eq('user_id', session.user.id).gte('reminder_time', nowISO).order('reminder_time', { ascending: true })
        ]);

        const mockMedications = medReq.data || [];
        const mockUpcomingReminders = remReq.data || [];

        let nextRefill = "N/A";
        const futureRefills = mockMedications
          .filter(m => m.refill_date && new Date(m.refill_date) > now)
          .sort((a, b) => new Date(a.refill_date) - new Date(b.refill_date));

        if (futureRefills.length > 0) {
          const nextRefillDate = new Date(futureRefills[0].refill_date);
          nextRefill = `${Math.ceil((nextRefillDate - now) / (1000 * 60 * 60 * 24))} days`;
        }

        setDashboardData({
          stats: {
            totalMedications: mockMedications.length,
            totalReminders: mockUpcomingReminders.length,
            medsTakenToday: 0,
            upcomingReminders: mockUpcomingReminders.length,
            nextRefill,
          },
          upcomingReminders: mockUpcomingReminders,
          medicationSummary: mockMedications,
          loading: false,
        });
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        setDashboardData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, [session]);

  if (dashboardData.loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Medications" value={dashboardData.stats.totalMedications} icon={Pill} color="orange" />
        <StatCard title="Total Reminders" value={dashboardData.stats.totalReminders} icon={Bell} color="blue" />
        <StatCard title="Upcoming Today" value={dashboardData.stats.upcomingReminders} icon={Clock} color="yellow" />
        <StatCard title="Next Refill" value={dashboardData.stats.nextRefill} icon={Calendar} color="purple" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Reminders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Today</h2>
          </div>
          <div className="p-6 space-y-4">
            {dashboardData.upcomingReminders.length > 0 ? (
              dashboardData.upcomingReminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{reminder.medication_name || reminder.medications?.name || "Unknown Medication"}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(reminder.reminder_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full capitalize">
                    {reminder.type}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No upcoming reminders.</p>
              </div>
            )}
          </div>
        </div>

        {/* Medication Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Medication Summary</h2>
          </div>
          <div className="p-6 space-y-4">
            {dashboardData.medicationSummary.map((med) => (
              <div key={med.id} className="flex items-center justify-between">
                <p className="font-medium text-gray-800">{med.name}</p>
                <p className="text-sm text-gray-500">{med.dosage}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard
