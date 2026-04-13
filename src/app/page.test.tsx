import { render, screen } from "@testing-library/react";

import Home from "./page";

describe("Home", () => {
  it("renders the explorer heading and current scope list", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { name: "Ethereum Mainnet Explorer" })).toBeInTheDocument();
    expect(screen.getByText("최신 블록 / 트랜잭션 목록")).toBeInTheDocument();
  });
});
