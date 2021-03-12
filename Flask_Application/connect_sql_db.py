import pandas
from sqlalchemy import create_engine
import psycopg2
from sql_config import db_password

#build conn with function
def build_engine(db_password=db_password, database_name="group_project", host="127.0.0.1:5432"):
    #create a db_string to connect to the database and conn -- connection variable
    db_string = f"postgres://postgres:{db_password}@{host}/{database_name}"
    engine = create_engine(db_string)    
    return engine


#return yelp dataframes dictionary from sql
def read_in_tables(list_of_tables):
    return_me = {}
    for name in list_of_tables:
        return_me[name] = pandas.read_sql(f'select * from "{name}"',con=engine)
        
    return return_me

#send dataframe dictionary to sql
def send_in_dataframes(tables_dict):
    for name,dataframe in tables_dict.items():
        dataframe.to_sql(
            f"{name}", 
            con = engine,
            index = False, 
            method = 'multi',
            chunksize = 1000,
            if_exists = "append"
        )
        print(f"{name} df sent...")
    return "dataframe data sent"

#drop dataframe dictionary from sql
def drop_dataframes(tables_dict):
    with engine.connect() as connection:
        for name in tables_dict.keys():
            connection.execute(f'DROP TABLE "{name}"')
            print(f"{name} dropped...")
    return "tables dropped"


