import React from "react";

type Dataset = { id: string; name: string };
type Job = { id: string; name: string };
type Link = { fromId: string; toId: string };

type Props = {
    upstream?: Dataset[];
    jobs?: Job[];
    downstream?: Dataset[];
    links?: Link[];
    width?: number;
    rowGap?: number;
    onNodeClick?: (id: string) => void;
};

/**
 * Simple Marquez-like DAG:
 * [upstream datasets]  ->  [jobs]  ->  [downstream datasets]
 * Renders with plain SVG (no external graph libs).
 */
export default function GraphDiagram({
    upstream = [],
    jobs = [],
    downstream = [],
    links = [],
    width = 900,
    rowGap = 90,
    onNodeClick,
}: Props) {
    // layout
    const colWidth = width / 3;
    const nodeSize = { w: 180, h: 40 };

    // y positions per column
    const colYs = (count: number) =>
        Array.from({ length: count }, (_, i) => 60 + i * rowGap);

    const upstreamYs = colYs(upstream.length);
    const jobYs = colYs(jobs.length);
    const downstreamYs = colYs(downstream.length);

    // id -> position map (center points)
    const positions = new Map<
        string,
        { x: number; y: number; type: "dataset" | "job" }
    >();

    upstream.forEach((d, i) =>
        positions.set(d.id, {
            x: colWidth * 0.5,
            y: upstreamYs[i],
            type: "dataset",
        })
    );
    jobs.forEach((j, i) =>
        positions.set(j.id, { x: colWidth * 1.5, y: jobYs[i], type: "job" })
    );
    downstream.forEach((d, i) =>
        positions.set(d.id, {
            x: colWidth * 2.5,
            y: downstreamYs[i],
            type: "dataset",
        })
    );

    const colHeader = (text: string, cx: number) => (
        <text x={cx} y={24} textAnchor="middle" fontSize={16} fontWeight={600}>
            {text}
        </text>
    );

    const renderNode = (
        id: string,
        name: string,
        x: number,
        y: number,
        type: "dataset" | "job"
    ) => {
        const rx = x - nodeSize.w / 2;
        const ry = y - nodeSize.h / 2;
        const fill = type === "dataset" ? "#E8F5E9" : "#E3F2FD";
        const stroke = type === "dataset" ? "#43A047" : "#1E88E5";

        return (
            <g
                key={id}
                data-testid={`node-${id}`}
                onClick={() => onNodeClick?.(id)}
                style={{ cursor: onNodeClick ? "pointer" : "default" }}
            >
                <rect
                    x={rx}
                    y={ry}
                    width={nodeSize.w}
                    height={nodeSize.h}
                    rx={10}
                    ry={10}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={2}
                />
                <text
                    x={x}
                    y={y + 5}
                    textAnchor="middle"
                    fontSize={14}
                    fontFamily="system-ui, sans-serif"
                    fill="#0D0D0D"
                >
                    {name}
                </text>
            </g>
        );
    };

    // edge path (straight line with arrowhead)
    const renderEdge = (fromId: string, toId: string, idx: number) => {
        const from = positions.get(fromId);
        const to = positions.get(toId);
        if (!from || !to) return null;

        // small horizontal padding so lines meet node edges, not centers
        const pad = nodeSize.w / 2 + 6;
        const startX = from.x < to.x ? from.x + pad : from.x - pad;
        const endX = to.x > from.x ? to.x - pad : to.x + pad;

        return (
            <g key={`edge-${idx}`} data-testid="edge">
                <line
                    x1={startX}
                    y1={from.y}
                    x2={endX}
                    y2={to.y}
                    stroke="#90A4AE"
                    strokeWidth={2}
                    markerEnd="url(#arrow)"
                />
            </g>
        );
    };

    const last = (arr: number[]) =>
        arr.length > 0 ? arr[arr.length - 1] : 120;

    const height = Math.max(last(upstreamYs), last(jobYs), last(downstreamYs)) + 60;

    return (
        <svg
            role="img"
            aria-label="Lineage diagram"
            width={width}
            height={height}
            style={{ background: "#FFFFFF" }}
        >
            {/* arrowhead definition */}
            <defs>
                <marker
                    id="arrow"
                    viewBox="0 0 10 10"
                    refX="10"
                    refY="5"
                    markerWidth="8"
                    markerHeight="8"
                    orient="auto-start-reverse"
                >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#90A4AE" />
                </marker>
            </defs>

            {/* column headers */}
            {colHeader("Upstream Datasets", colWidth * 0.5)}
            {colHeader("Jobs", colWidth * 1.5)}
            {colHeader("Downstream Datasets", colWidth * 2.5)}

            {/* edges first so nodes sit on top */}
            {links.map((l, i) => renderEdge(l.fromId, l.toId, i))}

            {/* nodes */}
            {upstream.map((d, i) =>
                renderNode(d.id, d.name, colWidth * 0.5, upstreamYs[i], "dataset")
            )}
            {jobs.map((j, i) =>
                renderNode(j.id, j.name, colWidth * 1.5, jobYs[i], "job")
            )}
            {downstream.map((d, i) =>
                renderNode(d.id, d.name, colWidth * 2.5, downstreamYs[i], "dataset")
            )}
        </svg>
    );
}
