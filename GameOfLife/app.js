(() => {
  const MIN_GRID_SIZE = 5;
  const ROWS = Math.max(MIN_GRID_SIZE, 24);
  const COLS = Math.max(MIN_GRID_SIZE, 32);
  const TICK_MS = 180;
  const CELL_GAP = 3;
  const BOARD_PADDING = 28;

  const board = document.getElementById("board");
  const startButton = document.getElementById("start-button");
  const stopButton = document.getElementById("stop-button");
  const resetButton = document.getElementById("reset-button");
  const statusText = document.getElementById("status-text");
  const statusDot = document.getElementById("status-dot");
  const generationCount = document.getElementById("generation-count");

  let grid = [];
  let timerId = null;
  let generation = 0;

  function setStatus(label, isRunning) {
    statusText.textContent = label;
    statusDot.classList.toggle("status__dot--running", isRunning);
    startButton.disabled = isRunning;
    stopButton.disabled = !isRunning;
  }

  function randomGrid() {
    const nextGrid = make2darray(ROWS, COLS);
    fillrandom(nextGrid, ROWS, COLS);
    return nextGrid;
  }

  function advanceGrid(sourceGrid) {
    const originalPrompt = window.prompt;
    const originalFillRandom = window.fillrandom;
    const answers = [String(ROWS), String(COLS)];

    window.prompt = () => answers.shift();
    window.fillrandom = (arr, rows, cols) => {
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          arr[i][j] = sourceGrid[i][j];
        }
      }
    };

    try {
      return GameOfLife(sourceGrid);
    } finally {
      window.prompt = originalPrompt;
      window.fillrandom = originalFillRandom;
    }
  }

  function createCells() {
    const fragment = document.createDocumentFragment();

    board.style.setProperty("--cols", COLS);
    board.setAttribute("aria-rowcount", String(ROWS));
    board.setAttribute("aria-colcount", String(COLS));

    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "cell";
        cell.dataset.row = String(i);
        cell.dataset.col = String(j);
        cell.setAttribute("role", "gridcell");
        fragment.appendChild(cell);
      }
    }

    board.replaceChildren(fragment);
  }

  function fitBoard() {
    const wrap = board.parentElement;
    const availableWidth = wrap.clientWidth - BOARD_PADDING - CELL_GAP * (COLS - 1);
    const availableHeight = wrap.clientHeight - BOARD_PADDING - CELL_GAP * (ROWS - 1);
    const cellSize = Math.max(8, Math.floor(Math.min(availableWidth / COLS, availableHeight / ROWS)));

    board.style.setProperty("--cell-size", `${cellSize}px`);
  }

  function render() {
    const cells = board.children;
    let index = 0;

    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        const cell = cells[index++];
        const isAlive = grid[i][j] === 1;

        cell.classList.toggle("cell--alive", isAlive);
        cell.classList.toggle("cell--dead", !isAlive);
        cell.setAttribute("aria-label", `Row ${i + 1}, column ${j + 1}, ${isAlive ? "alive" : "dead"}`);
      }
    }

    generationCount.textContent = String(generation);
  }

  function step() {
    grid = advanceGrid(grid);
    generation += 1;
    render();
  }

  function stop() {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }

    if (statusText.textContent !== "Ready") {
      setStatus("Paused", false);
    }
  }

  function start() {
    if (timerId !== null) {
      return;
    }

    setStatus("Running", true);
    step();
    timerId = window.setInterval(step, TICK_MS);
  }

  function reset() {
    stop();
    grid = randomGrid();
    generation = 0;
    render();
    setStatus("Ready", false);
  }

  board.addEventListener("click", (event) => {
    const cell = event.target.closest(".cell");

    if (!cell) {
      return;
    }

    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);

    grid[row][col] = grid[row][col] === 1 ? 0 : 1;
    render();
  });

  startButton.addEventListener("click", start);
  stopButton.addEventListener("click", stop);
  resetButton.addEventListener("click", reset);
  window.addEventListener("resize", fitBoard);

  createCells();
  fitBoard();
  reset();
  window.requestAnimationFrame(fitBoard);
})();
