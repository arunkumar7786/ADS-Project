document.addEventListener('DOMContentLoaded', () => {
    // --- UI & Chart Logic ---
    const searchBtn = document.getElementById('searchBtn');
    const skillInput = document.getElementById('skillInput');
    const loader = document.getElementById('loader');
    const topSkillsSection = document.getElementById('topSkills');
    const resultsSection = document.getElementById('results');
    
    // AI data display areas
    const demandList = document.getElementById('demandList');
    const relatedSkillsList = document.getElementById('relatedSkillsList');
    const resourcesList = document.getElementById('resourcesList');
    // NEW: Select the YouTube container
    const youtubeList = document.getElementById('youtubeList'); 

    let topSkillsChart = null;

    // --- Chart variables for car hover logic ---
    let cooccurrenceChart = null; 
    let locationChart = null; 
    let demandChart = null;
    let skillsChart = null;

    const chartBaseConfig = {
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1e293b',
                    titleFont: { size: 16, weight: 'bold' },
                    bodyFont: { size: 14 },
                    padding: 12,
                    cornerRadius: 6,
                    displayColors: false,
                },
            },
            scales: {
                x: {
                    ticks: { color: '#ffffffff', font: { family: "'Inter', sans-serif", size: 12 }},
                    grid: { display: false },
                    border: { color: '#e2e8f0' },
                },
                y: {
                    beginAtZero: true,
                    ticks: { color: '#ffffffff', font: { family: "'Inter', sans-serif", size: 12 }},
                    grid: { color: '#f1f5f9' },
                    border: { display: false },
                },
            },
        },
    };

    const analyzeSkill = async () => {
        if (searchBtn.disabled) return;
        const skill = skillInput.value.trim().toLowerCase();
        if (!skill) {
            showError("Please enter a skill to analyze.");
            return;
        }

        // --- Start UI loading state ---
        searchBtn.textContent = 'Analyzing...';
        searchBtn.disabled = true;
        hideError();
        topSkillsSection.style.display = 'none'; // Hide top skills chart
        resultsSection.classList.add('hidden'); // Hide old results
        loader.classList.remove('hidden'); // Show loader

        try {
            const response = await fetch(`http://localhost:3000/api/skill/${skill}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();

            // --- Populate UI with AI data (TEXT-BASED) ---
            
            // 1. Populate High-Demand Areas List
            demandList.innerHTML = ''; 
            if (data.high_demand_areas && data.high_demand_areas.length > 0) {
                data.high_demand_areas.forEach(area => {
                    const li = document.createElement('li');
                    li.textContent = area;
                    li.className = "text-slate-700 dark:text-slate-300";
                    demandList.appendChild(li);
                });
            } else {
                demandList.innerHTML = '<p>No high-demand areas found.</p>';
            }

            // 2. Populate Related Skills List
            relatedSkillsList.innerHTML = ''; 
            if (data.related_skills && data.related_skills.length > 0) {
                data.related_skills.forEach(skill => {
                    const card = document.createElement('div');
                    card.className = 'bg-slate-100 dark:bg-slate-700 p-4 rounded-lg shadow';
                    card.innerHTML = `
                        <h4 class="font-bold text-lg text-indigo-600 dark:text-indigo-400">${skill.name}</h4>
                        <p class="text-slate-600 dark:text-slate-400">${skill.reason}</p>
                    `;
                    relatedSkillsList.appendChild(card);
                });
            } else {
                relatedSkillsList.innerHTML = '<p>No related skills found.</p>';
            }

            // 3. Populate Learning Resources
            resourcesList.innerHTML = ''; 
            if (data.learning_resources && data.learning_resources.length > 0) {
                data.learning_resources.forEach(resource => {
                    const card = document.createElement('div');
                    // Dark card style
                    card.className = 'bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-sm hover:border-indigo-500 transition-all flex flex-col h-full';
                    
                    card.innerHTML = `
                        <a href="${resource.url}" target="_blank" class="font-bold text-lg text-indigo-400 hover:text-indigo-300 hover:underline mb-2">
                            ${resource.name}
                        </a>
                        <p class="text-slate-400 text-sm leading-relaxed">
                            Type: <span class="text-slate-300">${resource.type}</span>
                        </p>
                    `;
                    resourcesList.appendChild(card);
                });
            } else {
                resourcesList.innerHTML = '<p class="text-slate-400 col-span-2">No learning resources found.</p>';
            }

            // 4. Populate YouTube Videos 
            if (youtubeList) { 
                youtubeList.innerHTML = ''; 
                if (data.youtube_videos && data.youtube_videos.length > 0) {
                    data.youtube_videos.forEach(video => {
                        // Create Search Link
                        const searchQuery = encodeURIComponent(`${video.title} ${video.channelName}`);
                        const searchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;

                        const card = document.createElement('div');
                        // Dark card style - identical to above
                        card.className = 'bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-sm hover:border-indigo-500 transition-all flex flex-col h-full justify-between';
                        
                        card.innerHTML = `
                            <div>
                                <h4 class="font-bold text-lg text-indigo-400 mb-2 leading-tight">
                                    ${video.title}
                                </h4>
                                <p class="text-slate-400 text-sm mb-4">
                                    Channel: <span class="text-slate-300">${video.channelName}</span>
                                </p>
                            </div>
                            
                            <a href="${searchUrl}" target="_blank" class="inline-flex items-center text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors mt-auto">
                                <span class="mr-2">▶</span> Watch on YouTube
                            </a>
                        `;
                        youtubeList.appendChild(card);
                    });
                } else {
                    youtubeList.innerHTML = '<p class="text-slate-400 col-span-2">No videos found.</p>';
                }
            }

            // Show results
            resultsSection.classList.remove('hidden');
            resultsSection.classList.add('fade-in');

        } catch (error) {
            console.error("Analysis Error:", error);
            showError(error.message || 'Could not fetch data. Please try again.');
            topSkillsSection.style.display = 'block'; // Show top skills again on error
        } finally {
            // --- End UI loading state ---
            loader.classList.add('hidden'); // Hide loader
            setTimeout(() => {
                searchBtn.textContent = 'Analyze';
                searchBtn.disabled = false;
            }, 1000);
        }
    };

    // --- Removed chart rendering functions for AI data ---

    const renderTopSkillsChart = (topSkillsData) => {
        const ctx = document.getElementById('topSkillsChart').getContext('2d');
        if (topSkillsChart) topSkillsChart.destroy();
        let topSkillsOptions = JSON.parse(JSON.stringify(chartBaseConfig.options));
        topSkillsOptions.indexAxis = 'y';
        topSkillsOptions.scales.y.ticks.font.size = 14;
        topSkillsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: topSkillsData.labels,
                datasets: [{
                    label: 'Number of Mentions',
                    data: topSkillsData.data,
                    backgroundColor: '#818cf8',
                    borderRadius: 6,
                }]
            },
            options: topSkillsOptions,
        });
    };

    const showError = (message) => {
        const errorAlert = document.getElementById('errorAlert');
        document.getElementById('errorMessage').textContent = message;
        errorAlert.classList.remove('hidden');
    };

    const hideError = () => {
        const errorAlert = document.getElementById('errorAlert');
        errorAlert.classList.add('hidden');
    };

    searchBtn.addEventListener('click', analyzeSkill);
    skillInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') analyzeSkill();
    });

    const topSkillsData = {
        labels: ["Python", "JavaScript", "SQL", "Java", "React", "AWS", "Node.js", "TypeScript", "Go", "CSS"],
        data: [1250, 1100, 1050, 900, 850, 800, 700, 600, 500, 450]
    };
    renderTopSkillsChart(topSkillsData);

    // --- 2D Toy Car Game Logic ---
    const gameCanvas = document.getElementById('gameCanvas');
    const ctx = gameCanvas.getContext('2d');
    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        gameCanvas.width = window.innerWidth;
        gameCanvas.height = window.innerHeight;
    });

    const car = {
        x: 100,
        y: window.innerHeight - 100,
        width: 40,
        height: 20,
        color: '#4f46e5',
        speed: 0,
        acceleration: 0.2,
        maxSpeed: 4,
        friction: 0.1,
        angle: 0,
        rotationSpeed: 0.03,
    };

    const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
    let isCarOverAnalyzeButton = false;

    function drawCar() {
        ctx.save();
        ctx.translate(car.x, car.y);
        ctx.rotate(car.angle);
        ctx.fillStyle = car.color;
        ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height);
        ctx.fillStyle = '#334155';
        ctx.fillRect(-car.width / 2 + 5, -car.height / 2 - 3, 8, 3);
        ctx.fillRect(car.width / 2 - 13, -car.height / 2 - 3, 8, 3);
        ctx.fillRect(-car.width / 2 + 5, car.height / 2, 8, 3);
        ctx.fillRect(car.width / 2 - 13, car.height / 2, 8, 3);
        ctx.restore();
    }

    function updateCarPosition() {
        if (keys.ArrowLeft) car.angle -= car.rotationSpeed;
        if (keys.ArrowRight) car.angle += car.rotationSpeed;
        if (keys.ArrowUp) car.speed += car.acceleration;
        if (keys.ArrowDown) car.speed -= car.acceleration;
        if (car.speed > car.maxSpeed) car.speed = car.maxSpeed;
        if (car.speed < -car.maxSpeed / 2) car.speed = -car.maxSpeed / 2;
        if (car.speed > 0) car.speed -= car.friction;
        if (car.speed < 0) car.speed += car.friction;
        if (Math.abs(car.speed) < car.friction) car.speed = 0;

        const moveX = Math.cos(car.angle) * car.speed;
        const moveY = Math.sin(car.angle) * car.speed;
        const newX = car.x + moveX;
        const newY = car.y + moveY;
        if (newX > 0 && newX < gameCanvas.width) car.x = newX;
        if (newY > 0 && newY < gameCanvas.height) car.y = newY;
    }

    function checkCollision(point, rect) {
        return (point.x > rect.left && point.x < rect.right && point.y > rect.top && point.y < rect.bottom);
    }

    const chartHoverState = {};

    function handleChartHover(chart, chartId, carPoint) {
        if (!chart || !chart.canvas || chart.canvas.offsetParent === null) {
            return;
        }
        const canvasRect = chart.canvas.getBoundingClientRect();
        if (checkCollision(carPoint, canvasRect)) {
            const x = carPoint.x - canvasRect.left;
            const y = carPoint.y - canvasRect.top;
            const elements = chart.getElementsAtEventForMode({ offsetX: x, offsetY: y }, 'nearest', { intersect: true }, false);
            if (elements.length > 0) {
                const activeElement = [{ datasetIndex: elements[0].datasetIndex, index: elements[0].index }];
                chart.setActiveElements(activeElement);
                chart.tooltip.setActiveElements(activeElement);
                chart.update();
                chartHoverState[chartId] = true;
            } else {
                if (chartHoverState[chartId]) {
                    chart.setActiveElements([]);
                    chart.tooltip.setActiveElements([]);
                    chart.update();
                    chartHoverState[chartId] = false;
                }
            }
        } else {
            if (chartHoverState[chartId]) {
                chart.setActiveElements([]);
                chart.tooltip.setActiveElements([]);
                chart.update();
                chartHoverState[chartId] = false;
            }
        }
    }

    function gameLoop() {
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        updateCarPosition();
        drawCar();

        const inputTargetRect = skillInput.getBoundingClientRect();
        const buttonTargetRect = searchBtn.getBoundingClientRect();
        const carPoint = { x: car.x, y: car.y };

        if (checkCollision(carPoint, inputTargetRect)) {
            if (document.activeElement !== skillInput) skillInput.focus();
        }

        if (checkCollision(carPoint, buttonTargetRect)) {
            isCarOverAnalyzeButton = true;
            searchBtn.classList.add('bg-indigo-700');
        } else {
            isCarOverAnalyzeButton = false;
            searchBtn.classList.remove('bg-indigo-700');
        }
        
        // --- Trigger chart hover logic ---
        handleChartHover(topSkillsChart, 'topSkills', carPoint);
        // This logic remains, but demandChart and skillsChart will be null
        handleChartHover(demandChart, 'demand', carPoint);
        handleChartHover(skillsChart, 'skills', carPoint);
        
        requestAnimationFrame(gameLoop);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key in keys) {
            e.preventDefault();
            keys[e.key] = true;
        }
        if ((e.key === ' ' || e.key === 'Enter') && isCarOverAnalyzeButton) {
            e.preventDefault();
            analyzeSkill();
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key in keys) {
            e.preventDefault();
            keys[e.key] = false;
        }
    });

    gameLoop();
});