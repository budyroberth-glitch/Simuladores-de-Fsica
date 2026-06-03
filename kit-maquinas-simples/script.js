// Gestión de pestañas
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-button');

    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabName).classList.add('active');
    
    // Encontrar el botón correspondiente
    document.querySelectorAll('.tab-button').forEach(btn => {
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        }
    });
}

// Agregar event listeners a los botones de pestaña
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        switchTab(tabName);
    });
});

// ============================================
// SIMULADOR DE PALANCA
// ============================================
const leverCanvas = document.getElementById('leverCanvas');
if (leverCanvas) {
    const ctx = leverCanvas.getContext('2d');

    const weightLeftInput = document.getElementById('weight-left');
    const weightRightInput = document.getElementById('weight-right');
    const distanceLeftInput = document.getElementById('distance-left');
    const distanceRightInput = document.getElementById('distance-right');
    const resetBtnPalanca = document.getElementById('reset-btn-palanca');

    function updateDisplayLever() {
        const weightLeft = parseInt(weightLeftInput.value);
        const weightRight = parseInt(weightRightInput.value);
        const distanceLeft = parseInt(distanceLeftInput.value);
        const distanceRight = parseInt(distanceRightInput.value);

        document.getElementById('display-left').textContent = weightLeft + 'g';
        document.getElementById('display-right').textContent = weightRight + 'g';
        document.getElementById('display-dist-left').textContent = distanceLeft + 'cm';
        document.getElementById('display-dist-right').textContent = distanceRight + 'cm';

        const momentLeft = weightLeft * distanceLeft;
        const momentRight = weightRight * distanceRight;

        document.getElementById('moment-left').textContent = momentLeft + ' g·cm';
        document.getElementById('moment-right').textContent = momentRight + ' g·cm';

        const difference = Math.abs(momentLeft - momentRight);
        document.getElementById('difference').textContent = difference + ' g·cm';

        let status = '⚖️ Equilibrado';
        let statusColor = '#28a745';

        if (momentLeft > momentRight) {
            status = '⬅️ Se inclina a la izquierda';
            statusColor = '#ffc107';
        } else if (momentRight > momentLeft) {
            status = '➡️ Se inclina a la derecha';
            statusColor = '#ffc107';
        }

        const statusElement = document.getElementById('status');
        statusElement.textContent = status;
        statusElement.parentElement.style.borderColor = statusColor;

        drawLever(weightLeft, weightRight, distanceLeft, distanceRight, momentLeft, momentRight);
    }

    function drawLever(wL, wR, dL, dR, mL, mR) {
        ctx.fillStyle = '#f9f9f9';
        ctx.fillRect(0, 0, leverCanvas.width, leverCanvas.height);

        const centerX = leverCanvas.width / 2;
        const centerY = leverCanvas.height / 2;
        const scaleX = 5;
        const ruleHeight = 30;

        // Base
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + 200, 80, 25, 0, 0, Math.PI * 2);
        ctx.fill();

        // Varilla
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + 200);
        ctx.lineTo(centerX, centerY - 100);
        ctx.stroke();

        // Regla
        const ruleLength = 74 * scaleX;
        const ruleLeft = centerX - ruleLength / 2;
        const ruleRight = centerX + ruleLength / 2;

        ctx.fillStyle = '#e8e8e8';
        ctx.fillRect(ruleLeft, centerY - 100 - ruleHeight / 2, ruleLength, ruleHeight);

        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.font = '10px Arial';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';

        for (let i = 0; i <= 74; i += 5) {
            const x = ruleLeft + i * scaleX;
            const tickHeight = i % 10 === 0 ? 10 : 5;
            ctx.beginPath();
            ctx.moveTo(x, centerY - 100 - ruleHeight / 2);
            ctx.lineTo(x, centerY - 100 - ruleHeight / 2 - tickHeight);
            ctx.stroke();

            if (i % 10 === 0) {
                ctx.fillText(i, x, centerY - 100 - ruleHeight / 2 - 20);
            }
        }

        ctx.strokeStyle = '#999';
        ctx.lineWidth = 2;
        ctx.strokeRect(ruleLeft, centerY - 100 - ruleHeight / 2, ruleLength, ruleHeight);

        // Sujetadores
        const sujetadorColor = '#d32f2f';
        ctx.fillStyle = sujetadorColor;
        ctx.beginPath();
        ctx.arc(ruleLeft, centerY - 100, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = sujetadorColor;
        ctx.beginPath();
        ctx.arc(ruleRight, centerY - 100, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#d32f2f';
        ctx.beginPath();
        ctx.rect(centerX - 15, centerY - 100 - 20, 30, 40);
        ctx.fill();

        // Pesas
        const weightsColor1 = '#d32f2f';
        const weightsColor2 = '#1976d2';

        const posLeftX = centerX - dL * scaleX;
        drawWeight(posLeftX, centerY - 100 - ruleHeight / 2 - 80, wL, weightsColor1);

        const posRightX = centerX + dR * scaleX;
        drawWeight(posRightX, centerY - 100 - ruleHeight / 2 - 80, wR, weightsColor2);

        ctx.strokeStyle = '#999';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 100);
        ctx.lineTo(posLeftX, centerY - 100);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 100);
        ctx.lineTo(posRightX, centerY - 100);
        ctx.stroke();

        ctx.setLineDash([]);

        // Aguja
        const angle = (mL - mR) / (mL + mR + 1) * 0.3;
        ctx.save();
        ctx.translate(centerX, centerY - 100 - 15);
        ctx.rotate(angle);

        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-5, -40);
        ctx.lineTo(5, -40);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        ctx.fillStyle = '#333';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';

        ctx.fillText(`Momento Izq: ${mL} g·cm`, posLeftX, centerY - 100 - ruleHeight / 2 - 140);
        ctx.fillText(`Momento Der: ${mR} g·cm`, posRightX, centerY - 100 - ruleHeight / 2 - 140);
    }

    function drawWeight(x, y, weight, color) {
        const size = Math.sqrt(weight) * 1.5;

        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + 30);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.fillRect(x - size / 2, y + 30, size, size);

        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - size / 2, y + 30, size, size);

        ctx.fillStyle = '#333';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(weight + 'g', x, y + 30 + size / 2 + 5);
    }

    weightLeftInput.addEventListener('input', updateDisplayLever);
    weightRightInput.addEventListener('input', updateDisplayLever);
    distanceLeftInput.addEventListener('input', updateDisplayLever);
    distanceRightInput.addEventListener('input', updateDisplayLever);

    resetBtnPalanca.addEventListener('click', () => {
        weightLeftInput.value = 100;
        weightRightInput.value = 100;
        distanceLeftInput.value = 25;
        distanceRightInput.value = 25;
        updateDisplayLever();
    });

    updateDisplayLever();
}

