#!/bin/bash

# Set up the backend
cd backend
npm install

# Set up the frontend
cd ../frontend
npm install

echo "\n🎉 Setup complete! Follow these steps to get started:\n"
echo "1. Create a .env file in the backend directory with your configuration:"
echo "   cp ../.env.example backend/.env"
echo "   # Edit the .env file with your settings"
echo ""
echo "2. Start the backend server:"
echo "   cd backend && npm run server"
echo ""
echo "3. In a new terminal, start the frontend development server:"
echo "   cd frontend && npm run dev"
echo ""
echo "4. Open your browser and navigate to: http://localhost:5173"
echo ""
echo "Happy coding! 🚀"
