export function getOffsetDistance(
  dom: any
): { offsetLeft: number; offsetTop: number } {
  let parent = dom;
  let offsetLeft = 0;
  let offsetTop = 0;
  while (parent) {
    offsetLeft += parent.offsetLeft;
    offsetTop += parent.offsetTop;
    parent = parent.offsetParent;
  }

  return {
    offsetLeft,
    offsetTop
  };
}
