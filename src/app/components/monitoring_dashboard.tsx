'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { ArrowUpRight, Shield, Zap, Users, Globe, Clock, AlertTriangle } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    requestCount: 5000,
    anomalyScore: 35,
    trafficPattern: 'Regular',
    blockedIpRanges: ['192.168.1.100', '10.0.0.50', '172.16.0.1'],
    loginAttempts: 250,
    suspiciousIPs: 3,
    unusualTrafficPatterns: 2,
    responseTime: 150,
    availabilityPercentage: 99.9
  })
  const [isSimulating, setIsSimulating] = useState(false)
  const [isMitigating, setIsMitigating] = useState(false)
  const [chartData, setChartData] = useState<{ time: string; requests: number; anomalyScore: number; loginAttempts: number; responseTime: number }[]>([])

  const updateSimulatedData = useCallback(() => {
    setStats(prevStats => {
      let newRequestCount = prevStats.requestCount
      let newAnomalyScore = prevStats.anomalyScore
      let newLoginAttempts = prevStats.loginAttempts
      let newSuspiciousIPs = prevStats.suspiciousIPs
      let newUnusualPatterns = prevStats.unusualTrafficPatterns
      let newResponseTime = prevStats.responseTime
      let newAvailability = prevStats.availabilityPercentage

      if (isSimulating) {
        newRequestCount += Math.floor(Math.random() * 1000) + 500
        newAnomalyScore = Math.min(100, newAnomalyScore + Math.random() * 10)
        newLoginAttempts += Math.floor(Math.random() * 100) + 50
        newSuspiciousIPs += Math.floor(Math.random() * 3)
        newUnusualPatterns += Math.floor(Math.random() * 2)
        newResponseTime += Math.floor(Math.random() * 100) + 50
        newAvailability = Math.max(90, newAvailability - Math.random() * 2)
      } else if (isMitigating) {
        newRequestCount = Math.max(0, newRequestCount - Math.floor(Math.random() * 500))
        newAnomalyScore = Math.max(0, newAnomalyScore - Math.random() * 5)
        newLoginAttempts = Math.max(0, newLoginAttempts - Math.floor(Math.random() * 50))
        newSuspiciousIPs = Math.max(0, newSuspiciousIPs - 1)
        newUnusualPatterns = Math.max(0, newUnusualPatterns - 1)
        newResponseTime = Math.max(50, newResponseTime - Math.floor(Math.random() * 50))
        newAvailability = Math.min(100, newAvailability + Math.random())
      } else {
        newRequestCount += Math.floor(Math.random() * 200) - 100
        newAnomalyScore += (Math.random() * 2) - 1
        newLoginAttempts += Math.floor(Math.random() * 20) - 10
        newResponseTime += Math.floor(Math.random() * 20) - 10
      }

      newAnomalyScore = Math.max(0, Math.min(100, newAnomalyScore))
      newAvailability = Math.max(90, Math.min(100, newAvailability))

      return {
        ...prevStats,
        requestCount: newRequestCount,
        anomalyScore: newAnomalyScore,
        trafficPattern: newAnomalyScore > 50 ? 'Irregular' : 'Regular',
        loginAttempts: newLoginAttempts,
        suspiciousIPs: newSuspiciousIPs,
        unusualTrafficPatterns: newUnusualPatterns,
        responseTime: newResponseTime,
        availabilityPercentage: newAvailability
      }
    })

    setChartData(prevData => {
      const newDataPoint = { 
        time: new Date().toLocaleTimeString(), 
        requests: stats.requestCount,
        anomalyScore: stats.anomalyScore,
        loginAttempts: stats.loginAttempts,
        responseTime: stats.responseTime
      }
      const newData = [...prevData, newDataPoint]
      return newData.slice(-30) // Keep last 30 data points for a more detailed graph
    })
  }, [stats, isSimulating, isMitigating])

  useEffect(() => {
    const interval = setInterval(updateSimulatedData, 1000)
    return () => clearInterval(interval)
  }, [updateSimulatedData])

  const simulateAttack = () => {
    setIsSimulating(true)
    setTimeout(() => setIsSimulating(false), 10000)
  }

  const toggleMitigation = () => {
    setIsMitigating(!isMitigating)
  }

  return (
    <div className="min-h-screen bg-black-900 text-white p-8">
      <h1 className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">DDoS Attack Detection & Mitigation Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-black-800 border-black-700 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Request Count</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.requestCount.toLocaleString()}</div>
            <p className="text-xs text-gray-400 mt-1">Requests per minute</p>
          </CardContent>
        </Card>
        <Card className="bg-black-800 border-white-700 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anomaly Score</CardTitle>
            <Zap className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.anomalyScore.toFixed(2)}</div>
            <p className="text-xs text-gray-400 mt-1">Measure of unusual activity (0-100)</p>
          </CardContent>
        </Card>
        <Card className="bg-black-800 border-white-700 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Login Attempts</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.loginAttempts}</div>
            <p className="text-xs text-gray-400 mt-1">Attempts per minute</p>
          </CardContent>
        </Card>
        <Card className="bg-black-800 border-white-700 shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.responseTime} ms</div>
            <p className="text-xs text-gray-400 mt-1">Average server response time</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black-800 border-white-700 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-shadow duration-300 mb-8">
        <CardHeader>
          <CardTitle>Network Traffic Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="time" stroke="#888" />
              <YAxis yAxisId="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                itemStyle={{ color: '#e5e7eb' }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="requests" name="Requests" stroke="#8884d8" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="anomalyScore" name="Anomaly Score" stroke="#82ca9d" strokeWidth={2} dot={false} />
              <Line yAxisId="left" type="monotone" dataKey="loginAttempts" name="Login Attempts" stroke="#ffc658" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="responseTime" name="Response Time (ms)" stroke="#ff8042" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <Card className="bg-black-800 border-white-700 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-shadow duration-300">
          <CardHeader>
            <CardTitle>DDoS Attack Simulation</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={simulateAttack} 
              disabled={isSimulating}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSimulating ? 'Simulating Attack...' : 'Simulate DDoS Attack'}
            </Button>
            <p className="text-xs text-gray-400 mt-2">Simulates a 10-second DDoS attack, increasing all metrics</p>
          </CardContent>
        </Card>
        <Card className="bg-black-800 border-white-700 shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-shadow duration-300">
          <CardHeader>
            <CardTitle>DDoS Mitigation</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={toggleMitigation} 
              className={`w-full ${isMitigating ? 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600' : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'} text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105`}
            >
              {isMitigating ? 'Deactivate DDoS Protection' : 'Activate DDoS Protection'}
            </Button>
            <p className="text-xs text-gray-400 mt-2">Toggles advanced DDoS protection measures</p>
          </CardContent>
        </Card>
        <Card className="bg-black-800 border-white-700 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Suspicious Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Suspicious IPs:</span>
                <span className="font-bold text-orange-400">{stats.suspiciousIPs}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Unusual Traffic Patterns:</span>
                <span className="font-bold text-orange-400">{stats.unusualTrafficPatterns}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="bg-black-800 border-white-700 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Website Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-center mb-2">{stats.availabilityPercentage.toFixed(2)}%</div>
            <p className="text-xs text-gray-400 text-center">Current website uptime percentage</p>
          </CardContent>
        </Card>
        <Card className="bg-black-800 border-white-700 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Blocked IP Ranges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.blockedIpRanges.map((range, index) => (
                <div key={index} className="flex items-center space-x-2 bg-red-900/50 p-2 rounded">
                  <Shield className="h-4 w-4 text-red-500" />
                  <span className="text-sm">{range}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black-800 border-white-700 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Traffic Pattern</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className={`text-2xl font-bold ${stats.trafficPattern === 'Irregular' ? 'text-red-500' : 'text-green-500'}`}>
              {stats.trafficPattern}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}