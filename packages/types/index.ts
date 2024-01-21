export interface Room {
    id: string,
    users: Map<string, string>,
    prevMoves: DrawLineProps[]
}

export type Point = { x: number; y: number }

export type Draw = {
    ctx: CanvasRenderingContext2D,
    currentPoint: Point,
    prevPoint: Point | null,
}

export type DrawLineProps = {
    currentPoint: Point,
    prevPoint: Point | null,
    color: string
}