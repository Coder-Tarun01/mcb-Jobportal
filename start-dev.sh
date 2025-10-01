#!/bin/bash

echo "Starting MCB Job Portal Development Environment..."
echo

echo "Starting Backend API Server..."
cd api && npm run dev &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 5

echo "Starting Frontend React App..."
cd ../mcb && npm start &
FRONTEND_PID=$!

echo
echo "Development environment started!"
echo "Backend API: http://localhost:4000"
echo "Frontend App: http://localhost:3000"
echo
echo "Press Ctrl+C to stop both servers"

# Function to cleanup processes on exit
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Trap Ctrl+C
trap cleanup SIGINT

# Wait for processes
wait
