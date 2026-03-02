"use client";

/**
 * SVG sequence diagram showing the Embedded Form 2 (PaymentFormElement / habanero) flow.
 * Dark-themed to match technical diagram conventions.
 */

type Step = {
  from: number;
  to: number;
  label: string;
  dashed?: boolean;
  self?: boolean;
};

const ACTORS = [
  { label: "User", x: 90 },
  { label: "Page", x: 290 },
  { label: "API", x: 490 },
  { label: "Stripe", x: 690 },
];

const STEPS: Step[] = [
  { from: 0, to: 1, label: "Open /embedded-form-2" },
  { from: 1, to: 2, label: "POST create-checkout-session" },
  { from: 2, to: 3, label: "sessions.create (custom, line_items)" },
  { from: 3, to: 2, label: "client_secret", dashed: true },
  { from: 2, to: 1, label: "clientSecret", dashed: true },
  {
    from: 1,
    to: 1,
    label: "CheckoutProvider + PaymentFormElement renders",
    self: true,
  },
  { from: 0, to: 1, label: "Enter payment details in form" },
  {
    from: 1,
    to: 1,
    label: "onConfirm → checkout.confirm(event)",
    self: true,
  },
  { from: 1, to: 3, label: "Confirm payment" },
  { from: 3, to: 1, label: "Redirect to return_url", dashed: true },
  { from: 1, to: 2, label: "GET checkout-session-status" },
  { from: 2, to: 3, label: "sessions.retrieve (expand)" },
  { from: 3, to: 2, label: "Full session object", dashed: true },
  { from: 2, to: 1, label: "session", dashed: true },
  { from: 1, to: 0, label: "Show success or 'Payment not completed'" },
];

const BOX_W = 110;
const BOX_H = 36;
const TOP_Y = 20;
const STEP_START = TOP_Y + BOX_H + 34;
const STEP_GAP = 46;
const SVG_WIDTH = 780;

export function EmbeddedForm2FlowDiagram() {
  const lastStepY = STEP_START + (STEPS.length - 1) * STEP_GAP;
  const bottomBoxY = lastStepY + 44;
  const svgHeight = bottomBoxY + BOX_H + 20;

  return (
    <svg
      viewBox={`0 0 ${SVG_WIDTH} ${svgHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      className="w-full rounded-lg"
      role="img"
      aria-label="Embedded Form 2 checkout flow sequence diagram"
    >
      <defs>
        <marker
          id="ef2-arrow"
          markerWidth="8"
          markerHeight="6"
          refX="8"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="#9ca3af" />
        </marker>
        <marker
          id="ef2-arrow-d"
          markerWidth="8"
          markerHeight="6"
          refX="8"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="#6b7280" />
        </marker>
      </defs>

      <rect width={SVG_WIDTH} height={svgHeight} fill="#111827" rx="8" />

      {/* Actor boxes — top */}
      {ACTORS.map((a, i) => (
        <g key={`t-${i}`}>
          <rect
            x={a.x - BOX_W / 2}
            y={TOP_Y}
            width={BOX_W}
            height={BOX_H}
            fill="#1f2937"
            stroke="#4b5563"
            strokeWidth={1.5}
            rx={6}
          />
          <text
            x={a.x}
            y={TOP_Y + BOX_H / 2 + 5}
            textAnchor="middle"
            fill="#e5e7eb"
            fontSize={14}
            fontWeight={600}
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            {a.label}
          </text>
        </g>
      ))}

      {/* Lifelines */}
      {ACTORS.map((a, i) => (
        <line
          key={`l-${i}`}
          x1={a.x}
          y1={TOP_Y + BOX_H}
          x2={a.x}
          y2={bottomBoxY}
          stroke="#374151"
          strokeWidth={1}
          strokeDasharray="4 3"
        />
      ))}

      {/* Steps */}
      {STEPS.map((step, i) => {
        const y = STEP_START + i * STEP_GAP;
        const fromX = ACTORS[step.from].x;
        const toX = ACTORS[step.to].x;

        if (step.self) {
          const loopW = 28;
          const loopH = 20;
          return (
            <g key={`s-${i}`}>
              <path
                d={`M ${fromX} ${y} H ${fromX + loopW} V ${y + loopH} H ${fromX}`}
                stroke="#9ca3af"
                strokeWidth={1.5}
                fill="none"
                markerEnd="url(#ef2-arrow)"
              />
              <text
                x={fromX + loopW + 8}
                y={y + loopH / 2 + 4}
                fill="#d1d5db"
                fontSize={11}
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {step.label}
              </text>
            </g>
          );
        }

        const dir = toX > fromX ? 1 : -1;
        const x1 = fromX + dir * 6;
        const x2 = toX - dir * 6;
        const midX = (fromX + toX) / 2;
        const color = step.dashed ? "#6b7280" : "#9ca3af";
        const marker = step.dashed ? "url(#ef2-arrow-d)" : "url(#ef2-arrow)";

        return (
          <g key={`s-${i}`}>
            <line
              x1={x1}
              y1={y}
              x2={x2}
              y2={y}
              stroke={color}
              strokeWidth={1.5}
              strokeDasharray={step.dashed ? "6 3" : undefined}
              markerEnd={marker}
            />
            <text
              x={midX}
              y={y - 7}
              textAnchor="middle"
              fill="#d1d5db"
              fontSize={11}
              fontFamily="system-ui, -apple-system, sans-serif"
              stroke="#111827"
              strokeWidth={3}
              paintOrder="stroke"
            >
              {step.label}
            </text>
          </g>
        );
      })}

      {/* Actor boxes — bottom */}
      {ACTORS.map((a, i) => (
        <g key={`b-${i}`}>
          <rect
            x={a.x - BOX_W / 2}
            y={bottomBoxY}
            width={BOX_W}
            height={BOX_H}
            fill="#1f2937"
            stroke="#4b5563"
            strokeWidth={1.5}
            rx={6}
          />
          <text
            x={a.x}
            y={bottomBoxY + BOX_H / 2 + 5}
            textAnchor="middle"
            fill="#e5e7eb"
            fontSize={14}
            fontWeight={600}
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            {a.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
