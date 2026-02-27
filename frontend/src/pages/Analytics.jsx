import { useState } from "react"
import { Target, Award, BarChart3, Clock, TrendingUp, Pill } from "lucide-react"
// import AdherenceChart from "../components/charts/AdherenceChart"
// import ProgressRing from "../components/charts/ProgressRing"
// import TrendChart from "../components/charts/TrendChart"
// import HeatmapCalendar from "../components/charts/HeatmapCalendar"
// import MedicationBreakdown from "../components/charts/MedicationBreakdown"
// import WeeklyPattern from "../components/charts/WeeklyPattern"

const StatCard = ({ title, value, change, icon: Icon, color = "blue", trend }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && (
          <p className={`text-sm mt-1 flex items-center ${change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
            <TrendingUp size={14} className="mr-1" />
            {change} from last week
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg bg-${color}-100`}>
        <Icon size={24} className={`text-${color}-600`} />
      </div>
    </div>
    {trend && (
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span>{trend}%</span>
        </div>
        <div className="bg-gray-200 rounded-full h-2">
          <div
            className={`bg-${color}-500 h-2 rounded-full transition-all duration-500`}
            style={{ width: `${trend}%` }}
          ></div>
        </div>
      </div>
    )}
  </div>
)

const InsightCard = ({ icon, title, description, type = "info" }) => {
  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800"
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "danger":
        return "bg-red-50 border-red-200 text-red-800"
      default:
        return "bg-blue-50 border-blue-200 text-blue-800"
    }
  }

  return (
    <div className={`p-4 rounded-lg border ${getTypeStyles()}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 text-lg">{icon}</div>
        <div>
          <h4 className="font-medium mb-1">{title}</h4>
          <p className="text-sm opacity-90">{description}</p>
        </div>
      </div>
    </div>
  )
}

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("week")
  const [selectedMetric, setSelectedMetric] = useState("adherence")

  // Sample data - in real app, this would come from your backend
  const adherenceData = [
    { day: "Mon", taken: 4, total: 4 },
    { day: "Tue", taken: 3, total: 4 },
    { day: "Wed", taken: 4, total: 4 },
    { day: "Thu", taken: 4, total: 4 },
    { day: "Fri", taken: 2, total: 4 },
    { day: "Sat", taken: 4, total: 4 },
    { day: "Sun", taken: 4, total: 4 },
  ]

  const trendData = [
    { label: "Week 1", value: 85 },
    { label: "Week 2", value: 92 },
    { label: "Week 3", value: 88 },
    { label: "Week 4", value: 94 },
    { label: "Week 5", value: 89 },
    { label: "Week 6", value: 96 },
  ]

  const medicationBreakdown = [
    { name: "Lisinopril", adherence: 95, taken: 28, total: 30, streak: 28, lastTaken: "2 hours ago" },
    { name: "Metformin", adherence: 87, taken: 26, total: 30, streak: 15, lastTaken: "4 hours ago" },
    { name: "Vitamin D3", adherence: 100, taken: 30, total: 30, streak: 45, lastTaken: "Yesterday" },
    { name: "Aspirin", adherence: 80, taken: 24, total: 30, streak: 12, lastTaken: "Yesterday" },
  ]

  const calendarData = Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    adherence: Math.floor(Math.random() * 100),
    taken: Math.floor(Math.random() * 4) + 1,
    total: 4,
  }))

  const weeklyPatternData = [
    {
      day: 0,
      hours: Array.from({ length: 24 }, (_, hour) => ({
        hour,
        adherence: hour >= 8 && hour <= 10 ? Math.random() * 20 + 80 : Math.random() * 60 + 20,
      })),
    },
    // ... more days
  ]

  const weeklyAdherence = Math.round(
    (adherenceData.reduce((sum, day) => sum + day.taken, 0) / adherenceData.reduce((sum, day) => sum + day.total, 0)) *
    100,
  )

  const insights = [
    {
      icon: "🎯",
      title: "Excellent Progress!",
      description: "Your adherence rate improved by 5% this week. You're on track to reach your 95% goal.",
      type: "success",
    },
    {
      icon: "⏰",
      title: "Timing Optimization",
      description: "You tend to miss evening doses. Consider setting an additional reminder for 6 PM.",
      type: "warning",
    },
    {
      icon: "💊",
      title: "Medication Insight",
      description: "Vitamin D3 has your highest adherence rate at 100%. Great consistency!",
      type: "info",
    },
    {
      icon: "📈",
      title: "Streak Achievement",
      description: "You're on a 12-day streak! Keep it up to reach your 30-day milestone.",
      type: "success",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Comprehensive insights into your medication adherence
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none bg-white"
          >
            <option value="adherence">Adherence</option>
            <option value="timing">Timing</option>
            <option value="streaks">Streaks</option>
          </select>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none bg-white"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Overall Adherence"
          value={`${weeklyAdherence}%`}
          change="+5%"
          icon={Target}
          color="green"
          trend={weeklyAdherence}
        />
        <StatCard title="Current Streak" value="12 days" change="+2 days" icon={Award} color="orange" trend={40} />
        <StatCard title="Doses This Week" value="25/28" change="+3" icon={Pill} color="blue" trend={89} />
        <StatCard title="On-Time Rate" value="89%" change="+7%" icon={Clock} color="purple" trend={89} />
      </div>

      {/* Progress Rings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Progress Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-2xl font-bold text-[#10B981]">{weeklyAdherence}%</span>
            <span className="text-xs text-gray-500 mt-1">Weekly Adherence</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-2xl font-bold text-[#3B82F6]">89%</span>
            <span className="text-xs text-gray-500 mt-1">On-Time Doses</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-2xl font-bold text-[#F97316]">12/30</span>
            <span className="text-xs text-gray-500 mt-1">Streak Progress</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-2xl font-bold text-[#8B5CF6]">3/4</span>
            <span className="text-xs text-gray-500 mt-1">Active Medications</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Daily Adherence Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 flex flex-col items-center justify-center min-h-[250px] text-gray-500">
          <BarChart3 size={48} className="mb-4 opacity-50" />
          <p>Daily Adherence Chart Placeholder</p>
        </div>

        {/* Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 flex flex-col items-center justify-center min-h-[250px] text-gray-500">
          <TrendingUp size={48} className="mb-4 opacity-50" />
          <p>Adherence Trend Placeholder</p>
        </div>
      </div>

      {/* Medication Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Medication Breakdown Placeholder</h3>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Calendar Heatmap */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 flex flex-col items-center justify-center min-h-[250px] text-gray-500">
          <p>Calendar Heatmap Placeholder</p>
        </div>

        {/* Weekly Pattern */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 flex flex-col items-center justify-center min-h-[250px] text-gray-500">
          <p>Weekly Pattern Placeholder</p>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-[#F97316]/10 to-[#FB923C]/10 rounded-xl p-4 sm:p-6 border border-[#F97316]/20">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-[#F97316] rounded-lg mr-3">
            <BarChart3 size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">AI-Powered Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <InsightCard key={index} {...insight} />
          ))}
        </div>
      </div>

      {/* Detailed Analytics Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Medication Analytics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medication
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Adherence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Streak
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Dose
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Due
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {medicationBreakdown.map((med, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: ["#F97316", "#3B82F6", "#10B981", "#8B5CF6"][index] }}
                      ></div>
                      <span className="font-medium text-gray-900">{med.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-900 mr-2">{med.adherence}%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${med.adherence}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{med.streak} days</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{med.lastTaken}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Today 2:00 PM</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${med.adherence >= 90
                          ? "bg-green-100 text-green-800"
                          : med.adherence >= 75
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {med.adherence >= 90 ? "Excellent" : med.adherence >= 75 ? "Good" : "Needs Attention"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Analytics
