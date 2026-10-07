const root = document.documentElement;

const header = document.querySelector("#site-header");
const progressBar = document.querySelector("#scroll-progress-bar");

const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector("#theme-icon");

const menuButton = document.querySelector("#menu-button");
const menuIcon = document.querySelector("#menu-icon");
const navigation = document.querySelector("#main-navigation");
const navigationLinks = document.querySelectorAll(".main-navigation a");

const profilePhoto = document.querySelector("#profile-photo");
const photoFrame = document.querySelector("#photo-frame");

const hero = document.querySelector(".hero");
const heroGrid = document.querySelector("#hero-grid");

const revealElements = document.querySelectorAll(".reveal");
const glowSurfaces = document.querySelectorAll(".glow-surface");
const effectButtons = document.querySelectorAll(".fx-button");
const sections = document.querySelectorAll("main section[id]");

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);


/* ============================================================
   1. HELE / TUME REŽIIM
   ============================================================

   Leht alustab iga uue laadimise korral heledas režiimis.
   ============================================================ */

root.removeAttribute("data-theme");

function setTheme(theme) {
    const darkMode = theme === "dark";

    if (darkMode) {
        root.setAttribute("data-theme", "dark");
    } else {
        root.removeAttribute("data-theme");
    }

    if (themeToggle) {
        themeToggle.classList.toggle("is-dark", darkMode);

        themeToggle.setAttribute(
            "aria-label",
            darkMode
                ? "Lülita hele režiim sisse"
                : "Lülita tume režiim sisse"
        );
    }

    if (themeIcon) {
        themeIcon.textContent = darkMode
            ? "light_mode"
            : "dark_mode";
    }
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const darkMode =
            root.getAttribute("data-theme") === "dark";

        setTheme(darkMode ? "light" : "dark");
    });
}


/* ============================================================
   2. MOBIILIMENÜÜ
   ============================================================ */

function closeMenu() {
    if (!navigation || !menuButton || !menuIcon) {
        return;
    }

    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Ava menüü");
    menuIcon.textContent = "menu";

    document.body.classList.remove("menu-open");
}

function openMenu() {
    if (!navigation || !menuButton || !menuIcon) {
        return;
    }

    navigation.classList.add("is-open");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Sulge menüü");
    menuIcon.textContent = "close";

    document.body.classList.add("menu-open");
}

if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
        const isOpen =
            navigation.classList.contains("is-open");

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    navigationLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) {
            closeMenu();
        }
    });
}


/* ============================================================
   3. FOTO LAADIMINE
   ============================================================ */

if (profilePhoto && photoFrame) {
    const showPhoto = () => {
        profilePhoto.classList.add("is-loaded");
        photoFrame.classList.add("has-photo");
    };

    const hidePhoto = () => {
        profilePhoto.classList.remove("is-loaded");
        photoFrame.classList.remove("has-photo");
    };

    profilePhoto.addEventListener("load", showPhoto);
    profilePhoto.addEventListener("error", hidePhoto);

    if (
        profilePhoto.complete &&
        profilePhoto.naturalWidth > 0
    ) {
        showPhoto();
    }
}


/* ============================================================
   4. SCROLL PROGRESS + HEADER
   ============================================================ */

function updateScrollUI() {
    const scrollTop =
        window.scrollY ||
        document.documentElement.scrollTop;

    const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const progress =
        scrollHeight > 0
            ? (scrollTop / scrollHeight) * 100
            : 0;

    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }

    if (header) {
        header.classList.toggle(
            "is-scrolled",
            scrollTop > 10
        );
    }
}

window.addEventListener(
    "scroll",
    updateScrollUI,
    { passive: true }
);

updateScrollUI();


/* ============================================================
   5. SEKTSIOONIDE ILMUMISE EFEKT
   ============================================================ */

if (
    "IntersectionObserver" in window &&
    !reducedMotion.matches
) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -7% 0px"
        }
    );

    revealElements.forEach((element, index) => {
        element.style.transitionDelay =
            `${Math.min(index % 4, 3) * 55}ms`;

        revealObserver.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("is-visible");
    });
}


/* ============================================================
   6. MENÜÜ AKTIIVNE LINK
   ============================================================ */

