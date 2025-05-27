// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD-fcO0tloAkj5hNZD1zUW0gYBb2rg5y0U",
    databaseURL: "https://dht11-e87c0-default-rtdb.firebaseio.com",
    projectId: "dht11-e87c0",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Chart initialization
// Remove this old chart initialization:
// const ctx = document.getElementById('sensorChart').getContext('2d');
// const sensorChart = new Chart(ctx, {...});

// Replace with these three separate charts:
const tempCtx = document.getElementById('temperatureChart').getContext('2d');
const humCtx = document.getElementById('humidityChart').getContext('2d');
const soilCtx = document.getElementById('soilMoistureChart').getContext('2d');

const temperatureChart = new Chart(tempCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Temperature (°C)',
            data: [],
            borderColor: '#FF6384',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

const humidityChart = new Chart(humCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Humidity (%)',
            data: [],
            borderColor: '#36A2EB',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

const soilMoistureChart = new Chart(soilCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Soil Moisture (%)',
            data: [],
            borderColor: '#4BC0C0',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            }
        }
    }
});


// Firebase data listener
database.ref('plant').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        // Update dashboard values
        document.getElementById('temperature').textContent = data.temperature ? data.temperature.toFixed(1) : '--';
        document.getElementById('humidity').textContent = data.humidity ? data.humidity.toFixed(1) : '--';
        document.getElementById('rainfall').textContent = data.rainfall || '--';
        document.getElementById('soilMoisture').textContent = data.soilMoisturePercent || '--';

        // Update status indicators
        updateStatus('temperature', data.temperature, 15, 30);
        updateStatus('humidity', data.humidity, 40, 80);
        updateStatus('soilMoisture', data.soilMoisturePercent, 30, 70);

        // Update charts
        const now = new Date();
        const timeLabel = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
        
        // Helper function to update charts
        function updateChart(chart, value) {
            chart.data.labels.push(timeLabel);
            if (chart.data.labels.length > 15) {
                chart.data.labels.shift();
            }
            
            chart.data.datasets[0].data.push(value);
            if (chart.data.datasets[0].data.length > 15) {
                chart.data.datasets[0].data.shift();
            }
            
            chart.update();
        }

        // Update temperature chart
        if (data.temperature) {
            updateChart(temperatureChart, data.temperature);
        }

        // Update humidity chart
        if (data.humidity) {
            updateChart(humidityChart, data.humidity);
        }

        // Update soil moisture chart
        if (data.soilMoisturePercent) {
            updateChart(soilMoistureChart, data.soilMoisturePercent);
        }
    }
});

// Update status indicator
function updateStatus(sensorId, value, min, max) {
    if (value === undefined) return;
    
    const statusElement = document.querySelector(`#${sensorId}`).parentElement.querySelector('.sensor-status');
    
    // Remove all status classes
    statusElement.classList.remove('status-good', 'status-warning', 'status-danger');
    
    // Determine status
    if (value < min * 0.8 || value > max * 1.2) {
        statusElement.classList.add('status-danger');
        statusElement.textContent = 'Critical';
    } else if (value < min || value > max) {
        statusElement.classList.add('status-warning');
        statusElement.textContent = 'Attention Needed';
    } else {
        statusElement.classList.add('status-good');
        statusElement.textContent = 'Optimal';
    }
}

// Scroll animations
function checkVisibility() {
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        const rect = step.getBoundingClientRect();
        const isVisible = (rect.top <= window.innerHeight * 0.8);
        if (isVisible) {
            step.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', checkVisibility);
window.addEventListener('load', checkVisibility);

// Form submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
});

// Mobile menu toggle
document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});