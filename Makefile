.DEFAULT_GOAL := help

.PHONY: help install dev lint typecheck test test-watch coverage security build preview check clean

help: ## Show available targets
	@printf "Available targets:\n"
	@awk 'BEGIN { FS = ":.*## " } /^[a-zA-Z-]+:.*## / { printf "  %-12s %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

install: ## Install project dependencies with npm ci
	npm ci

dev: ## Start the Vite development server
	npm run dev

lint: ## Run ESLint with warnings treated as failures
	npm run lint

typecheck: ## Run the TypeScript compiler in check mode
	npm run typecheck

test: ## Run the unit test suite once
	npm run test

test-watch: ## Run tests in watch mode
	npm run test:watch

coverage: ## Run tests with a coverage report
	npm run test:coverage

security: ## Audit dependencies for known vulnerabilities
	npm run security

build: ## Create the production build
	npm run build

preview: ## Serve the production build locally
	npm run preview

check: ## Run the full local quality gate
	npm run check

clean: ## Remove build output, coverage, and TypeScript build metadata
	rm -rf dist coverage *.tsbuildinfo
