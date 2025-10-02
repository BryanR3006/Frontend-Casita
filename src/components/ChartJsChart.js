import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ChartJsChart = ({ data, type = 'line', title, color = '#2962FF' }) => {
    if (!data || data.length === 0) {
        return (
            <div style={{
                width: '100%',
                height: '250px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8f9fa',
                border: '1px dashed #ddd',
                borderRadius: '4px'
            }}>
                <span className="text-muted">No hay datos para mostrar</span>
            </div>
        );
    }

    const chartData = {
        labels: data.map(item => item.time || item.label || item.name),
        datasets: [
            {
                label: title,
                data: data.map(item => item.value || item.count || item.total),
                borderColor: color,
                backgroundColor: type === 'bar' ? color : `${color}20`,
                borderWidth: 2,
                fill: type === 'line',
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <div style={{ width: '100%', height: '250px' }}>
            {type === 'line' ? (
                <Line data={chartData} options={options} />
            ) : (
                <Bar data={chartData} options={options} />
            )}
        </div>
    );
};

export default ChartJsChart;