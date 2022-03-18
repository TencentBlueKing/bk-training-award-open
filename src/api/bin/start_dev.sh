#!/bin/bash

LISTEN_PORT="${PORT:=8007}"
poetry run python manage.py runserver 0.0.0.0:"${LISTEN_PORT}"