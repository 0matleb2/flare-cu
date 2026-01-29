# Flare CU

**Flare CU** is a UX-focused mobile app prototype for Concordia University. It allows students to crowdsource campus safety and issue awareness by "raising flares" - community-driven signals that inform others without creating alarm.

> **Note:** This is an academic prototype focused on UI/UX design. It simulates a backend using local storage.

## Features

- **Raise a Flare:** Quickly report safety, maintenance, or medical issues.
- **Community Feed:** See nearby flares raised by others.
- **Validation:** Confirm flares to increase their reliability.
- **Simulated Backend:** Uses `AsyncStorage` to mimic network requests and persistence.
- **Optimistic UI:** Instant updates for interactions like confirming a flare.

## Tech Stack

- **Framework:** Expo (Managed Workflow)
- **Language:** TypeScript
- **UI Library:** React Native Paper (Material Design 3)
- **State Management:** TanStack Query (React Query)
- **Compiler:** React Compiler (Experimental/Beta)
- **Data Persistence:** AsyncStorage (Local Simulation)
- **Tooling:** Biome (Linting/Formatting), pnpm

## Getting Started

### Prerequisites
- Node.js (LTS recommended)
- `pnpm` (Package Manager)
- Expo Go app on your mobile device (or Android Studio/Xcode for simulators)

### Setup

1.  **Clone and Install:**
    ```bash
    git clone <repo-url>
    cd flare-cu
    pnpm install
    ```

2.  **Run the App:**
    ```bash
    pnpm start
    ```
    - Press `a` for Android Emulator
    - Press `i` for iOS Simulator
    - Scan the QR code with **Expo Go** to run on your physical device.

3.  **Lint & Format:**
    ```bash
    pnpm check      # Check for errors
    pnpm check:fix  # Auto-fix errors and format
    ```

## Project Structure

- `src/components`: Reusable UI components (`FlareCard`, `EmptyState`).
- `src/hooks`: Custom React hooks (`useFlares`).
- `src/screens`: Application screens (`FeedScreen`, `RaiseFlareScreen`).
- `src/services`: Simulated backend services (`FlareService`).
- `src/theme`: Concordia-branded UI theme configuration.
- `src/types`: TypeScript definitions.

## Design Philosophy

- **Participatory:** Safety is a shared responsibility.
- **Non-alarmist:** Calm visuals and language ("Flares" vs "Alerts").
- **Clear:** Literal descriptions combined with the flare metaphor.
- **Concordia Branded:** Uses official Burgundy and Gold colors.