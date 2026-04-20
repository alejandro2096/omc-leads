import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatsCard } from "../components/StatsCard";
import { Users } from "lucide-react";

describe("StatsCard", () => {
  it("renderiza el título y valor correctamente", () => {
    render(<StatsCard title="Total Leads" value={42} icon={Users} />);
    expect(screen.getByText("Total Leads")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renderiza la descripción si se provee", () => {
    render(
      <StatsCard
        title="Calificados"
        value={10}
        description="Listos para cerrar"
        icon={Users}
      />
    );
    expect(screen.getByText("Listos para cerrar")).toBeInTheDocument();
  });

  it("no renderiza descripción si no se provee", () => {
    render(<StatsCard title="Calificados" value={10} icon={Users} />);
    expect(screen.queryByText("Listos para cerrar")).not.toBeInTheDocument();
  });
});
