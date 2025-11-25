.PHONY: dev-backend dev-frontend install build up down

install:
	cd backend && bun install
	cd frontend && bun install

dev-backend:
	cd backend && bun dev

dev-frontend:
	cd frontend && bun dev

build:
	docker-compose build --no-cache

up:
	docker-compose up -d

down:
	docker-compose down
