export type ParametersCone = {
  height: number;
  radius: number;
  segments: number;
};

export type Coordinate = {
  x: number;
  y: number;
  z: number;
};

export type Triangulation = {
  vertexA: Coordinate;
  p1: Coordinate;
  p2: Coordinate;
};
