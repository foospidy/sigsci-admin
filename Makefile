env:
	virtualenv .env && source .env/bin/activate && pip install -r requirements.txt

run-local:
	source .env/bin/activate && gunicorn app:app