// ============================================
// SIMULADOR DE POLEA
// ============================================
const pulleyCanvas = document.getElementById('pulleyCanvas');
if (pulleyCanvas) {
    const ctx = pulleyCanvas.getContext('2d');

    const pulleyTypeInput = document.getElementById('pulley-type');
    const loadWeightInput = document.getElementById('load-weight');
    const appliedForceInput = document.getElementById('applied-force');
    const ropePullInput = document.getElementById('rope-pull');
    const resetBtnPolea = document.getElementById('reset-btn-polea');

    function updateDisplayPolea() {
        const pulleyType = pulleyTypeInput.value;
        const loadWeight = parseInt(loadWeightInput.value);
        const appliedForce = parseInt(appliedForceInput.value);
        const ropePull = parseInt(ropePullInput.value);

        document.getElementById('display-load').textContent = loadWeight + 'g';
        document.getElementById('display-force').textContent = appliedForce + 'g';
        document.getElementById('display-rope').textContent = ropePull + ' cm';

        // Calcular ventaja mecánica
        let mechanicalAdvantage = 1;
        let ropeSegments = 1;

        if (pulleyType === 'mobile') {
            mechanicalAdvantage = 2;
            ropeSegments = 2;
        } else if (pulleyType === 'compound') {
            mechanicalAdvantage = 4;
            ropeSegments = 4;
        }

        const forceNeeded = Math.ceil(loadWeight / mechanicalAdvantage);
        const heightLifted = (ropePull / ropeSegments);

        document.getElementById('mechanical-advantage').textContent = mechanicalAdvantage.toFixed(1);
        document.getElementById('force-needed').textContent = forceNeeded + 'g';
        document.getElementById('height-lifted').textContent = heightLifted.toFixed(1) + ' cm';

        let status = '✅ Sistema balanceado';
        let statusColor = '#28a745';

        if (appliedForce < forceNeeded) {
            status = '❌ Fuerza insuficiente';
            statusColor = '#d32f2f';
        } else if (appliedForce > forceNeeded * 1.2) {
            status = '⚠️ Fuerza excesiva';
            statusColor = '#ff9800';
        }

        const statusElement = document.getElementById('pulley-status');
        statusElement.textContent = status;
        statusElement.parentElement.style.borderColor = statusColor;

        drawPulley(pulleyType, loadWeight, appliedForce, ropePull, mechanicalAdvantage);
    }

    function drawPulley(type, load, force, rope, advantage) {
        ctx.fillStyle = '#f9f9f9';
        ctx.fillRect(0, 0, pulleyCanvas.width, pulleyCanvas.height);

        const centerX = pulleyCanvas.width / 2;
        const topY = 80;
        const pulleyRadius = 30;

        // Marco superior
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        ctx.strokeRect(centerX - 200, 20, 400, 50);
        ctx.fillStyle = '#ddd';
        ctx.fillRect(centerX - 200, 20, 400, 50);

        if (type === 'fixed') {
            drawFixedPulley(centerX, topY, pulleyRadius, load, rope);
        } else if (type === 'mobile') {
            drawMobilePulley(centerX, topY, pulleyRadius, load, rope);
        } else if (type === 'compound') {
            drawCompoundPulley(centerX, topY, pulleyRadius, load, rope);
        }

        // Información adicional
        ctx.fillStyle = '#333';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Carga: ${load}g | Fuerza: ${force}g | Ventaja Mecánica: ${advantage}x`, centerX, pulleyCanvas.height - 20);
    }

    function drawFixedPulley(x, y, r, load, rope) {
        // Polea fija
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Centro
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Cuerda izquierda
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - r, y);
        ctx.lineTo(x - r - 100, y + 150);
        ctx.stroke();

        // Cuerda derecha (salida)
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + r + 50, y - 150 + rope);
        ctx.stroke();

        // Carga
        ctx.fillStyle = '#d32f2f';
        ctx.fillRect(x - r - 120, y + 130, 40, 50);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - r - 120, y + 130, 40, 50);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(load + 'g', x - r - 100, y + 165);

        // Punto de aplicación
        ctx.fillStyle = '#1976d2';
        ctx.beginPath();
        ctx.arc(x + r + 50, y - 150 + rope, 8, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawMobilePulley(x, y, r, load, rope) {
        // Polea fija (superior)
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x - 80, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Centro
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(x - 80, y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Polea móvil
        const mobilePulleyY = y + 200 + rope;
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x, mobilePulleyY, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(x, mobilePulleyY, 5, 0, Math.PI * 2);
        ctx.fill();

        // Cuerdas
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;

        // Cuerda fija a la polea móvil
        ctx.beginPath();
        ctx.moveTo(x - 80 - r, y);
        ctx.lineTo(x - r, mobilePulleyY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x - 80 + r, y);
        ctx.lineTo(x + r, mobilePulleyY);
        ctx.stroke();

        // Cuerda de entrada
        ctx.strokeStyle = '#8B4513';
        ctx.beginPath();
        ctx.moveTo(x - 80 - r, y);
        ctx.lineTo(x - 80 - r - 50, y - 150 + rope);
        ctx.stroke();

        // Carga
        ctx.fillStyle = '#d32f2f';
        ctx.fillRect(x - 20, mobilePulleyY + 40, 40, 50);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 20, mobilePulleyY + 40, 40, 50);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(load + 'g', x, mobilePulleyY + 75);

        // Punto de aplicación
        ctx.fillStyle = '#1976d2';
        ctx.beginPath();
        ctx.arc(x - 80 - r - 50, y - 150 + rope, 8, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawCompoundPulley(x, y, r, load, rope) {
        // Bloque de poleas superior
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(x - 60, y - 20, 120, 100);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 60, y - 20, 120, 100);

        // Poleas fijas
        for (let i = 0; i < 2; i++) {
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(x - 30 + i * 60, y + 20, r - 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Bloque de poleas móvil
        const mobileBlockY = y + 250 + rope;
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(x - 60, mobileBlockY - 20, 120, 100);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 60, mobileBlockY - 20, 120, 100);

        // Poleas móviles
        for (let i = 0; i < 2; i++) {
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(x - 30 + i * 60, mobileBlockY + 20, r - 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Cuerdas (simplificadas)
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;

        for (let i = 0; i < 2; i++) {
            ctx.beginPath();
            ctx.moveTo(x - 30 + i * 60, y + 30);
            ctx.lineTo(x - 30 + i * 60, mobileBlockY - 30);
            ctx.stroke();
        }

        // Cuerda de entrada
        ctx.beginPath();
        ctx.moveTo(x - 90, y);
        ctx.lineTo(x - 140, y - 150 + rope);
        ctx.stroke();

        // Carga
        ctx.fillStyle = '#d32f2f';
        ctx.fillRect(x - 20, mobileBlockY + 100, 40, 50);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 20, mobileBlockY + 100, 40, 50);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(load + 'g', x, mobileBlockY + 135);

        // Punto de aplicación
        ctx.fillStyle = '#1976d2';
        ctx.beginPath();
        ctx.arc(x - 140, y - 150 + rope, 8, 0, Math.PI * 2);
        ctx.fill();
    }

    pulleyTypeInput.addEventListener('change', updateDisplayPolea);
    loadWeightInput.addEventListener('input', updateDisplayPolea);
    appliedForceInput.addEventListener('input', updateDisplayPolea);
    ropePullInput.addEventListener('input', updateDisplayPolea);

    resetBtnPolea.addEventListener('click', () => {
        pulleyTypeInput.value = 'fixed';
        loadWeightInput.value = 200;
        appliedForceInput.value = 200;
        ropePullInput.value = 0;
        updateDisplayPolea();
    });

    updateDisplayPolea();
}