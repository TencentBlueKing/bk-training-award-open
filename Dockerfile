FROM python:3.9.10-slim-buster
USER root

RUN rm /etc/apt/sources.list && \
    echo "deb https://mirrors.cloud.tencent.com/debian buster main contrib non-free" >> /etc/apt/sources.list && \
    echo "deb https://mirrors.cloud.tencent.com/debian buster-updates main contrib non-free" >> /etc/apt/sources.list && \
    echo "deb-src https://mirrors.cloud.tencent.com/debian buster main contrib non-free" >> /etc/apt/sources.list && \
    echo "deb-src https://mirrors.cloud.tencent.com/debian buster-updates main contrib non-free" >> /etc/apt/sources.list

RUN mkdir ~/.pip &&  printf '[global]\nindex-url = https://mirrors.tencent.com/pypi/simple/' > ~/.pip/pip.conf

RUN apt-get update && apt-get install -y gcc

ENV LC_ALL=C.UTF-8 \
    LANG=C.UTF-8

RUN pip install --upgrade pip
RUN pip install poetry==1.1.13

WORKDIR /app
COPY src/api/pyproject.toml /app
COPY src/api/poetry.lock /app

RUN poetry config experimental.new-installer false && poetry config virtualenvs.create false && poetry install --no-dev

COPY src/api/manage.py /app
COPY src/api/bk_award/wsgi.py /app
COPY src/api/bk_award /app/bk_award
COPY src/api/bin/start.sh /app

CMD ["bash", "/app/start.sh"]