/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import GraphDiagram from "./GraphDiagram";

describe("GraphDiagram", () => {
    const upstream = [
        { id: "ds_raw_customers", name: "raw.customers" },
        { id: "ds_raw_orders", name: "raw.orders" },
    ];
    const jobs = [
        { id: "job_clean_customers", name: "clean_customers" },
        { id: "job_build_marts", name: "build_marts" },
    ];
    const downstream = [
        { id: "ds_dim_customers", name: "dim.customers" },
        { id: "ds_fact_orders", name: "fact.orders" },
    ];

    const links = [
        // upstream -> jobs
        { fromId: "ds_raw_customers", toId: "job_clean_customers" },
        { fromId: "ds_raw_orders", toId: "job_build_marts" },
        // jobs -> downstream
        { fromId: "job_clean_customers", toId: "ds_dim_customers" },
        { fromId: "job_build_marts", toId: "ds_fact_orders" },
    ];

    it("renders all nodes with labels", () => {
        render(
            <GraphDiagram upstream={upstream} jobs={jobs} downstream={downstream} links={links} />
        );

        // dataset labels
        expect(screen.getByText("raw.customers")).toBeInTheDocument();
        expect(screen.getByText("raw.orders")).toBeInTheDocument();
        expect(screen.getByText("dim.customers")).toBeInTheDocument();
        expect(screen.getByText("fact.orders")).toBeInTheDocument();

        // job labels
        expect(screen.getByText("clean_customers")).toBeInTheDocument();
        expect(screen.getByText("build_marts")).toBeInTheDocument();
    });

    it("renders an edge per link", () => {
        render(
            <GraphDiagram upstream={upstream} jobs={jobs} downstream={downstream} links={links} />
        );
        // Each edge group has data-testid="edge"
        const edges = screen.getAllByTestId("edge");
        expect(edges).toHaveLength(links.length);
    });

    it("calls onNodeClick with the node id", () => {
        const onNodeClick = jest.fn();
        render(
            <GraphDiagram
                upstream={upstream}
                jobs={jobs}
                downstream={downstream}
                links={links}
                onNodeClick={onNodeClick}
            />
        );

        const node = screen.getByTestId("node-ds_raw_customers");
        fireEvent.click(node);
        expect(onNodeClick).toHaveBeenCalledTimes(1);
        expect(onNodeClick).toHaveBeenCalledWith("ds_raw_customers");
    });

    it("has an accessible label on the SVG", () => {
        render(
            <GraphDiagram upstream={upstream} jobs={jobs} downstream={downstream} links={links} />
        );
        expect(screen.getByRole("img", { name: "Lineage diagram" })).toBeInTheDocument();
    });
});
