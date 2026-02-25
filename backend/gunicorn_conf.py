# Gunicorn configuration file
import multiprocessing

bind = "0.0.0.0:8000"
workers = 4  # Adjust based on your CPU cores
worker_class = "uvicorn.workers.UvicornWorker"
timeout = 120
keepalive = 5
loglevel = "info"
accesslog = "-"
errorlog = "-"
