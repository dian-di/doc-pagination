export function isDirectionArrowPath(d: string) {
  const commands = d.match(/[A-Za-z][^A-Za-z]*/g);
  if (!commands) return false;

  const points = [];
  let currentPoint = [0, 0];

  for (const cmd of commands) {
    const type = cmd[0];
    const nums = cmd.slice(1).trim().split(/[ ,]+/).map(Number);

    if (type === 'M' || type === 'L') {
      for (let i = 0; i < nums.length; i += 2) {
        currentPoint = [nums[i], nums[i + 1]];
        points.push(currentPoint);
      }
    } else if (type === 'H') {
      for (let i = 0; i < nums.length; i++) {
        currentPoint = [nums[i], currentPoint[1]];
        points.push(currentPoint);
      }
    } else if (type === 'V') {
      for (let i = 0; i < nums.length; i++) {
        currentPoint = [currentPoint[0], nums[i]];
        points.push(currentPoint);
      }
    }
  }

  // 构建所有线段
  const segments = [];
  for (let i = 1; i < points.length; i++) {
    segments.push([points[i - 1], points[i]]);
  }

  // 检查所有线段组合，看是否存在共用端点 + 合理夹角
  for (let i = 0; i < segments.length; i++) {
    const [a1, a2] = segments[i];
    for (let j = i + 1; j < segments.length; j++) {
      const [b1, b2] = segments[j];

      const shared = getSharedPoint([a1, a2], [b1, b2]);
      if (!shared) continue;

      const aVec = getVectorFrom(shared, [a1, a2]);
      const bVec = getVectorFrom(shared, [b1, b2]);

      const angle = getAngleBetweenVectors(aVec, bVec);
      if (angle > 20 && angle < 160) {
        return true; // 是箭头形状
      }
    }
  }

  return false;
}

function getVector(p1: number[], p2: number[]) {
  return [p2[0] - p1[0], p2[1] - p1[1]];
}

function getAngleBetweenVectors(v1: number[], v2: number[]) {
  const dot = v1[0] * v2[0] + v1[1] * v2[1];
  const mag1 = Math.hypot(...v1);
  const mag2 = Math.hypot(...v2);
  const cosTheta = dot / (mag1 * mag2);
  return Math.acos(Math.max(-1, Math.min(1, cosTheta))) * (180 / Math.PI);
}

function getSharedPoint(seg1: number[][], seg2: number[][]) {
  for (const p1 of seg1) {
    for (const p2 of seg2) {
      if (p1[0] === p2[0] && p1[1] === p2[1]) return p1;
    }
  }
  return null;
}

function getVectorFrom(origin: number[], segment: number[][]) {
  const other = segment[0][0] === origin[0] && segment[0][1] === origin[1]
    ? segment[1]
    : segment[0];
  return getVector(origin, other);
}