if (
    "IntersectionObserver" in window &&
    sections.length > 0
) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            const visibleEntries = entries
                .filter((entry) => entry.isIntersecting)
                .sort(
                    (a, b) =>
                        b.intersectionRatio -
                        a.intersectionRatio
                );

            if (visibleEntries.length === 0) {
                return;
            }

            const activeId =
                visibleEntries[0].target.id;

            navigationLinks.forEach((link) => {
                const target =
                    link.getAttribute("href");

                link.classList.toggle(
                    "active",
                    target === `#${activeId}`
                );
            });
        },
        {
            rootMargin: "-28% 0px -55% 0px",
            threshold: [0.05, 0.2, 0.5]
        }
    );

    sections.forEach((section) => {
        sectionObserver.observe(section);
    });
}


/* ============================================================
   7. KAARTIDE / FOTO PEHME HIIRGUS
   ============================================================ */

glowSurfaces.forEach((surface) => {
    surface.addEventListener("pointermove", (event) => {
        const rect =
            surface.getBoundingClientRect();

        const x =
            event.clientX - rect.left;

        const y =
            event.clientY - rect.top;

        surface.style.setProperty(
            "--glow-x",
            `${x}px`
        );

        surface.style.setProperty(
            "--glow-y",
            `${y}px`
        );
    });
});


/* ============================================================
   8. NUPPUDE SPARK EFEKT
   ============================================================ */

function createSpark(x, y, angle, distance) {
    const spark = document.createElement("span");

    spark.className = "spark";

    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;

    spark.style.setProperty(
        "--spark-dx",
        `${Math.cos(angle) * distance}px`
    );

    spark.style.setProperty(
        "--spark-dy",
        `${Math.sin(angle) * distance}px`
    );

    document.body.appendChild(spark);

    spark.addEventListener(
        "animationend",
        () => spark.remove(),
        { once: true }
    );
}

effectButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        if (reducedMotion.matches) {
            return;
        }

        const x = event.clientX;
        const y = event.clientY;
        const amount = 8;

        for (let i = 0; i < amount; i += 1) {
            const angle =
                (Math.PI * 2 * i) / amount +
                (Math.random() * 0.22);

            const distance =
                28 + Math.random() * 32;

            createSpark(
                x,
                y,
                angle,
                distance
            );
        }
    });
});


/* ============================================================
   9. HERO RUUDUSTIK – VÄIKE PARALLAX
   ============================================================ */

if (
    hero &&
    heroGrid &&
    !reducedMotion.matches
) {
    hero.addEventListener("pointermove", (event) => {
        if (
            window.matchMedia("(pointer: coarse)").matches
        ) {
            heroGrid.style.transform = "none";
            return;
        }

        const rect =
            hero.getBoundingClientRect();

        const x =
            (event.clientX - rect.left) /
            rect.width -
            0.5;

        const y =
            (event.clientY - rect.top) /
            rect.height -
            0.5;

        heroGrid.style.transform =
            `translate(${x * -10}px, ${y * -10}px)`;
    });

    hero.addEventListener("pointerleave", () => {
        heroGrid.style.transform =
            "translate(0, 0)";
    });
}


/* ============================================================
   10. RETRO DX-BALL MINI-MÄNG
   ============================================================

   Juhtimine:
   - hiir canvasel;
   - puude / sõrmega liigutamine;
   - vasak ja parem nooleklahv.

   Iga purustatud klots = 100 punkti.
   40 klotsi = maksimaalselt 4000 punkti.
   ============================================================ */

const gameTrigger = document.querySelector("#game-trigger");
const gameModal = document.querySelector("#game-modal");
const gameClose = document.querySelector("#game-close");

const gameStartButton =
    document.querySelector("#game-start");

const gameMessage =
    document.querySelector("#game-message");

const gameMessageTitle =
    document.querySelector("#game-message-title");

const gameMessageText =
    document.querySelector("#game-message-text");

const gameScoreElement =
    document.querySelector("#game-score");

const gameMaxScoreElement =
    document.querySelector("#game-max-score");

const canvas =
    document.querySelector("#dxball-canvas");

const ctx =
    canvas
        ? canvas.getContext("2d")
        : null;


/* ---------- Mängu põhiseaded ---------- */

const GAME_WIDTH = 800;
const GAME_HEIGHT = 500;

