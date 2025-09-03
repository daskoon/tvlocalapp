# CargoCalc

CargoCalc is an internal tool designed to assist Best Buy employees by quickly resolving TV transportation and logistics questions. It helps determine if a customer's newly purchased TV will fit in their vehicle, suggests suitable alternatives if it doesn't, and provides other useful lookup features.

## Core Features

The application is organized into three main tabs, each addressing a specific question:

### 1. Fit Check
This is the primary function of the app. It allows an employee to check if a specific TV (and its box) can safely fit into a specific vehicle.

- **Inputs**: Select a TV and a vehicle from the database, or enter their dimensions manually.
- **Output**: A clear "Fits" or "Will Not Fit" result. If it fits, it specifies the best loading scenario (e.g., "Cargo Area (Seats Down)"). If it's a tight fit (less than 2 inches of clearance), it will be noted.

### 2. TV Finder
This feature helps answer the question: "What's the largest TV that can fit in my car?"

- **Input**: Select a vehicle from the database or enter its dimensions manually.
- **Output**: A list of all TV screen sizes (e.g., 55", 65") from the database that are confirmed to fit in the selected vehicle.

### 3. Vehicle Finder
This feature reverses the question and helps answer: "What kind of car would I need for the TV I just bought?"

- **Input**: Select a TV brand and size.
- **Output**: A list of all vehicles from the database that can accommodate the selected TV, along with the required loading scenario for each.

## Data Input Methods

For both TVs and vehicles, the app offers multiple ways to input data:

- **Database Selection**: The fastest method. The app includes an extensive database of TV box dimensions and vehicle cargo specifications.
- **Manual Entry**: If a specific model isn't in the database, users can manually enter the dimensions (in inches) of the TV box or vehicle cargo space.
- **AI Lookup (Experimental)**: For vehicles not in the database, an experimental AI feature can attempt to look up the cargo dimensions based on the vehicle's make, model, and year. Accuracy may vary.

## AI-Powered Suggestions

If the "Fit Check" determines a TV will not fit, the user can click a button to get AI-powered suggestions. The AI provides two types of alternatives:
1.  **Alternative TV Sizes**: Suggests smaller TV models that are more likely to fit.
2.  **Alternative Loading/Transport Options**: Provides practical advice, such as arranging for home delivery, renting a larger vehicle, or using a ride-sharing service with larger cars (e.g., UberXL).

## Feedback System

To continuously improve the tool's accuracy and usefulness, a feedback dialog will appear after a calculation is performed.
- It includes a 1-5 star rating system and a comment box.
- Submission sends a pre-formatted email directly to the development team.
- Users can opt-out of seeing the automatic pop-up in the future via a checkbox. A manual feedback button is always available in the results card.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **UI**: React, ShadCN UI Components, Tailwind CSS
- **AI/Generative Features**: Google Genkit
