FROM python:3.11
ENV PYTHONUNBUFFERED 1
WORKDIR /app/backend
COPY Pipfile Pipfile.lock ./
RUN pip install pipenv && pipenv install --system
COPY . ./
EXPOSE 5000
CMD [ "flask", "run", "--host=0.0.0.0"]