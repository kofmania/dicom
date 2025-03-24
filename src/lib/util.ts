const fitToBox = (
  targetWidth: number,
  targetHeight: number,
  sourceWidth: number,
  sourceHeight: number
) => {
  let ratio = 1;
  let fitWidth = sourceWidth,
    fitHeight = sourceHeight;

  if (sourceWidth > targetWidth) {
    ratio = targetWidth / sourceWidth;
    fitHeight = sourceHeight * ratio;

    if (fitHeight > targetHeight) {
      ratio = targetHeight / sourceHeight;
      fitWidth = sourceWidth * ratio;
      fitHeight = sourceHeight * ratio;
    } else fitWidth = sourceWidth * ratio;
  } else {
    if (sourceHeight > targetHeight) {
      ratio = targetHeight / sourceHeight;
      fitWidth = sourceWidth * ratio;
      fitHeight = sourceHeight * ratio;
    }
  }

  return [fitWidth, fitHeight];
};

export { fitToBox };