const BRICK_ROWS = 5;
const BRICK_COLUMNS = 8;
const POINTS_PER_BRICK = 100;
const TOTAL_BRICKS =
    BRICK_ROWS * BRICK_COLUMNS;

const MAX_SCORE =
    TOTAL_BRICKS * POINTS_PER_BRICK;

if (gameMaxScoreElement) {
    gameMaxScoreElement.textContent =
        String(MAX_SCORE).padStart(4, "0");
}

let animationFrameId = null;
let gameRunning = false;
let gameWasStarted = false;
let score = 0;
let remainingBricks = TOTAL_BRICKS;

let moveLeft = false;
let moveRight = false;

const paddle = {
    width: 120,
    height: 14,
    x: (GAME_WIDTH - 120) / 2,
    y: GAME_HEIGHT - 38,
    speed: 8
};

const ball = {
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT - 60,
    radius: 7,
    dx: 4.6,
    dy: -4.6
};

let bricks = [];


/* ---------- Abifunktsioonid ---------- */

function clamp(value, min, max) {
    return Math.max(
        min,
        Math.min(max, value)
    );
}

function formatScore(value) {
    return String(value).padStart(4, "0");
}

function updateScore() {
    if (gameScoreElement) {
        gameScoreElement.textContent =
            formatScore(score);
    }
}

function createBricks() {
    bricks = [];

    const gap = 8;
    const sidePadding = 38;
    const topPadding = 62;

    const brickWidth =
        (
            GAME_WIDTH -
            sidePadding * 2 -
            gap * (BRICK_COLUMNS - 1)
        ) / BRICK_COLUMNS;

    const brickHeight = 26;

    for (
        let row = 0;
        row < BRICK_ROWS;
        row += 1
    ) {
        for (
            let column = 0;
            column < BRICK_COLUMNS;
            column += 1
        ) {
            bricks.push({
                x:
                    sidePadding +
                    column * (brickWidth + gap),

                y:
                    topPadding +
                    row * (brickHeight + gap),

                width: brickWidth,
                height: brickHeight,
                active: true,
                row
            });
        }
    }
}

function resetGameState() {
    score = 0;
    remainingBricks = TOTAL_BRICKS;

    paddle.x =
        (GAME_WIDTH - paddle.width) / 2;

    ball.x = GAME_WIDTH / 2;
    ball.y = GAME_HEIGHT - 60;

    /*
     * Iga uus mäng saab veidi erineva,
     * kuid kontrollitud algsuuna.
     */
    ball.dx =
        Math.random() > 0.5
            ? 4.6
            : -4.6;

    ball.dy = -4.6;

    moveLeft = false;
    moveRight = false;

    createBricks();
    updateScore();
    drawGame();
}


/* ---------- Joonistamine ---------- */

function drawBackground() {
    ctx.fillStyle = "#020817";
    ctx.fillRect(
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
    );

    /*
     * Retro ruudustik.
     */
    ctx.strokeStyle =
        "rgba(124, 231, 255, 0.08)";

    ctx.lineWidth = 1;

    for (let x = 0; x <= GAME_WIDTH; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, GAME_HEIGHT);
        ctx.stroke();
    }

    for (let y = 0; y <= GAME_HEIGHT; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(GAME_WIDTH, y);
        ctx.stroke();
    }
}

function drawBricks() {
    const colors = [
        "#7ce7ff",
        "#56b4ff",
        "#3387ff",
        "#0f62fe",
        "#0043ce"
    ];

    bricks.forEach((brick) => {
        if (!brick.active) {
            return;
        }

        ctx.fillStyle =
            colors[brick.row % colors.length];

        ctx.fillRect(
            brick.x,
            brick.y,
            brick.width,
            brick.height
        );

        ctx.fillStyle =
            "rgba(255, 255, 255, 0.30)";

        ctx.fillRect(
            brick.x + 3,
            brick.y + 3,
            brick.width - 6,
            3
        );

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;

        ctx.strokeRect(
            brick.x + 0.5,
            brick.y + 0.5,
            brick.width - 1,
            brick.height - 1
        );
    });
}

function drawPaddle() {
    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        paddle.x,
        paddle.y,
        paddle.width,
        paddle.height
    );

    ctx.fillStyle = "#7ce7ff";

    ctx.fillRect(
        paddle.x + 8,
        paddle.y + 4,
        paddle.width - 16,
        4
    );
}

