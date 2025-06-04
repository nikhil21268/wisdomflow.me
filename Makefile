.PHONY: dev test migrate

dev:
	cd backend && FLASK_APP=app.core flask run &
	cd frontend && npm run dev

migrate:
	cd backend && alembic upgrade head

TEST_BACKEND = cd backend && pytest
TEST_FRONTEND = cd frontend && npm test -- --watchAll=false
	
test:
	$(TEST_BACKEND)
	$(TEST_FRONTEND)
