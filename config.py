import os

class Config:
    app.config['MYSQL_HOST'] = os.getenv('BD_SERVER')
    app.config['MYSQL_USER'] = os.getenv('BD_USER')
    app.config['MYSQL_PASSWORD'] = os.getenv('BD_PASSWORD')
    app.config['MYSQL_DB'] = os.getenv('BD_BD')

class DevelopmentConfig(Config):
    pass

class ProductionConfig(Config):
    pass

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig
}