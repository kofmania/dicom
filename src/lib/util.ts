const fitToBox = (fitboxW: number, fitboxH: number, w: number, h: number) => {
  let ratio = 1;
  let fitW = w,
    fitH = h;

  if (w > fitboxW) {
    ratio = fitboxW / w;
    fitH = h * ratio;

    if (fitH > fitboxH) {
      ratio = fitboxH / h;
      fitW = w * ratio;
      fitH = h * ratio;
    } else fitW = w * ratio;
  }

  return [fitW, fitH];
};

export { fitToBox };
