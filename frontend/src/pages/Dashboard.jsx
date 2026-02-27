import { Pill, Bell, Calendar, Clock, CheckCircle } from "lucide-react"
import { useSession } from "../contexts/SessionContext"
import { useState, useEffect } from "react"

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

      // Mock Data
      const now = new Date();
      const nowISO = now.toISOString();

      const mockMedications = [
        { id: 1, name: "Lisinopril", dosage: "10mg", refill_date: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 2, name: "Metformin", dosage: "500mg", refill_date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 3, name: "Vitamin D3", dosage: "1000 IU", refill_date: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString() }
      ];

      const mockUpcomingReminders = [
        { id: 1, type: "whatsapp", reminder_time: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(), medications: { name: "Lisinopril" } },
        { id: 2, type: "email", reminder_time: new Date(now.getTime() + 5 * 60 * 60 * 1000).toISOString(), medications: { name: "Metformin" } },
        { id: 3, type: "whatsapp", reminder_time: new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString(), medications: { name: "Vitamin D3" } }
      ]

      setTimeout(() => {
        const nextRefillDate = new Date(mockMedications[1].refill_date);
        const nextRefill = `${Math.ceil((nextRefillDate - now) / (1000 * 60 * 60 * 24))} days`;

        setDashboardData({
          stats: {
            totalMedications: 3,
            totalReminders: 3,
            medsTakenToday: 2,
            upcomingReminders: 3,
            nextRefill,
          },
          upcomingReminders: mockUpcomingReminders,
          medicationSummary: mockMedications,
          loading: false,
        });
      }, 500); // Simulate network latency
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
                    <p className="font-medium text-gray-900">{reminder.medications?.name || "Unknown Medication"}</p>
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
