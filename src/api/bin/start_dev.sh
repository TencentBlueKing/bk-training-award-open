#!/bin/bash

LISTEN_PORT="${PORT:=8007}"
export DJANGO_SETTINGS_MODULE="bk_award.settings.overlays.dev" && poetry run python manage.py runserver 0.0.0.0:"${LISTEN_PORT}"