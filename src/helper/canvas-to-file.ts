export const canvasToFile = (canvas: HTMLCanvasElement, options: {name: string, type: string}) => {
  return new Promise(res => canvas.toBlob(function (blob: Blob) {
    const file = new File([blob], options.name, {
      type: options.type,
      lastModified: Date.now()
    });
    res(file);
  } as any, options.type, 1));
};

export const fileToFormData = (append: {image: File, resolver: string}) => new Promise(res => {
  const fd = new FormData();
  for (const name in append) fd.append(name, (append as any)[name]);
  res(fd);
});
