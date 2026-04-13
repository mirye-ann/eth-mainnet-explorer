import { render, screen } from "@testing-library/react";

import { QueryProvider } from "./query-provider";

describe("QueryProvider", () => {
  it("renders children inside the provider tree", () => {
    render(
      <QueryProvider>
        <span>provider-child</span>
      </QueryProvider>,
    );

    expect(screen.getByText("provider-child")).toBeInTheDocument();
  });
});
