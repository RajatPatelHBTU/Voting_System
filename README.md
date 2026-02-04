# Digital Voting Management System

A secure and transparent digital voting platform built with modern web technologies and blockchain-based smart contracts.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-blue)](https://reactjs.org/)

## Overview

This system streamlines elections by offering a user-friendly advanced interface and tamper-proof vote recording through Ethereum smart contracts.

## Features

- **Voter Authentication**: Secure registration and login with JWT.
- **Candidate Management**: Easily add and manage candidates.
- **Vote Casting**: Intuitive interface for secure voting.
- **Real-Time Results**: Instant vote tallies and analytics.
- **Blockchain Security**: Solidity contracts ensure data integrity.
- **Admin Dashboard**: Tools to manage elections and review data.

## Architecture of System

- **Frontend**: React, Tailwind CSS  
  Responsive UI and API integration.
- **Backend**: Node.js  
  Handles logic, APIs, Jwt and data storage.
- **Smart Contracts**: Solidity (Ethereum)  
  Immutable voting logic and records.

## Installation

### Prerequisites
- Node.js (v16+)
- Foundry
- Git
- Local Ethereum node (e.g., Anvil) at `http://127.0.0.1:8545`

### Steps
1. **Clone Repository**  
   ```bash
   git clone https://github.com/sanyamhbtu/voting_System.git
   cd voting_System
   ```

2. **Setup Frontend**  
   ```bash
   cd frontend
   npm install
   ```

3. **Setup Backend**  
   ```bash
   cd ../backend
   npm install
   ```

4. **Setup Contracts**  
   ```bash
   cd ../contract
   npm install
   forge create --rpc-url http://127.0.0.1:8545 --private-key <your-private-key> src/Voting.sol:Voting --broadcast
   ```

## Usage

- **Run Backend**  
   ```bash
   cd backend
   npm run dev
   ```
   Available at `http://localhost:3000`.

- **Run Frontend**  
   ```bash
   cd frontend
   npm run dev
   ```
   Available at `http://localhost:3000`.

- **Smart Contracts**  
   Configure backend/frontend to use the deployed contract address.

## Contributing

1. Fork the repository.
2. Create a branch: `git checkout -b feature-name`.
3. Commit changes: `git commit -m "Description"`.
4. Push: `git push origin feature-name`.
5. Open a pull request.

## License

[MIT License](LICENSE)

## Contact

Rajat Patel 
📧 [krishnarajat1234@gmail.com](mailto:krishnarajat1234@gmail.com)
