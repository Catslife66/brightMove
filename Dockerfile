FROM python:3.12-slim

WORKDIR /app

RUN python -m venv venv

COPY . /app/

RUN pip install pip --upgrade && \ 
    pip install -r requirements.txt

EXPOSE 8000

CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]
