"""
WSGI config for manuscripts project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""
import sys
sys.path.append('/var/www/manuscripts/backend')
sys.path.append('/var/www/manuscripts/backend/manuscripts')

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'manuscripts.settings')

application = get_wsgi_application()
