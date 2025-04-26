'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  UserIcon,
  Syringe,
  AlertTriangle,
  Construction,
} from 'lucide-react';
import { Chart } from '@/components/ui/chart';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Range } from '@/enums/time-category';

// Mock data for demonstration
const patientData = {
  today: 12,
  yesterday: 8,
  currentMonth: 145,
  lastMonth: 132,
  currentQuarter: 420,
  lastQuarter: 385,
  currentYear: 1560,
  lastYear: 1420,
};

const monthlyData = [
  { name: 'Jan', patients: 65 },
  { name: 'Feb', patients: 59 },
  { name: 'Mar', patients: 80 },
  { name: 'Apr', patients: 81 },
  { name: 'May', patients: 56 },
  { name: 'Jun', patients: 55 },
  { name: 'Jul', patients: 40 },
  { name: 'Aug', patients: 70 },
  { name: 'Sep', patients: 90 },
  { name: 'Oct', patients: 110 },
  { name: 'Nov', patients: 120 },
  { name: 'Dec', patients: 130 },
];

const quarterlyData = [
  { name: 'Q1', current: 204, previous: 180 },
  { name: 'Q2', current: 192, previous: 170 },
  { name: 'Q3', current: 200, previous: 190 },
  { name: 'Q4', current: 260, previous: 230 },
];

// Add a chart config object
const chartConfig = {
  patients: {
    label: 'Patients',
    color: '#8884d8',
  },
  current: {
    label: 'Current Year',
    color: '#8884d8',
  },
  previous: {
    label: 'Previous Year',
    color: '#82ca9d',
  },
  count: {
    label: 'Patient Count',
    color: '#8884d8',
  },
};

export function DataOverview() {
  const [timeframe, setTimeframe] = useState(Range.Day);

  // Calculate percentage change
  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(1);
  };

  // Get data based on selected timeframe
  const getCurrentData = () => {
    switch (timeframe) {
      case Range.Day:
        return {
          current: patientData.today,
          previous: patientData.yesterday,
          label: 'Today vs Yesterday',
        };
      case Range.Month:
        return {
          current: patientData.currentMonth,
          previous: patientData.lastMonth,
          label: 'This Month vs Last Month',
        };
      case Range.Quarter:
        return {
          current: patientData.currentQuarter,
          previous: patientData.lastQuarter,
          label: 'This Quarter vs Last Quarter',
        };
      case Range.Year:
        return {
          current: patientData.currentYear,
          previous: patientData.lastYear,
          label: 'This Year vs Last Year',
        };
      default:
        return {
          current: patientData.today,
          previous: patientData.yesterday,
          label: 'Today vs Yesterday',
        };
    }
  };

  const data = getCurrentData();
  const percentChange = calculateChange(data.current, data.previous);
  const isPositive = Number.parseFloat(percentChange) >= 0;

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-full overflow-hidden relative">
      {/* Construction overlay */}
      <div className="absolute inset-0 bg-black/5 rounded-lg backdrop-blur-sm z-10 flex flex-col items-center justify-center">
        <Construction className="h-16 w-16 text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold text-black">Under Construction</h2>
        <p className="text-black/80 mt-2 text-center max-w-md px-6">
          This feature is currently being developed and will be available soon.
        </p>
      </div>

      <Card className="w-full overflow-hidden">
        <CardHeader className="flex flex-col items-center justify-between space-y-2 pb-2 px-3">
          <CardTitle className="text-sm font-medium text-left w-full px-3">
            Patient Overview
          </CardTitle>
          <Tabs
            defaultValue={Range.Day}
            onValueChange={(value) => setTimeframe(value as Range)}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-4 gap-x-0.5">
              <TabsTrigger value={Range.Day} className="text-xs h-8 px-0">
                Day
              </TabsTrigger>
              <TabsTrigger value={Range.Month} className="text-xs h-8 px-0">
                Month
              </TabsTrigger>
              <TabsTrigger value={Range.Quarter} className="text-xs h-8 px-0">
                Quarter
              </TabsTrigger>
              <TabsTrigger value={Range.Year} className="text-xs h-8 px-0">
                Year
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="text-2xl font-bold text-left">{data.current}</div>
          <div className="flex items-center justify-start space-x-2 mt-1">
            {isPositive ? (
              <ArrowUpIcon className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-rose-500 flex-shrink-0" />
            )}
            <p
              className={`text-xs whitespace-nowrap ${
                isPositive ? 'text-emerald-500' : 'text-rose-500'
              }`}
            >
              {isPositive ? '+' : ''}
              {percentChange}%
            </p>
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              from {data.previous}
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-left">
            {data.label}
          </p>
        </CardContent>
      </Card>

      <Card className="w-full overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
          <UserIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2,350</div>
          <p className="text-xs text-muted-foreground">
            All time patient records
          </p>
        </CardContent>
      </Card>

      <Card className="w-full overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vaccinations</CardTitle>
          <Syringe className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,892</div>
          <p className="text-xs text-muted-foreground">
            Completed vaccination schedules
          </p>
        </CardContent>
      </Card>

      <Card className="w-full overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Follow-ups
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">42</div>
          <p className="text-xs text-muted-foreground">
            Patients requiring follow-up
          </p>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2 lg:col-span-full w-full overflow-hidden">
        <CardHeader>
          <CardTitle>Patient Trends</CardTitle>
          <CardDescription>
            Monthly patient intake over the past year
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] w-full overflow-hidden">
          <div className="h-full w-full">
            <Chart config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={200}>
                <LineChart
                  data={monthlyData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="patients"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Chart>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2 w-full overflow-hidden">
        <CardHeader>
          <CardTitle>Quarterly Comparison</CardTitle>
          <CardDescription>
            Current year vs previous year by quarter
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] w-full overflow-hidden">
          <div className="h-full w-full">
            <Chart config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={200}>
                <BarChart
                  data={quarterlyData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="current" fill="#8884d8" name="Current Year" />
                  <Bar dataKey="previous" fill="#82ca9d" name="Previous Year" />
                </BarChart>
              </ResponsiveContainer>
            </Chart>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2 w-full overflow-hidden">
        <CardHeader>
          <CardTitle>Patient Distribution</CardTitle>
          <CardDescription>Patient cases by age group</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] w-full overflow-hidden">
          <div className="h-full w-full">
            <Chart config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={200}>
                <AreaChart
                  data={[
                    { age: '0-10', count: 120 },
                    { age: '11-20', count: 200 },
                    { age: '21-30', count: 150 },
                    { age: '31-40', count: 80 },
                    { age: '41-50', count: 70 },
                    { age: '51-60', count: 50 },
                    { age: '61+', count: 30 },
                  ]}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Chart>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