function drawBall() {
    ctx.beginPath();

    ctx.arc(
        ball.x,
        ball.y,
        ball.radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.shadowColor = "#7ce7ff";
    ctx.shadowBlur = 12;

    ctx.strokeStyle = "#7ce7ff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.shadowBlur = 0;
}

function drawGame() {
    if (!ctx) {
        return;
    }

    ctx.imageSmoothingEnabled = false;

    drawBackground();
    drawBricks();
    drawPaddle();
    drawBall();
}


/* ---------- Kokkupõrked ---------- */

function ballTouchesRectangle(rect) {
    const closestX =
        clamp(
            ball.x,
            rect.x,
            rect.x + rect.width
        );

    const closestY =
        clamp(
            ball.y,
            rect.y,
            rect.y + rect.height
        );

    const distanceX =
        ball.x - closestX;

    const distanceY =
        ball.y - closestY;

    return (
        distanceX * distanceX +
        distanceY * distanceY
        <
        ball.radius * ball.radius
    );
}

function handleWallCollisions() {
    if (
        ball.x + ball.radius >= GAME_WIDTH &&
        ball.dx > 0
    ) {
        ball.x =
            GAME_WIDTH - ball.radius;

        ball.dx *= -1;
    }

    if (
        ball.x - ball.radius <= 0 &&
        ball.dx < 0
    ) {
        ball.x = ball.radius;
        ball.dx *= -1;
    }

    if (
        ball.y - ball.radius <= 0 &&
        ball.dy < 0
    ) {
        ball.y = ball.radius;
        ball.dy *= -1;
    }
}

function handlePaddleCollision() {
    const paddleRect = {
        x: paddle.x,
        y: paddle.y,
        width: paddle.width,
        height: paddle.height
    };

    if (
        ball.dy > 0 &&
        ballTouchesRectangle(paddleRect)
    ) {
        ball.y =
            paddle.y - ball.radius - 1;

        const hitPosition =
            (
                ball.x -
                (
                    paddle.x +
                    paddle.width / 2
                )
            ) /
            (paddle.width / 2);

        /*
         * Lööginurk sõltub sellest,
         * kuhu pall alusel tabab.
         */
        ball.dx =
            clamp(
                hitPosition * 6.2,
                -6.2,
                6.2
            );

        if (Math.abs(ball.dx) < 1.6) {
            ball.dx =
                ball.dx < 0
                    ? -1.6
                    : 1.6;
        }

        ball.dy =
            -Math.abs(ball.dy);
    }
}

function handleBrickCollisions() {
    for (const brick of bricks) {
        if (!brick.active) {
            continue;
        }

        if (!ballTouchesRectangle(brick)) {
            continue;
        }

        brick.active = false;
        remainingBricks -= 1;

        score += POINTS_PER_BRICK;
        updateScore();

        /*
         * Lihtne DX-Ball / brick breaker tüüpi põrge.
         */
        ball.dy *= -1;

        /*
         * Mäng muutub veidi tempokamaks.
         */
        ball.dx *= 1.012;
        ball.dy *= 1.012;

        ball.dx =
            clamp(ball.dx, -7.2, 7.2);

        ball.dy =
            clamp(ball.dy, -7.2, 7.2);

        if (remainingBricks <= 0) {
            finishGame(true);
        }

        break;
    }
}


/* ---------- Mängu liikumine ---------- */

function updatePaddleFromKeyboard() {
    if (moveLeft) {
        paddle.x -= paddle.speed;
    }

    if (moveRight) {
        paddle.x += paddle.speed;
    }

    paddle.x =
        clamp(
            paddle.x,
            0,
            GAME_WIDTH - paddle.width
        );
}

function updateGame() {
    if (!gameRunning) {
        return;
    }

    updatePaddleFromKeyboard();

    ball.x += ball.dx;
    ball.y += ball.dy;

    handleWallCollisions();
    handlePaddleCollision();
    handleBrickCollisions();

    if (
        ball.y - ball.radius >
        GAME_HEIGHT
    ) {
        finishGame(false);
        return;
    }

    drawGame();

    animationFrameId =
        requestAnimationFrame(updateGame);
}


/* ---------- Mängu teated ---------- */

function showGameMessage(
    title,
    text,
    buttonText
) {
    if (!gameMessage) {
        return;
    }

    gameMessage.classList.remove("is-hidden");

    gameMessageTitle.textContent = title;
    gameMessageText.textContent = text;
    gameStartButton.textContent = buttonText;
}

function hideGameMessage() {
    if (gameMessage) {
        gameMessage.classList.add("is-hidden");
    }
}

function finishGame(won) {
    gameRunning = false;

    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    drawGame();

    if (won) {
        showGameMessage(
            "Mäng läbi! Aitäh mängimast!",
            `Sinu lõppskoor on ${score} punkti. Kõik ${TOTAL_BRICKS} klotsi on purustatud.`,
            "MÄNGI UUESTI"
        );
    } else {
        showGameMessage(
            "Pall läks mööda!",
            `Sinu skoor on ${score} punkti. Proovi uuesti ja purusta kõik klotsid.`,
            "PROOVI UUESTI"
        );
    }
}

function startGame() {
    if (!ctx) {
        return;
    }

    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    resetGameState();

    gameWasStarted = true;
    gameRunning = true;

    hideGameMessage();

    animationFrameId =
        requestAnimationFrame(updateGame);
}


/* ---------- Modaali avamine / sulgemine ---------- */

function openGame() {
    if (!gameModal) {
        return;
    }

    closeMenu();

    document.body.classList.add("game-open");

    gameModal.classList.add("is-open");
    gameModal.setAttribute("aria-hidden", "false");

    resetGameState();

    showGameMessage(
        "DX-Ball",
        "Liiguta alust hiire, puute või nooleklahvidega. Iga klots annab 100 punkti.",
        gameWasStarted
            ? "MÄNGI UUESTI"
            : "ALUSTA MÄNGU"
    );

    window.setTimeout(() => {
        gameStartButton?.focus();
    }, 80);
}

function closeGame() {
    if (!gameModal) {
        return;
    }

    gameRunning = false;

    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    gameModal.classList.remove("is-open");
    gameModal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("game-open");

    gameTrigger?.focus();
}

if (gameTrigger) {
    gameTrigger.addEventListener(
        "click",
        openGame
    );
}

if (gameClose) {
    gameClose.addEventListener(
        "click",
        closeGame
    );
}

document
    .querySelectorAll("[data-close-game]")
    .forEach((element) => {
        element.addEventListener(
            "click",
            closeGame
        );
    });

if (gameStartButton) {
    gameStartButton.addEventListener(
        "click",
        startGame
    );
}


/* ---------- Klaviatuur ---------- */

document.addEventListener("keydown", (event) => {
    if (
        !gameModal ||
        !gameModal.classList.contains("is-open")
    ) {
        return;
    }

    if (event.key === "Escape") {
        event.preventDefault();
        closeGame();
        return;
    }

    if (
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight"
    ) {
        event.preventDefault();
    }

    if (event.key === "ArrowLeft") {
        moveLeft = true;
    }

    if (event.key === "ArrowRight") {
        moveRight = true;
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") {
        moveLeft = false;
    }

    if (event.key === "ArrowRight") {
        moveRight = false;
    }
});


/* ---------- Hiir / puude canvasel ---------- */

function movePaddleFromPointer(event) {
    if (!canvas) {
        return;
    }

    const rect =
        canvas.getBoundingClientRect();

    const scaleX =
        GAME_WIDTH / rect.width;

    const pointerX =
        (event.clientX - rect.left) * scaleX;

    paddle.x =
        clamp(
            pointerX - paddle.width / 2,
            0,
            GAME_WIDTH - paddle.width
        );

    /*
     * Kui mäng ei jookse, liigub alus ikkagi,
     * et kasutaja näeks kohe, et juhtimine töötab.
     */
    if (!gameRunning) {
        drawGame();
    }
}

if (canvas) {
    canvas.addEventListener(
        "pointermove",
        movePaddleFromPointer
    );

    canvas.addEventListener(
        "pointerdown",
        (event) => {
            canvas.setPointerCapture?.(
                event.pointerId
            );

            movePaddleFromPointer(event);
        }
    );
}


/* ============================================================
   11. ÜLDINE ESC – MOBIILIMENÜÜ
   ============================================================ */

document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
        return;
    }

    if (
        gameModal &&
        gameModal.classList.contains("is-open")
    ) {
        return;
    }

    closeMenu();
});