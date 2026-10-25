# UI Contract: /demo (Guided Demo Desk)

Stable hooks for tests (`data-testid`):

| testid | Element |
|--------|---------|
| `play-tour` | Play guided demo button |
| `coach` | Coach card (text contains "N of 7") |
| `coach-next` / `coach-back` / `coach-exit` | Coach buttons |
| `company-card-<id>` | Company card (`aria-pressed`) |
| `signal-chip-<id>` | Signal chip (`aria-pressed`) |
| `breakdown` | Priority breakdown (`data-sum`) |
| `funnel` / `funnel-<n>` | Funnel strip / stage (`data-state`) |
| `next-action` | Sticky primary action |
| `recap` | Recap card |
| `recap-again` / `recap-other` | Recap buttons |

Keyboard: `ArrowRight` = next action (not in inputs); `Escape` = exit tour.
