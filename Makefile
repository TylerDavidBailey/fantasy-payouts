.DEFAULT_GOAL := help

.PHONY: help install dev lint typecheck test test-watch build preview check ci clean

help:
	@printf "Available targets:\n"
	@printf "  %-12s %s\n" "install" "Install project dependencies with npm ci"
	@printf "  %-12s %s\n" "dev" "Start the Vite development server"
	@printf "  %-12s %s\n" "lint" "Run ESLint with warnings treated as failures"
	@printf "  %-12s %s\n" "typecheck" "Run the TypeScript compiler in check mode"
	@printf "  %-12s %s\n" "test" "Run the unit test suite once"
	@printf "  %-12s %s\n" "test-watch" "Run tests in watch mode"
	@printf "  %-12s %s\n" "build" "Create the production build"
	@printf "  %-12s %s\n" "preview" "Serve the production build locally"
	@printf "  %-12s %s\n" "check" "Run the full local quality gate"
	@printf "  %-12s %s\n" "ci" "Install dependencies and run the CI quality gate"
	@printf "  %-12s %s\n" "clean" "Remove build output and TypeScript build metadata"

install:
	npm ci

dev:
	npm run dev

lint:
	npm run lint

typecheck:
	npm run typecheck

test:
	npm run test

test-watch:
	npm run test:watch

build:
	npm run build

preview:
	npm run preview

check:
	npm run check

ci: install check

clean:
	rm -rf dist *.tsbuildinfo
