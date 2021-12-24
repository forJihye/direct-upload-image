export const fixImageDraw = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
  ctx.canvas.width = img.width;
  ctx.canvas.height = img.height;

  ctx.save();
  ctx.drawImage(img, 0, 0);
  ctx.restore();
}

export const rotateDraw = (ctx: CanvasRenderingContext2D) => {
  const rcanvas = document.createElement('canvas') as HTMLCanvasElement;
  const rctx = rcanvas.getContext('2d') as CanvasRenderingContext2D;

  Object.assign(rcanvas, {
    width: ctx.canvas.width,
    height: ctx.canvas.height
  });
  rctx.drawImage(ctx.canvas, 0, 0);

  Object.assign(ctx.canvas, { // 90도 회전이라서 width , height 뒤바뀜
    width: rcanvas.height,
    height: rcanvas.width
  });

  ctx.save();
  ctx.translate(ctx.canvas.width, 0);
  ctx.rotate(Math.PI / 180 * 90);
  ctx.drawImage(rcanvas, 0, 0);
  ctx.restore();
}

export const computedWidth = (canvas: HTMLCanvasElement, maxWidth: number) => {
  if (canvas.width < maxWidth) return canvas;
  else {
    const tempCanvas = document.createElement('canvas') as HTMLCanvasElement;
    const tempCtx = tempCanvas.getContext('2d') as CanvasRenderingContext2D;
    
    const width = maxWidth;
    const height = canvas.height * maxWidth / canvas.width;
    tempCanvas.width = width;
    tempCanvas.height = height;

    tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, tempCanvas.width, tempCanvas.height);
    return tempCanvas;
  }
}