const colour = "#535bf2";

const onResize = (element: HTMLCanvasElement) => {
    element.width = window.innerWidth;
    element.height = window.innerHeight;
};

type Position = {
    x: number;
    y: number;
};

const distanceBetweenPositions = (first: Position, second: Position) => {
    const result = Math.sqrt(
        Math.pow(first.x - second.x, 2) + Math.pow(first.y - second.y, 2)
    );
    return result;
};

const angleBetweenPositions = (first: Position, second: Position) => {
    var dy = second.y - first.y;
    var dx = second.x - first.x;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    //if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
};

const drawPill = (
    ctx: CanvasRenderingContext2D,
    position: Position,
    size: number,
    rotation: number
) => {
    ctx.save();

    ctx.beginPath();
    // move the rotation point to the center of the rect
    ctx.translate(position.x + size / 2, position.y + size / 2);
    // rotate the rect
    ctx.rotate((rotation * Math.PI) / 180);
    // draw the rect on the transformed context
    // Note: after transforming [0,0] is visually [x,y]
    //       so the rect needs to be offset accordingly when drawn
    ctx.rect(-size / 2, -size / 2, size, 2);

    ctx.fill();

    // restore the context to its untranslated/unrotated state
    ctx.restore();
};

const draw = (canvas: HTMLCanvasElement, mousePosition: Position) => {
    const ctx = canvas.getContext("2d")!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = colour;
    // width
    const w = window.innerWidth;
    // height
    const h = window.innerHeight;
    // Padding/spacing
    const p = 20;

    const maxDistance = Math.sqrt(
        Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2)
    );

    for (let x = p; x <= w - p; x += p) {
        for (let y = p; y <= h - p; y += p) {
            const distanceFromMouse = distanceBetweenPositions(
                { x, y },
                mousePosition
            );
            const rotation = angleBetweenPositions({ x, y }, mousePosition);
            //normalise and invert then multiply to get size
            const size = 10 ** (1 - distanceFromMouse / maxDistance);
            drawPill(ctx, { x, y }, size, rotation);
        }
    }
};

export const setupGrid = (element: HTMLCanvasElement) => {
    let mousePosition: Position = {
        x: 0,
        y: 0,
    };

    window.addEventListener("mousemove", (e) => {
        mousePosition = {
            x: e.x,
            y: e.y,
        };
    });
    window.addEventListener("touchmove", (e) => {
        mousePosition = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
        };
    });
    window.addEventListener("resize", () => onResize(element));

    const animate = () => {
        draw(element, mousePosition);
        requestAnimationFrame(animate);
    };

    onResize(element);
    requestAnimationFrame(animate);
};
