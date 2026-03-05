# create_tables.py
from helpers.database import engine
import helpers.models as models

models.Base.metadata.create_all(bind=engine)
print("All tables created!")
