// draw.js

export function clear(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
}

export function fillRect(ctx, x, y, w, h, color, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.restore();
}

export function strokeRect(ctx, x, y, w, h, color, alpha = 1, lineWidth = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(x, y, w, h);
    ctx.restore();
}

export function fillCircle(ctx, x, y, radius, color, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

export function strokeCircle(ctx, x, y, radius, color, alpha = 1, lineWidth = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
}

export function line(ctx, x1, y1, x2, y2, color, lineWidth = 1, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
}

export function text(ctx, str, x, y, color = "#fff", size = 14, align = "left") {
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = `${size}px sans-serif`;
    ctx.textAlign = align;
    ctx.fillText(str, x, y);
    ctx.restore();
}
