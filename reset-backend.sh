#!/bin/bash

echo "Resetting backend database and restarting..."

cd api

echo "Deleting old database..."
rm -f database.sqlite

echo "Installing dependencies..."
npm install

echo "Starting backend with new model..."
npm run dev
