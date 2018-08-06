env:
	virtualenv .env && source .env/bin/activate && pip install -r requirements.txt

run-local:
	source .env/bin/activate && gunicorn app:app

lint:
	source .env/bin/activate && pylint app.py

install:
	pip install -r requirements.txt
	pip install pylint
