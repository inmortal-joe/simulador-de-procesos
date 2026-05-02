const clock = document.getElementById("clock");

let time = 0;
const ready = document.getElementById("ready");
const cpu = document.getElementById("cpu");
const finished = document.getElementById("finished");
const gantt = document.getElementById("gantt");
const waitingTimeLabel = document.getElementById("waiting-time");
const turnaroundLabel = document.getElementById("turnaround-time");
const cpuUtilizationLabel = document.getElementById("cpu-utilization");

let simulationHistory = [];
let totalWaiting = 0;
let totalTurnaround = 0;
let completedProcesses = 0;

let processes = [
    { id: "Proceso 1", burst: 4 },
    { id: "Proceso 2", burst: 2 },
    { id: "Proceso 3", burst: 6 },
    { id: "Proceso 4", burst: 3 }
];

let originalProcesses = [];
originalProcesses = JSON.parse(JSON.stringify(processes));


function createProcessBox(process, remaining = null, state = "ready") {

    const div = document.createElement("div");

    div.classList.add("process");
    div.classList.add(state);

    let text = `
        <strong>${process.id}</strong><br>
        Burst: ${process.burst}
    `;

    if (remaining !== null) {
        text += `<br>Restante: ${remaining}`;
    }

    div.innerHTML = text;

    return div;
}

function loadReadyQueue() {

    ready.innerHTML = "";

    processes.forEach(p => {
        ready.appendChild(createProcessBox(p, null, "ready"));
    });
}

function simulateFCFS() {

    if (processes.length === 0) {
        return;
    }

    const currentProcess = processes.shift();

    loadReadyQueue();

    cpu.innerHTML = "";

    let remaining = currentProcess.burst;

const cpuProcess = createProcessBox(currentProcess, remaining);

    cpu.appendChild(cpuProcess);

    const countdown = setInterval(() => {

    remaining--;

    cpu.innerHTML = "";

    cpu.appendChild(createProcessBox(currentProcess, remaining, "running"));
    addToGantt(currentProcess.id);

}, 1000);

    setTimeout(() => {

        clearInterval(countdown);
        cpu.innerHTML = "";

        finished.appendChild(createProcessBox(currentProcess, null, "finished"));
        updateMetrics(currentProcess);

        simulateFCFS();

    }, currentProcess.burst * 1000);
}


setInterval(() => {

    time++;

    clock.innerText = "Tiempo: " + time;

}, 1000);

function startSimulation() {

    resetSimulation();

    const algorithm = document.getElementById("algorithm").value;

    if (algorithm === "fcfs") {
        simulateFCFS();
    }

    if (algorithm === "rr") {
        simulateRR();
    }
        if (algorithm === "sjf") {
        simulateSJF();
    }

}

function resetSimulation() {

    processes = JSON.parse(JSON.stringify(originalProcesses));
    

    ready.innerHTML = "";
    cpu.innerHTML = "";
    finished.innerHTML = "";
    gantt.innerHTML = "";
    totalWaiting = 0;
totalTurnaround = 0;
completedProcesses = 0;
console.log("Historial simulación:", simulationHistory);
    loadReadyQueue();
}

function simulateRR() {

    if (processes.length === 0) {
        return;
    }

    const quantum = parseInt(document.getElementById("quantum").value);

    const currentProcess = processes.shift();

    let executeTime = Math.min(currentProcess.burst, quantum);

    cpu.innerHTML = "";

    cpu.appendChild(createProcessBox(currentProcess, currentProcess.burst, "running"));
    addToGantt(currentProcess.id);

    setTimeout(() => {

        currentProcess.burst -= executeTime;

        cpu.innerHTML = "";

        if (currentProcess.burst > 0) {

            processes.push(currentProcess);

        } else {

            finished.appendChild(createProcessBox(currentProcess, null, "finished"));
            updateMetrics(currentProcess);

        }

        loadReadyQueue();

        simulateRR();

    }, executeTime * 1000);
}

function simulateSJF() {

    if (processes.length === 0) {
        return;
    }

    processes.sort((a, b) => a.burst - b.burst);

    const currentProcess = processes.shift();

    loadReadyQueue();

    cpu.innerHTML = "";

    let remaining = currentProcess.burst;

    cpu.appendChild(createProcessBox(currentProcess, remaining, "running"));
    addToGantt(currentProcess.id);

    const countdown = setInterval(() => {

        remaining--;

        cpu.innerHTML = "";

         cpu.appendChild(createProcessBox(currentProcess, remaining, "running"));

    }, 1000);

    setTimeout(() => {

        clearInterval(countdown);

        cpu.innerHTML = "";

        finished.appendChild(createProcessBox(currentProcess, null, "finished"));
        updateMetrics(currentProcess);

        simulateSJF();

    }, currentProcess.burst * 1000);
}

function addToGantt(processId) {

    const block = document.createElement("div");

    block.classList.add("gantt-block");

    block.innerText = processId;

    gantt.appendChild(block);
}

function updateMetrics(process) {

    completedProcesses++;

    totalTurnaround += process.burst;

    totalWaiting += time - process.burst;

    let avgWaiting = Math.round(totalWaiting / completedProcesses);

    let avgTurnaround = Math.round(totalTurnaround / completedProcesses);

    let cpuUtil = Math.round((completedProcesses / time) * 100);

    waitingTimeLabel.innerText = avgWaiting;

    turnaroundLabel.innerText = avgTurnaround;

    cpuUtilizationLabel.innerText = cpuUtil;
    simulationHistory.push({
    process: process.id,
    burst: process.burst,
    time: time
});
}







