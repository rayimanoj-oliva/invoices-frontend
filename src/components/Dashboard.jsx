import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function Dashboard() {
    // Sample data for Revenue Trend
    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Revenue',
                data: [3000, 3500, 4200, 4800, 5200, 5800],
                borderColor: '#00A4A7',
                backgroundColor: 'rgba(0, 164, 167, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    // Sample data for Invoice Distribution
    const invoiceData = {
        labels: ['Products', 'Services', 'Consultations'],
        datasets: [
            {
                data: [300, 250, 150],
                backgroundColor: [
                    'rgba(0, 164, 167, 0.8)',
                    'rgba(0, 132, 135, 0.8)',
                    'rgba(0, 100, 102, 0.8)',
                ],
                borderColor: [
                    'rgba(0, 164, 167, 1)',
                    'rgba(0, 132, 135, 1)',
                    'rgba(0, 100, 102, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Sample data for Monthly Invoices
    const monthlyInvoiceData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Invoices Generated',
                data: [65, 78, 82, 75, 90, 85],
                backgroundColor: 'rgba(0, 164, 167, 0.8)',
            },
        ],
    };

    // Sample data for Doctor Performance
    const doctorPerformanceData = {
        labels: ['Dr. Smith', 'Dr. Patel', 'Dr. Kumar', 'Dr. Singh', 'Dr. Reddy'],
        datasets: [
            {
                label: 'Revenue Generated',
                data: [125000, 98000, 115000, 88000, 105000],
                backgroundColor: 'rgba(0, 164, 167, 0.8)',
            },
            {
                label: 'Patients Treated',
                data: [180, 150, 165, 130, 155],
                backgroundColor: 'rgba(0, 132, 135, 0.8)',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    return (
        <div className="p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                        <div className="text-sm text-gray-500">
                            Last updated: {new Date().toLocaleDateString()}
                        </div>
                    </div>

                    {/* Summary Cards - First Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Total Revenue</CardTitle>
                                <CardDescription>Current month</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-[#00A4A7]">₹5,80,000</div>
                                <p className="text-sm text-green-600">+12% from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Total Patients</CardTitle>
                                <CardDescription>Current month</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-[#00A4A7]">850</div>
                                <p className="text-sm text-green-600">+15% from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">New Patients</CardTitle>
                                <CardDescription>Current month</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-[#00A4A7]">245</div>
                                <p className="text-sm text-green-600">+8% from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Patient Retention</CardTitle>
                                <CardDescription>Last 3 months</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-[#00A4A7]">78%</div>
                                <p className="text-sm text-green-600">+5% from last quarter</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Summary Cards - Second Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Average Bill Value</CardTitle>
                                <CardDescription>Per patient</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-[#00A4A7]">₹6,820</div>
                                <p className="text-sm text-green-600">+8% from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Treatment Success</CardTitle>
                                <CardDescription>Based on feedback</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-[#00A4A7]">92%</div>
                                <p className="text-sm text-green-600">+3% from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Product Sales</CardTitle>
                                <CardDescription>Current month</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-[#00A4A7]">₹1,25,000</div>
                                <p className="text-sm text-green-600">+10% from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Service Revenue</CardTitle>
                                <CardDescription>Current month</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-[#00A4A7]">₹4,55,000</div>
                                <p className="text-sm text-green-600">+15% from last month</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts - First Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Revenue Trend</CardTitle>
                                <CardDescription>Last 6 months</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <Line data={revenueData} options={chartOptions} />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Revenue Distribution</CardTitle>
                                <CardDescription>By service type</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <Doughnut data={invoiceData} options={chartOptions} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Doctor Performance Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Doctor Performance Metrics</CardTitle>
                            <CardDescription>Revenue generated and patients treated by each doctor</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px]">
                                <Bar 
                                    data={doctorPerformanceData} 
                                    options={{
                                        ...chartOptions,
                                        scales: {
                                            y: {
                                                position: 'left',
                                                title: {
                                                    display: true,
                                                    text: 'Revenue (₹)'
                                                }
                                            },
                                            y1: {
                                                position: 'right',
                                                title: {
                                                    display: true,
                                                    text: 'Patients'
                                                },
                                                grid: {
                                                    drawOnChartArea: false
                                                }
                                            }
                                        }
                                    }} 
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Monthly Invoices Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Invoices</CardTitle>
                            <CardDescription>Number of invoices generated per month</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <Bar data={monthlyInvoiceData} options={chartOptions} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
    );
} 